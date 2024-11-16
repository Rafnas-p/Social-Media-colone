"use client";
import { useState } from "react";
import { UserAuth } from "@/context/authcontext/authcontext";

const Signup = () => {
  const [error, setError] = useState("");
  const { googleSignIn, user, logOut } = UserAuth();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn(); 
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };
  console.log(user);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-[400px] bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-center text-3xl font-semibold text-white">
          Sign Up
        </h2>
        <p className="mt-1 text-center text-sm text-gray-400">
          Create a new account with Google
        </p>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}

        <div className="pt-6">
          {!user ? (
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-0"
            >
              Sign Up with Google
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              className="w-full py-3 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-0"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
