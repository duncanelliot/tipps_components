//@ts-check
"use-strict";

import { format_string } from "../utils/index.js";
import { debounce } from "../utils/index.js";
import { update_entry_length, create_pagination, update_pagination, paginationClickHandler, style_duplicates } from "./table_helpers.js";

/*
    v1.00   DH    Feb 2020  : initial version
    v1.01   DE    Apr 2020  : added properties.hasOwnProperty("original_data") to the filter function 
    v1.02   DH    Apr 2020  : added ability to change time formats used
    v1.03   DE/DH May 2020  : persist the table filter to local storage

    possible improvements:
    - having to use original_data is prone to error
    - You can see thru the header when scrolling down
*/

/**
 *
 * @typedef {Object} TableProps
 * @property {Object} data // the data for headers and rows
 * @property {String} table_id // unique string to use to save searches to local storage
 * @property {Number} [initial_rows] // rows to display if pagination is true
 * @property {Boolean} [pagination] // toggle pagination
 * @property {Boolean} [sticky] // toggle sticky
 * @property {Object} [table_insert] // toggle sticky
 * @property {[Object[]]} [custom_headers] // self explanatory
 * @property {Object} [custom_col_styles] // add custom styles for certain columns in the table
 * @property {Boolean | [String, String] | [String]} [duplicates] // if an array of a single string is passed then duplicates will be matched against the single string header, if an array of two strings are passed then it will match against two headers
 * @property {String} [custom_time_format] // dayjs format for time
 */

//! add on hoover effect
// look at the way other tables are structured (plugin archiecture)
// https://flatlogic.com/blog/top-19-remarkable-javascript-table-libraries-and-plugins/
// { data, initial_rows, pagination = true, sticky = true, table_insert = {} }

/**
 * @param {TableProps} options
 * @returns {void}
 */
export function Table(options) {
  let {
    data,
    table_id,
    initial_rows,
    pagination = true,
    sticky = true,
    table_insert = {},
    custom_headers = [],
    duplicates = false,
    custom_col_styles = {},
    custom_time_format = undefined,
  } = options;

  this.table = document.createElement("table");
  this.table.classList.add("content-table");
  // $(this.table).css({width: '100%', 'table-layout': 'fixed', 'word-break': 'break-word'})

  let _tbody = this.table.createTBody();
  $(_tbody).on("click", (e) => {
    //@ts-ignore
    if (e.target.hasOwnProperty("onClick")) e.target.onClick();
    e.stopPropagation();
  });
  $(_tbody).on("change", (e) => {
    //@ts-ignore
    if (e.target.hasOwnProperty("onChange")) e.target.onChange(e);
    e.stopPropagation();
  });
  let _data = data.data;
  let _length = _data.length;
  let _headers = data.headers;
  this.initial_rows = initial_rows;
  this.initial_pages = Math.ceil(_length / this.initial_rows);
  let add_row = table_insert;

  create_hdrs.bind(this)();

  function create_hdrs() {
    let head = this.table.createTHead();
    let row = head.insertRow();

    if (custom_headers.length > 0) create_top_row();
    let col_count = 0;
    for (const header in _headers) {
      let cell = document.createElement("th");
      cell.setAttribute("id", header);
      row.appendChild(cell);
      cell.innerText = _headers[header];
      if (sticky) cell.style.position = "sticky";
      let asc = true;
      cell.addEventListener("click", (e) => {
        asc = !asc;
        this.sort(header, asc);
      });
      if (custom_col_styles.hasOwnProperty(+col_count)) {
        $(cell).css(custom_col_styles[col_count]);
      }
      col_count++;
    }

    function create_top_row() {
      custom_headers.forEach((row, index) => {
        let head_row = $("<tr/>", { class: "custom" });
        row.forEach((header) => {
          let td = $("<td/>").text(header.name).attr("colspan", header.span);
          head_row.append(td);
        });
        $(head).prepend(head_row);
        $(head).children("tr").addClass("custom");
      });
    }
  }

  // create table foot
  let foot_row = this.table.createTFoot().insertRow();
  // let foot_row = _tfoot.insertRow();

  // display number of entries
  let display_cell = foot_row.insertCell();
  display_cell.colSpan = 3;

  // create the table body
  createRows(_data, add_row, custom_col_styles);

  // create pagination options
  if (pagination) {
    let pagination_cell = create_pagination(foot_row, this.initial_pages);
    update_pagination(_tbody, pagination_cell, display_cell, this.initial_rows, _length);
    let pag_links = $(pagination_cell).find("a");
    paginationClickHandler(_tbody, pag_links, this.initial_rows);
  }

  if (duplicates !== false) style_duplicates(this.table, _data, duplicates, sticky);

  // method for sorting the table
  this.sort = (header, asc) => {
    _data.sort((a, b) => {
      let _x = a[header] instanceof HTMLElement || a[header] instanceof jQuery ? a.original_data[header] : a[header];
      let _y = b[header] instanceof HTMLElement || b[header] instanceof jQuery ? b.original_data[header] : b[header];

      let x = asc ? _x : _y;
      let y = asc ? _y : _x;
      if (x === null) return 1;
      if (y === null) return -1;
      if (y < x) return -1;
      if (y > x) return 1;
      return 0;
    });
    createRows(_data, add_row, custom_col_styles);
    if (pagination) update_pagination(_tbody, $("#pagination"), display_cell, this.initial_rows, _length);
    if (duplicates !== false) style_duplicates(this.table, _data, duplicates, sticky);
  };

  function createRows(data, add_rows_data, custom_col_styles) {
    $(_tbody).empty();

    // create table row for adding (if one exists)
    if (Object.keys(add_rows_data).length > 0) {
      let search_row = _tbody.insertRow();
      for (const header in _headers) {
        let cell = search_row.insertCell();
        let cellData = add_rows_data[header] ?? "";
        if (cellData instanceof HTMLElement) {
          cell.appendChild(cellData);
        } else {
          //! this isn't ideal
          cell.innerText = format_string(cellData, null, custom_time_format);
        }
      }
    }

    let count = 0;
    data.forEach((rowData) => {
      let row = _tbody.insertRow();
      let col_count = 0;
      for (const header in _headers) {
        let cell = row.insertCell();
        let cellData = rowData[header];
        // HTML element
        if (cellData instanceof HTMLElement) {
          cell.appendChild(cellData);
        } else if (cellData instanceof jQuery) {
          //@ts-ignore
          $(cell).append(cellData);
        } else {
          cell.innerText = format_string(cellData, null, custom_time_format);
        }
        if (custom_col_styles.hasOwnProperty(+col_count)) {
          $(cell).css(custom_col_styles[col_count]);
        }
        col_count++;
      }
      if (rowData.visible === undefined) {
        row.style.display = "";
        count++;
      } else {
        if (rowData.visible) {
          row.style.display = "";
          count++;
        } else row.style.display = "none";
      }
    });
    update_entry_length(display_cell, count, _length);
  }

  //! use a search prop for objects
  this.filter = (val) => {
    const regex = new RegExp(val, "i");

    let indexArr = [];
    _data.forEach((properties, index) => {
      for (const prop in properties) {
        if (properties.hasOwnProperty("original_data") && (properties[prop] instanceof HTMLElement || properties[prop] instanceof jQuery)) {
          properties.visible = regex.test(String(format_string(properties.original_data[prop], null, custom_time_format)));
          if (properties.visible) indexArr.push(index);
        } else {
          properties.visible = regex.test(String(format_string(properties[prop], null, custom_time_format)));
          if (properties.visible) indexArr.push(index);
        }
        if (properties.visible) {
          break;
        }
      }
    });

    localStorage.setItem(table_id, val);

    // new technique to hide the offending rows
    let rows = $(this.table).find("tbody tr");
    $(rows).each(function (index) {
      if (indexArr.includes(index)) $(this).show();
      else $(this).hide();
    });
    update_entry_length(display_cell, indexArr.length, _length);

    // old technique to re-render the full table
    // createRows(_data, add_row, custom_col_styles);
    // if (duplicates !== false) style_duplicates(this.table, _data, duplicates, sticky);
    //! need to update the pagination after running the filter
  };

  // setting the filter for the table if it exists in
  let existing_filter = localStorage.getItem(table_id);
  if (existing_filter !== null) {
    this.filter(existing_filter);
  }

  this.debounce = debounce();
}
