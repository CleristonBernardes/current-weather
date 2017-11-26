export default interface IAccessKey {
  _id: any;
  last_access?: [{
    date_time: Date,
    ip?: string
  }];
  active: boolean;
  save: Function;
}