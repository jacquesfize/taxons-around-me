import { stringify } from "wellknown";
import { buffer } from "@turf/turf";

function toWKT(layer, typeLayer, radius) {
  let WKT = stringify(layer.toGeoJSON());
  // If point or line, we buffer the geometry since API does not support them
  if (typeLayer == "marker" || typeLayer == "polyline") {
    var buffered = buffer(layer.toGeoJSON(), radius);
    WKT = stringify(buffered);
  }
  if (typeLayer == "circle") {
    var buffered = buffer(layer.toGeoJSON(), layer.getRadius());
    WKT = stringify(buffered);
  }
  return WKT;
}
export { toWKT };
