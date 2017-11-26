import * as _         from "underscore"
import * as mongoose  from "mongoose"
import { Model, Document, Types } from "mongoose";
import { flatten, unflatten }     from "flat";

export interface IMockOptions {
  seed_data: any[];
}

export class Mock<T extends Document> {
  protected list_data: any[]
  protected model: Model<T>;

  constructor(model: Model<T>, options?: IMockOptions) {
    this.model = model;
    this.list_data = (options && options.seed_data) ? options.seed_data : [];
  }
  public save = (new_obj: any, done:DefaultResultCallback) => {
    let db_obj: any;
    if (new_obj._id){
      for (const data of this.list_data){
        if (data._id.toString === new_obj._id.toString){
          const updated_data = _.extend(flatten(data), flatten(new_obj));
          return done(undefined, updated_data);
        }
      }
    }else {
      new_obj._id = mongoose.Types.ObjectId().toString();
    }
    try{
      db_obj = new this.model(new_obj);
    } catch (err) {
      return done(err);
    }
    done(undefined, db_obj);
  }

  public findById = (id: any, done:DefaultResultCallback) => {
    return _.find(this.list_data, (l)=>{ return l._id.toString === id.toString()})
  }
}
