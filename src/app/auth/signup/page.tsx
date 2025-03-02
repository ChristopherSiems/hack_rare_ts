"use client"; // Client component directive

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import fs from 'fs/promises';
import path from 'path';

// Sample fallback data in case file loading fails
const SAMPLE_DISEASES = [
  "Autosomal dominant polycystic kidney disease",
  "Autosomal recessive polycystic kidney disease",
  "Autoimmune hepatitis",
  "Autism spectrum disorder",
  "Asthma",
  "Alzheimer's disease"
];

export default function SignUp() {
  // Initialize router for navigation after signup
  const router = useRouter();
  
  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disease, setDisease] = useState("");
  const [location, setLocation] = useState("");
  
  // State for disease suggestions
  const [diseases, setDiseases] = useState<string[]>([]);
  const [filteredDiseases, setFilteredDiseases] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch diseases from the disease.txt file
  useEffect(() => {
    const fetchDiseases = async () => {
      setIsLoading(true);
      try {
        // Since we know the exact path, we'll create an API endpoint to access it
        const response = await fetch('/api/diseases');
        if (response.ok) {
          const data = await response.json();
          if (data.diseases && data.diseases.length > 0) {
            setDiseases(data.diseases);
            console.log(`Loaded ${data.diseases.length} diseases from API`);
          } else {
            console.log("API returned empty diseases list, using fallback data");
            setDiseases(SAMPLE_DISEASES);
          }
        } else {
          console.error("Failed to fetch diseases from API, using fallback data");
          setDiseases(SAMPLE_DISEASES);
        }
      } catch (error) {
        console.error('Error loading diseases:', error);
        setDiseases(SAMPLE_DISEASES);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiseases();
  }, []);

  // Filter diseases based on input
  const handleDiseaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisease(value);
    
    if (value.trim() === '') {
      setFilteredDiseases([]);
      setShowSuggestions(false);
    } else {
      // Case-insensitive search
      const searchTerm = value.toLowerCase();
      const filtered = diseases
        .filter(d => d.toLowerCase().includes(searchTerm))
        .slice(0, 5); // Limit to 5 suggestions
      
      setFilteredDiseases(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  // Select disease from suggestions
  const selectDisease = (selected: string) => {
    setDisease(selected);
    setShowSuggestions(false);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/users/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, disease, location }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful!");
        router.push("/auth/signin");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Internal Server Error");
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        {isLoading && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Loading disease data...
          </p>
        )}
      </div>
      
      {/* Registration form */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          {/* Name input field */}
          <div>
            <label htmlFor="name" className="sr-only">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          {/* Email input field */}
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          {/* Password input field */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Disease type input field with autocomplete */}
          <div className="relative">
            <label htmlFor="disease" className="sr-only">
              Disease
            </label>
            <input
              id="disease"
              name="disease"
              type="text"
              autoComplete="off"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Disease name"
              value={disease}
              onChange={handleDiseaseChange}
              onFocus={() => {
                if (disease.trim() !== '') {
                  const filtered = diseases
                    .filter(d => d.toLowerCase().includes(disease.toLowerCase()))
                    .slice(0, 5);
                  setFilteredDiseases(filtered);
                  setShowSuggestions(filtered.length > 0);
                }
              }}
            />
            
            {/* Suggestions dropdown */}
            {showSuggestions && filteredDiseases.length > 0 && (
              <div className="absolute z-10 w-full bg-white text-black border border-gray-300 rounded-b-md shadow-lg max-h-60 overflow-y-auto">
                <ul className="py-1">
                  {filteredDiseases.map((suggestion, index) => (
                    <li 
                      key={index}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectDisease(suggestion)}
                      onMouseDown={(e) => {
                        // Prevent the onBlur from firing before the click
                        e.preventDefault();
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        
          {/* Location */}
          <div>
            <label htmlFor="location" className="sr-only">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              autoComplete="address-level1"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Submit button */}
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign up
          </button>
        </div>
        
        {/* Link to signin page */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}