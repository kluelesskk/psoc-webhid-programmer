# PSoC Bootloadable Firmware Programmer

This is a WebHID port of the firmware programmer for bootloadable applications created by the PSoC Creator IDE for Cypress PSoC devices. It's been tested against the KitProg device included in a CY8CKIT-059 PSoC 5LP prototyping board, but I believe it should work with any PSoC family device.

**Note that this relies on the recent WebHID support added in Chrome 89, and is not currently supported in any other browsers (or Chrome versions older than 89).**

There are 2 parts to this repo: a Javascript library exposing the bootloadable program/verify/erase interface, and a simple React web page that allows programming an attached PSoC with a local file. The web app is available here: https://kluelesskk.github.io/psoc-webhid-programmer/

## Library (cybtldr-lib)

The library includes the Cypress-provided reference C implementation for the programmer, and uses [emscripten](https://emscripten.org/) to compile that into Javascript. A Javascript interface is provided by the file [`cybootloader_interface.js`](lib/cybootloader_interface.js), and is exported as a global object called `bootloadable`. 

Everything is packed and minified by emscripten into a single output file called `cybtldr.js`, which can be imported by any web app.

## Application (cybtldr-app)

The web app is built with React and Material UI, and hosted on GitHub pages.

## Build Instructions

Note that the compiled library file `cybtldr.js` is included in this repo and can be used as it is.

To build the library yourself, you will need GNU make and emscripten.

To build the web app, you will need NPM.

## License

This software is released under the MIT license.
