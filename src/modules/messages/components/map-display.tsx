import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Map, Marker, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo, useState } from "react";
import maplibregl from "maplibre-gl";

interface MapDisplayProps {
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
}

export default function MapDisplay({
  location,
  locationName,
}: MapDisplayProps) {
  const popup = useMemo(() => {
    return new maplibregl.Popup().setText(locationName);
  }, []);

  if (!location.latitude || !location.longitude) {
    return (
      <Alert variant={"destructive"}>
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          Unable to create a map preview, missing required details
          about the location.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="w-full h-64 bg-zinc-800 rounded-lg flex items-center justify-center relative overflow-hidden border border-zinc-800">
      <Map
        initialViewState={{
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 13,
        }}
        maplibreLogo={true}
        attributionControl={false}
        logoPosition={"bottom-right"}
        mapStyle="https://tiles.openfreemap.org/styles/dark"
        style={{ position: "relative", height: "100%" }}
      >
        <Marker
          latitude={location.latitude}
          longitude={location.longitude}
          anchor="center"
          popup={popup}
        ></Marker>
      </Map>
    </div>
  );
}
