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
const { utils, constants } = require('@adobe/generator-app-common-lib');

class DependenciesGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts);

    this.option('extensionOptions', { type: Object });
  }

  writing () {
    this.addBaseDependencies();
    this.addDevDependencies();
    this.addPackageScript();
  }

  /**
   * Todo: add dependencies based on "useReact" extension option
   */
  addBaseDependencies () {
    utils.addDependencies(
      this,
      {
        '@adobe/aio-sdk': constants.commonDependencyVersions['@adobe/aio-sdk'],
        '@adobe/exc-app': '^0.2.21',
        '@adobe/react-spectrum': '^3.4.0',
        '@adobe/uix-guest': '^0.10.0',
        '@react-spectrum/list': '^3.0.0-rc.0',
        '@spectrum-icons/workflow': '^3.2.0',
        'chalk': '^4',
        'core-js': '^3.6.4',
        'node-fetch': '^2.6.0',
        'node-html-parser': '^5.4.2-0',
        react: '^16.13.1',
        'react-dom': '^16.13.1',
        'react-error-boundary': '^1.2.5',
        'react-router-dom': '^6.3.0',
        'regenerator-runtime': '^0.13.5',
      }
    );
  }

  addDevDependencies () {
    utils.addDependencies(
      this,
      {
        '@babel/core': '^7.8.7',
        '@babel/plugin-transform-react-jsx': '^7.8.3',
        '@babel/polyfill': '^7.8.7',
        '@babel/preset-env': '^7.8.7',
        '@openwhisk/wskdebug': '^1.3.0',
        jest: '^27.2.4',
        "ajv": "^8.12.0",
        "js-yaml": "^4.1.0"
      },
      true
    );
  }

  addPackageScript () {
    utils.addPkgScript(
      this,
      {
        "transform:yaml-to-json": "node node_modules/@adobe/uix-guest/scripts/generate-metadata.js"
      }
    );
  }
}

module.exports = DependenciesGenerator;
