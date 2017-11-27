export default interface IWeather {
  coord: {
    lon?: Number,
    lat?: Number
  };
  weather: any[];
  base: string;
  main: {
    temp?: Number,
    pressure?: Number,
    humidity?: Number,
    temp_min?: Number,
    temp_max?: Number,
  };
  visibility?: Number;
  wind: {
    speed?: Number,
    deg?: Number
  };
  clouds: { all?: Number};
  dt?: Number;
  sys: any;
  id?: Number;
  name?: string;
  cod?: Number;
}