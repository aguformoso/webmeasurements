addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
  event.waitUntil(postMetrics(event.request));
})

// We support the GET, POST, HEAD, and OPTIONS methods from any origin,
// and accept the Content-Type header on requests. These headers must be
// present on all responses to all CORS requests. In practice, this means
// all responses to OPTIONS requests.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Network-Info",
}

/**
 * Fetch and log a given request object
 * @param {Request} request
 */
async function handleRequest(request) {

  if (request.method === "OPTIONS")
    return handleOptions(request)

  if (request.method === "POST")
    return new Response(
      'OK',
      { headers: corsHeaders }
      )

  const response = await fetch(request);
  return response
}

function handleOptions(request) {
  if (request.headers.get("Origin") !== null &&
      request.headers.get("Access-Control-Request-Method") !== null &&
      request.headers.get("Access-Control-Request-Headers") !== null) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: corsHeaders
    })
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        "Allow": "GET, HEAD, POST, OPTIONS",
      }
    })
  }
}

async function postMetrics(request) {

  const headers = request.headers;

  const key = await KV.get("DATADOG_API_KEY");

  let asns = [];
  if(request.url === "https://api.webmeasurements.net/") {
    for (asn of JSON.parse(headers.get('X-Network-Info').replace(/"/g, "")))
      asns.push(`ripestat-asn:${asn}`);
  }

  const referer = headers.has('referer') ? headers.get('referer').split('/')[2] : 'N/A';
  const cf_ipcountry = headers.has('cf-ipcountry') ? headers.get('cf-ipcountry') : 'N/A';

  data = {
        "series":[{
          "metric": "hits.cloudflare-workers",
          "type": "count",
          "points": [
              [new Date().getTime()/1000|0, 1]
            ],
          "tags": [
            "env:cdn",
            "tester:webmeasurements",
            "cf-host:" + headers.get('host'),
            "cf-ipcountry:" + cf_ipcountry,
            "cf-referer:" + referer,
            "method:" + request.method
          ].concat(asns)
        }]
      };

  const r = await fetch(
    `https://api.datadoghq.com/api/v1/series?api_key=${key}`,
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data)
    },
  );
}