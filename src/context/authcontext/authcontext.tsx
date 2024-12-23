"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User,getIdToken } from "firebase/auth";
import { auth } from "@/app/fairbase/config";
import { Dispatch, SetStateAction } from "react";
import Cookies from "js-cookie";

import axios from "axios";


interface AuthContextType {
  user: User | null;
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>; 
  allUsers: UserRecord[]; 
  setAllUsers: Dispatch<SetStateAction<UserRecord[]>>; 
}
export interface UserRecord {
  _id?:string
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

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers,setAllUsers]=useState<UserRecord[]>([]);

  const googleSignIn = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
  
      // Get JWT token
      const token = await currentUser.getIdToken();
  
      // Save user to the database and get MongoDB _id
      const mongoDbId = await saveUserToDatabase(currentUser);
  
      // Set cookies
      Cookies.set("token", token, {
        expires: 1, // Expires in 1 day
        secure: true, // Use only in HTTPS
        sameSite: "strict", // Protect against CSRF
      });
  
      Cookies.set("mongoDbId", mongoDbId, {
        expires: 1, // Expires in 1 day
        secure: true,
        sameSite: "strict",
      });
  
      console.log("JWT Token and MongoDB ID stored in cookies:", token, mongoDbId);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };
  
  
  const logOut = async () => {
    try {
      await signOut(auth); 
      setUser(null); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const saveUserToDatabase = async (user: User) => {
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
          channelName: (displayName || "Anonymous User").replace(/\s+/g, "").toLowerCase(),
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await saveUserToDatabase(currentUser);

        const response = await axios.get(`http://localhost:5000/api/getUserById/${currentUser.uid}`);
        setUser(response.data); // Replace the Firebase user with the MongoDB user
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getallusers");
        setAllUsers(response.data); 
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);
  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut,allUsers,setAllUsers}}>
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
