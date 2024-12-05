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

const path = require('path');
const Generator = require('yeoman-generator');

class WebAssetsReactGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts);

    this.option('extensionOptions', { type: Object });

    this.templatesFolder = path.resolve(path.join(__dirname, '../templates/'));
    // templateProps are used in ejs templates
    this.templateProps = {
      extensionManifest: this.options.extensionOptions.manifest,
    };
  }

  writing () {
    this.copyStaticFiles();
    this.generateAppRoute();
    this.generateExtensionRegistration();
    this.generateWidgetFiles();
    this.generateMainMenuComponentFiles();
    this.configureBabel();
  }

  copyStaticFiles () {
    this.fs.copyTpl(
      this.templatePath(`${this.templatesFolder}/web/**/*`),
      this.destinationPath(this.options.extensionOptions.webSrcFolder),
      this.templateProps
    );

    this.fs.copyTpl(
      this.templatePath(`${this.templatesFolder}/hooks/*`),
      this.destinationPath('./hooks')
    )
  }

  generateAppRoute () {
    this.fs.copyTpl(
      this.templatePath(`${this.templatesFolder}/app.ejs`),
      this.destinationPath(`${this.options.extensionOptions.webSrcFolder}/src/components/App.js`),
      this.templateProps
    );
  }

  generateExtensionRegistration () {
    this.fs.copyTpl(
      this.templatePath(`${this.templatesFolder}/extension-registration.ejs`),
      this.destinationPath(
        `${this.options.extensionOptions.webSrcFolder}/src/components/ExtensionRegistration.js`
      ),
      this.templateProps
    );
  }


  generateWidgetFiles () {
    const widgets = this.options.extensionOptions.manifest.rte?.widgets || [];

    widgets.forEach((widget) => {
      const fileName = widget.id.replace(/-/g, '') + 'Widget';
      const capitalizedFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

      this.fs.copyTpl(
        this.templatePath(`${this.templatesFolder}/widget.ejs`),
        this.destinationPath(
          `${this.options.extensionOptions.webSrcFolder}/src/components/${capitalizedFileName}.js`
        ),
        {
          ...this.templateProps,
          widget,
        }
      );
    });
  }

  generateMainMenuComponentFiles () {
    const mainMenuItems = this.options.extensionOptions.manifest.mainMenuItems || [];

    mainMenuItems.forEach((item) => {
      const fileName = item.id.replace(/-/g, '') + 'MainMenu';
      const capitalizedFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

      this.fs.copyTpl(
        this.templatePath(`${this.templatesFolder}/extension-registration/main-menu-component.ejs`),
        this.destinationPath(
          `${this.options.extensionOptions.webSrcFolder}/src/components/${capitalizedFileName}.js`
        ),
        {
          ...this.templateProps,
          ComponentName: capitalizedFileName
        }
      );
    });
  }

  configureBabel () {
    // NOTE this is a global file and might conflict
    this.fs.writeJSON(this.destinationPath('.babelrc'), {
      plugins: ['@babel/plugin-transform-react-jsx'],
    });
  }
}

module.exports = WebAssetsReactGenerator;
