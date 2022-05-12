import { Button } from "../button/index.js";

/*
   VERSION CONTROL
   v1.00   DE   May 2022 :  Initial version
   v1.01   DE   May 2022 :  


   possible improvements:
     - 
     - 
     - 
*/

export function modal(titleHtml, contentHtml, buttons = [], draggable = true) {
  let modal = document.createElement("div");
  $(modal).addClass("modal");

  let inner = $("<div/>", { class: "modal__inner modal__show" });
  let top = $("<div/>", { class: "modal__top" });
  let title = $("<div/>", { class: "modal__title" });
  let close = $("<button/>", { type: "button", class: "modal__close" }).on("click", () => close_modal());
  let span = $("<span/>", { class: "material-icons" }).text("close");
  let content = $("<div/>", { class: "modal__content" });
  let bottom = $("<div/>", { class: "modal__bottom" });

  $(modal).append(inner);
  inner.append(top);
  inner.append(content);
  inner.append(bottom);
  top.append(title);
  top.append(close);
  close.append(span);

  if (titleHtml instanceof HTMLElement) title.append($(titleHtml));
  else title.html(titleHtml);
  if (contentHtml instanceof HTMLElement) content.append($(contentHtml));
  else content.html(contentHtml);

  function close_modal() {
    document.body.removeChild(modal);
    document.body.style.overflow = "unset";
  }

  createButtons(buttons, bottom, close_modal);

  document.body.style.overflow = "hidden";
  document.body.appendChild(modal);

  if (draggable) {
    $(".modal__inner").draggable({
      handle: ".modal__top",
    });

    $(".modal__top").css({ cursor: "move" });
  }

  return {
    modal,
    content,
    close_modal,
    inner,
  };
}

function createButtons(buttons, bottom, close_modal) {
  for (const button of buttons) {
    async function buttonClickEvent() {
      if (button.hasOwnProperty("onClick")) {
        if (button.triggerClose) {
          await button.onClick();
          close_modal();
        } else {
          let bool = await button.onClick();
          if (bool) close_modal();
        }
      } else if (button.triggerClose) {
        close_modal();
      }
      return;
    }

    const element = new Button({
      label: button.label,
      disabled: button.disabled,
      id: button.id,
      className: button.className,
      styles: button.styles,
      onClick: buttonClickEvent,
    });
    bottom.append(element.button);
  }
}
