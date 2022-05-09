export const regex = {
  check_is_monetary_amount: (text) => {
    let regex = /^([0-9]+(\.[0-9]{1,2})?)$/gm;
    return regex.test(text);
  },
  extract_tel_no: (tel_no) => {
    // from the start take the first two digits
    let regex = /^\d\d/gm;
    return tel_no.replace(regex, "0");
  },
  other_test: () => {},
};
