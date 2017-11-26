interface DefaultResultCallback {
  ( error: any, result?: any ): void;
}

interface DefaultMethod {
  ( params: any, done?: DefaultResultCallback ): void;
}

interface DefaultMethodDone {
  (done?: DefaultResultCallback ): void;
}