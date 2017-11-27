import * as config       from "config";
import * as _            from "underscore";
import * as async        from "async";
import * as request      from "request";
import IWeather          from "../interfaces/weather";

const API_URL = `${config.api.url}${config.api.version}weather`

export const findByLocation = (params: any, done: DefaultResultCallback) => {
  let {city, country} = params;
  console.info("params", params);
  if (!city) {
    return done(new Error("Please inform the city location."))
  }
  city = city.replace(/,/g, "");
  country = country ? country.replace(/,/g, "") : country;
  const query= {
    appid: config.OWM.access_key,
    q: country ? `${city},${country}` : city
  }
  const requestObject = { uri: API_URL, method: "GET", qs: query}
  console.info("requestObject", requestObject);
  request(requestObject, (err: Error, response: any, body: string) => {
    if (err) {return done(err);}
    const result: IWeather = JSON.parse(body);
    console.info("result", result);
    if (!result || !result.weather || result.weather.length < 1) {return done(new Error("not-found"))}
    done(undefined, result.weather[0].description);
  });
}