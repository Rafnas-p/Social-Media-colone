// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FAIRBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FAIRBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FAIRBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FAIRBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FAIRBASE_MASSAGINGSENDERiD,
  appId: process.env.NEXT_PUBLIC_FAIRBASE_APPID,

};


const app =!getApps().length? initializeApp(firebaseConfig) :getApp()

export const auth=getAuth(app)
export const db = getFirestore(app); 


