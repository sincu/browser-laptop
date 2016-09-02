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
  // index, history, favorites, passwords, search engines, homepage, autofilldata
  // firefox dev test
  // importer.importData(['1', 'true', 'true', 'true', 'true', 'false', 'true'])
  // safari dev test
  // importer.importData(['0', 'false', 'true', 'false', 'false', 'false', 'false'])
})

importer.on('add-password-form', (e, detail) => {
  console.log(detail)
})

importer.on('add-history-page', (e, histories, visitSource) => {
  console.log(histories)
  console.log(visitSource)
})

importer.on('add-homepage', (e, detail) => {
  console.log(detail)
})

importer.on('add-bookmarks', (e, bookmarks, topLevelFolder) => {
  console.log(bookmarks)
  console.log(topLevelFolder)
})

importer.on('add-favicons', (e, detail) => {
  console.log(detail)
})

importer.on('add-keywords', (e, templateUrls, uniqueOnHostAndPath) => {
  console.log(templateUrls)
  console.log(uniqueOnHostAndPath)
})

importer.on('add-autofill-form-data-entries', (e, detail) => {
  console.log(detail)
})
