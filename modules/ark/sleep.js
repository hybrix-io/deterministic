"use strict";
/* hybrix: this file is used by precompile.sh to replace /node_modules/@arkecosystem/utils/dist/sleep.js
to prevent the use of Util.promisify which is not available in browsers
*/
function promisify(f) {
  return function (...args) { // return a wrapper-function
    return new Promise((resolve, reject) => {
      function callback(err, result) { // our custom callback for f
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // append our custom callback to the end of f arguments

      f.call(this, ...args); // call the original function
    });
  };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = promisify(setTimeout);
//# sourceMappingURL=sleep.js.map
