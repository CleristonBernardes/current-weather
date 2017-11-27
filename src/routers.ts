import * as AccessKey from "./controllers/access_key"
import * as _         from 'underscore';
import * as config    from 'config';
import {
  Router,
  Request,
  Response,
  NextFunction
}  from 'express';

const router: Router = Router();

const getParameters = (req: Request) => {
  const _ip =req.header('x-forwarded-for') || req.connection.remoteAddress;
  return _.extend(req.params, req.query, req.body, {_ip});
}

const runMethod = (method, use_params=true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let params = getParameters(req);
    try{
      if (use_params){
        method(params, (err: Error, result: any) => {
          res.locals.error = err;
          res.locals.result = result;
          next(err);
        });
      } else {
        method((err: Error, result: any) => {
          res.locals.error = err;
          res.locals.result = result;
          next(err);
        });
      }
    }
    catch(err){
      res.locals.error = err;
      next(err);
    }
  }
}

const dispatch = (logKeyAccess=true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.error) {
      res.status(config.api.status.error).send(res.locals.error.message);
    } else {
      if (logKeyAccess) {
        try{
          let params = getParameters(req);
          AccessKey.logKeyUsage(params, (err, result)=>{
            if (err) {console.error(`Error while loging access key usage - ${err}`)}
          });
        }catch(err){
          if (err) {console.error(`Exception while loging access key usage - ${err}`)}
        }finally{
          res.status(config.api.status.success).send(res.locals.result);
        }
      }else{
        res.status(config.api.status.success).send(res.locals.result);
      }
    }
  };
}

router.get(`/key/generate`, runMethod(AccessKey.generateKey, false), dispatch());

export default router;