/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License")
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const fs = require('fs-extra');
const slugify = require('slugify');

/**
 * @param manifestPath
 */
function readManifest (manifestPath) {
  try {
    return fs.readJsonSync(manifestPath, { encoding: 'utf8' });
  } catch (err) {
    if (err.code && err.code === 'ENOENT') {
      return {};
    } else {
      throw err;
    }
  }
}

/**
 * @param manifest
 * @param manifestPath
 */
function writeManifest (manifest, manifestPath) {
  fs.writeJsonSync(manifestPath, manifest, { spaces: 2 });
}

function generateUniqueWithinListIdFromValue (value, list) {
  let id = slugify(value, {
    lower: true,
    strict: true,
  });

  if (!/^[a-zA-Z]/.test(id)) {
    id = generateRandomPrefix(5) + '-' + id;
  }

  if (list) {
    let matching = list.find(obj => obj.id === id);
    while (matching !== undefined) {
      id = generateRandomPrefix(5) + '-' + id;
      matching = list.find(obj => obj.id === id);
    }
  }

  return id;
}

function generateRandomPrefix (length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const randomString = [];

  for (let i = 0; i < length; i++) {
    const character = characters.charAt(Math.floor(Math.random() * characters.length));
    randomString.push(character);
  }

  return randomString.join('');
}

module.exports = {
  readManifest,
  writeManifest,
  generateRandomPrefix,
  generateUniqueWithinListIdFromValue,
};
