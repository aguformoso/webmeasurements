(function(f, b) {
    var c = f.createElement(b),
        e = f.getElementsByTagName(b)[0];
    c.src = "http://requirejs.org/docs/release/2.3.2/minified/require.js";
    c.type = "text/javascript";
    e.parentNode.insertBefore(c, e);
    c.onload = c.onreadystatechange = function() {
      // Require libraries loaded
        requirejs.config({
            "paths": {
                "jquery": "https://code.jquery.com/jquery-1.11.1.min",
                "simon": "https://cdn.rawgit.com/LACNIC/simon/master/simon-javascript/simon_probe_plugin",
                "stun": "https://cdn.rawgit.com/LACNIC/natmeter/master/stun/app/static/app/js/stun"
            }
        });

        require(["jquery"], function($) {
            // Configuration loaded now, safe to do other require calls
            // that depend on that config.

            if (Math.random() < 1 / 2) {
                require(["simon"], function() {
                    SIMON.init();
                });
            } else {
                require(["stun"], function() {
                    STUN.init();
                });
            }
        });
    }
}(document, "script"));
