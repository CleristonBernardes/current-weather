import * as config      from "config"
import * as AccessKey   from "../src/controllers/access_key"
import { testExecute }  from "./utils"
import * as async       from "async"

jasmine.DEFAULT_TIMEOUT_INTERVAL = config.test.DEFAULT_TIMEOUT_INTERVAL

describe("key_manager", () => {
  const key_list = {}
  beforeAll((done) => {
    async.parallel({
      new_access_key: AccessKey.generateKey,
      four_access_key: (n)=> { 
        AccessKey.saveModel({
          _id:"5a1acaa8d91a8c5804336600",
          last_access: [{date_time: new Date()}, {date_time: new Date()}, {date_time: new Date()}, {date_time: new Date()}] 
        }, n) 
      },
      five_access_key: (n)=> { 
        AccessKey.saveModel({
          _id:"5a1acaa8d91a8c5804336601",
          last_access: [{date_time: new Date()}, {date_time: new Date()}, {date_time: new Date()}, {date_time: new Date()}, {date_time: new Date()}] 
        }, n)
      },
      five_access_key_valid: (n)=> { 
        AccessKey.saveModel({
          _id:"5a1b827ef5619969b5c8072e",
          last_access: [{date_time: new Date("2010/01/01")}, {date_time: new Date()}, {date_time: new Date()}, {date_time: new Date()}, {date_time: new Date()}] 
        }, n)
      }
    }, (err, {new_access_key, four_access_key, five_access_key, five_access_key_valid}) => {
      // console.info({new_access_key, four_access_key, five_access_key, five_access_key_valid})
      key_list["empty"] = new_access_key;
      key_list["four_access_key"] = four_access_key._id;
      key_list["five_access_key"] = five_access_key._id;
      key_list["five_access_key_valid"] = five_access_key_valid._id;
      done(err);
    });
  });

  testExecute(`generate_key`, AccessKey.generateKey, (done) => {
    return function validate(err: any, response: any) {
      expect(err).toBeUndefined();
      expect(response).toBeDefined();
      done();
    };
  });

  it(`validate_key_empty`, done => {
    AccessKey.validateKey({key: key_list["empty"]}, (err: any, response: any) => {
      expect(err).toBeUndefined();
      expect(response).toBeTruthy();
      done();
    });
  });

  it(`validate_4_key_access`, done => {
    AccessKey.validateKey({key: key_list["four_access_key"]}, (err: any, response: any) => {
      expect(err).toBeUndefined();
      expect(response).toBeTruthy();
      done();
    });
  });

  it(`validate_5_key_access`, done => {
    AccessKey.validateKey({key: key_list["five_access_key"]}, (err: any, response: any) => {
      expect(err).toBeDefined();
      expect(response).toBeFalsy();
      done();
    });
  });

  it(`validate_5_key_access having one used before 1h ago`, done => {
    AccessKey.validateKey({key: key_list["five_access_key_valid"]}, (err: any, response: any) => {
      expect(err).toBeUndefined();
      expect(response).toBeTruthy();
      done();
    });
  });

  it(`log_key_usage`, done => {
    AccessKey.logKeyUsage({key: key_list["empty"]}, (err: any, response: any) => {
      expect(err).toBeUndefined();
      expect(response).toBeDefined();
      expect(response.last_access).toHaveLength(1);
      done();
    });
  });

});