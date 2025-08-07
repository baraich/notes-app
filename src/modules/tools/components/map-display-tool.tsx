import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Map, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import {
  MapToolInput,
  MapToolOutput,
} from "@/modules/tools/interface";

interface MapDisplayProps {
  input: MapToolInput;
  output: MapToolOutput;
}

export default function MapDisplay({ output }: MapDisplayProps) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  // const [mapStyle, setMapStyle] = useState<
  //   "dark" | "positron" | "liberty"
  // >("dark");

  const fitBounds = () => {
    if (!mapRef.current || output.points.length < 2) return;

    const bounds = new maplibregl.LngLatBounds();
    output.points.forEach((point) =>
      bounds.extend([point.lng, point.lat])
    );

    mapRef.current.fitBounds(bounds, {
      padding: 40,
      maxZoom: 15,
      duration: 1000,
    });
  };

  useEffect(() => {
    if (!mapLoaded) return;
    fitBounds();
  }, [mapRef.current, output.points, mapLoaded]);

  if (output.points.length === 0) {
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

  const center =
    output.points.find((p) => p.is_main) || output.points[0];

  return (
    <div className="w-full h-64 bg-zinc-800 rounded-lg flex flex-col items-center justify-center relative overflow-hidden border border-zinc-800">
      <Map
        reuseMaps
        onLoad={() => {
          setMapLoaded(true);
        }}
        ref={(instance) => {
          mapRef.current = instance?.getMap?.() ?? null;
        }}
        initialViewState={{
          latitude: center.lat,
          longitude: center.lng,
          zoom: 13,
        }}
        maplibreLogo={true}
        attributionControl={false}
        logoPosition={"bottom-right"}
        mapStyle={
          "https://tiles.openfreemap.org/styles/dark"
          // Light mode varient for the map.
          // "https://tiles.openfreemap.org/styles/positron"
        }
      >
        {output.points
          .sort((x, y) => Number(y.is_main) - Number(x.is_main))
          .map((point, idx) => {
            return (
              <Marker
                key={idx}
                latitude={point.lat}
                longitude={point.lng}
                anchor="center"
                popup={new maplibregl.Popup().setText(point.location)}
              ></Marker>
            );
          })}
      </Map>
    </div>
  );
}
