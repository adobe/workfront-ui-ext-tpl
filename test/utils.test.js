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

const fs = require('fs-extra');
const {
  readManifest,
  writeManifest,
  generateRandomPrefix,
  generateUniqueWithinListIdFromValue,
} = require('../src/utils');

describe('readManifest', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return the parsed manifest file contents when the file exists', () => {
    const manifestPath = 'manifest.json';
    const expectedManifest = { name: 'my-ext', version: '1.0.0' };

    const readJsonSyncMock = jest.spyOn(fs, 'readJsonSync').mockReturnValue(expectedManifest);

    expect(readManifest(manifestPath)).toEqual(expectedManifest);
    expect(readJsonSyncMock).toHaveBeenCalledWith(manifestPath, { encoding: 'utf8' });
  });

  test('should return an empty object when the manifest file does not exist (ENOENT)', () => {
    const manifestPath = 'nonexistent-file.json';
    const readJsonSyncMock = jest.spyOn(fs, 'readJsonSync').mockImplementation(() => {
      const err = new Error();
      err.code = 'ENOENT';
      throw err;
    });

    expect(readManifest(manifestPath)).toEqual({});
    expect(readJsonSyncMock).toHaveBeenCalledWith(manifestPath, { encoding: 'utf8' });
  });

  test('should throw an error when throws an error with code other than ENOENT', () => {
    const manifestPath = 'invalid-manifest.json';
    const readJsonSyncMock = jest.spyOn(fs, 'readJsonSync').mockImplementation(() => {
      const err = new Error();
      err.code = 'EACCES';
      throw err;
    });

    try {
      readManifest(manifestPath);
    } catch (err) {
      expect(err.code).toEqual('EACCES');
    }
    expect(readJsonSyncMock).toHaveBeenCalledWith(manifestPath, { encoding: 'utf8' });
  });

  test('should throw an error when some other error occurs such as manifest file contains not valid JSON', () => {
    const manifestPath = 'invalid-manifest.json';
    const readJsonSyncMock = jest.spyOn(fs, 'readJsonSync').mockImplementation(() => {
      const err = new Error();
      throw err;
    });

    try {
      readManifest(manifestPath);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
    expect(readJsonSyncMock).toHaveBeenCalledWith(manifestPath, { encoding: 'utf8' });
  });
});

describe('writeManifest', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should write the manifest to file', () => {
    const manifestPath = 'manifest.json';
    const manifest = { name: 'my-ext', version: '1.0.0' };
    const writeJsonSyncMock = jest.spyOn(fs, 'writeJsonSync').mockImplementation();

    writeManifest(manifest, manifestPath);

    expect(writeJsonSyncMock).toHaveBeenCalledWith(manifestPath, manifest, { spaces: 2 });
  });
});

describe('generateRandomPrefix', () => {
  it('should generate a random prefix of the specified length', () => {
    const length = 5;
    const prefix = generateRandomPrefix(length);
    expect(prefix).toMatch(/[a-z]{5}/);
  });
});

describe('generateUniqueWithinListIdFromValue', () => {
  const list = [
    { id: 'abc123' },
  ];

  it('should generate a unique ID from a value', () => {
    const value = 'My Example @# Value 1';
    const id = generateUniqueWithinListIdFromValue(value, list);
    expect(id).toBe('my-example-value-1');
  });

  it('should add a random prefix if the ID does not contain alphabetic characters', () => {
    const value = '12345';
    const id = generateUniqueWithinListIdFromValue(value, list);
    expect(id).toMatch(/^[a-z]{5}-12345$/);
  });

  it('should add a random prefix if the ID starts with a numeric value', () => {
    const value = '7th My Example';
    const id = generateUniqueWithinListIdFromValue(value, list);
    expect(id).toMatch(/^[a-z]{5}-7th-my-example$/);
  });

  it('should add a random prefix if the ID already exists in the list', () => {
    const value = 'abc123';
    const id = generateUniqueWithinListIdFromValue(value, list);
    expect(id).toMatch(/^[a-z]{5}-abc123$/);
  });

  it('should re-generate ID if the initial value starts with a numeric and the generated value already exists in the list', () => {
    const value = '123 Example Value'; // start with numeric, should leads to adding of generated prefix
    const list = [
      { id: 'abc123' },
    ];

    list.find = jest.fn()
      // emulate that value with the generated prefix already exists in the list
      .mockReturnValueOnce({ id: 'ntosn-123-example-value' })
      .mockReturnValue(undefined);

    const id = generateUniqueWithinListIdFromValue(value, list);
    expect(id).toMatch(/^[[a-z]{5}-[a-z]{5}-123-example-value$/);
  });

  it('should re-generate ID if generated value already exists in the list', () => {
    const value = 'abc123';
    const list = [
      { id: 'abc123' },
    ];

    list.find = jest.fn()
      // emulate that initial value already exists in the list, should leads to adding of generated prefix
      .mockReturnValueOnce({ id: 'ntosn-123-example-value' })
      // emulate that value with the generated prefix already exists in the list
      .mockReturnValueOnce({ id: 'qwerty-123-example-value' })
      .mockReturnValue(undefined);

    const id = generateUniqueWithinListIdFromValue(value, list);
    expect(id).toMatch(/^[a-z]{5}-[a-z]{5}-abc123$/);
  });
});
