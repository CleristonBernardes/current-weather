import { IAccessKeyModel, AccessKeyModel }  from "../models/access_key"
import { Mock }  from "../models/mock/mocks"
import * as _         from "underscore"
import * as moment    from "moment"
import * as config    from "config"
import * as async     from "async"
import { Model }      from "mongoose"

let _AccessKeyModel: Model<IAccessKeyModel>;
const _test_ = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "test");

if (_test_){
  // console.info("Testing mocked data.");
  _AccessKeyModel = new Mock<IAccessKeyModel>(AccessKeyModel);
}else {
  _AccessKeyModel = AccessKeyModel;

  //generate 5 initial keys as requested
  _AccessKeyModel.findOne({}, (err: Error, access_key: IAccessKeyModel)=>{
    if (!access_key){
      async.parallel([
        generateKey, generateKey, generateKey, generateKey, generateKey,
      ], (err, keys)=>{
        console.info("First project execution generated 5 keys: ", keys);
      });
    }
  });
}

export const save = (params: any, done: DefaultResultCallback) => {
  if (_test_){
    params = params.toObject? params.toObject() : params;
    _AccessKeyModel.save(params, done);
  }else{
    const new_key = new _AccessKeyModel(params);
    new_key.save(done);
  }
}

export const generateKey = (done: DefaultResultCallback) => {
  save({}, (err: Error, access_key: IAccessKeyModel)=>{
    done(undefined, access_key._id);
  });
}

export const validateKey = (params: any, done: DefaultResultCallback) => {
  const {key} = params;
  if (!key) {return done(new Error("Missing key."))} //key not informed
  _AccessKeyModel.findById(key, (err: Error, access_key: IAccessKeyModel)=>{
    if (err) {return done(err)}
    if (!access_key) {return done(new Error("Invalid key."))} //not in DB
    if (access_key.last_access && access_key.last_access.length === 0) {return done(undefined, true)} //never been used

    const one_hour_before = moment().add(-1, "h");
    const last_hour_access_list = _.filter(access_key.last_access, (l)=> {
      return l.date_time >= one_hour_before
    });
    if (last_hour_access_list.length >= config.api.hour_limit_rate){
      return done(new Error("You have reached the hour rate limit. Please try again later.")); //exceeded hour rate
    }
    done(undefined, true);
  });
}

export const logKeyUsage = (params, done) => {
  const {key, _ip} = params;
  _AccessKeyModel.findById(key, (err: Error, access_key: IAccessKeyModel)=>{
    if (err) {return done(err)}
    if (!access_key) {return done(new Error("Invalid key."))} //not in DB
    access_key.last_access ? access_key.last_access.push({date_time: new Date(), ip: _ip}) : access_key.last_access = [{date_time: new Date(), ip: _ip}];
    save(access_key, done);
  });
}