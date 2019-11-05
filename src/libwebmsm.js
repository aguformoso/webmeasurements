import stun from "./stun";
import { UAParser } from "ua-parser-js";
import { testRpkiInvalids } from "rpki-web-test";

/* All the tests that *could* be run from the hosting website
 * should be listed here.
 * takes:
 * {
 *   name,  descriptive name of the test to run
 *   fn,    test function to be called to start
 *   args   argument array to be passed in to the test function
 * }
 */
const TESTS = [
  { name: "stun", fn: stun().init, args: null },
  {
    name: "rpki-web-test",
    fn: testRpkiInvalids,
    args: [{ enrich: true, postResult: true }]
  }
];

const RIPESTAT_API = "https://stat.ripe.net/data";

export const measurementsDecider = () => {
  /*
   * Honour settings from the user or the hosting website!
   *
   * Do *NOT* run if any of the following apply:
   * - The user has DoNotTrack (DNT) enabled in browser settings
   * - An opt in UI was shown and the outcome is negative
   * - An opt out UI was shown and the outcome is negative
   */
  const DNTSetByUser =
    (window.doNotTrack ||
      navigator.doNotTrack ||
      navigator.msDoNotTrack ||
      "msTrackingProtectionEnabled" in window.external) && // dnt available
    (window.doNotTrack === "1" ||
      navigator.doNotTrack === "yes" ||
      navigator.doNotTrack === "1" ||
      navigator.msDoNotTrack === "1" ||
      window.external.msTrackingProtectionEnabled());

  if (DNTSetByUser) {
    return false;
  }

  const optIn = window.localStorage.getItem("webmeasurements.optin");
  const userChoice = window.localStorage.getItem("webmeasurements.userChoice");

  let run = null;

  switch (String(optIn, userChoice)) {
    // Opt IN UI was shown, user confirmed "I want in"
    case "true,true":
      run = true;
      break;

    // Opt IN UI was shown, user denied and said "I want out"
    case "true,false":
      run = false;
      break;

    // Opt IN UI was shown, user didn't do anything
    case "true,null":
      run = false;
      break;

    // Opt OUT UI was shown, user CONFIRMED "I want out"
    case "false,true":
      run = false;
      break;

    // Opt OUT UI was shown, user DENIED and said "I want in"
    case "false,false":
      run = true;
      break;

    // Opt OUT UI was shown, user didn't do anything
    case "false,null":
      run = true;
      break;

    // No Opt IN or Opt OUT UI was shown, go ahead
    default:
      run = true;
      break;
  }

  return run;
};

export const startMeasurements = (debug = false) => {
  let browser = new UAParser().getResult(); // object to store our information into

  fetch(`${RIPESTAT_API}/whats-my-ip/data.json`)
    .then(a => a.json())
    .then(json => {
      browser.ip = json["data"]["ip"];
    })
    .then(_ => {
      const f1 = fetch(
        `${RIPESTAT_API}/geoloc/data.json?resource=${browser.ip}`
      ).then(a => a.json());
      const f2 = fetch(
        `${RIPESTAT_API}/network-info/data.json?resource=${browser.ip}`
      ).then(a => a.json());

      const f3 = fetch(
        `${RIPESTAT_API}/rir/data.json?resource=${browser.ip}`
      ).then(a => a.json());

      delete browser.ip; // the IP address won't be used any more

      Promise.all([f1, f2, f3]).then(([r1, r2, r3]) => {
        const countries = r1["data"]["locations"].map(cc => cc["country"]);
        const asns = r2["data"]["asns"].map(asn => Number(asn));
        const rirs = r3["data"]["rirs"].map(rir => rir["rir"]);

        const a = JSON.stringify(asns);
        const ASNs = `"${a}"`;

        const RIRs = rirs.join(",");

        if (debug) {
          console.log("-----------------");
          console.log("debug info (not posting)");
          console.log(`asns :\t${ASNs}`);
          console.log(`RIRs :\t${RIRs}`);
          console.log(`countries :\t${countries}`);
          console.log(`browser :\t${JSON.stringify(browser)}`);
          console.log("-----------------");
        } else {
          fetch("https://api.webmeasurements.net", {
            method: "POST",
            mode: "cors",
            headers: new Headers({
              "Content-Type": "text/plain",
              "X-Network-Info": ASNs,
              "X-Rir-Info": RIRs,
              "X-Browser-Info": JSON.stringify(browser)
            })
          });
        }

        return countries, asns, rirs;
      });
    });

  // Run only one test, determined by .... chance!
  const test = TESTS[Math.round(Math.random() * (TESTS.length - 1))];

  const testResult = test.fn(...test.args);

  // We're assuming the result of the test is returned by
  // the test function.
  // (I am looking at you stun!)
  return { name: test.name, result: testResult };
};
