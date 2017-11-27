import * as config       from "config";
import * as _            from "underscore";
import * as async        from "async";
import * as request      from "request"

// http://api.openweathermap.org/data/2.5/weather?q=London&appid=4825956219f5198f88d13543358f14ba

const API_URL = `${config.api.url}${config.api.version}weather`
export const findByLocation = (params: any, done: DefaultResultCallback) => {
  let {city, country} = params;
  
  done(undefined, "not implemented");
}