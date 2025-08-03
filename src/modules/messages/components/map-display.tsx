import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Layer,
  Map,
  Marker,
  Popup,
  Source,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import {
  MapToolInput,
  MapToolOutput,
} from "@/modules/tools/interface";
import { env } from "@/env";

interface MapDisplayProps {
  input: MapToolInput;
  output: MapToolOutput;
}

export default function MapDisplay({ output }: MapDisplayProps) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeCoords, setRouteCoords] = useState<number[][] | null>(
    null
  );

  const [selectedPoint, setSelectedPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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

  // async function fetchRoute(
  //   start: { lat: number; lng: number },
  //   end: { lat: number; lng: number }
  // ): Promise<number[][]> {
  //   const response = await fetch(
  //     `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: env.NEXT_PUBLIC_HEIGHT_API_KEY,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         coordinates: [
  //           [start.lng, start.lat],
  //           [end.lng, end.lat],
  //         ],
  //       }),
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error("Failed to fetch route");
  //   }

  //   const json = await response.json();
  //   return json.features[0].geometry.coordinates;
  // }

  return (
    <div className="w-full h-64 bg-zinc-800 rounded-lg flex items-center justify-center relative overflow-hidden border border-zinc-800">
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
        mapStyle="https://tiles.openfreemap.org/styles/dark"
      >
        {output.points
          .sort((x, y) => Number(y.is_main) - Number(x.is_main))
          .map((point, idx) => {
            const isSelected =
              selectedPoint?.lat === point.lat &&
              selectedPoint?.lng === point.lng;

            return (
              <Marker
                key={idx}
                latitude={point.lat}
                longitude={point.lng}
                anchor="center"
                // onClick={async () => {
                //   const clickedPoint = {
                //     lat: point.lat,
                //     lng: point.lng,
                //   };

                //   if (
                //     selectedPoint &&
                //     selectedPoint.lat === clickedPoint.lat &&
                //     selectedPoint.lng === clickedPoint.lng
                //   ) {
                //     setSelectedPoint(null);
                //     setRouteCoords(null);
                //   } else {
                //     setSelectedPoint(clickedPoint);

                //     try {
                //       const coords = await fetchRoute(
                //         center,
                //         clickedPoint
                //       );
                //       setRouteCoords(coords);
                //     } catch (e) {
                //       console.error("Route fetch failed:", e);
                //       setRouteCoords(null);
                //     }
                //   }
                // }}
                popup={new maplibregl.Popup().setText(point.location)}
              ></Marker>
            );
          })}

        {routeCoords && (
          <Source
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: routeCoords,
              },
              properties: {},
            }}
          >
            <Layer
              id="routed-path"
              type="line"
              paint={{
                "line-color": "#00bcd4",
                "line-width": 4,
                "line-opacity": 0.8,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
