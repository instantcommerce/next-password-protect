import{serialize as e}from"../../node_modules/cookie/index.js";var o=function(o,a,i,n){"maxAge"in n&&(n.expires=new Date(Date.now()+n.maxAge),n.maxAge/=1e3),o.setHeader("Set-Cookie",e(a,i,n))};export{o as setCookie};
//# sourceMappingURL=setCookie.js.map
