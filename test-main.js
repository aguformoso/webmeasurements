var allTestFiles = []
var TEST_REGEXP = /(spec|test)\.js$/i

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '')
    allTestFiles.push(normalizedTestModule)
  }
})

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths: {
    'jquery': "https://cdn.dev.lacnic.net/jquery-1.11.1.min",  // 1.11.1
    "jquery-private": 'jquery-private',  //  'https://cdn.dev.lacnic.net/jquery-private',
    "jquery-public": "jquery-1.6.2",  // 1.6.2
    "jsonp": "https://cdn.dev.lacnic.net/jsonp",
    "date-format": "https://cdn.dev.lacnic.net/date.format",
    "simon": "https://rawgit.com/LACNIC/simon/master/simon-javascript/simon_probe_plugin",
    "stun": "https://rawgit.com/LACNIC/natmeter/master/stun/app/static/app/js/stun",
    "monitor": "https://rawgit.com/LACNIC/monitor/master/monitor/app/static/app/js/monitor"
  },

  map: {
    // '*' means all modules will get 'jquery-private'
    // for their 'jquery' dependency.
    '*': { 'jquery': 'jquery-private' },

    // 'jquery-private' wants the real jQuery module
    // though. If this line was not here, there would
    // be an unresolvable cyclic dependency.
    'jquery-private': { 'jquery': 'jquery' }
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
})
