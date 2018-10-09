/*
 * LACNIC Labs - 2017
 * agustin at lacnic dot net
 */

define(function () {

    var charts = {};

    charts.debug = false;

    charts.endpoint = charts.debug && 'http://127.0.0.1:8001' || 'https://charts.dev.lacnic.net';

    charts.progressBars = {};  // charts managed by the CHARTS object

    charts.updateChart = function (divId, value, message) {

        var progress = document.getElementById(divId).getElementsByTagName('progress')[0];
        progress.value = value;
    }

    charts.draw = async function ({x = [], y = [], ys = [[]], kind = '', divId = '', xType = '', callback = '', labels = [], colors = [], stacked = '', my_options = {}}) {

        var body = document.getElementsByTagName('body')[0];
        var progress = document.createElement('progress');
        var br = document.createElement('br');
        var span = document.createElement('span');
        var div;



        if (document.getElementById(divId) === null) {
            div = document.createElement('div');
            div.id = divId;
            body.appendChild(div);
        } else {
            div = document.getElementById(divId);
        }
        div.style.fontFamily = 'Helvetica';
        div.style.fontSize = '.60em';
        div.style.color = 'grey';
        div.style.minHeight = '12em';
        div.style.margin = 'auto';
        div.style.textAlign = 'center';
        div.appendChild(progress);
        div.appendChild(br);
        div.appendChild(span);


        charts.updateChart(divId, 20);


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

        charts.updateChart(divId, 30);

        script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = function () {
            // remote script has loaded
        };

        var service = '/code';
        if(kind === 'Histogram')
            service = '/hist/code';

        script.src = this.endpoint + service + '?' + params;
        document.getElementsByTagName('head')[0].appendChild(script);

        charts.updateChart(divId, 75);
    };

    return charts;
});
