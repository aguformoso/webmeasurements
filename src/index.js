import { startMeasurements, measurementsDecider } from "./libwebmsm";

if (measurementsDecider()) {
  console.log("starting webmeasurements...");
  const testResult = startMeasurements();
  console.log(testResult);
} else {
  console.log("webmeasurements skipped...");
}
