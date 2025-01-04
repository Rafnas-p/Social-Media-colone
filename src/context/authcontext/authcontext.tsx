"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { auth } from "@/app/fairbase/config";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface AuthContextType {
  user: User | null;
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
  allUsers: UserRecord[];
  setAllUsers: Dispatch<SetStateAction<UserRecord[]>>;
}

export interface UserRecord {
  _id?: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  channelName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<UserRecord[]>([]);
  const router = useRouter();

  const googleSignIn = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;

      const token = await currentUser.getIdToken();

      const mongoDbId = await saveUserToDatabase(currentUser);

      Cookies.set("token", token, { secure: true, sameSite: "strict" });
      Cookies.set("mongoDbId", mongoDbId, { secure: true, sameSite: "strict" });

      console.log(
        "JWT Token and MongoDB ID stored in cookies:",
        token,
        mongoDbId
      );
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const logOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);

      Cookies.remove("token");
      Cookies.remove("mongoDbId");

      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const saveUserToDatabase = async (
    user: User
  ): Promise<string | undefined> => {
    const { uid, email, displayName, photoURL } = user;

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          email,
          displayName: displayName || "Anonymous User",
          photoURL,
          channelName: (displayName || "Anonymous User")
            .replace(/\s+/g, "")
            .toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save user");
      }

      const data = await response.json();
      return data._id;
    } catch (error) {
      console.error("Error saving user to database:", error);
    }
  };

  useEffect(() => {
    const refreshToken = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const newToken = await currentUser.getIdToken(true);
          Cookies.set("token", newToken, { secure: true, sameSite: "strict" });
        } catch (error) {
          console.error("Error refreshing token:", error)
          await logOut();
        }
      }
    };

    const interval = setInterval(refreshToken, 50 * 60 * 1000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        Cookies.set("token", token, { secure: true, sameSite: "strict" });

        const response = await axios.get(
          `http://localhost:5000/api/getUserById/${currentUser.uid}`
        );
        setUser(response.data);
      } else {
        setUser(null);
        Cookies.remove("token");
        Cookies.remove("mongoDbId");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getallusers"
        );
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, googleSignIn, logOut, allUsers, setAllUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
