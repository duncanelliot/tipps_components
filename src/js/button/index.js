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
/**
 *
 * @typedef {Object} ButtonProps
 * @property {Boolean} [disabled]
 * @property {String} label
 * @property {String} id
 * @property {String} [className]
 * @property {Object} [styles]
 * @property {Function} onClick
 * @property {Boolean} [inmodal]
 *
 */

/**
 *
 * @param {ButtonProps} ButtonParam
 */
//  * @returns {{button: JQuery}}

export function Button({ label, disabled = false, id, className = "", styles = {}, onClick, inmodal = true }) {

  this.button = $("<button>", {
    type: "button",
    class: [`${inmodal ? "modal__button" : ""}`, className].join(" "),
    id: id,
  });
  this.button.text(label);

  if (disabled) {
    if (inmodal) this.button.addClass("modal__disabled");
    this.button.prop("disabled", true);
  }

  if (styles) this.button.css(styles);

  this.button.on("click", (e) => {
    onClick(e);
  });
}
