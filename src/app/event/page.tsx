// app/events/page.tsx
"use client";

import React, { useState } from 'react';

export default function EventsPage() {
  // Sample data for health awareness events
  const [events] = useState([
    {
      "id": 1,
      "title": "Wolfram Syndrome UK Annual Conference 2025",
      "date": "September 20, 2025",
      "hashtags": ["#WolframSyndrome", "#WSUKConference", "#GeneticDisorders", "#RareDiseases"],
      "description": "Join us for the annual Wolfram Syndrome UK Conference, where families, researchers, and medical experts connect to discuss the latest updates, treatments, and support resources. Free lunch and refreshments provided.",
      "location": "Mercure Daventry Court Hotel, United Kingdom",
      "image": "/flier/wolfram syndrome.jpg"
    },
    {
      "id": 2,
      "title": "Rare Disease Day Conference 2025",
      "date": "February 28, 2025",
      "hashtags": ["#RareDiseaseDay", "#ShowYourStripes", "#RareDiseases", "#Advocacy"],
      "description": "Join us on Rare Disease Day to raise awareness, support research, and connect with experts and patient advocates. Engage in discussions on policy changes, new treatments, and community impact.",
      "location": "National Institutes of Health, Maryland",
      "image": "/flier/raredisease.jpg"
    },
    {
      "id": 3,
      "title": "EURORDIS Rare Diseases Congress 2025",
      "date": "May 15-17, 2025",
      "hashtags": ["#EURORDIS", "#RareDiseaseEurope", "#HealthPolicy", "#OrphanDrugs"],
      "description": "A European-wide event bringing together policymakers, researchers, and patient organizations. Discuss challenges in rare disease treatments, policy advancements, and collaborative solutions.",
      "location": "Brussels, Belgium",
      "image": "/flier/eurordis.png"
    },    
    {
      "id": 4,
      "title": "NORD Rare Diseases Summit",
      "date": "October 20-21, 2025",
      "hashtags": ["#NORDSummit", "#OrphanDrugs", "#RareBreakthroughs", "#FDA"],
      "description": "A premier event focusing on rare disease research, FDA regulatory updates, and industry innovations. Engage with top scientists, policymakers, and patient advocates.",
      "location": "Washington, D.C.",
      "image": "/flier/nord.webp"
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