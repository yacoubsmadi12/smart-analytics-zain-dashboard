import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { cn } from "@/lib/utils";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  color?: string;
  layer?: string;
  detail?: { title: string; rows: Array<[string, string]> };
};

export type MapLayerState = Record<string, boolean>;

type MapViewProps = {
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  markers?: MapMarker[];
  layers?: MapLayerState;
  selectedId?: string | null;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapReady?: (map: any) => void;
  onMapError?: (error: Error) => void;
};

const JORDAN_CENTER = { lat: 31.24, lng: 36.35 };

function clusterMarkers(markers: MapMarker[], zoom: number) {
  if (zoom >= 11) return markers.map(marker => ({ marker, count: 1, lat: marker.lat, lng: marker.lng }));
  const precision = zoom <= 7 ? 0.28 : zoom <= 9 ? 0.12 : 0.045;
  const groups = new Map<string, { markers: MapMarker[]; lat: number; lng: number }>();
  markers.forEach(marker => {
    const key = `${Math.round(marker.lat / precision)}:${Math.round(marker.lng / precision)}`;
    const group = groups.get(key) ?? { markers: [], lat: 0, lng: 0 };
    group.markers.push(marker);
    group.lat += marker.lat;
    group.lng += marker.lng;
    groups.set(key, group);
  });
  return Array.from(groups.values()).map(group => ({ marker: group.markers[0], count: group.markers.length, lat: group.lat / group.markers.length, lng: group.lng / group.markers.length }));
}

export function MapView({
  className,
  initialCenter = JORDAN_CENTER,
  initialZoom = 7,
  markers = [],
  layers = {},
  selectedId,
  onMarkerClick,
  onMapReady,
  onMapError,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  const onMapReadyRef = useRef(onMapReady);
  const onMapErrorRef = useRef(onMapError);
  const [zoom, setZoom] = useState(initialZoom);

  onMarkerClickRef.current = onMarkerClick;
  onMapReadyRef.current = onMapReady;
  onMapErrorRef.current = onMapError;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    try {
      const map = L.map(containerRef.current, { zoomControl: true, preferCanvas: true }).setView([initialCenter.lat, initialCenter.lng], initialZoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors", maxZoom: 19 }).addTo(map);
      const markerLayer = L.layerGroup().addTo(map);
      map.on("zoomend", () => setZoom(map.getZoom()));
      mapRef.current = map;
      markerLayerRef.current = markerLayer;
      onMapReadyRef.current?.(map);
      setTimeout(() => map.invalidateSize(), 0);
    } catch (error) {
      onMapErrorRef.current?.(error instanceof Error ? error : new Error("Map could not be initialized"));
    }
    return () => { mapRef.current?.remove(); mapRef.current = null; markerLayerRef.current = null; };
  }, [initialCenter.lat, initialCenter.lng, initialZoom]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const visible = markers.filter(marker => !marker.layer || layers[marker.layer] !== false);
    clusterMarkers(visible, zoom).forEach(group => {
      const color = group.marker.color ?? "#39c7d5";
      const isSelected = group.count === 1 && group.marker.id === selectedId;
      const circle = L.circleMarker([group.lat, group.lng], { radius: group.count > 1 ? Math.min(20, 8 + Math.log10(group.count) * 5) : isSelected ? 10 : 6, color: isSelected ? "#ffffff" : "#071822", weight: isSelected ? 3 : 1.5, fillColor: group.count > 1 ? "#2eb6c8" : color, fillOpacity: 0.88 });
      if (group.count > 1) {
        circle.bindTooltip(`${group.count.toLocaleString()} sites`, { direction: "top", className: "map-cluster-tooltip" });
        circle.on("click", () => map.setView([group.lat, group.lng], Math.min(12, zoom + 2)));
      } else {
        const marker = group.marker;
        if (marker.label) circle.bindTooltip(marker.label, { direction: "top", offset: [0, -5] });
        if (marker.detail) circle.bindPopup(`<strong>${marker.detail.title}</strong>${marker.detail.rows.map((row: [string, string]) => `<br/><span>${row[0]}: ${row[1]}</span>`).join("")}`);
        circle.on("click", () => onMarkerClickRef.current?.(marker));
      }
      circle.addTo(layer);
    });
  }, [markers, layers, selectedId, zoom]);

  return <div ref={containerRef} className={cn("w-full h-[500px] smart-leaflet-map", className)} aria-label="Jordan operational map" />;
}

export function OperationalMap(props: MapViewProps) {
  return <MapView {...props} />;
}
