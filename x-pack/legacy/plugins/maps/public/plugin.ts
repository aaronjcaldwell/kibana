/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Plugin, CoreStart } from 'src/core/public';
// @ts-ignore
import { wrapInI18nContext } from 'ui/i18n';
// @ts-ignore
import { MapListing } from './components/map_listing';
// @ts-ignore
import { setLicenseId } from './kibana_services';
// @ts-ignore
import { MapEmbeddableFactory } from './embeddable/map_embeddable_factory.js';
// @ts-ignore
import { MAP_SAVED_OBJECT_TYPE } from '../common/constants';

/**
 * These are the interfaces with your public contracts. You should export these
 * for other plugins to use in _their_ `SetupDeps`/`StartDeps` interfaces.
 * @public
 */
export type MapsPluginSetup = ReturnType<MapsPlugin['setup']>;
export type MapsPluginStart = ReturnType<MapsPlugin['start']>;

/** @internal */
export class MapsPlugin implements Plugin<MapsPluginSetup, MapsPluginStart> {
  public setup(core: any, plugins: any) {
    const {
      __LEGACY: { uiModules },
      np: { licensing, embeddable },
    } = plugins;

    embeddable.registerEmbeddableFactory(MAP_SAVED_OBJECT_TYPE, new MapEmbeddableFactory());

    uiModules
      .get('app/maps', ['ngRoute', 'react'])
      .directive('mapListing', function(reactDirective: any) {
        return reactDirective(wrapInI18nContext(MapListing));
      });

    if (licensing) {
      licensing.license$.subscribe(({ uid }: { uid: string }) => setLicenseId(uid));
    }
  }

  public start(core: CoreStart, plugins: any) {}
}
