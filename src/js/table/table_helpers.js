export function update_entry_length(cell, current_length, total_length) {
  cell.innerText = `Entries: ${Math.min(current_length, total_length)} / ${total_length}`;
}

export function create_pagination(footer, init_pages) {
  if ($("#pagination")) $("#pagination").remove();
  let pagination_cell = footer.insertCell();
  pagination_cell.id = "pagination";
  pagination_cell.colSpan = 3;
  for (let i = 0; i < init_pages; i++) {
    const pageNum = i + 1;
    $(pagination_cell).append('<a href="#" page="' + i + '">' + pageNum + "</a> ");
  }

  return pagination_cell;
}

export function update_pagination(body, pagination_cell, entry_cell, init_rows, total_rows) {
  $(body).find("tr").hide();
  $(body).find("tr").slice(0, init_rows).show();

  let _a = $(pagination_cell).find("a:first");
  _a.addClass("active");
  update_entry_length(entry_cell, init_rows, total_rows);

  return;
}

export function paginationClickHandler(body, pag_links, init_rows) {
  pag_links.on("click", function () {
    pag_links.removeClass("active");
    $(this).addClass("active");
    const current_page = parseInt($(this).attr("page"));
    const start_row = current_page * init_rows;
    const end_row = start_row + init_rows;
    $(body).find("tr").css("opacity", "0.0").hide().slice(start_row, end_row).css("display", "table-row").animate({ opacity: 1 }, 300);

    return false; // used to stop the href triggering a movement to top of page
  });
}

function check_duplicates(data, headers) {
  let store = {};
  let repeated = {};

  let header = headers[0];

  data.forEach((el, index) => {
    if (Object.values(store).includes(el[header])) {
      let position_a = Object.keys(store)[Object.values(store).indexOf(el[header])];
      if (Object.keys(repeated).includes(el[header])) repeated[el[header]] = [...repeated[el[header]], index];
      else {
        repeated[el[header]] = [parseInt(position_a), index];
      }
    } else store[index] = el[header];
  });

  if (headers.length > 1) {
    let store1 = {};
    let repeated1 = {};

    let header1 = headers[1];

    data.forEach((el, index) => {
      if (Object.values(store1).includes(el[header1])) {
        let position_a = Object.keys(store1)[Object.values(store1).indexOf(el[header1])];
        if (Object.keys(repeated1).includes(el[header1])) repeated1[el[header1]] = [...repeated1[el[header1]], index];
        else {
          repeated1[el[header1]] = [parseInt(position_a), index];
        }
      } else store1[index] = el[header1];
    });

    //need to crossreference the 2 repeateds
    let repeated3 = {};

    for (let ids in repeated) {
      let dups = [];
      for (let types in repeated1) {
        let combined = [...repeated[ids], ...repeated1[types]];
        let duplicates = combined.filter((e, i, a) => a.indexOf(e) !== i);
        if (duplicates.length > 1) dups.push(...duplicates);
      }
      repeated3[ids] = dups;
    }
    repeated = repeated3;
  }

  return {
    store,
    repeated,
  };
}

//! table should have a add_column()
export function style_duplicates(table, data, duplicates, sticky) {
  // $(table).addClass('finance_table') // to remove tr styling
  if ($(table).find(".table_duplicate").length === 0) {
    let _ = $(table).find("thead > tr");
    _.each(function () {
      let th = $("<th/>").css({ cursor: "default" }).addClass("table_duplicate");
      $(this).append(th);
    });

    $(table).find("thead > tr:last > th:last").text("Duplicates");
    if (sticky) $(table).find("thead > tr:last > th:last").css({ position: "sticky", "z-index": 10 });
  }

  let table_rows = $(table).find("tbody > tr");
  let repeated_rows = check_duplicates(data, duplicates).repeated;

  let amend_rows = [];
  for (let row in repeated_rows) {
    amend_rows.push(...repeated_rows[row]);
  }

  let header_length = $(table).find("thead > tr:last > th").length;

  table_rows.each(function (index) {
    let selected_row = table_rows[index];
    let row_length = $(selected_row).find("td").length;

    if (row_length === header_length) $(selected_row).find("td")[row_length - 1].remove();

    if (amend_rows.includes(index)) $(selected_row).append(create_error_span());
    else $(selected_row).append(create_tick_span());
  });

  // let count = 1;
  // for (let row in repeated_rows) {
  //   // let background_color = `rgba(${count*50}, ${count*50}, 100, 0.11)`
  //   repeated_rows[row].forEach((number) => {
  //     let selected_row = table_rows[parseInt(number)];
  //     // $(selected_row).css({'background': background_color})
  //     let new_td = $('<td/>');
  //     let wrapper = $('<div/>').css({ position: 'relative' });
  //     let span = $('<span/>', { class: 'fa fa-exclamation-circle fa-2x' }).css({ color: 'darkorange' });
  //     // let span = $('<span/>').text(count).css({position:'absolute', top:'0px', left:'-50px', width: '30px', height: '30px'})
  //     wrapper.append(span);
  //     new_td.append(wrapper);
  //     $(selected_row).append(new_td);
  //   });
  //   count++;
  // }
}

function create_error_span() {
  let new_td = $("<td/>");
  let wrapper = $("<div/>").css({ position: "relative" });
  let span = $("<span/>", { class: "fa fa-exclamation-circle fa-2x" }).css({ color: "darkorange" });
  wrapper.append(span);
  new_td.append(wrapper);

  return new_td;
}

function create_tick_span() {
  let new_td = $("<td/>");
  let wrapper = $("<div/>").css({ position: "relative" });
  let span = $("<span />", { class: "far fa-thumbs-up  green fa-2x" });
  wrapper.append(span);
  new_td.append(wrapper);

  return new_td;
}
