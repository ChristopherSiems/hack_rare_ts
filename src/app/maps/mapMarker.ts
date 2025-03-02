// markerData.ts
export type Marker = {
  id: number;
  xPercent: number; // X position as percentage of map width
  yPercent: number; // Y position as percentage of map height
  icon: string;
  title: string;
  description?: string;
  // Animation properties
  animationDelay?: number;
  animationDuration?: number;
};

// These positions are percentages of the map size and should be directly on land masses
// You may need to adjust these values to match your specific map
export const fixedMarkers: Marker[] = [
  // North America
  { 
    id: 2, 
    xPercent: 15, 
    yPercent: 35, 
    icon: "/org/org1.png", 
    title: "Los Angeles Expo"
  },
  { 
    id: 3, 
    xPercent: 17, 
    yPercent: 25, 
    icon: "/org/org2.png", 
    title: "Toronto Summit"
  },
  
  // South America
  { 
    id: 4, 
    xPercent: 28, 
    yPercent: 60, 
    icon: "/org/org3.jpg", 
    title: "São Paulo Festival"
  },
  { 
    id: 5, 
    xPercent: 25, 
    yPercent: 65, 
    icon: "/org/org4.png", 
    title: "Buenos Aires Conference"
  },
  
  // Europe
  { 
    id: 6, 
    xPercent: 47, 
    yPercent: 28, 
    icon: "/org/org5.webp", 
    title: "London Exhibition"
  },
  { 
    id: 7, 
    xPercent: 49, 
    yPercent: 30, 
    icon: "/org/org6.png", 
    title: "Paris Event"
  },
  { 
    id: 8, 
    xPercent: 52, 
    yPercent: 26, 
    icon: "/org/org7.png", 
    title: "Berlin Summit"
  },
  
  // Asia
  { 
    id: 9, 
    xPercent: 75, 
    yPercent: 32, 
    icon: "/org/org8.png", 
    title: "Tokyo Tech Expo"
  },
  { 
    id: 10, 
    xPercent: 70, 
    yPercent: 30, 
    icon: "/org/org9.png", 
    title: "Seoul Digital Forum"
  },
  { 
    id: 11, 
    xPercent: 68, 
    yPercent: 35, 
    icon: "/org/org10.webp", 
    title: "Shanghai Business Summit"
  },
  
  // Africa
  { 
    id: 13, 
    xPercent: 50, 
    yPercent: 45, 
    icon: "/org/org11.webp", 
    title: "Cairo Summit"
  },
  { 
    id: 14, 
    xPercent: 47, 
    yPercent: 60, 
    icon: "/org/org12.jpg", 
    title: "Johannesburg Forum"
  },
  
  // Oceania
  { 
    id: 15, 
    xPercent: 85, 
    yPercent: 70, 
    icon: "/org/org_india.jpg", 
    title: "Sydney Convention"
  },
  { 
    id: 16, 
    xPercent: 88, 
    yPercent: 65, 
    icon: "/org/org13.png", 
    title: "Melbourne Tech Week"
  }
];

/**
 * Get a random subset of markers with staggered animation
 * 
 * @param count Number of markers to display
 * @returns Array of markers with animation properties
 */
export function getRandomMarkers(count: number = 8): Marker[] {
  // Shuffle array
  const shuffled = [...fixedMarkers];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Get subset and add animation timing
  return shuffled.slice(0, count).map((marker, index) => ({
    ...marker,
    animationDelay: 1000 + (index * 1500),
    animationDuration: 6000
  }));
}

/**
 * Get markers distributed across regions with grouped animation timing
 * 
 * @param count Total number of markers to display
 * @returns Array of markers with grouped animation timing
 */
export function getDistributedMarkers(count: number = 8): Marker[] {
  // Define region ranges in the marker array
  const regions = [
    { name: "North America", start: 0, end: 3 },
    { name: "South America", start: 3, end: 5 },
    { name: "Europe", start: 5, end: 8 },
    { name: "Asia", start: 8, end: 12 },
    { name: "Africa", start: 12, end: 14 },
    { name: "Oceania", start: 14, end: 16 }
  ];
  
  // Calculate how many markers per region (at least 1 from each if possible)
  const markersPerRegion = Math.max(1, Math.floor(count / regions.length));
  let remaining = count - (markersPerRegion * regions.length);
  
  let selectedMarkers: Marker[] = [];
  let delayOffset = 1000;
  
  // Select markers from each region
  regions.forEach(region => {
    const regionMarkers = fixedMarkers.slice(region.start, region.end);
    
    // Determine how many to take from this region
    let takeCount = markersPerRegion;
    if (remaining > 0) {
      takeCount += 1;
      remaining -= 1;
    }
    
    // Don't try to take more markers than available
    takeCount = Math.min(takeCount, regionMarkers.length);
    
    // Shuffle region markers
    const shuffled = [...regionMarkers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Add selected markers with timing
    shuffled.slice(0, takeCount).forEach((marker, index) => {
      selectedMarkers.push({
        ...marker,
        animationDelay: delayOffset + (index * 500),
        animationDuration: 7000
      });
    });
    
    // Add gap between regions
    delayOffset += (takeCount * 500) + 2000;
  });
  
  return selectedMarkers;
}