/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'strict mode'

const electron = require('electron')
const importer = electron.importer
const Immutable = require('immutable')
const siteUtil = require('../js/state/siteUtil')
const AppStore = require('../js/stores/appStore')
const siteTags = require('../js/constants/siteTags')
const appActions = require('../js/actions/appActions')
const Filtering = require('./filtering')

exports.init = () => {
  importer.initialize()
}

exports.importData = (options) => {
  importer.importData(options)
}

importer.on('update-supported-browsers', (e, detail) => {
  console.log(detail)
  // index, history, favorites, passwords, search engines, homepage, autofilldata, cookies
  // firefox dev test
  // importer.importData(['1', 'true', 'true', 'true', 'true', 'false', 'true', 'false'])
  // safari dev test
  // importer.importData(['0', 'false', 'true', 'false', 'false', 'false', 'false', 'false'])
  // chrome dev test
  // importer.importData(['2', 'true', 'true', 'false', 'false', 'false', 'false', 'true'])
})

importer.on('show-warning-dialog', (e) => {
})

importer.on('add-password-form', (e, detail) => {
  console.log(detail)
})

importer.on('add-history-page', (e, history, visitSource) => {
  let sites = []
  for (let i = 0; i < history.length; ++i) {
    const site = {
      title: history[i].title,
      location: history[i].url,
      lastAccessedTime: history[i].last_visit * 1000
    }
    sites.push(site)
  }
  appActions.addSite(Immutable.fromJS(sites))
})

importer.on('add-homepage', (e, detail) => {
  console.log(detail)
})

importer.on('add-bookmarks', (e, bookmarks, topLevelFolder) => {
  let nextFolderId = siteUtil.getNextFolderId(AppStore.getState().get('sites'))
  let pathMap = {}
  let sites = []
  const topLevelFolderId = nextFolderId++
  sites.push({
    title: topLevelFolder,
    folderId: topLevelFolderId,
    parentFolderId: -1,
    lastAccessedTime: (new Date()).getTime(),
    tags: [siteTags.BOOKMARK_FOLDER]
  })
  pathMap[topLevelFolder] = topLevelFolderId
  for (let i = 0; i < bookmarks.length; ++i) {
    const pathLen = bookmarks[i].path.length
    let parentFolderId = -1
    if (!pathLen) {
      parentFolderId = topLevelFolderId
    } else {
      const parentFolder = bookmarks[i].path[pathLen - 1]
      parentFolderId = pathMap[parentFolder]
      if (parentFolderId === undefined) {
        parentFolderId = nextFolderId++
        pathMap[parentFolder] = parentFolderId
        const folder = {
          title: parentFolder,
          folderId: parentFolderId,
          parentFolderId: pathMap[bookmarks[i].path[pathLen - 2]],
          lastAccessedTime: (new Date()).getTime(),
          tags: [siteTags.BOOKMARK_FOLDER]
        }
        sites.push(folder)
      }
    }
    if (bookmarks[i].is_folder) {
      const folderId = nextFolderId++
      pathMap[bookmarks[i].title] = folderId
      const folder = {
        title: bookmarks[i].title,
        folderId: folderId,
        parentFolderId: parentFolderId,
        lastAccessedTime: bookmarks[i].creation_time * 1000,
        tags: [siteTags.BOOKMARK_FOLDER]
      }
      sites.push(folder)
    } else {
      const site = {
        title: bookmarks[i].title,
        location: bookmarks[i].url,
        parentFolderId: parentFolderId,
        lastAccessedTime: bookmarks[i].creation_time * 1000,
        tags: [siteTags.BOOKMARK]
      }
      sites.push(site)
    }
  }
  appActions.addSite(Immutable.fromJS(sites))
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

importer.on('add-cookies', (e, cookies) => {
  for (let i = 0; i < cookies.length; ++i) {
    const cookie = {
      url: cookies[i].url,
      name: cookies[i].name,
      value: cookies[i].value,
      domain: cookies[i].domain,
      path: cookies[i].path,
      secure: cookies[i].secure,
      httpOnly: cookies[i].httponly,
      expirationDate: cookies[i].expiry_date
    }
    Filtering.setCookie(cookie)
  }
})
