# Alohomora-3FA ![React](https://img.shields.io/badge/React-16-blue.svg) ![Node](https://img.shields.io/badge/Node.js-8.x-brightgreen.svg) ![CodeStyle](https://img.shields.io/badge/code%20style-standard-brightgreen.svg) 

![Status](https://img.shields.io/badge/status-WIP-red.svg)   [![Build Status](https://travis-ci.org/TheBigBangTeam/Alohomora-3FA.svg?branch=master)](https://travis-ci.org/TheBigBangTeam/Alohomora-3FA)    [![Greenkeeper badge](https://badges.greenkeeper.io/TheBigBangTeam/Alohomora-3FA.svg)](https://greenkeeper.io/)       [![Known Vulnerabilities](https://snyk.io/test/github/thebigbangteam/alohomora-3fa/badge.svg)](https://snyk.io/test/github/thebigbangteam/alohomora-3fa) [![BCH compliance](https://bettercodehub.com/edge/badge/TheBigBangTeam/Alohomora-3FA?branch=master)](https://bettercodehub.com/) [![Coverage Status](https://coveralls.io/repos/github/TheBigBangTeam/Alohomora-3FA/badge.svg?branch=master)](https://coveralls.io/github/TheBigBangTeam/Alohomora-3FA?branch=master)

A smart IoT based entrance unlock system which comprises full fledged logging, system security alerts and statistics.

## Authors
  - Michele 'An4cr0n' Biondi, michelebiondi01@gmail.com, PGP:3814987E (Contacts)
  - Andrea Salvatori, andrea.salvatori92@gmail.com, PGP:AE6F5660
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
`npm install -g node-gyp`
 - Run `npm install` inside the project folder to receive dependencies.

## Development server

Run `npm start` for a development server. Navigate to `http://localhost:3000/`.

## Testing

Run `npm test` to execute the backend tests via [Mocha](https://mochajs.org/) 
and receive code coverage via [Istanbul](https://istanbul.js.org/).