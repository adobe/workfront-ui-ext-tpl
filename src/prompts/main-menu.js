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
const { generateUniqueWithinListIdFromValue } = require('../utils');

const mainMenuItemsPrompts = (manifest) => {
  const questions = [labelPrompt()];

  return inquirer
    .prompt(questions)
    .then((answers) => {
      manifest.mainMenuItems = manifest.mainMenuItems || [];
      answers.id = generateUniqueWithinListIdFromValue(answers.label, manifest.mainMenuItems);
      manifest.mainMenuItems.push(answers);
    })
    .catch((error) => {
      console.error(error);
    });
};

const labelPrompt = () => {
  return {
    type: 'input',
    name: 'label',
    message: 'Please provide label name for the button:',
    validate: (value) => value.length ? true : 'Required.',
  };
};


module.exports = mainMenuItemsPrompts;
