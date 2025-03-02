"use client"; // Client component directive

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpOption() {
  // Initialize router for navigation after option selection
  const router = useRouter();

  // State to track the selected option
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check selected option and navigate accordingly
    if (selectedOption === "option1" ) {
      // Redirect to this signup page if Option 1 is chosen
      router.push("/auth/signup");
    } else if (selectedOption === "option3") {
      // Redirect to another signup page for Option 3
      router.push("/auth/organization");} 
      else {
      alert("Please select an option before submitting.");
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Who are you?
        </h2>
      </div>

      {/* Option selection buttons */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          {/* Option 1 */}
          <div>
            <input
              type="radio"
              id="option1"
              name="option"
              value="option1"
              checked={selectedOption === "option1"}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="mr-2"
            />
            <label htmlFor="option1" className="text-lg text-black">Patient</label>
          </div>

          {/* Option 3 */}
          <div>
            <input
              type="radio"
              id="option3"
              name="option"
              value="option3"
              checked={selectedOption === "option3"}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="mr-2"
            />
            <label htmlFor="option3" className="text-lg text-black">Organization</label>
          </div>
        </div>

        {/* Submit button */}
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>

        {/* Link to alternate signup page */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
