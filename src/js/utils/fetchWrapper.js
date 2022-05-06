export { fetchWrapper };

// const endpoint = "http://tipps.co.uk.eu.ngrok.io";
const endpoint = process.env.ENDPOINT;

function get(url) {
  const requestOptions = {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  };
  return fetch(endpoint + url, requestOptions).then(handleResponse);
}

function post(url, body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(endpoint + url, requestOptions).then(handleResponse);
}

function post_no_headers(url, body) {
  const requestOptions = {
    method: "POST",
    credentials: "include",
    body: body,
  };
  return fetch(endpoint + url, requestOptions).then(handleResponse);
}

function put(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(endpoint + url, requestOptions).then(handleResponse);
}

function patch(url, body) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(endpoint + url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url, body) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(endpoint + url, requestOptions).then(handleResponse);
}

// helper functions

function handleResponse(response) {
  if ((response.status === 200) & (response.redirected === true)) {
    return (window.location.href = response.url);
  }

  return response.text().then((text) => {
    if (!response.ok) {
      const error = response.status + ": " + JSON.parse(text).message ?? response.statusText;

      window.alert("Operation could not be completed \n" + error);
      return Promise.reject(error);
    }
    // console.log(text)
    let data = text && JSON.parse(text);

    return data;
  });
}

const fetchWrapper = {
  get,
  post,
  post_no_headers,
  put,
  patch,
  delete: _delete,
  endpoint,
};
