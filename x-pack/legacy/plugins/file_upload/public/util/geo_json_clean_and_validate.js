/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import * as jsts from 'jsts';
import rewind from 'geojson-rewind';

export function geoJsonCleanAndValidate(features) {

  const reader = new jsts.io.GeoJSONReader();
  const geoJson = reader.read({
    type: 'FeatureCollection',
    features
  });

  // Pass features for cleaning
  const cleanedFeatures = cleanFeatures(geoJson.features);

  // JSTS does not enforce winding order, wind in clockwise order
  const correctlyWindedFeatures = rewind(cleanedFeatures, false);
  return correctlyWindedFeatures;
}

export function cleanFeatures(features) {
  const writer = new jsts.io.GeoJSONWriter();
  return features.map(({ id, geometry, properties }) => {
    const geojsonGeometry = (geometry.isSimple() || geometry.isValid())
      ? writer.write(geometry)
      : writer.write(geometry.buffer(0));
    return ({
      type: 'Feature',
      geometry: geojsonGeometry,
      ...(id ? { id } : {}),
      ...(properties ? { properties } : {}),
    });
  });
}
