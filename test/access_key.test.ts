import * as config from "config"
import * as AccessKey  from "../src/controllers/access_key"
import { testExecute } from "./utils"


jasmine.DEFAULT_TIMEOUT_INTERVAL = config.test.DEFAULT_TIMEOUT_INTERVAL

describe("key_manager", () => {
  testExecute(`generate_key`, AccessKey.generateKey, (done) => {
    return function validate(err: any, response: any) {
      expect(err).toBeUndefined();
      expect(response).toBeDefined();
      done();
    };
  });

});