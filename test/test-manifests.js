/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const defaultExtensionManifest = {
  name: 'Workfront Test Extension',
  id: 'workfront-test-extension',
  description: 'Test Extension for Workfront product',
  version: '0.0.1',
};

const customExtensionManifest = {
  name: 'Workfront Test Extension',
  id: 'workfront-test-extension',
  description: 'Test Extension for Workfront product',
  version: '1.0.1',
  mainMenuItems: [
    {
      label: 'Import',
      id: 'import',
    },
    {
      label: 'Export',
      id: 'export',
    },
  ],
};

module.exports = {
  defaultExtensionManifest,
  customExtensionManifest,
};
