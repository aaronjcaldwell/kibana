/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

export {
  injectDefaultVars,
  replaceInjectedVars,
} from './modify_injected_vars';

export {
  mappings,
  migrations,
  savedObjectSchemas,
  validations,
} from './saved_object';

export {
  app,
  apps,
} from './ui_apps';

export {
  visTypes,
  visResponseHandlers,
  visRequestHandlers,
  visEditorTypes,
  savedObjectTypes,
  embeddableFactories,
  fieldFormats,
  fieldFormatEditors,
  inspectorViews,
  chromeNavControls,
  navbarExtensions,
  contextMenuActions,
  managementSections,
  indexManagement,
  devTools,
  docViews,
  hacks,
  home,
  visTypeEnhancers,
  aliases,
  visualize,
  search,
  autocompleteProviders,
  shareContextMenuExtensions,
} from './ui_app_extensions';

export {
  link,
  links,
} from './ui_nav_links';

export {
  styleSheetPaths
} from './style_sheet_paths';

export {
  uiSettingDefaults,
} from './ui_settings';

export {
  unknown,
} from './unknown';

export {
  noParse,
  __globalImportAliases__,
  __bundleProvider__,
  __webpackPluginProvider__,
} from './webpack_customizations';
