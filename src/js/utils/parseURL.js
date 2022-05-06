export function parseUrl(url) {
  var m = url.match(/^(([^:\/?#]+:)?(?:\/\/((?:([^\/?#:]*):([^\/?#:]*)@)?([^\/?#:]*)(?::([^\/?#:]*))?)))?([^?#]*)(\?[^#]*)?(#.*)?$/),
    r = {
      hash: m[10] || "", // #asd
      host: m[3] || "", // localhost:257
      hostname: m[6] || "", // localhost
      href: m[0] || "", // http://username:password@localhost:257/deploy/?asd=asd#asd
      origin: m[1] || "", // http://username:password@localhost:257
      pathname: m[8] || (m[1] ? "/" : ""), // /deploy/
      port: m[7] || "", // 257
      protocol: m[2] || "", // http:
      search: m[9] || "", // ?asd=asd
      username: m[4] || "", // username
      password: m[5] || "", // password
    };
  if (r.protocol.length == 2) {
    r.protocol = "file:///" + r.protocol.toUpperCase();
    r.origin = r.protocol + "//" + r.host;
  }
  r.href = r.origin + r.pathname + r.search + r.hash;
  return r;
}
