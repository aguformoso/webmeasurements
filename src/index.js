import { startMeasurements, measurementsDecider } from "./libwebmsm";

// simple toggle to allow or disallow msm execution
const run = false;

if (run && measurementsDecider()) {
  console.log("starting webmeasurements...");
  const testResult = startMeasurements();
  console.log(testResult);
} else {
  console.log("webmeasurements skipped...");
}
