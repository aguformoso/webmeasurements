/*
 * Web Measurements
 * October 2018
 */
(function(f, b) {
  var c = f.createElement(b),
    e = f.getElementsByTagName(b)[0];
  c.src = "https://cdn.dev.lacnic.net/require.js";
  c.type = "text/javascript";
  e.parentNode.insertBefore(c, e);
  c.onload = c.onreadystatechange = function() {
    // Require libraries loaded
    requirejs.config({
      "paths": {
        "stun": "https://rawgit.com/LACNIC/natmeter/59f6bd2860a0c417d8ea7e67d2c6868d93800ed8/stun/app/static/app/js/stun",
      },

      'map': {
      }
      
    });

    require([], function() {
      // Configuration loaded now, safe to do other require calls
      // that depend on that config.

      const ripestat = "https://stat.ripe.net";
      const browser = {}; // object to store our information into

      fetch(`${ripestat}/data/whats-my-ip/data.json`).then(

        a=>a.json()

      ).then(
        json=>{
          browser.ip = json["data"]["ip"];
      }).then(

          _ => {
          const f1 = fetch(`${ripestat}/data/geoloc/data.json?resource=${browser.ip}`).then(
            a=>a.json()
          );
          const f2 = fetch(`${ripestat}/data/network-info/data.json?resource=${browser.ip}`).then(
            a=>a.json()
          );

          delete browser.ip; // the IP address won't be used any more

          Promise.all(
              [f1, f2]
          ).then(
            ([b, c])=>{
              const countries = b["data"]["locations"].map(cc => cc["country"]);
              const asns = c["data"]["asns"].map(asn => Number(asn));
              const a = JSON.stringify(asns);
              const ASNs = `"${a}"`;

              fetch(
                  "https://api.webmeasurements.net",
                  {
                      method: 'POST',
                      mode: "cors",
                      headers: new Headers({
                            'Content-Type': 'text/plain',
                            'X-Network-Info': ASNs
                        }),
                   }
              );

              return (countries, asns)
            }
          )
          }
    );

      if ( Math.random() > 1.0 ) {

      } else {
        require(['stun'], function(STUN) {
          STUN.init();
        });
      }
    });
  }
}(document, "script"));
