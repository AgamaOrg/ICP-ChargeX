import type { StyleSpecification } from "maplibre-gl";

export type MapStyleId = "color" | "dark" | "satellite";

// Esri imagery has no vector style, so it is wrapped in a minimal raster
// style with Esri's place-name overlay on top.
const satelliteStyle: StyleSpecification = {
  version: 8,
  sources: {
    imagery: {
      type: "raster",
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      maxzoom: 19,
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
    },
    places: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [
    { id: "imagery", type: "raster", source: "imagery" },
    { id: "places", type: "raster", source: "places" },
  ],
};

/**
 * Basemaps shared by the rider battery map and the admin branch map. All
 * three are free and need no API key: CARTO vector styles (OpenStreetMap
 * data) and Esri World Imagery.
 */
export const MAP_STYLES: Record<MapStyleId, { label: string; style: string | StyleSpecification }> = {
  color: { label: "Color", style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" },
  dark: { label: "Dark", style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" },
  satellite: { label: "Satellite", style: satelliteStyle },
};

export const MAP_STYLE_IDS = Object.keys(MAP_STYLES) as MapStyleId[];

export function isMapStyleId(value: string | null): value is MapStyleId {
  return value !== null && Object.hasOwn(MAP_STYLES, value);
}
