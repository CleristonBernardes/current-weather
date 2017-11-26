import { Document, Schema, model }     from "mongoose";
import IAccessKey from "../interfaces/access_key";

const accessKeySchema = new Schema({
  last_access: [{
    date_time: Date,
    ip: String
  }],
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export interface IAccessKeyModel extends IAccessKey, Document {}
export const AccessKeyModel = model<IAccessKeyModel>("access_key", accessKeySchema);