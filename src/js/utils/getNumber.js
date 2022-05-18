export function getNumber(data, err = null) {
  if (typeof data === "string") {
    data = parseFloat(data) || parseInt(data);
    return isNaN(data) ? err : data;
  }
  if (typeof data === "number") return data;
  return err;
}
