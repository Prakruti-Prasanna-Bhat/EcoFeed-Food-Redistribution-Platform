// @ts-nocheck
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Fix for missing marker icons (Standard Leaflet Bug) ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
// ----------------------------------------------------------

// Default center (Bangalore)
const DEFAULT_CENTER = [12.9716, 77.5946];

export default function RescueMap({ locations = [], userLocation = null }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Map (only if not already created)
    if (mapContainerRef.current && !mapInstanceRef.current) {
      
      // Cleanup any existing map instance on this element
      if (mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }

      const map = L.map(mapContainerRef.current).setView(userLocation || DEFAULT_CENTER, 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Fix gray box issue
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, []);

  // 2. Update Markers whenever 'locations' or 'userLocation' changes
  useEffect(() => {
    if (mapInstanceRef.current && markersLayerRef.current) {
      markersLayerRef.current.clearLayers();

      // Add User Location Marker (Blue)
      if (userLocation) {
         L.circleMarker(userLocation, {
            radius: 8,
            fillColor: "#3b82f6", // Blue
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
         }).addTo(markersLayerRef.current).bindPopup("You are here");
         
         mapInstanceRef.current.setView(userLocation, 12);
      }

      // Add Other Locations (Red Pins) - can be NGOs, Composters, etc.
      locations.forEach(loc => {
        if (loc.lat && loc.lng) {
          const popupContent = `
            <div class="p-1">
                <strong class="text-sm text-green-700">${loc.name}</strong><br/>
                <span class="text-xs text-gray-600">${loc.type || 'Location'}</span>
            </div>
          `;
          L.marker([loc.lat, loc.lng])
            .bindPopup(popupContent)
            .addTo(markersLayerRef.current);
        }
      });
    }
  }, [locations, userLocation]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full min-h-[250px] z-0"
      style={{ minHeight: '250px' }}
    />
  );
}