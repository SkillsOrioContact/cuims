"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2 } from "lucide-react";

// Fix missing marker icons in leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ProjectMap({ projects }: { projects: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 border border-dashed rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Flatten projects and subprojects
  const allProjects = projects.flatMap(p => [p, ...(p.subProjects || [])]);

  // Filter projects that actually have coordinates
  const validProjects = allProjects.filter(p => p.latitude != null && p.longitude != null);

  // Default to a central location if no projects (e.g., center of US, or dynamically calculate bounds)
  const defaultCenter: [number, number] = validProjects.length > 0
    ? [validProjects[0].latitude, validProjects[0].longitude]
    : [39.8283, -98.5795];

  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden border">
      <MapContainer
        center={defaultCenter}
        zoom={validProjects.length > 0 ? 5 : 4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validProjects.map((project) => (
          <Marker
            key={project.id}
            position={[project.latitude, project.longitude]}
            icon={icon}
          >
            <Popup>
              <strong>{project.name}</strong><br/>
              Status: {project.status}<br/>
              Contract Cost: ${project.contractCost?.toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}