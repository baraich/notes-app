import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Map as MapLibre, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { MapToolInput, MapToolOutput } from "@/modules/tools/interface";

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

  const fitBounds = useCallback(() => {
    if (!mapRef.current || output.points.length < 2) return;

    const bounds = new maplibregl.LngLatBounds();
    output.points.forEach((point) => bounds.extend([point.lng, point.lat]));

    mapRef.current.fitBounds(bounds, {
      padding: 40,
      maxZoom: 15,
      duration: 1000,
    });
  }, [mapRef, output.points]);

  useEffect(() => {
    if (!mapLoaded) return;
    fitBounds();
  }, [mapRef, output.points, mapLoaded, fitBounds]);

  if (output.points.length === 0) {
    return (
      <Alert variant={"destructive"}>
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          Unable to create a map preview, missing required details about the
          location.
        </AlertDescription>
      </Alert>
    );
  }

  const center = output.points.find((p) => p.is_main) || output.points[0];

  return (
    <div className="relative flex h-64 w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800">
      <MapLibre
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
      </MapLibre>
    </div>
  );
}
