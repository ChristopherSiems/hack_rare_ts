"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

//Define the Marker type for typeScript
type Marker = {
  id: number;
  lat: number;
  lng: number;
  icon: string;
  title: string;
};

// Define marker data - you can fetch this from an API in a real application
const markerData = [
  { 
    id: 1, 
    lat: 25, 
    lng: 15, 
    icon: "/userx.svg",  // Replace with your actual icon paths
    title: "Paris Event"
  },
  { 
    id: 2, 
    lat: 23, 
    lng: 22, 
    icon: "/userx.svg", 
    title: "London Exhibition"
  },
  { 
    id: 3, 
    lat: 34, 
    lng: 60, 
    icon: "/userx.svg", 
    title: "Tokyo Festival"
  },
  { 
    id: 4, 
    lat: 39, 
    lng: 77, 
    icon: "/userx.svg", 
    title: "Seoul Conference"
  },
  { 
    id: 5, 
    lat: 48, 
    lng: 40, 
    icon: "/userx.svg", 
    title: "Moscow Exhibition"
  },
];

export default function Home() {
  const router = useRouter();
  //Check user login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Store the currently selected marker
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  // Track map dimension for positioning markers 
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  // Track if the map image has been loaded
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  //Check whether user is logged in when component mounts
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  // Get map dimensions on load to calculate marker positions
  useEffect(() => {
    const updateDimensions = () => {
      const mapContainer = document.getElementById('map-container');
      if (mapContainer) {
        setMapDimensions({
          width: mapContainer.offsetWidth,
          height: mapContainer.offsetHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    
    // Initial calculation after map loads
    if (isMapLoaded) {
      updateDimensions();
    }
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMapLoaded]);

  // Handle marker selction when clicked
  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
  };
  

  // Calculate marker position on the map
  const getMarkerPosition = (lat: number, lng: number) => {
    const x = (lng + 180) * (mapDimensions.width / 360);
    const y = (90 - lat) * (mapDimensions.height / 180);
    return { x, y };
  };
  

  return (
    <main className="flex flex-col items-center justify-between min-h-screen bg-white relative">
      
      {/* World Map Section*/}
      <div id="map-container" className="absolute inset-0 top-12 bottom-16 px-6 overflow-hidden">
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
          
          {/* Display markers */}
          {isMapLoaded && mapDimensions.width > 0 && markerData.map((marker) => {
            const position = getMarkerPosition(marker.lat, marker.lng);
            return (
              <div
                key={marker.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ 
                  left: `${position.x}px`, 
                  top: `${position.y}px`,
                  zIndex: 20
                }}
                onClick={() => handleMarkerClick(marker)}
              >
                {/* Marker Icon */}
                <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center bg-white overflow-hidden">
                  <Image 
                    src={marker.icon} 
                    alt={marker.title}
                    width={30}
                    height={30}
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/fallback-marker.svg";
                    }}                    
                  />
                </div>
                
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {marker.title}
                </div>
                
                {/* Marker pointer */}
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500 mx-auto -mt-1"></div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}