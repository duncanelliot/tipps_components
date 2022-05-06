export function isValidDate(s) {
  // format D(D)/M(M)/(YY)YY
  var dateFormat = /^\d{1,4}[\.|\/|-]\d{1,2}[\.|\/|-]\d{1,4}/;
  // var dateFormat = /^\d/;

  if (dateFormat.test(s)) {
    return true;
  } else {
    return false;
  }
}
