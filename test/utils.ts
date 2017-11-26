export function testExecute(testing_name: string, testing_method: Function, validating_method: Function, ...args: any[]) {
  it(testing_name, done => {
      if (args.length > 0) {
        testing_method(...args, validating_method(done));
      } else {
        testing_method(validating_method(done));
      }
  });
}