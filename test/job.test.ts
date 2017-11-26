import * as fs from "fs"
import * as path from "path"
import {  } from "../src/controllers/job"
jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000
import { testExecute } from "./utils"

const default_file = {}

function testExecute(testing_name: string, testing_method: Function, validating_method: Function, ...args: any[]) {
  it(testing_name, done => {
    if (args.length > 0) {
      testing_method(...args, validating_method(done));
    } else {
      testing_method(validating_method(done));
    }
  });
}


describe("job", () => {
  testExecute(`job1`, calcNotation, (err: any, result: any) => {
    expect(err).toBeUndefined();
    expect(result).toBeDefined();
    expect(result.output_file).toBeDefined();
    compareResults(result.output_file, (err: any, valid: boolean)=>{
      expect(err).toBeUndefined();
      expect(valid).toBeTruthy();
      done()
    });
  }, {});

});