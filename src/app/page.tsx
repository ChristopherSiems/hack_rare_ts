"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Marker, getDistributedMarkers } from "./maps/mapMarker";

export default function Home() {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Check user login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Store the currently selected marker
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  
  // Track map dimension for positioning markers 
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  
  // Track if the map image has been loaded
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Get markers for display
  const [markerData, setMarkerData] = useState<Marker[]>([]);
  
  // Store animation states for each marker
  const [visibleMarkers, setVisibleMarkers] = useState<{ [key: number]: boolean }>({});
  
  // Load markers on first render
  useEffect(() => {
    // Get markers distributed across regions
    setMarkerData(getDistributedMarkers(10));
    
    // Refresh markers every 5 minutes for variety
    const refreshInterval = setInterval(() => {
      setMarkerData(getDistributedMarkers(10));
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Check whether user is logged in when component mounts
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  // Get map dimensions on load to calculate marker positions
  useEffect(() => {
    const updateDimensions = () => {
      if (mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect();
        setMapDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    // Update dimensions when window resizes
    window.addEventListener('resize', updateDimensions);
    
    // Initial calculation after map loads
    if (isMapLoaded) {
      updateDimensions();
    }
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMapLoaded]);

  // Set up animation timers for markers
  useEffect(() => {
    if (!isMapLoaded || markerData.length === 0) return;

    const timers: NodeJS.Timeout[] = [];
    const initialVisibility: { [key: number]: boolean } = {};
    
    // Initialize all markers as hidden
    markerData.forEach(marker => {
      initialVisibility[marker.id] = false;
    });
    
    setVisibleMarkers(initialVisibility);
    
    // Create show/hide timers for each marker
    markerData.forEach(marker => {
      const showDelay = marker.animationDelay || 0;
      const duration = marker.animationDuration || 5000;
      
      // Timer to show the marker
      const showTimer = setTimeout(() => {
        setVisibleMarkers(prev => ({ ...prev, [marker.id]: true }));
      }, showDelay);
      
      // Timer to hide the marker
      const hideTimer = setTimeout(() => {
        setVisibleMarkers(prev => ({ ...prev, [marker.id]: false }));
      }, showDelay + duration);
      
      timers.push(showTimer, hideTimer);
    });
    
    // Calculate total animation cycle time
    const lastMarker = markerData.reduce((latest, marker) => {
      const endTime = (marker.animationDelay || 0) + (marker.animationDuration || 5000);
      return endTime > latest ? endTime : latest;
    }, 0);
    
    const cycleTime = lastMarker + 3000; // Add 3 seconds buffer between cycles
    
    // Create a cycle timer to restart the sequence
    const cycleTimer = setInterval(() => {
      // Reset all markers
      setVisibleMarkers(initialVisibility);
      
      // Restart the show/hide sequence
      markerData.forEach(marker => {
        const showDelay = marker.animationDelay || 0;
        const duration = marker.animationDuration || 5000;
        
        setTimeout(() => {
          setVisibleMarkers(prev => ({ ...prev, [marker.id]: true }));
        }, showDelay);
        
        setTimeout(() => {
          setVisibleMarkers(prev => ({ ...prev, [marker.id]: false }));
        }, showDelay + duration);
      });
    }, cycleTime);
    
    timers.push(cycleTimer);
    
    // Clean up all timers on unmount
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isMapLoaded, markerData]);

  // Handle marker selection
  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
  };
  
  return (
    <main className="flex flex-col items-center justify-between min-h-screen bg-white relative">
      
      {/* World Map Section */}
      <div 
        ref={mapContainerRef}
        id="map-container" 
        className="absolute inset-0 top-12 bottom-16 px-6 overflow-hidden"
      >
        <div className="w-full h-full relative">
          {/* SVG World Map - Responsive and fills container */}
          <Image
            src="/worldmap.svg"
            alt="World Map"
            fill
            style={{ objectFit: 'contain' }}
            priority
            onLoad={() => setIsMapLoaded(true)}
          />
          
          {/* Display markers with direct percentage positioning */}
          {isMapLoaded && markerData.map((marker) => {
            const isVisible = visibleMarkers[marker.id] || false;
            
            return (
              <div
                key={marker.id}
                className={`w-[5vw] md:w-[3vw] absolute origin-bottom ${isVisible ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'}`}
                style={{ 
                  left: `${marker.xPercent}%`, 
                  top: `${marker.yPercent}%`,
                  zIndex: 20,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'scale(1) translateZ(0px)' : 'scale(0) translateZ(0px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease'
                }}
                onClick={() => isVisible && handleMarkerClick(marker)}
              >
                <div className="flex flex-col gap-0.5 md:gap-1 justify-between items-center">
                  {/* Marker Icon */}
                  <div className="rounded-full border-[1.5px] md:border-[2px] lg:border-[3px] border-[#171717] object-cover bg-white overflow-hidden aspect-square w-full">
                    <Image 
                      src={marker.icon} 
                      alt={marker.title}
                      width={72}
                      height={72}
                      className="object-cover aspect-square"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/fallback-marker.svg";
                      }}                    
                    />
                  </div>
                  
                  {/* Marker pointer (triangle) */}
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.72058 6.25115C6.32718 6.65999 5.67282 6.65999 5.27942 6.25116L1.13426 1.94338C0.52294 1.30807 0.973177 0.25 1.85484 0.25L10.1452 0.249999C11.0268 0.249999 11.4771 1.30807 10.8657 1.94337L6.72058 6.25115Z" fill="#171717"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Display selected marker info if any */}
      {selectedMarker && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-30 max-w-md w-full mx-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold">{selectedMarker.title}</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedMarker(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {selectedMarker.description && (
            <p className="mt-2 text-gray-600">{selectedMarker.description}</p>
          )}
          
          <button 
            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => {
              // You can implement navigation or additional actions here
              setSelectedMarker(null);
            }}
          >
            View Details
          </button>
        </div>
      )}
    </main>
  );
}