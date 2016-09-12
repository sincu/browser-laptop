/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const Immutable = require('immutable')
const ImmutableComponent = require('../../../js/components/immutableComponent')
const windowActions = require('../../../js/actions/windowActions')
const separatorMenuItem = require('../../common/commonMenu').separatorMenuItem

class MenubarItem extends ImmutableComponent {
  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
  }

  onClick (e) {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    // If clicking on an already selected item, deselect it
    const selected = this.props.menubar.state.selectedLabel
    if (selected && selected === this.props.label) {
      this.props.menubar.setState({selectedLabel: null})
      return
    }
    // Otherwise, mark item as selected and show its context menu
    this.props.menubar.setState({selectedLabel: this.props.label})
    const rect = e.target.getBoundingClientRect()
    windowActions.setContextMenuDetail(Immutable.fromJS({
      left: rect.left,
      top: rect.bottom,
      template: this.props.submenu.map((submenuItem) => {
        if (submenuItem.type === separatorMenuItem.type) {
          return submenuItem
        }
        submenuItem.click = function (e) {
          windowActions.clickMenubarItem(submenuItem.label)
        }
        return submenuItem
      })
    }))
  }

  onMouseOver (e) {
    const selected = this.props.menubar.state.selectedLabel
    if (selected && selected !== this.props.label) {
      this.onClick(e)
    }
  }

  render () {
    return <span
      className={'menubarItem' + (this.props.selected ? ' selected' : '')}
      onClick={this.onClick}
      onMouseOver={this.onMouseOver}>
      { this.props.label }
    </span>
  }
}

/**
 * Menubar that can be optionally be displayed at the top of a window (in favor of the system menu).
 * First intended use is with Windows to enable a slim titlebar.
 * NOTE: the system menu is still created and used in order to keep the accelerators working.
 */
class Menubar extends ImmutableComponent {
  constructor () {
    super()
    this.state = {
      selectedLabel: null
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.state.selectedLabel !== nextState.selectedLabel
  }

  // TODO: this needs to clear its state every time a context menu is closed
  // selected label would need to be in windowState for this to work

  render () {
    return <div className='menubar'>
    {
      this.props.template.map((menubarItem) => {
        let props = {
          label: menubarItem.get('label'),
          submenu: menubarItem.get('submenu').toJS(),
          menubar: this
        }
        if (props.label === this.state.selectedLabel) {
          props.selected = true
        }
        return <MenubarItem {...props} />
      })
    }
    </div>
  }
}

module.exports = Menubar
