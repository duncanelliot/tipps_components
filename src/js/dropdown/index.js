//@ts-check
"use-strict";
/*

    v1.00   DE   Feb 2022 :  Initial version
    v1.01   DH   Apr 2022 :  Can show disabled options
    v1.02   DH   Apr 2022 :  initial value input compared with options values (previously was compared with options names)
    v1.03   DE   May 2022 :  Refactored + added the ability to toggle
    v1.04   DE   May 2022 :  Default option arr if null + disabled if no options

    possible improvements:
    - dont show the placeholder in the list
    - automatically set the is_selected field given a value
    - feed an object as the param object
*/

/**
 * @typedef {Object} options
 * @property {string} opt_name
 * @property {string|number} value
 * @property {boolean} [selected]
 * @property {boolean} [disabled]
 */
/**
 *
 * @param {options[]} options // options to feed into the dropdown
 * @param {Object} initial_value // Initial_value value to set the dropdown
 * @param {string} [placeholder] // placeholder for the dropdown
 * @param {Function} [onChange] // Custom onChange function
 * @returns {Object}
 *
 */

export function Dropdown(options = [], initial_value, placeholder = null, onChange = null) {
  // debugger;
  // public properties
  this.version = "1.03";
  this.description = "non native dropdown object";
  this.jquery = $("<select>", { class: "dropdown" }).on("change", onChange ? (e) => onChange(e) : () => {});
  // private variables
  var selected = null;
  var previous = null;

  // disable it if there are no options
  if (options.length === 0) this.jquery.prop("disabled", "disabled");

  // load the options in the select component
  load_options.bind(this)();

  // method to enable or disable the jquery
  this.toggle = (on) => (on ? this.jquery.attr("disabled", on) : this.jquery.removeAttr("disabled"));

  // create options to the select (assumes that header and options are in the same order)
  function load_options() {
    options.unshift({ value: "placeholder", opt_name: placeholder || "Select your option", disabled: true, selected: true });
    options.forEach((option) => {
      let __ = $("<option/>", { name: option.opt_name }).val(option.value).text(option.opt_name);
      // @ts-ignore
      if (option.hasOwnProperty("disabled")) __.attr("disabled", true);
      if (option?.selected || option.value === initial_value) {
        selected = option.value;
        previous = option.value;
        __.prop("selected", true);
      }
      this.jquery.append(__.get(0));
    });
  }

  // method to replace the current options with a new set
  this.updateInputs = (new_options) => {
    this.jquery.prop("disabled", new_options.length === 0 ? "disabled" : null);
    $(this.jquery).empty();
    options = new_options;
    load_options.bind(this)();
  };

  // picks an option
  this.setSelected = (value, is_update) => {
    if (is_update) {
      let existing = previous;
      previous = selected;
      selected = value;
      $(`option [value=${existing}]`).prop("selected", false);
      $(`option [value=${value}]`).prop("selected", true);
      $(this.jquery).val(value);
    } else {
      selected = previous;
      this.jquery.val(previous);
    }
  };
}
