"use client"; // Client component directive

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  // Initialize router for navigation
  const router = useRouter();

  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Check authentication when component mounts
  useEffect(() => {
    // Redirect to signin if not logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/auth/signin");
    } else {
      setLoading(false); // Stop loading if authenticated
    }
  }, [router]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  // Show loading state while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Main profile content
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile header */}
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and preferences</p>
        </div>

        {/* Profile information list */}
        <div className="border-t border-gray-200">
          <dl>
            {/* Full name row */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">John Doe</dd>
            </div>

            {/* Email row */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">johndoe@example.com</dd>
            </div>

            {/* Member since row */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Member since</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">January 1, 2023</dd>
            </div>
          </dl>
        </div>

        {/* Action buttons */}
        <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Log out
          </button>

          {/* Back to map button */}
          <button
            onClick={() => router.push("/")}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Map
          </button>
        </div>
      </div>
    </div>
  );
}
