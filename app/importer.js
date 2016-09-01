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

importer.on('update-supported-browsers', (e, detail) => {
  console.log(detail)
  // firefox dev test
  importer.importData(['1', 'true', 'true', 'true', 'true', 'false', 'true'])
})

importer.on('add-password-form', (e, detail) => {
  console.log(detail)
})

importer.on('add-history-page', (e, detail) => {
  console.log(detail)
})

importer.on('add-homepage', (e, detail) => {
  console.log(detail)
})

importer.on('add-bookmarks', (e, detail) => {
  console.log(detail)
})

importer.on('add-favicons', (e, detail) => {
  console.log(detail)
})

importer.on('add-keywords', (e, detail) => {
  console.log(detail)
})

importer.on('add-autofill-form-data-entries', (e, detail) => {
  console.log(detail)
})
