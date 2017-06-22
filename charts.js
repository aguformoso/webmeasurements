var CHARTS = (typeof CHARTS === 'undefined') ? {} : CHARTS;
    CHARTS.debug = true;

    CHARTS.endpoint = CHARTS.debug && 'http://127.0.0.1:8001/code/' || 'https://charts.dev.lacnic.net/code/';

    CHARTS.fetchChart = async function({x=[], y=[], ys=[[]], kind='', divId='', xType='', callback='', labels=[], colors=[], stacked='', my_options={}}) {

      var body = document.getElementsByTagName('body')[0];
      var progress = document.createElement('progress');
      var br = document.createElement('br');
      var span = document.createElement('span');
      var div = document.createElement('div');
      div.id = divId;
      div.style.fontFamily = 'Helvetica';
      div.style.fontSize = '.60em';
      div.style.color = 'grey';
      div.style.minHeight = '12em';
      div.style.margin = 'auto';
      div.style.textAlign = 'center';
      div.appendChild(progress);
      div.appendChild(br);
      div.appendChild(span);
      body.appendChild(div);

      function updateChart(value, message) {
        progress.setAttribute('value', value);
        span.innerHTML = message;
      }

      f=document;
      b="script";

      updateChart(10, 'Fetching libraries');

      var c = f.createElement(b),
        e = f.getElementsByTagName(b)[0];
      c.src = "https://cdn.dev.lacnic.net/require.js";
      c.type = "text/javascript";
      e.parentNode.insertBefore(c, e);
      c.onload = c.onreadystatechange = function() {
        // Require libraries loaded
        requirejs.config({
          "paths": {
            "jquery": "https://cdn.dev.lacnic.net/jquery-1.11.2.min",
            "jsapi": "https://www.gstatic.com/charts/loader"
          }
        });

        require(["jquery", "jsapi"], function($, jsapi) {
          // Configuration loaded now, safe to do other require calls
          // that depend on that config.

          google.charts.load("43", {packages:["corechart"]});

          updateChart(20, 'Google libraries loaded');

          var params = decodeURIComponent($.param({
            'x': JSON.stringify(x),
            'y': JSON.stringify(y),
            'ys': JSON.stringify(ys),
            'kind': JSON.stringify(kind),
            'divId': JSON.stringify(divId),
            'xType': JSON.stringify(xType),
            'callback': JSON.stringify(callback),
            'labels': JSON.stringify(labels),
            'colors': JSON.stringify(colors),
            'stacked': JSON.stringify(stacked),
            'my_options': JSON.stringify(my_options)
          }));

          updateChart(30, 'Fetching chart');


          script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.onload = function(){
              // remote script has loaded
              // console.log(CHARTS);
          };
          script.src = CHARTS.endpoint + '?' + params;
          document.getElementsByTagName('head')[0].appendChild(script);
          updateChart(90, 'Fetching chart');

        });
      }
    }
