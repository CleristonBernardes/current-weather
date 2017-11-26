import * as config from "config"
import * as AccessKey  from "../src/controllers/access_key"
import { testExecute } from "./utils"

jasmine.DEFAULT_TIMEOUT_INTERVAL = config.test.DEFAULT_TIMEOUT_INTERVAL




describe("key_manager", () => {
  const key_list = []
  beforeAll((done) => {
    AccessKey.generateKey((err: Error, access_key: any)=>{
      key_list.push(access_key);
      done();
    });
  });
  testExecute(`generate_key`, AccessKey.generateKey, (done) => {
    return function validate(err: any, response: any) {
      expect(err).toBeUndefined();
      expect(response).toBeDefined();
      done();
    };
  });

  // it(`validate_key`, done => {
  //   AccessKey.validateKey({key: key_list[0]}, (err: any, response: any) => {
  //     console.info("response",err, response);
  //     expect(err).toBeUndefined();
  //     expect(response).toBeTruthy();
  //     AccessKey.logKeyUsage({key: key_list[0]}, (err: any, response: any) => {
  //       AccessKey.validateKey({key: key_list[0]}, (err: any, response: any) => {
  //         expect(err).toBeUndefined();
  //         expect(response).toBeTruthy();
  //         done();
  //       });
  //     });
  //   });
  // });

});