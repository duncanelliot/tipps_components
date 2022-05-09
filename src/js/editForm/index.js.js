//@ts-check
"use-strict";
import * as utils from "../utils/index.js";
import { modal } from "./modal.js";
import TextInput from "./textInput.js";

/**
 *
 * @typedef {Object} editFormProps
 * @property {Object[]} data
 * @property {String[]} labels // labels for the fields
 * @property {String[]} included_fields // If not null then only these fields will be enumerated
 * @property {String[]} excluded_fields // If include field is null, then these fields will be excluded
 * @property {String} api //api to call to updated
 * @property {String} pk // where clause
 */
export default function editForm(opts) {
  let { data, labels, included_fields, excluded_fields, api, pk, http_method, initial_changes } = opts;

  // where we record state changes
  let changes = initial_changes ?? {};
  let use_only_included_fields = true;
  http_method = http_method ?? "put";

  // args checking
  if (typeof data === "undefined" || data === null) data = [];
  if (typeof included_fields === "undefined" || included_fields === null) use_only_included_fields = false;
  if (typeof excluded_fields === "undefined" || excluded_fields === null) excluded_fields = [pk];
  if (typeof pk === "undefined" || pk === null) {
    throw new Error("no primary key supplied");
  } else {
    const { pk, ...changes_no_pk } = changes;
    changes = changes_no_pk;
  }
  if (typeof api === "undefined" || api === "" || api === null) throw new Error("api not supplied");
  if (typeof labels === "undefined" || labels === null) labels = {};

  let buttons = [
    {
      label: "Save",
      disabled: true,
      id: "save_btn",
      onClick: (e) => {
        utils.fetchWrapper[http_method](api, { data: changes, pk: data[pk] })
          .then((res) => {
            location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      },
    },
  ];

  // create inputs
  let fields = $("<div>").css({ width: "90%" });

  for (const [key, value] of Object.entries(data)) {
    // only apply to primitive types
    if (value != null && typeof value === "object") continue;

    // if you can't find it then move on
    if (use_only_included_fields && included_fields.indexOf(key) === -1) continue;

    // if you dont want it then move on
    if (excluded_fields.indexOf(key) != -1) continue;

    let _field = {
      title: labels[key] ?? key,
      value: utils.format_string(value, "YYYY-MM-DD", "YYYY-MM-DD"),
      placeholder: "",
      onChange: (change) => {
        changes[key] = change;
        $("#save_btn").prop("disabled", false).removeClass("modal__disabled");
      },
      url: "text",
      id: "text",
      type: utils.isValidDate(value) ? "date" : "text",
      styles: { width: "unset", "margin-right": "15px", overflow: "visible" },
      showLabel: true,
      disabled: false,
      required: false,
    };
    fields.append(new TextInput(_field)._html);
  }

  let _m = modal("Edit fields", fields, buttons, false);
}
