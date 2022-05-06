//@ts-check
"use-strict";

/*

    v1.00   DE   Feb 2022 :  Initial version
    v1.01   DH   Apr 2022 :  Can show disabled options
    v1.02   DH   Apr 2022 :  initial value input compared with data values (previously was compared with data names)

    possible improvements:
    - dont show the placeholder in the list
    - automatically set the is_selected field given a value
    - feed an object as the param object
*/

/**
 * @typedef {Object} data
 * @property {string} name
 * @property {string|number} value
 * @property {boolean} [selected]
 * @property {boolean} [disabled]
 */
/**
 *
 * @param {data[]} data // Data to feed into the dropdown
 * @param {Object} initial_value // Initial_value value to set the dropdown
 * @param {{name:string, text:string}} [placeholder] // placeholder for the dropdown
 * @param {Function} [onChange] // Custom onChange function
 * @returns {Object}
 *
 */

export function Dropdown(data, initial_value, placeholder = null, onChange = null) {
  this.version = "1.02";
  this.description = "non native dropdown object";

  this.dropdown = $("<select>", { class: "dropdown" });

  if (onChange) this.dropdown.on("change", (e) => onChange(e));

  let _data = data;
  this.selected = null;
  this.previous = null;

  // var self = this;
  // create placeholder if it exists
  if (placeholder !== null) {
    let label_option = $("<option/>", { name: placeholder.name }).val("").text(placeholder.text);
    this.dropdown.append(label_option.get(0));
  }

  // create inputs
  createInputs.bind(this)();

  // assumes that header and data are in the same order
  function createInputs() {
    Object.keys(_data).forEach((data) => {
      let option = $("<option/>", { name: _data[data].name }).val(_data[data].value).text(_data[data].name);

      if (_data[data].hasOwnProperty("disabled")) option.attr("disabled", true);

      if (_data[data]?.selected || _data[data].value === initial_value) {
        this.selected = _data[data].value;
        this.previous = _data[data].value;
        option.prop("selected", true);
      }

      this.dropdown.append(option.get(0));
    });
  }

  this.updateInputs = (new_data, placeholder) => {
    $(this.dropdown).empty();
    if (placeholder !== null) {
      let label_option = $("<option/>", { name: placeholder.name }).val("").text(placeholder.text);
      this.dropdown.append(label_option.get(0));
    }
    Object.keys(new_data).forEach((data) => {
      let option = $("<option/>", { name: new_data[data].name }).val(new_data[data].value).text(new_data[data].name);
      if (new_data[data].hasOwnProperty("disabled")) option.attr("disabled", true);
      if (new_data[data]?.selected) {
        this.selected = new_data[data].value;
        this.previous = new_data[data].value;
        option.prop("selected", true);
      }

      this.dropdown.append(option.get(0));
    });
  };

  this.setSelected = (value, is_update) => {
    if (is_update) {
      let existing = this.previous;
      this.previous = this.selected;
      this.selected = value;
      $(`option [value=${existing}]`).prop("selected", false);
      $(`option [value=${value}]`).prop("selected", true);
      $(this.dropdown).val(value);
    } else {
      this.selected = this.previous;
      $(this.dropdown).val(this.previous);
    }
  };
}
