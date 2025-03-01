"use client";
// client-layout.tsx
// This file contains the interactive parts of the layout

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check whether user is logged in when component mounts
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  // Handle user navigation based on login status
  const handleUsernameClick = () => {
    if (isLoggedIn) {
      router.push("/profile");
    } else {
      router.push("/auth/signin");
    }
  };

  // Hamdle chat navigation based on login status
  const handleChatClick = () => {
    if (isLoggedIn){
        router.push('/chat')
    }else{
        router.push("/auth/signin")
    }
  }

  return (
    <>
      {/* Header with logo */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="px-6 py-2">
          <h1 className="text-2xl font-bold text-gray-800">LabBrats</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="min-h-screen pb-16">
        {children}
      </div>

      {/* Navigation Bar - Fixed at bottom of screen */}
      <div className="w-full border-t border-blue-300 fixed bottom-0 bg-white">
        <div className="w-full mx-auto px-6">
          <div className="flex justify-around py-3">
            {/* Event Button */}
            <button className="flex flex-col items-center focus:outline-none group">
              <div className="w-10 h-10 rounded-full border border-blue-400 flex items-center justify-center mb-1 group-hover:border-red-500 group-hover:bg-red-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-blue-500 text-sm group-hover:text-red-500 transition-colors">Event</span>
            </button>

            {/* Username Button */}
            <button
              className="flex flex-col items-center focus:outline-none group"
              onClick={handleUsernameClick}
            >
              <div className="w-10 h-10 rounded-full border border-blue-400 flex items-center justify-center mb-1 group-hover:border-red-500 group-hover:bg-red-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-blue-500 text-sm group-hover:text-red-500 transition-colors">Username</span>
            </button>

            {/* Chat Button */}
            <button className="flex flex-col items-center focus:outline-none group" 
                onClick={handleChatClick}>
                
              <div className="w-10 h-10 rounded-full border border-blue-400 flex items-center justify-center mb-1 group-hover:border-red-500 group-hover:bg-red-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-blue-500 text-sm group-hover:text-red-500 transition-colors">Chat</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}