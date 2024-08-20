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

const inquirer = require('inquirer');
const slugify = require('slugify');
const chalk = require('chalk');
const path = require('path');
const mainMenuItemsPrompts = require('./prompts/main-menu');

let exitMenu = false;

const briefOverviews = {
  templateInfo: `\nWorkfront Template Overview:\n
  * You have the option to generate boilerplate code for your extension.
  * You can get help regarding documentation at any time from the menu.
  * An App Builder project will be created with Node.js packages pre-configured.\n`,
};

const promptDocs = {
  mainDoc: 'https://developer.adobe.com/uix/docs/',
};

// Top Level prompts
const promptTopLevelFields = (manifest) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What do you want to name your extension?',
      validate (answer) {
        if (!answer.length) {
          return 'Required.';
        }

        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Please provide a short description of your extension:',
      validate (answer) {
        if (!answer.length) {
          return 'Required.';
        }

        return true;
      },
    },
    {
      type: 'input',
      name: 'version',
      message: 'What version would you like to start with?',
      default: '0.0.1',
      validate(answer) {
        if (!new RegExp("^\\bv?(?:0|[1-9][0-9]*)(?:\\.(?:0|[1-9][0-9]*)){2}(?:-[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?(?:\\+[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?\\b$").test(answer)) {
          return 'Required. Must match semantic versioning rules.'
        }

        return true;
      },
    },
  ])
    .then((answers) => {
      if (answers.name) {
        manifest.name = answers.name;
        manifest.id = slugify(answers.name, {
          lower: true,
          strict: true,
        });
      }

      if (answers.description) {
        manifest.description = answers.description;
      }

      if (answers.version) {
        manifest.version = answers.version;
      }
    });
};

// Main Menu prompts
const promptMainMenu = (manifest) => {
  const choices = [];

  choices.push(
    new inquirer.Separator(),
    {
      name: 'Add a custom button to Main Menu',
      value: mainMenuItemsPrompts.bind(this, manifest),
    },
    new inquirer.Separator(),
    {
      name: "I'm done",
      value: () => {
        return Promise.resolve(true);
      },
    },
    {
      name: "I don't know",
      value: promptGuideMenu.bind(this, manifest),
    }
  );

  return inquirer
    .prompt({
      type: 'list',
      name: 'execute',
      message: 'What would you like to do next?',
      choices,
    })
    .then((answers) => answers.execute())
    .then((endMainMenu) => {
      if (!endMainMenu && !exitMenu) {
        return promptMainMenu(manifest);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// Guide Menu Prompts
const promptGuideMenu = (manifest) => {
  const choices = [];

  choices.push(
    new inquirer.Separator(),
    {
      name: 'Find some help',
      value: helpPrompts.bind(this),
    },
    new inquirer.Separator(),
    {
      name: 'Go back',
      value: () => {
        return Promise.resolve(true);
      },
    }
  );

  return inquirer
    .prompt({
      type: 'list',
      name: 'execute',
      message: 'What about this then?',
      choices,
    })
    .then((answers) => answers.execute())
    .then((endGuideMenu) => {
      if (!endGuideMenu) {
        return promptGuideMenu(manifest);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// Helper prompts for Guide Menu
const helpPrompts = () => {
  console.log('  Please refer to:');
  console.log(chalk.blue(chalk.bold(`  -> ${promptDocs.mainDoc}`)) + '\n');
};

module.exports = {
  briefOverviews,
  promptTopLevelFields,
  promptMainMenu,
  promptDocs,
};
