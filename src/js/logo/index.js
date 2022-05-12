//@ts-check
"use-strict";
import { modal } from "../modal/index.js";
import { fetchWrapper } from "../utils/index.js";

/*

    v1.00   DH   Feb 2022 :  Initial version
    v1.01   De   Apr 2022 :  Added belongs_to_co_id which looks to its parent co's logo if thiere is an error
    v1.01   DH   Apr 2022 :  Added dynamic endpoint setting
    v1.02   DH   Apr 2022 :  Added JS doc, 
    v1.03   DH   Apr 2022 :  Clear existing button disabled if image is the fallback url
    v1.04   DH   Apr 2022 :  Logo src auto reloads on successful updates
    v1.05  DH   Apr 2022 :  Rebind event handlers after actions

    Potential improvements:
    - cache logos in a map to avoid multiple api calls
    - cache company id in a map (if we know it is dud then so be it)

*/

/**
 *
 * @typedef {Object} LogoProps
 * @property {String} src
 * @property {String} id
 * @property {String} [entity] // one of 'company', 'template', 'company_site'
 * @property {Number} [belongs_to_co_id]
 *
 */

/**
 *
 * @param {LogoProps} LogoParam
 * @returns {JQuery}
 */

export function Logo({ src, id, entity = "company", belongs_to_co_id = null }) {
  let image = $("<img>", { src: `${fetchWrapper.endpoint}/images/logos/${src}` }).data("error", "false");

  let default_url = "images/logos/tipps_logo.png";

  $(image).on("error", async function errorHandler() {
    // figure out whether there is an entity above. If yes, get the url for this entity and change the entity the new entity
    // if all of this fails, put the Tipps logo
    $(this).data("error", "true");
    if (typeof belongs_to_co_id === "number") {
      let co = await fetchWrapper.get(`/cms/company/companies?company_id=${belongs_to_co_id}`);
      belongs_to_co_id = null;
      $(this).attr("src", `${fetchWrapper.endpoint}/images/logos/${co[0].logo_url}`); //.attr("src").replace("5500", "8080");
      return;
    }
    $(this).attr("src", `${fetchWrapper.endpoint}/${default_url}`); //.attr("src").replace("5500", "8080");
    $(this).off("error");
  });

  let form = $("<form>", {
    id: "image_upload",
    action: "/cms/upload",
    method: "POST",
    enctype: "multipart/form-data",
  }).css({ display: "block", width: "400px" });
  let title = $("<p>").text("Please select a logo to upload");
  let label = $("<label>", { class: "modal__button" }).text("Select file");
  let input = $("<input>", { id: "select_file", type: "file", name: "logo", accept: "image/png, image/jpeg" });
  let file_path = $("<p>", { class: "file-path url" });

  label.append(input);

  form.append(title).append(label).append(file_path);

  $(input).on("change", function (e) {
    // @ts-ignore
    let name = e.target.files[0].name;
    // run some checks on the file type
    $("#btn_upload").removeClass("modal__disabled");
    $("#btn_upload").removeAttr("disabled");
    $(".file-path").html(name);
  });

  let buttons = [
    {
      disabled: false,
      label: "Clear Existing",
      id: "btn_clear_logo",
      onClick: async function () {
        let data = {
          id: id,
          entity: entity,
        };
        let response = await fetchWrapper.post(`/cms/upload/clear_logo`, data);
        $(image).data("error", "true");
        if (response.logo_url === "null") $(image).attr("src", `${fetchWrapper.endpoint}/${default_url}`);
        else $(image).attr("src", `${fetchWrapper.endpoint}/images/logos/${response.logo_url}`);
      },
      triggerClose: false,
    },
    {
      disabled: true,
      label: "Upload",
      id: "btn_upload",
      onClick: async function () {
        const form = document.getElementById("image_upload");
        // @ts-ignore
        const data = new FormData(form);
        data.append("entity", entity);
        data.append("id", id);
        let response = await fetchWrapper.post_no_headers(`/cms/upload/logo`, data);
        $(image).attr("src", `${fetchWrapper.endpoint}/images/logos/${response.logo_url}`);
        $(image).data("error", "false");
        $(image).off("click");
        $(image).on("click", async function (e) {
          image_clickHandler();
        });
        return true;
      },
      triggerClose: false,
    },
    {
      label: "Cancel",
      triggerClose: true,
      disabled: false,
    },
  ];

  $(image).on("click", async function (e) {
    image_clickHandler();
  });

  function image_clickHandler() {
    if ($(image).attr("src") === `${fetchWrapper.endpoint}/${default_url}` || $(image).data("error") === "true") buttons[0].disabled = true;
    else buttons[0].disabled = false;
    modal("Upload a logo", form, buttons);
  }

  return image;
}
