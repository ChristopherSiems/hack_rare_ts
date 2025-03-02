"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/users/profile", { credentials: "include" });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setUser(data);
      } else {
        console.error("Error:", data.error);
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      router.push("/auth/signin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    localStorage.setItem("isLoggedIn", "false");
    router.push("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
            {[
              { label: "Full name", value: user?.name },
              { label: "Email address", value: user?.email },
              { label: "Country", value: user?.country },
              { label: "Disease", value: user?.disease },
            ].map(({ label, value }, index) => (
              <div
                key={label}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
              >
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || "N/A"}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Action buttons */}
        <div className="px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleLogout}
            className="py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Log out
          </button>

          <button
            onClick={() => router.push("/")}
            className="py-2 px-4 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Back to Map
          </button>
        </div>
      </div>
    </div>
  );
}
