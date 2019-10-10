/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import _ from 'lodash';
import { geoJsonCleanAndValidate } from './geo_json_clean_and_validate';
import { i18n } from '@kbn/i18n';
import { PatternReader } from './pattern_reader';

// In local testing, performance improvements leveled off around this size
export const FILE_BUFFER = 1024000;

const readSlice = (fileReader, file, start, stop) => {
  const blob = file.slice(start, stop);
  fileReader.readAsBinaryString(blob);
};

let previousFileReader;
export const fileHandler = (
  file, chunkHandler, cleanAndValidate, getFileParseActive,
  fileReader = new FileReader(), fileBuffer = FILE_BUFFER
) => {

  if (!file) {
    return Promise.reject(
      new Error(
        i18n.translate('xpack.fileUpload.fileParser.noFileProvided', {
          defaultMessage: 'Error, no file provided',
        })
      )
    );
  }


  // Halt any previous file reading activity
  if (previousFileReader) {
    previousFileReader.abort();
  }

  let start;
  let stop = fileBuffer;
  previousFileReader = fileReader;

  // Set up feature tracking
  let featuresProcessed = 0;
  const onFeatureRead = feature => {
    // TODO: Add handling and tracking for cleanAndValidate fails
    featuresProcessed++;
    return cleanAndValidate(feature);
  };

  const patternReader = new PatternReader();
  patternReader.onGeoJSONFeaturePatternDetect(onFeatureRead);

  const filePromise = new Promise((resolve, reject) => {
    fileReader.onloadend = ({ target: { readyState, result } }) => {
      if (readyState === FileReader.DONE) {
        if (!getFileParseActive() || !result) {
          patternReader.abortStream();
          resolve(null);
          return;
        }
        chunkHandler({
          featuresProcessed,
          bytesProcessed: stop || file.size,
          totalBytes: file.size
        });
        patternReader.writeDataToPatternStream(result);
        if (!stop) {
          return;
        }

        start = stop;
        const newStop = stop + fileBuffer;
        // Check EOF
        stop = newStop > file.size ? undefined : newStop;
        readSlice(fileReader, file, start, stop);
      }
    };
    fileReader.onerror = () => {
      fileReader.abort();
      patternReader.abortStream();
      reject(new Error(i18n.translate(
        'xpack.fileUpload.fileParser.errorReadingFile', {
          defaultMessage: 'Error reading file',
        })));
    };
    patternReader.onStreamComplete(parsedGeojson => {
      resolve(parsedGeojson);
    });
  });
  readSlice(fileReader, file, start, stop);
  return filePromise;
};

export function jsonPreview(json, previewFunction) {
  if (json && previewFunction) {
    const defaultName = _.get(json, 'name', 'Import File');
    previewFunction(json, defaultName);
  }
}

export async function parseFile(
  file, transformDetails, previewCallback = null, onChunkParse, getFileParseActive
) {
  let cleanAndValidate;
  if (typeof transformDetails === 'object') {
    cleanAndValidate = transformDetails.cleanAndValidate;
  } else {
    switch(transformDetails) {
      case 'geo':
        cleanAndValidate = geoJsonCleanAndValidate;
        break;
      default:
        throw(
          i18n.translate(
            'xpack.fileUpload.fileParser.transformDetailsNotDefined', {
              defaultMessage: 'Index options for {transformDetails} not defined',
              values: { transformDetails }
            })
        );
    }
  }

  const parsedJson = await fileHandler(
    file, onChunkParse, cleanAndValidate, getFileParseActive
  );
  jsonPreview(parsedJson, previewCallback);
  return parsedJson;
}
