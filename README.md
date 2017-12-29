![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Node](https://img.shields.io/badge/Node.js-v.8.x-brightgreen.svg) ![EcmaScript](https://img.shields.io/badge/Javascript-ES7-yellow.svg) ![Angular](https://img.shields.io/badge/Angular-5-red.svg)

# Alohomora-3FA

![Status](https://img.shields.io/badge/status-WIP-red.svg)   [![Build Status](https://travis-ci.org/TheBigBangTeam/Alohomora-3FA.svg?branch=master)](https://travis-ci.org/TheBigBangTeam/Alohomora-3FA)         [![Known Vulnerabilities](https://snyk.io/test/github/thebigbangteam/alohomora-3fa/badge.svg)](https://snyk.io/test/github/thebigbangteam/alohomora-3fa) [![BCH compliance](https://bettercodehub.com/edge/badge/TheBigBangTeam/Alohomora-3FA?branch=master)](https://bettercodehub.com/) [![Coverage Status](https://coveralls.io/repos/github/TheBigBangTeam/Alohomora-3FA/badge.svg?branch=master)](https://coveralls.io/github/TheBigBangTeam/Alohomora-3FA?branch=master)

A smart IoT based entrance unlock system which comprises full fledged logging, system security alerts and statistics.

## Authors
  - Michele 'An4cr0n' Biondi, michelebiondi01@gmail.com, PGP:3814987E (Contacts)
  - Andrea Salvatori
  - Maicol Moretti
  - Daniele Moscati

## Prerequisites
HARDWARE:
  - Arduino (sketches and schematics will be provided in the final release)
  - NodeMcu (same as arduino regarding sketches)
  - RFID tag(s) and reader(s).

SOFTWARE:
 - To run the server you need Node.js installed ( > v8.x)
 - You need Node-gyp installed globally for some dependencies.
`(sudo) npm install -g node-gyp`
 - Run `npm install` inside the project folder to receive dependencies.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:8080/`.

## Production server

Run `npm run start-production` for a production server.
You can refer to the script inside package.json if you want to use a custom way to run the server.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
NOTE: running `npm start` or `npm run start-production` will automatically do this for you, use this only to tests Angular output files.

## Running frontend unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running frontend end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Running backend tests & code coverage reporting

Run `npm test` to execute the backend tests via [Mocha](https://mochajs.org/) 
and receive code coverage via [Istanbul](https://istanbul.js.org/).

