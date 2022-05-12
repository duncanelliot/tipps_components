//@ts-check
"use-strict";

/*
   VERSION CONTROL
   v1.00   DE   May 2022 :  Initial version
   v1.01   DE   May 2022 :  


   possible improvements:
     - 
     - 
     - 
*/

import { fetchWrapper } from "../utils/fetchWrapper.js";

/**
 * @typedef {Object} TextInputParam
 * @param {String} title //to be used in what clause  of fetchwrapper
 * @param {any} value
 * @param {String} placeholder
 * @param {String} [type]
 * @param {Boolean} [showLabel]
 * @param {Number | String} id //to be used in where clause of fetchwrapper
 * @param {Function} [onChange] // will overwrite basic fetchwrapper call
 * @param {String} [url] //to be used as route in fetchwrapper call
 * @param {Boolean} [disabled]
 * @param {Boolean} [required]
 * @param {Object} [styles]
 * @param {Object} [options]
 */

/**
 * @param {TextInputParam} TextInputParam
 * @returns {void}
 */

export class TextInput {
  constructor({
    title,
    value,
    placeholder,
    onChange,
    url,
    id,
    type = "text",
    styles = {},
    showLabel = true,
    disabled = false,
    required = false,
    options = {},
  }) {
    this._html = $("<div>", { class: "text__input__wrapper" });
    let input = $("<input>", {
      type: type,
      placeholder: placeholder,
      id: title,
      name: title,
      class: "text__input",
      ...options,
    })
      .val(value)
      .css(styles);
    let previous = value;
    if (disabled) input.prop("disabled", true);

    if (showLabel) {
      let label = $("<label>", { for: title, class: "text__label" }).text(title);
      if (required) {
        let span = $("<span>").text("*").css({ color: "red" });
        label.append(span);
      }
      this._html.append(label).append(input);
    } else this._html.append(input);

    // @ts-ignore
    this.onChange = async function (e) {
      try {
        let input = e.target.value;
        if (onChange) await onChange(input);
        else {
          let what_data = {};
          what_data[title] = input;
          await fetchWrapper.put(url, { what: what_data, where: { id: id } });
        }
        previous = input;
      } catch (e) {
        input.val(previous);
      }
    };

    input.on("change", (e) => {
      this.onChange(e);
    });
  }
  _html;
  get html() {
    return this._html[0];
  }
}
