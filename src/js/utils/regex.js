export const regex = {
  check_is_monetary_amount: (text) => {
    let regex = /^([0-9]+(\.[0-9]{1,2})?)$/gm;
    return regex.test(text);
  },

  other_test: () => {},
};
