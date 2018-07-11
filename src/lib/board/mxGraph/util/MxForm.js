/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxForm
 *
 * A simple class for creating HTML forms.
 *
 * Constructor: MxForm
 *
 * Creates a HTML table using the specified classname.
 */

import MxUtils from './MxUtils'
import MxResources from './MxResources'
import MxEvent from './MxEvent'
import MxClient from '@/lib/board/mxGraph/MxClient'

export default class MxForm {
  constructor(className) {
    this.table = document.createElement('table')
    this.table.className = className
    this.body = document.createElement('tbody')

    this.table.appendChild(this.body)
  }
}

/**
 * Variable: table
 *
 * Holds the DOM node that represents the table.
 */
MxForm.prototype.table = null

/**
 * Variable: body
 *
 * Holds the DOM node that represents the tbody (table body). New rows
 * can be added to this object using DOM API.
 */
MxForm.prototype.body = false

/**
 * Function: getTable
 *
 * Returns the table that contains this form.
 */
MxForm.prototype.getTable = function() {
  return this.table
}

/**
 * Function: addButtons
 *
 * Helper method to add an OK and Cancel button using the respective
 * functions.
 */
MxForm.prototype.addButtons = function(okFunct, cancelFunct) {
  let tr = document.createElement('tr')
  let td = document.createElement('td')
  tr.appendChild(td)
  td = document.createElement('td')

  // Adds the ok button
  let button = document.createElement('button')
  MxUtils.write(button, MxResources.get('ok') || 'OK')
  td.appendChild(button)

  MxEvent.addListener(button, 'click', function() {
    okFunct()
  })

  // Adds the cancel button
  button = document.createElement('button')
  MxUtils.write(button, MxResources.get('cancel') || 'Cancel')
  td.appendChild(button)

  MxEvent.addListener(button, 'click', function() {
    cancelFunct()
  })

  tr.appendChild(td)
  this.body.appendChild(tr)
}

/**
 * Function: addText
 *
 * Adds an input for the given name, type and value and returns it.
 */
MxForm.prototype.addText = function(name, value, type) {
  let input = document.createElement('input')

  input.setAttribute('type', type || 'text')
  input.value = value

  return this.addField(name, input)
}

/**
 * Function: addCheckbox
 *
 * Adds a checkbox for the given name and value and returns the textfield.
 */
MxForm.prototype.addCheckbox = function(name, value) {
  let input = document.createElement('input')

  input.setAttribute('type', 'checkbox')
  this.addField(name, input)

  // IE can only change the checked value if the input is inside the DOM
  if (value) {
    input.checked = true
  }

  return input
}

/**
 * Function: addTextarea
 *
 * Adds a textarea for the given name and value and returns the textarea.
 */
MxForm.prototype.addTextarea = function(name, value, rows) {
  let input = document.createElement('textarea')

  if (MxClient.IS_NS) {
    rows--
  }

  input.setAttribute('rows', rows || 2)
  input.value = value

  return this.addField(name, input)
}

/**
 * Function: addCombo
 *
 * Adds a combo for the given name and returns the combo.
 */
MxForm.prototype.addCombo = function(name, isMultiSelect, size) {
  let select = document.createElement('select')

  if (size !== null) {
    select.setAttribute('size', size)
  }

  if (isMultiSelect) {
    select.setAttribute('multiple', 'true')
  }

  return this.addField(name, select)
}

/**
 * Function: addOption
 *
 * Adds an option for the given label to the specified combo.
 */
MxForm.prototype.addOption = function(combo, label, value, isSelected) {
  let option = document.createElement('option')

  MxUtils.writeln(option, label)
  option.setAttribute('value', value)

  if (isSelected) {
    option.setAttribute('selected', isSelected)
  }

  combo.appendChild(option)
}

/**
 * Function: addField
 *
 * Adds a new row with the name and the input field in two columns and
 * returns the given input.
 */
MxForm.prototype.addField = function(name, input) {
  let tr = document.createElement('tr')
  let td = document.createElement('td')
  MxUtils.write(td, name)
  tr.appendChild(td)

  td = document.createElement('td')
  td.appendChild(input)
  tr.appendChild(td)
  this.body.appendChild(tr)

  return input
}
