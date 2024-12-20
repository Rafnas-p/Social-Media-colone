"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/app/fairbase/config";
import { Dispatch, SetStateAction } from "react";

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
    await signInWithPopup(auth, provider); 
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
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Error response from backend:", data); // Log backend response
        throw new Error(data.message || "Failed to save user");
      }
  
    } catch (error) {
      console.error("Error saving user to database:", error);
    }
  };
  
  
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //     if (currentUser) {
    
  //       setUser(currentUser);
  //       await saveUserToDatabase(currentUser); 
  //     } else {
  //       setUser(null);
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);
  
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
