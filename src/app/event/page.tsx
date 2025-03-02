// app/events/page.tsx
"use client";

import React, { useState } from 'react';

export default function EventsPage() {
  // Sample data for health awareness events
  const [events] = useState([
    {
      id: 1,
      title: "World Diabetes Day Awareness",
      date: "November 14, 2025",
      hashtags: ["#DiabetesAwareness", "#T1D", "#T2D", "#BlueCircle"],
      description: "Join us for our annual Diabetes awareness campaign. Learn about prevention, management, and latest treatments. Free blood sugar screening available for all attendees.",
      location: "City Community Center",
      image: "/api/placeholder/600/400"
    },
    {
      id: 2,
      title: "Heart Health Month",
      date: "February 10-28, 2025",
      hashtags: ["#HeartHealth", "#CardiovascularDisease", "#GoRed"],
      description: "February is Heart Health Month! Participate in our series of workshops, fitness activities, and seminars focused on cardiovascular health and disease prevention.",
      location: "Memorial Hospital",
      image: "/api/placeholder/600/400"
    },
    {
      id: 3,
      title: "Mental Health Awareness Walk",
      date: "May 15, 2025",
      hashtags: ["#MentalHealthMatters", "#EndTheStigma", "#MindfulnessWalk"],
      description: "Take steps for mental health awareness. This 5K walk aims to reduce stigma and promote understanding of mental health conditions. Register now to support the cause.",
      location: "Riverside Park",
      image: "/api/placeholder/600/400"
    },
    {
      id: 4,
      title: "Breast Cancer Screening Drive",
      date: "October 8, 2025",
      hashtags: ["#BreastCancerAwareness", "#ThinkPink", "#EarlyDetection"],
      description: "Free mammogram screenings available for eligible women. Learn about self-examination techniques and risk factors. Together we can fight breast cancer through early detection.",
      location: "Women's Health Clinic",
      image: "/api/placeholder/600/400"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md">
      <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold">Health Awareness Events</h1>
            <p className="mt-1">Join us in promoting awareness for important health causes</p>
        </div>
        </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <img 
                src={event.image} 
                alt={`Flier for ${event.title}`} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {event.hashtags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {event.location}
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center py-6">
        <p>© 2025 Hack Rare LabBrats. All rights reserved.</p>
      </footer>
    </div>
  );
}