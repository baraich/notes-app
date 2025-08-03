import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Map, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapDisplayProps {
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function MapDisplay({ location }: MapDisplayProps) {
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
    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
      <Map
        initialViewState={{
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 13,
        }}
        maplibreLogo={true}
        attributionControl={false}
        logoPosition={"bottom-right"}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ position: "relative", height: "100%" }}
      >
        <Marker
          latitude={location.latitude}
          longitude={location.longitude}
          anchor="center"
        ></Marker>
      </Map>
    </div>
  );
}
