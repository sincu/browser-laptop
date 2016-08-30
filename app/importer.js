/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'strict mode'

const electron = require('electron')
const importer = electron.importer

exports.init = () => {
  importer.initialize()
}

exports.importData = (options) => {
  importer.importData(options)
}

importer.on('updateSupportedBrowsers', (e, detail) => {
  console.log(detail)
})
