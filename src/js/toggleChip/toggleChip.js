"use-strict";
//@ts-check

/*
   VERSION CONTROL
   v1.00   DE   May 2022 :  Initial version
   v1.01   DE   May 2022 :  


   possible improvements:
     - 
     - 
     - 
*/

export default class ToggleChip {
  constructor(text, subtext, is_visible, _activate, _deactivate, is_booked = null) {
    const activate_icon = $("<span>", { class: "activate fa fa-eye" })
      .css({ "padding-left": "20px", cursor: "pointer" })
      .on("click", (e) => this.click(e));
    const deactivate_icon = $("<span>", { class: "deactivate fa fa-eye-slash" })
      .css({ "padding-left": "20px", cursor: "pointer" })
      .on("click", (e) => this.click(e));

    const bg_active = "rgba(255, 245,57, 0.74)";
    const bg_deactive = "rgba(255, 73,73, 0.74)";
    this._activated = is_visible;

    this._chip = $("<div>", { class: "togglechip" }).css({
      "justify-content": "center",
      "align-items": "center",
      display: "flex",
      "flex-direction": "row",
      width: "max-content",
      background: `${is_visible ? bg_active : bg_deactive}`,
    });
    let text_container = $("<div>").css({ display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center" });
    if (subtext.length > 0) {
      let _text = $("<p>").css({ margin: "0px", padding: "0px", "line-height": "unset" }).text(text);
      let _subtext = $("<p>").css({ "font-size": "10px", margin: "0px", padding: "0px", "line-height": "unset" }).text(subtext);
      text_container.append(_text).append(_subtext);
    } else {
      text_container.text(text);
    }
    this._chip.append(text_container).append(activate_icon).append(deactivate_icon);
    is_visible ? deactivate_icon.hide() : activate_icon.hide();

    this.activate = () => {
      _activate();
      this._activated = true;
      deactivate_icon.hide();
      activate_icon.show();
      this._chip.css({ background: `${bg_active}` });
    };

    this.deactivate = () => {
      _deactivate();
      this._activated = false;
      activate_icon.hide();
      deactivate_icon.show();
      this._chip.css({ background: `${bg_deactive}` });
    };

    if (is_booked === true) {
      this._chip.css({ background: "#00e676" });
    }
  }

  get chip() {
    return this._chip.get(0);
  }
  get() {
    return this._chip;
  }

  click(e) {
    if (this._activated) this.deactivate();
    else this.activate();
    e.stopPropagation();
  }
}
