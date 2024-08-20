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

const Generator = require('yeoman-generator');
const path = require('path');
const upath = require('upath');
const { utils } = require('@adobe/generator-app-common-lib');

class ConfigGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts);

    this.option('extensionOptions', { type: Object });
  }

  writing () {
    this.generateDefaultMetadata();
    this.generateAppConfig();
    this.generateExtensionConfig();

  }

  generateDefaultMetadata () {
    this.fs.writeJSON('src/app-metadata.json', {});
  }

  generateAppConfig () {
    utils.writeKeyAppConfig(
      this,
      'extensions.' + this.options.extensionOptions.type,
      {
        // posix separator
        $include: upath.toUnix(this.options.extensionOptions.configPath),
      }
    );
  }

  generateExtensionConfig () {
    utils.writeKeyYAMLConfig(
      this,
      this.options.extensionOptions.configPath,
      'operations',
      {
        view: [
          { type: 'web', impl: 'index.html' },
        ],
      }
    );

    utils.writeKeyYAMLConfig(
      this,
      this.options.extensionOptions.configPath,
      'web',
      path.relative(this.options.extensionOptions.rootFolder, this.options.extensionOptions.webSrcFolder)
    );

    // add hooks path
    utils.writeKeyYAMLConfig(
      this,
      this.options.extensionOptions.configPath,
      'hooks', {
        'pre-app-run': 'node node_modules/@adobe/uix-guest/scripts/generate-metadata.js',
        'pre-app-build': 'node node_modules/@adobe/uix-guest/scripts/generate-metadata.js',
        'post-app-deploy': './hooks/post-deploy.js'
      }
    );
  }
}

module.exports = ConfigGenerator;
