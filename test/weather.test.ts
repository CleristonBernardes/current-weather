if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "test") {
  // console.info("Testing stub api.");
  jest.mock("../src/controllers/weather");
}

import * as Weather          from "../src/controllers/weather";
import * as config           from "config"
import { testExecute }       from "./utils"
import * as async            from "async"

jasmine.DEFAULT_TIMEOUT_INTERVAL = config.test.DEFAULT_TIMEOUT_INTERVAL


describe("weather", () => {
  testExecute(`find_by_city`, Weather.findByLocation, (done) => {
    return function validate(err: any, response: any) {
      expect(err).toBeUndefined();
      expect(response).toBeDefined();
      expect(response).toBe("light intensity drizzle");
      done();
    };
  }, {city:"Sydney"});

  testExecute(`find_by_city_and_country`, Weather.findByLocation, (done) => {
    return function validate(err: any, response: any) {
      expect(err).toBeUndefined();
      expect(response).toBeDefined();
      expect(response).toBe("light intensity drizzle");
      done();
    };
  }, {city:"Sydney", country:"AU"});

  testExecute(`find_by_location_empty`, Weather.findByLocation, (done) => {
    return function validate(err: any, response: any) {
      expect(err).toBeDefined();
      expect(response).toBeUndefined();
      done();
    };
  }, {});

});