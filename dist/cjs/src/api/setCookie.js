"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("../../node_modules/cookie/index.js");exports.setCookie=function(o,i,t,r){"maxAge"in r&&(r.expires=new Date(Date.now()+r.maxAge),r.maxAge/=1e3),o.setHeader("Set-Cookie",e.serialize(i,t,r))};
//# sourceMappingURL=setCookie.js.map
