// 此文件由pnpm --filter @telltale/contracts generate生成。
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// ../../node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  "../../node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/formats.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
    function fmtDef(validate, compare) {
      return { validate, compare };
    }
    exports.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: fmtDef(date, compareDate),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: fmtDef(getTime(true), compareTime),
      "date-time": fmtDef(getDateTime(true), compareDateTime),
      "iso-time": fmtDef(getTime(), compareIsoTime),
      "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte,
      // signed 32 bit integer
      int32: { type: "number", validate: validateInt32 },
      // signed 64 bit integer
      int64: { type: "number", validate: validateInt64 },
      // C-type float
      float: { type: "number", validate: validateNumber },
      // C-type double
      double: { type: "number", validate: validateNumber },
      // hint to the UI to hide input strings
      password: true,
      // unchecked string payload
      binary: true
    };
    exports.fastFormats = {
      ...exports.fullFormats,
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
      "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
      "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
      "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    exports.formatNames = Object.keys(exports.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date(str) {
      const matches = DATE.exec(str);
      if (!matches)
        return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    function compareDate(d1, d2) {
      if (!(d1 && d2))
        return void 0;
      if (d1 > d2)
        return 1;
      if (d1 < d2)
        return -1;
      return 0;
    }
    var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function getTime(strictTimeZone) {
      return function time(str) {
        const matches = TIME.exec(str);
        if (!matches)
          return false;
        const hr = +matches[1];
        const min = +matches[2];
        const sec = +matches[3];
        const tz = matches[4];
        const tzSign = matches[5] === "-" ? -1 : 1;
        const tzH = +(matches[6] || 0);
        const tzM = +(matches[7] || 0);
        if (tzH > 23 || tzM > 59 || strictTimeZone && !tz)
          return false;
        if (hr <= 23 && min <= 59 && sec < 60)
          return true;
        const utcMin = min - tzM * tzSign;
        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
      };
    }
    function compareTime(s1, s2) {
      if (!(s1 && s2))
        return void 0;
      const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
      const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
      if (!(t1 && t2))
        return void 0;
      return t1 - t2;
    }
    function compareIsoTime(t1, t2) {
      if (!(t1 && t2))
        return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2))
        return void 0;
      t1 = a1[1] + a1[2] + a1[3];
      t2 = a2[1] + a2[2] + a2[3];
      if (t1 > t2)
        return 1;
      if (t1 < t2)
        return -1;
      return 0;
    }
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function getDateTime(strictTimeZone) {
      const time = getTime(strictTimeZone);
      return function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
      };
    }
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const d1 = new Date(dt1).valueOf();
      const d2 = new Date(dt2).valueOf();
      if (!(d1 && d2))
        return void 0;
      return d1 - d2;
    }
    function compareIsoDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0)
        return void 0;
      return res || compareTime(t1, t2);
    }
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    function validateNumber() {
      return true;
    }
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str))
        return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
});

// ../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// ../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "../../node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// validators.cjs
var require_validators = __commonJS({
  "validators.cjs"(exports) {
    exports.Identifier = validate10;
    var formats0 = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
    var func2 = require_ucs2length().default;
    function validate10(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (errors === 0) {
        if (errors === 0) {
          if (typeof data === "string") {
            if (func2(data) > 36) {
              validate10.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" }];
              return false;
            } else {
              if (func2(data) < 36) {
                validate10.errors = [{ instancePath, schemaPath: "#/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" }];
                return false;
              } else {
                if (!formats0.test(data)) {
                  validate10.errors = [{ instancePath, schemaPath: "#/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' }];
                  return false;
                }
              }
            }
          } else {
            validate10.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
            return false;
          }
        }
      }
      validate10.errors = vErrors;
      return errors === 0;
    }
    exports.UtcTimestamp = validate11;
    var formats2 = require_formats().fullFormats["date-time"];
    var pattern0 = new RegExp("Z$", "u");
    function validate11(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (errors === 0) {
        if (errors === 0) {
          if (typeof data === "string") {
            if (func2(data) > 30) {
              validate11.errors = [{ instancePath, schemaPath: "#/maxLength", keyword: "maxLength", params: { limit: 30 }, message: "must NOT have more than 30 characters" }];
              return false;
            } else {
              if (!pattern0.test(data)) {
                validate11.errors = [{ instancePath, schemaPath: "#/pattern", keyword: "pattern", params: { pattern: "Z$" }, message: 'must match pattern "Z$"' }];
                return false;
              } else {
                if (!formats2.validate(data)) {
                  validate11.errors = [{ instancePath, schemaPath: "#/format", keyword: "format", params: { format: "date-time" }, message: 'must match format "date-time"' }];
                  return false;
                }
              }
            }
          } else {
            validate11.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
            return false;
          }
        }
      }
      validate11.errors = vErrors;
      return errors === 0;
    }
    exports.Difficulty = validate12;
    function validate12(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      const _errs0 = errors;
      let valid0 = false;
      const _errs1 = errors;
      if (typeof data !== "string") {
        const err0 = { instancePath, schemaPath: "#/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      if ("L" !== data) {
        const err1 = { instancePath, schemaPath: "#/anyOf/0/const", keyword: "const", params: { allowedValue: "L" }, message: "must be equal to constant" };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      var _valid0 = _errs1 === errors;
      valid0 = valid0 || _valid0;
      if (!valid0) {
        const _errs3 = errors;
        if (typeof data !== "string") {
          const err2 = { instancePath, schemaPath: "#/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if ("M" !== data) {
          const err3 = { instancePath, schemaPath: "#/anyOf/1/const", keyword: "const", params: { allowedValue: "M" }, message: "must be equal to constant" };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        var _valid0 = _errs3 === errors;
        valid0 = valid0 || _valid0;
        if (!valid0) {
          const _errs5 = errors;
          if (typeof data !== "string") {
            const err4 = { instancePath, schemaPath: "#/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
          if ("H" !== data) {
            const err5 = { instancePath, schemaPath: "#/anyOf/2/const", keyword: "const", params: { allowedValue: "H" }, message: "must be equal to constant" };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
          var _valid0 = _errs5 === errors;
          valid0 = valid0 || _valid0;
        }
      }
      if (!valid0) {
        const err6 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
        validate12.errors = vErrors;
        return false;
      } else {
        errors = _errs0;
        if (vErrors !== null) {
          if (_errs0) {
            vErrors.length = _errs0;
          } else {
            vErrors = null;
          }
        }
      }
      validate12.errors = vErrors;
      return errors === 0;
    }
    exports.GradeBand = validate13;
    function validate13(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      const _errs0 = errors;
      let valid0 = false;
      const _errs1 = errors;
      if (typeof data !== "string") {
        const err0 = { instancePath, schemaPath: "#/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      if ("1-2" !== data) {
        const err1 = { instancePath, schemaPath: "#/anyOf/0/const", keyword: "const", params: { allowedValue: "1-2" }, message: "must be equal to constant" };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      var _valid0 = _errs1 === errors;
      valid0 = valid0 || _valid0;
      if (!valid0) {
        const _errs3 = errors;
        if (typeof data !== "string") {
          const err2 = { instancePath, schemaPath: "#/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if ("3-4" !== data) {
          const err3 = { instancePath, schemaPath: "#/anyOf/1/const", keyword: "const", params: { allowedValue: "3-4" }, message: "must be equal to constant" };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        var _valid0 = _errs3 === errors;
        valid0 = valid0 || _valid0;
        if (!valid0) {
          const _errs5 = errors;
          if (typeof data !== "string") {
            const err4 = { instancePath, schemaPath: "#/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
          if ("5-6" !== data) {
            const err5 = { instancePath, schemaPath: "#/anyOf/2/const", keyword: "const", params: { allowedValue: "5-6" }, message: "must be equal to constant" };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
          var _valid0 = _errs5 === errors;
          valid0 = valid0 || _valid0;
        }
      }
      if (!valid0) {
        const err6 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
        validate13.errors = vErrors;
        return false;
      } else {
        errors = _errs0;
        if (vErrors !== null) {
          if (_errs0) {
            vErrors.length = _errs0;
          } else {
            vErrors = null;
          }
        }
      }
      validate13.errors = vErrors;
      return errors === 0;
    }
    exports.EnglishStart = validate14;
    function validate14(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      const _errs0 = errors;
      let valid0 = false;
      const _errs1 = errors;
      if (typeof data !== "string") {
        const err0 = { instancePath, schemaPath: "#/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      if ("new" !== data) {
        const err1 = { instancePath, schemaPath: "#/anyOf/0/const", keyword: "const", params: { allowedValue: "new" }, message: "must be equal to constant" };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      var _valid0 = _errs1 === errors;
      valid0 = valid0 || _valid0;
      if (!valid0) {
        const _errs3 = errors;
        if (typeof data !== "string") {
          const err2 = { instancePath, schemaPath: "#/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if ("words" !== data) {
          const err3 = { instancePath, schemaPath: "#/anyOf/1/const", keyword: "const", params: { allowedValue: "words" }, message: "must be equal to constant" };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        var _valid0 = _errs3 === errors;
        valid0 = valid0 || _valid0;
        if (!valid0) {
          const _errs5 = errors;
          if (typeof data !== "string") {
            const err4 = { instancePath, schemaPath: "#/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
          if ("sentences" !== data) {
            const err5 = { instancePath, schemaPath: "#/anyOf/2/const", keyword: "const", params: { allowedValue: "sentences" }, message: "must be equal to constant" };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
          var _valid0 = _errs5 === errors;
          valid0 = valid0 || _valid0;
        }
      }
      if (!valid0) {
        const err6 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
        validate14.errors = vErrors;
        return false;
      } else {
        errors = _errs0;
        if (vErrors !== null) {
          if (_errs0) {
            vErrors.length = _errs0;
          } else {
            vErrors = null;
          }
        }
      }
      validate14.errors = vErrors;
      return errors === 0;
    }
    exports.ExerciseType = validate15;
    function validate15(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      const _errs0 = errors;
      let valid0 = false;
      const _errs1 = errors;
      if (typeof data !== "string") {
        const err0 = { instancePath, schemaPath: "#/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      if ("choice" !== data) {
        const err1 = { instancePath, schemaPath: "#/anyOf/0/const", keyword: "const", params: { allowedValue: "choice" }, message: "must be equal to constant" };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      var _valid0 = _errs1 === errors;
      valid0 = valid0 || _valid0;
      if (!valid0) {
        const _errs3 = errors;
        if (typeof data !== "string") {
          const err2 = { instancePath, schemaPath: "#/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if ("match" !== data) {
          const err3 = { instancePath, schemaPath: "#/anyOf/1/const", keyword: "const", params: { allowedValue: "match" }, message: "must be equal to constant" };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        var _valid0 = _errs3 === errors;
        valid0 = valid0 || _valid0;
        if (!valid0) {
          const _errs5 = errors;
          if (typeof data !== "string") {
            const err4 = { instancePath, schemaPath: "#/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
          if ("cloze" !== data) {
            const err5 = { instancePath, schemaPath: "#/anyOf/2/const", keyword: "const", params: { allowedValue: "cloze" }, message: "must be equal to constant" };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
          var _valid0 = _errs5 === errors;
          valid0 = valid0 || _valid0;
        }
      }
      if (!valid0) {
        const err6 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
        validate15.errors = vErrors;
        return false;
      } else {
        errors = _errs0;
        if (vErrors !== null) {
          if (_errs0) {
            vErrors.length = _errs0;
          } else {
            vErrors = null;
          }
        }
      }
      validate15.errors = vErrors;
      return errors === 0;
    }
    exports.SourceType = validate16;
    function validate16(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      const _errs0 = errors;
      let valid0 = false;
      const _errs1 = errors;
      if (typeof data !== "string") {
        const err0 = { instancePath, schemaPath: "#/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      if ("custom" !== data) {
        const err1 = { instancePath, schemaPath: "#/anyOf/0/const", keyword: "const", params: { allowedValue: "custom" }, message: "must be equal to constant" };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      var _valid0 = _errs1 === errors;
      valid0 = valid0 || _valid0;
      if (!valid0) {
        const _errs3 = errors;
        if (typeof data !== "string") {
          const err2 = { instancePath, schemaPath: "#/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if ("sample" !== data) {
          const err3 = { instancePath, schemaPath: "#/anyOf/1/const", keyword: "const", params: { allowedValue: "sample" }, message: "must be equal to constant" };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        var _valid0 = _errs3 === errors;
        valid0 = valid0 || _valid0;
      }
      if (!valid0) {
        const err4 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
        if (vErrors === null) {
          vErrors = [err4];
        } else {
          vErrors.push(err4);
        }
        errors++;
        validate16.errors = vErrors;
        return false;
      } else {
        errors = _errs0;
        if (vErrors !== null) {
          if (_errs0) {
            vErrors.length = _errs0;
          } else {
            vErrors = null;
          }
        }
      }
      validate16.errors = vErrors;
      return errors === 0;
    }
    exports.SafetyStatus = validate17;
    function validate17(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      const _errs0 = errors;
      let valid0 = false;
      const _errs1 = errors;
      if (typeof data !== "string") {
        const err0 = { instancePath, schemaPath: "#/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      if ("unknown" !== data) {
        const err1 = { instancePath, schemaPath: "#/anyOf/0/const", keyword: "const", params: { allowedValue: "unknown" }, message: "must be equal to constant" };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      var _valid0 = _errs1 === errors;
      valid0 = valid0 || _valid0;
      if (!valid0) {
        const _errs3 = errors;
        if (typeof data !== "string") {
          const err2 = { instancePath, schemaPath: "#/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if ("pass" !== data) {
          const err3 = { instancePath, schemaPath: "#/anyOf/1/const", keyword: "const", params: { allowedValue: "pass" }, message: "must be equal to constant" };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        var _valid0 = _errs3 === errors;
        valid0 = valid0 || _valid0;
        if (!valid0) {
          const _errs5 = errors;
          if (typeof data !== "string") {
            const err4 = { instancePath, schemaPath: "#/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
          if ("review" !== data) {
            const err5 = { instancePath, schemaPath: "#/anyOf/2/const", keyword: "const", params: { allowedValue: "review" }, message: "must be equal to constant" };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
          var _valid0 = _errs5 === errors;
          valid0 = valid0 || _valid0;
          if (!valid0) {
            const _errs7 = errors;
            if (typeof data !== "string") {
              const err6 = { instancePath, schemaPath: "#/anyOf/3/type", keyword: "type", params: { type: "string" }, message: "must be string" };
              if (vErrors === null) {
                vErrors = [err6];
              } else {
                vErrors.push(err6);
              }
              errors++;
            }
            if ("reject" !== data) {
              const err7 = { instancePath, schemaPath: "#/anyOf/3/const", keyword: "const", params: { allowedValue: "reject" }, message: "must be equal to constant" };
              if (vErrors === null) {
                vErrors = [err7];
              } else {
                vErrors.push(err7);
              }
              errors++;
            }
            var _valid0 = _errs7 === errors;
            valid0 = valid0 || _valid0;
            if (!valid0) {
              const _errs9 = errors;
              if (typeof data !== "string") {
                const err8 = { instancePath, schemaPath: "#/anyOf/4/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err8];
                } else {
                  vErrors.push(err8);
                }
                errors++;
              }
              if ("timeout" !== data) {
                const err9 = { instancePath, schemaPath: "#/anyOf/4/const", keyword: "const", params: { allowedValue: "timeout" }, message: "must be equal to constant" };
                if (vErrors === null) {
                  vErrors = [err9];
                } else {
                  vErrors.push(err9);
                }
                errors++;
              }
              var _valid0 = _errs9 === errors;
              valid0 = valid0 || _valid0;
            }
          }
        }
      }
      if (!valid0) {
        const err10 = { instancePath, schemaPath: "#/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
        if (vErrors === null) {
          vErrors = [err10];
        } else {
          vErrors.push(err10);
        }
        errors++;
        validate17.errors = vErrors;
        return false;
      } else {
        errors = _errs0;
        if (vErrors !== null) {
          if (_errs0) {
            vErrors.length = _errs0;
          } else {
            vErrors = null;
          }
        }
      }
      validate17.errors = vErrors;
      return errors === 0;
    }
    exports.CourseSettings = validate18;
    var pattern1 = new RegExp("\\S", "u");
    function validate18(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (errors === 0) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
          let missing0;
          if (data.gradeBand === void 0 && (missing0 = "gradeBand") || data.englishStart === void 0 && (missing0 = "englishStart") || data.difficulty === void 0 && (missing0 = "difficulty") || data.showChinese === void 0 && (missing0 = "showChinese") || data.volume === void 0 && (missing0 = "volume") || data.reduceMotion === void 0 && (missing0 = "reduceMotion") || data.reviewWordKeys === void 0 && (missing0 = "reviewWordKeys")) {
            validate18.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
            return false;
          } else {
            const _errs1 = errors;
            for (const key0 in data) {
              if (!(key0 === "gradeBand" || key0 === "englishStart" || key0 === "difficulty" || key0 === "showChinese" || key0 === "volume" || key0 === "reduceMotion" || key0 === "reviewWordKeys")) {
                validate18.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
                return false;
                break;
              }
            }
            if (_errs1 === errors) {
              if (data.gradeBand !== void 0) {
                let data0 = data.gradeBand;
                const _errs2 = errors;
                const _errs3 = errors;
                let valid1 = false;
                const _errs4 = errors;
                if (typeof data0 !== "string") {
                  const err0 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                  if (vErrors === null) {
                    vErrors = [err0];
                  } else {
                    vErrors.push(err0);
                  }
                  errors++;
                }
                if ("1-2" !== data0) {
                  const err1 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/0/const", keyword: "const", params: { allowedValue: "1-2" }, message: "must be equal to constant" };
                  if (vErrors === null) {
                    vErrors = [err1];
                  } else {
                    vErrors.push(err1);
                  }
                  errors++;
                }
                var _valid0 = _errs4 === errors;
                valid1 = valid1 || _valid0;
                if (!valid1) {
                  const _errs6 = errors;
                  if (typeof data0 !== "string") {
                    const err2 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err2];
                    } else {
                      vErrors.push(err2);
                    }
                    errors++;
                  }
                  if ("3-4" !== data0) {
                    const err3 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/1/const", keyword: "const", params: { allowedValue: "3-4" }, message: "must be equal to constant" };
                    if (vErrors === null) {
                      vErrors = [err3];
                    } else {
                      vErrors.push(err3);
                    }
                    errors++;
                  }
                  var _valid0 = _errs6 === errors;
                  valid1 = valid1 || _valid0;
                  if (!valid1) {
                    const _errs8 = errors;
                    if (typeof data0 !== "string") {
                      const err4 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err4];
                      } else {
                        vErrors.push(err4);
                      }
                      errors++;
                    }
                    if ("5-6" !== data0) {
                      const err5 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/2/const", keyword: "const", params: { allowedValue: "5-6" }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err5];
                      } else {
                        vErrors.push(err5);
                      }
                      errors++;
                    }
                    var _valid0 = _errs8 === errors;
                    valid1 = valid1 || _valid0;
                  }
                }
                if (!valid1) {
                  const err6 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                  if (vErrors === null) {
                    vErrors = [err6];
                  } else {
                    vErrors.push(err6);
                  }
                  errors++;
                  validate18.errors = vErrors;
                  return false;
                } else {
                  errors = _errs3;
                  if (vErrors !== null) {
                    if (_errs3) {
                      vErrors.length = _errs3;
                    } else {
                      vErrors = null;
                    }
                  }
                }
                var valid0 = _errs2 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.englishStart !== void 0) {
                  let data1 = data.englishStart;
                  const _errs10 = errors;
                  const _errs11 = errors;
                  let valid2 = false;
                  const _errs12 = errors;
                  if (typeof data1 !== "string") {
                    const err7 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err7];
                    } else {
                      vErrors.push(err7);
                    }
                    errors++;
                  }
                  if ("new" !== data1) {
                    const err8 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/0/const", keyword: "const", params: { allowedValue: "new" }, message: "must be equal to constant" };
                    if (vErrors === null) {
                      vErrors = [err8];
                    } else {
                      vErrors.push(err8);
                    }
                    errors++;
                  }
                  var _valid1 = _errs12 === errors;
                  valid2 = valid2 || _valid1;
                  if (!valid2) {
                    const _errs14 = errors;
                    if (typeof data1 !== "string") {
                      const err9 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err9];
                      } else {
                        vErrors.push(err9);
                      }
                      errors++;
                    }
                    if ("words" !== data1) {
                      const err10 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/1/const", keyword: "const", params: { allowedValue: "words" }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err10];
                      } else {
                        vErrors.push(err10);
                      }
                      errors++;
                    }
                    var _valid1 = _errs14 === errors;
                    valid2 = valid2 || _valid1;
                    if (!valid2) {
                      const _errs16 = errors;
                      if (typeof data1 !== "string") {
                        const err11 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err11];
                        } else {
                          vErrors.push(err11);
                        }
                        errors++;
                      }
                      if ("sentences" !== data1) {
                        const err12 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/2/const", keyword: "const", params: { allowedValue: "sentences" }, message: "must be equal to constant" };
                        if (vErrors === null) {
                          vErrors = [err12];
                        } else {
                          vErrors.push(err12);
                        }
                        errors++;
                      }
                      var _valid1 = _errs16 === errors;
                      valid2 = valid2 || _valid1;
                    }
                  }
                  if (!valid2) {
                    const err13 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                    if (vErrors === null) {
                      vErrors = [err13];
                    } else {
                      vErrors.push(err13);
                    }
                    errors++;
                    validate18.errors = vErrors;
                    return false;
                  } else {
                    errors = _errs11;
                    if (vErrors !== null) {
                      if (_errs11) {
                        vErrors.length = _errs11;
                      } else {
                        vErrors = null;
                      }
                    }
                  }
                  var valid0 = _errs10 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.difficulty !== void 0) {
                    let data2 = data.difficulty;
                    const _errs18 = errors;
                    const _errs19 = errors;
                    let valid3 = false;
                    const _errs20 = errors;
                    if (typeof data2 !== "string") {
                      const err14 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err14];
                      } else {
                        vErrors.push(err14);
                      }
                      errors++;
                    }
                    if ("L" !== data2) {
                      const err15 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/0/const", keyword: "const", params: { allowedValue: "L" }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err15];
                      } else {
                        vErrors.push(err15);
                      }
                      errors++;
                    }
                    var _valid2 = _errs20 === errors;
                    valid3 = valid3 || _valid2;
                    if (!valid3) {
                      const _errs22 = errors;
                      if (typeof data2 !== "string") {
                        const err16 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err16];
                        } else {
                          vErrors.push(err16);
                        }
                        errors++;
                      }
                      if ("M" !== data2) {
                        const err17 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/1/const", keyword: "const", params: { allowedValue: "M" }, message: "must be equal to constant" };
                        if (vErrors === null) {
                          vErrors = [err17];
                        } else {
                          vErrors.push(err17);
                        }
                        errors++;
                      }
                      var _valid2 = _errs22 === errors;
                      valid3 = valid3 || _valid2;
                      if (!valid3) {
                        const _errs24 = errors;
                        if (typeof data2 !== "string") {
                          const err18 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                          if (vErrors === null) {
                            vErrors = [err18];
                          } else {
                            vErrors.push(err18);
                          }
                          errors++;
                        }
                        if ("H" !== data2) {
                          const err19 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/2/const", keyword: "const", params: { allowedValue: "H" }, message: "must be equal to constant" };
                          if (vErrors === null) {
                            vErrors = [err19];
                          } else {
                            vErrors.push(err19);
                          }
                          errors++;
                        }
                        var _valid2 = _errs24 === errors;
                        valid3 = valid3 || _valid2;
                      }
                    }
                    if (!valid3) {
                      const err20 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                      if (vErrors === null) {
                        vErrors = [err20];
                      } else {
                        vErrors.push(err20);
                      }
                      errors++;
                      validate18.errors = vErrors;
                      return false;
                    } else {
                      errors = _errs19;
                      if (vErrors !== null) {
                        if (_errs19) {
                          vErrors.length = _errs19;
                        } else {
                          vErrors = null;
                        }
                      }
                    }
                    var valid0 = _errs18 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.showChinese !== void 0) {
                      const _errs26 = errors;
                      if (typeof data.showChinese !== "boolean") {
                        validate18.errors = [{ instancePath: instancePath + "/showChinese", schemaPath: "#/properties/showChinese/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                        return false;
                      }
                      var valid0 = _errs26 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.volume !== void 0) {
                        let data4 = data.volume;
                        const _errs28 = errors;
                        if (errors === _errs28) {
                          if (typeof data4 == "number" && isFinite(data4)) {
                            if (data4 > 1 || isNaN(data4)) {
                              validate18.errors = [{ instancePath: instancePath + "/volume", schemaPath: "#/properties/volume/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1 }, message: "must be <= 1" }];
                              return false;
                            } else {
                              if (data4 < 0 || isNaN(data4)) {
                                validate18.errors = [{ instancePath: instancePath + "/volume", schemaPath: "#/properties/volume/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                return false;
                              }
                            }
                          } else {
                            validate18.errors = [{ instancePath: instancePath + "/volume", schemaPath: "#/properties/volume/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                            return false;
                          }
                        }
                        var valid0 = _errs28 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.reduceMotion !== void 0) {
                          const _errs30 = errors;
                          if (typeof data.reduceMotion !== "boolean") {
                            validate18.errors = [{ instancePath: instancePath + "/reduceMotion", schemaPath: "#/properties/reduceMotion/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                            return false;
                          }
                          var valid0 = _errs30 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.reviewWordKeys !== void 0) {
                            let data6 = data.reviewWordKeys;
                            const _errs32 = errors;
                            if (errors === _errs32) {
                              if (Array.isArray(data6)) {
                                if (data6.length > 3) {
                                  validate18.errors = [{ instancePath: instancePath + "/reviewWordKeys", schemaPath: "#/properties/reviewWordKeys/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                  return false;
                                } else {
                                  var valid4 = true;
                                  const len0 = data6.length;
                                  for (let i0 = 0; i0 < len0; i0++) {
                                    let data7 = data6[i0];
                                    const _errs34 = errors;
                                    if (errors === _errs34) {
                                      if (typeof data7 === "string") {
                                        if (func2(data7) > 200) {
                                          validate18.errors = [{ instancePath: instancePath + "/reviewWordKeys/" + i0, schemaPath: "#/properties/reviewWordKeys/items/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" }];
                                          return false;
                                        } else {
                                          if (func2(data7) < 1) {
                                            validate18.errors = [{ instancePath: instancePath + "/reviewWordKeys/" + i0, schemaPath: "#/properties/reviewWordKeys/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                            return false;
                                          } else {
                                            if (!pattern1.test(data7)) {
                                              validate18.errors = [{ instancePath: instancePath + "/reviewWordKeys/" + i0, schemaPath: "#/properties/reviewWordKeys/items/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                                              return false;
                                            }
                                          }
                                        }
                                      } else {
                                        validate18.errors = [{ instancePath: instancePath + "/reviewWordKeys/" + i0, schemaPath: "#/properties/reviewWordKeys/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                        return false;
                                      }
                                    }
                                    var valid4 = _errs34 === errors;
                                    if (!valid4) {
                                      break;
                                    }
                                  }
                                  if (valid4) {
                                    let i1 = data6.length;
                                    let j0;
                                    if (i1 > 1) {
                                      const indices0 = {};
                                      for (; i1--; ) {
                                        let item0 = data6[i1];
                                        if (typeof item0 !== "string") {
                                          continue;
                                        }
                                        if (typeof indices0[item0] == "number") {
                                          j0 = indices0[item0];
                                          validate18.errors = [{ instancePath: instancePath + "/reviewWordKeys", schemaPath: "#/properties/reviewWordKeys/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" }];
                                          return false;
                                          break;
                                        }
                                        indices0[item0] = i1;
                                      }
                                    }
                                  }
                                }
                              } else {
                                validate18.errors = [{ instancePath: instancePath + "/reviewWordKeys", schemaPath: "#/properties/reviewWordKeys/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                return false;
                              }
                            }
                            var valid0 = _errs32 === errors;
                          } else {
                            var valid0 = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          validate18.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
          return false;
        }
      }
      validate18.errors = vErrors;
      return errors === 0;
    }
    exports.SettingsSnapshot = validate19;
    var schema20 = { "type": "object", "required": ["gradeBand", "englishStart", "difficulty", "showChinese", "volume", "reduceMotion", "reviewWordKeys", "focusVocabIds", "adoptedSuggestionId"], "properties": { "gradeBand": { "anyOf": [{ "type": "string", "const": "1-2" }, { "type": "string", "const": "3-4" }, { "type": "string", "const": "5-6" }] }, "englishStart": { "anyOf": [{ "type": "string", "const": "new" }, { "type": "string", "const": "words" }, { "type": "string", "const": "sentences" }] }, "difficulty": { "anyOf": [{ "type": "string", "const": "L" }, { "type": "string", "const": "M" }, { "type": "string", "const": "H" }] }, "showChinese": { "type": "boolean" }, "volume": { "type": "number", "minimum": 0, "maximum": 1 }, "reduceMotion": { "type": "boolean" }, "reviewWordKeys": { "type": "array", "items": { "type": "string", "minLength": 1, "maxLength": 200, "pattern": "\\S" }, "maxItems": 3, "uniqueItems": true }, "focusVocabIds": { "anyOf": [{ "type": "array", "items": { "type": "string", "format": "uuid", "minLength": 36, "maxLength": 36 }, "maxItems": 0 }, { "type": "array", "items": { "type": "string", "format": "uuid", "minLength": 36, "maxLength": 36 }, "minItems": 2, "maxItems": 3, "uniqueItems": true }] }, "adoptedSuggestionId": { "anyOf": [{ "type": "string", "format": "uuid", "minLength": 36, "maxLength": 36 }, { "type": "null" }] } }, "additionalProperties": false };
    var func7 = Object.prototype.hasOwnProperty;
    function validate19(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (errors === 0) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
          let missing0;
          if (data.gradeBand === void 0 && (missing0 = "gradeBand") || data.englishStart === void 0 && (missing0 = "englishStart") || data.difficulty === void 0 && (missing0 = "difficulty") || data.showChinese === void 0 && (missing0 = "showChinese") || data.volume === void 0 && (missing0 = "volume") || data.reduceMotion === void 0 && (missing0 = "reduceMotion") || data.reviewWordKeys === void 0 && (missing0 = "reviewWordKeys") || data.focusVocabIds === void 0 && (missing0 = "focusVocabIds") || data.adoptedSuggestionId === void 0 && (missing0 = "adoptedSuggestionId")) {
            validate19.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
            return false;
          } else {
            const _errs1 = errors;
            for (const key0 in data) {
              if (!func7.call(schema20.properties, key0)) {
                validate19.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
                return false;
                break;
              }
            }
            if (_errs1 === errors) {
              if (data.gradeBand !== void 0) {
                let data0 = data.gradeBand;
                const _errs2 = errors;
                const _errs3 = errors;
                let valid1 = false;
                const _errs4 = errors;
                if (typeof data0 !== "string") {
                  const err0 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                  if (vErrors === null) {
                    vErrors = [err0];
                  } else {
                    vErrors.push(err0);
                  }
                  errors++;
                }
                if ("1-2" !== data0) {
                  const err1 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/0/const", keyword: "const", params: { allowedValue: "1-2" }, message: "must be equal to constant" };
                  if (vErrors === null) {
                    vErrors = [err1];
                  } else {
                    vErrors.push(err1);
                  }
                  errors++;
                }
                var _valid0 = _errs4 === errors;
                valid1 = valid1 || _valid0;
                if (!valid1) {
                  const _errs6 = errors;
                  if (typeof data0 !== "string") {
                    const err2 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err2];
                    } else {
                      vErrors.push(err2);
                    }
                    errors++;
                  }
                  if ("3-4" !== data0) {
                    const err3 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/1/const", keyword: "const", params: { allowedValue: "3-4" }, message: "must be equal to constant" };
                    if (vErrors === null) {
                      vErrors = [err3];
                    } else {
                      vErrors.push(err3);
                    }
                    errors++;
                  }
                  var _valid0 = _errs6 === errors;
                  valid1 = valid1 || _valid0;
                  if (!valid1) {
                    const _errs8 = errors;
                    if (typeof data0 !== "string") {
                      const err4 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err4];
                      } else {
                        vErrors.push(err4);
                      }
                      errors++;
                    }
                    if ("5-6" !== data0) {
                      const err5 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf/2/const", keyword: "const", params: { allowedValue: "5-6" }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err5];
                      } else {
                        vErrors.push(err5);
                      }
                      errors++;
                    }
                    var _valid0 = _errs8 === errors;
                    valid1 = valid1 || _valid0;
                  }
                }
                if (!valid1) {
                  const err6 = { instancePath: instancePath + "/gradeBand", schemaPath: "#/properties/gradeBand/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                  if (vErrors === null) {
                    vErrors = [err6];
                  } else {
                    vErrors.push(err6);
                  }
                  errors++;
                  validate19.errors = vErrors;
                  return false;
                } else {
                  errors = _errs3;
                  if (vErrors !== null) {
                    if (_errs3) {
                      vErrors.length = _errs3;
                    } else {
                      vErrors = null;
                    }
                  }
                }
                var valid0 = _errs2 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.englishStart !== void 0) {
                  let data1 = data.englishStart;
                  const _errs10 = errors;
                  const _errs11 = errors;
                  let valid2 = false;
                  const _errs12 = errors;
                  if (typeof data1 !== "string") {
                    const err7 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err7];
                    } else {
                      vErrors.push(err7);
                    }
                    errors++;
                  }
                  if ("new" !== data1) {
                    const err8 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/0/const", keyword: "const", params: { allowedValue: "new" }, message: "must be equal to constant" };
                    if (vErrors === null) {
                      vErrors = [err8];
                    } else {
                      vErrors.push(err8);
                    }
                    errors++;
                  }
                  var _valid1 = _errs12 === errors;
                  valid2 = valid2 || _valid1;
                  if (!valid2) {
                    const _errs14 = errors;
                    if (typeof data1 !== "string") {
                      const err9 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err9];
                      } else {
                        vErrors.push(err9);
                      }
                      errors++;
                    }
                    if ("words" !== data1) {
                      const err10 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/1/const", keyword: "const", params: { allowedValue: "words" }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err10];
                      } else {
                        vErrors.push(err10);
                      }
                      errors++;
                    }
                    var _valid1 = _errs14 === errors;
                    valid2 = valid2 || _valid1;
                    if (!valid2) {
                      const _errs16 = errors;
                      if (typeof data1 !== "string") {
                        const err11 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err11];
                        } else {
                          vErrors.push(err11);
                        }
                        errors++;
                      }
                      if ("sentences" !== data1) {
                        const err12 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf/2/const", keyword: "const", params: { allowedValue: "sentences" }, message: "must be equal to constant" };
                        if (vErrors === null) {
                          vErrors = [err12];
                        } else {
                          vErrors.push(err12);
                        }
                        errors++;
                      }
                      var _valid1 = _errs16 === errors;
                      valid2 = valid2 || _valid1;
                    }
                  }
                  if (!valid2) {
                    const err13 = { instancePath: instancePath + "/englishStart", schemaPath: "#/properties/englishStart/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                    if (vErrors === null) {
                      vErrors = [err13];
                    } else {
                      vErrors.push(err13);
                    }
                    errors++;
                    validate19.errors = vErrors;
                    return false;
                  } else {
                    errors = _errs11;
                    if (vErrors !== null) {
                      if (_errs11) {
                        vErrors.length = _errs11;
                      } else {
                        vErrors = null;
                      }
                    }
                  }
                  var valid0 = _errs10 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.difficulty !== void 0) {
                    let data2 = data.difficulty;
                    const _errs18 = errors;
                    const _errs19 = errors;
                    let valid3 = false;
                    const _errs20 = errors;
                    if (typeof data2 !== "string") {
                      const err14 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err14];
                      } else {
                        vErrors.push(err14);
                      }
                      errors++;
                    }
                    if ("L" !== data2) {
                      const err15 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/0/const", keyword: "const", params: { allowedValue: "L" }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err15];
                      } else {
                        vErrors.push(err15);
                      }
                      errors++;
                    }
                    var _valid2 = _errs20 === errors;
                    valid3 = valid3 || _valid2;
                    if (!valid3) {
                      const _errs22 = errors;
                      if (typeof data2 !== "string") {
                        const err16 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err16];
                        } else {
                          vErrors.push(err16);
                        }
                        errors++;
                      }
                      if ("M" !== data2) {
                        const err17 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/1/const", keyword: "const", params: { allowedValue: "M" }, message: "must be equal to constant" };
                        if (vErrors === null) {
                          vErrors = [err17];
                        } else {
                          vErrors.push(err17);
                        }
                        errors++;
                      }
                      var _valid2 = _errs22 === errors;
                      valid3 = valid3 || _valid2;
                      if (!valid3) {
                        const _errs24 = errors;
                        if (typeof data2 !== "string") {
                          const err18 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                          if (vErrors === null) {
                            vErrors = [err18];
                          } else {
                            vErrors.push(err18);
                          }
                          errors++;
                        }
                        if ("H" !== data2) {
                          const err19 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/2/const", keyword: "const", params: { allowedValue: "H" }, message: "must be equal to constant" };
                          if (vErrors === null) {
                            vErrors = [err19];
                          } else {
                            vErrors.push(err19);
                          }
                          errors++;
                        }
                        var _valid2 = _errs24 === errors;
                        valid3 = valid3 || _valid2;
                      }
                    }
                    if (!valid3) {
                      const err20 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                      if (vErrors === null) {
                        vErrors = [err20];
                      } else {
                        vErrors.push(err20);
                      }
                      errors++;
                      validate19.errors = vErrors;
                      return false;
                    } else {
                      errors = _errs19;
                      if (vErrors !== null) {
                        if (_errs19) {
                          vErrors.length = _errs19;
                        } else {
                          vErrors = null;
                        }
                      }
                    }
                    var valid0 = _errs18 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.showChinese !== void 0) {
                      const _errs26 = errors;
                      if (typeof data.showChinese !== "boolean") {
                        validate19.errors = [{ instancePath: instancePath + "/showChinese", schemaPath: "#/properties/showChinese/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                        return false;
                      }
                      var valid0 = _errs26 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.volume !== void 0) {
                        let data4 = data.volume;
                        const _errs28 = errors;
                        if (errors === _errs28) {
                          if (typeof data4 == "number" && isFinite(data4)) {
                            if (data4 > 1 || isNaN(data4)) {
                              validate19.errors = [{ instancePath: instancePath + "/volume", schemaPath: "#/properties/volume/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1 }, message: "must be <= 1" }];
                              return false;
                            } else {
                              if (data4 < 0 || isNaN(data4)) {
                                validate19.errors = [{ instancePath: instancePath + "/volume", schemaPath: "#/properties/volume/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" }];
                                return false;
                              }
                            }
                          } else {
                            validate19.errors = [{ instancePath: instancePath + "/volume", schemaPath: "#/properties/volume/type", keyword: "type", params: { type: "number" }, message: "must be number" }];
                            return false;
                          }
                        }
                        var valid0 = _errs28 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.reduceMotion !== void 0) {
                          const _errs30 = errors;
                          if (typeof data.reduceMotion !== "boolean") {
                            validate19.errors = [{ instancePath: instancePath + "/reduceMotion", schemaPath: "#/properties/reduceMotion/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                            return false;
                          }
                          var valid0 = _errs30 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.reviewWordKeys !== void 0) {
                            let data6 = data.reviewWordKeys;
                            const _errs32 = errors;
                            if (errors === _errs32) {
                              if (Array.isArray(data6)) {
                                if (data6.length > 3) {
                                  validate19.errors = [{ instancePath: instancePath + "/reviewWordKeys", schemaPath: "#/properties/reviewWordKeys/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                  return false;
                                } else {
                                  var valid4 = true;
                                  const len0 = data6.length;
                                  for (let i0 = 0; i0 < len0; i0++) {
                                    let data7 = data6[i0];
                                    const _errs34 = errors;
                                    if (errors === _errs34) {
                                      if (typeof data7 === "string") {
                                        if (func2(data7) > 200) {
                                          validate19.errors = [{ instancePath: instancePath + "/reviewWordKeys/" + i0, schemaPath: "#/properties/reviewWordKeys/items/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" }];
                                          return false;
                                        } else {
                                          if (func2(data7) < 1) {
                                            validate19.errors = [{ instancePath: instancePath + "/reviewWordKeys/" + i0, schemaPath: "#/properties/reviewWordKeys/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                            return false;
                                          } else {
                                            if (!pattern1.test(data7)) {
                                              validate19.errors = [{ instancePath: instancePath + "/reviewWordKeys/" + i0, schemaPath: "#/properties/reviewWordKeys/items/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                                              return false;
                                            }
                                          }
                                        }
                                      } else {
                                        validate19.errors = [{ instancePath: instancePath + "/reviewWordKeys/" + i0, schemaPath: "#/properties/reviewWordKeys/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                        return false;
                                      }
                                    }
                                    var valid4 = _errs34 === errors;
                                    if (!valid4) {
                                      break;
                                    }
                                  }
                                  if (valid4) {
                                    let i1 = data6.length;
                                    let j0;
                                    if (i1 > 1) {
                                      const indices0 = {};
                                      for (; i1--; ) {
                                        let item0 = data6[i1];
                                        if (typeof item0 !== "string") {
                                          continue;
                                        }
                                        if (typeof indices0[item0] == "number") {
                                          j0 = indices0[item0];
                                          validate19.errors = [{ instancePath: instancePath + "/reviewWordKeys", schemaPath: "#/properties/reviewWordKeys/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" }];
                                          return false;
                                          break;
                                        }
                                        indices0[item0] = i1;
                                      }
                                    }
                                  }
                                }
                              } else {
                                validate19.errors = [{ instancePath: instancePath + "/reviewWordKeys", schemaPath: "#/properties/reviewWordKeys/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                return false;
                              }
                            }
                            var valid0 = _errs32 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.focusVocabIds !== void 0) {
                              let data8 = data.focusVocabIds;
                              const _errs36 = errors;
                              const _errs37 = errors;
                              let valid6 = false;
                              const _errs38 = errors;
                              if (errors === _errs38) {
                                if (Array.isArray(data8)) {
                                  if (data8.length > 0) {
                                    const err21 = { instancePath: instancePath + "/focusVocabIds", schemaPath: "#/properties/focusVocabIds/anyOf/0/maxItems", keyword: "maxItems", params: { limit: 0 }, message: "must NOT have more than 0 items" };
                                    if (vErrors === null) {
                                      vErrors = [err21];
                                    } else {
                                      vErrors.push(err21);
                                    }
                                    errors++;
                                  } else {
                                    var valid7 = true;
                                    const len1 = data8.length;
                                    for (let i2 = 0; i2 < len1; i2++) {
                                      let data9 = data8[i2];
                                      const _errs40 = errors;
                                      if (errors === _errs40) {
                                        if (errors === _errs40) {
                                          if (typeof data9 === "string") {
                                            if (func2(data9) > 36) {
                                              const err22 = { instancePath: instancePath + "/focusVocabIds/" + i2, schemaPath: "#/properties/focusVocabIds/anyOf/0/items/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                              if (vErrors === null) {
                                                vErrors = [err22];
                                              } else {
                                                vErrors.push(err22);
                                              }
                                              errors++;
                                            } else {
                                              if (func2(data9) < 36) {
                                                const err23 = { instancePath: instancePath + "/focusVocabIds/" + i2, schemaPath: "#/properties/focusVocabIds/anyOf/0/items/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                if (vErrors === null) {
                                                  vErrors = [err23];
                                                } else {
                                                  vErrors.push(err23);
                                                }
                                                errors++;
                                              } else {
                                                if (!formats0.test(data9)) {
                                                  const err24 = { instancePath: instancePath + "/focusVocabIds/" + i2, schemaPath: "#/properties/focusVocabIds/anyOf/0/items/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                  if (vErrors === null) {
                                                    vErrors = [err24];
                                                  } else {
                                                    vErrors.push(err24);
                                                  }
                                                  errors++;
                                                }
                                              }
                                            }
                                          } else {
                                            const err25 = { instancePath: instancePath + "/focusVocabIds/" + i2, schemaPath: "#/properties/focusVocabIds/anyOf/0/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                            if (vErrors === null) {
                                              vErrors = [err25];
                                            } else {
                                              vErrors.push(err25);
                                            }
                                            errors++;
                                          }
                                        }
                                      }
                                      var valid7 = _errs40 === errors;
                                      if (!valid7) {
                                        break;
                                      }
                                    }
                                  }
                                } else {
                                  const err26 = { instancePath: instancePath + "/focusVocabIds", schemaPath: "#/properties/focusVocabIds/anyOf/0/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                  if (vErrors === null) {
                                    vErrors = [err26];
                                  } else {
                                    vErrors.push(err26);
                                  }
                                  errors++;
                                }
                              }
                              var _valid3 = _errs38 === errors;
                              valid6 = valid6 || _valid3;
                              if (!valid6) {
                                const _errs42 = errors;
                                if (errors === _errs42) {
                                  if (Array.isArray(data8)) {
                                    if (data8.length > 3) {
                                      const err27 = { instancePath: instancePath + "/focusVocabIds", schemaPath: "#/properties/focusVocabIds/anyOf/1/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                      if (vErrors === null) {
                                        vErrors = [err27];
                                      } else {
                                        vErrors.push(err27);
                                      }
                                      errors++;
                                    } else {
                                      if (data8.length < 2) {
                                        const err28 = { instancePath: instancePath + "/focusVocabIds", schemaPath: "#/properties/focusVocabIds/anyOf/1/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" };
                                        if (vErrors === null) {
                                          vErrors = [err28];
                                        } else {
                                          vErrors.push(err28);
                                        }
                                        errors++;
                                      } else {
                                        var valid8 = true;
                                        const len2 = data8.length;
                                        for (let i3 = 0; i3 < len2; i3++) {
                                          let data10 = data8[i3];
                                          const _errs44 = errors;
                                          if (errors === _errs44) {
                                            if (errors === _errs44) {
                                              if (typeof data10 === "string") {
                                                if (func2(data10) > 36) {
                                                  const err29 = { instancePath: instancePath + "/focusVocabIds/" + i3, schemaPath: "#/properties/focusVocabIds/anyOf/1/items/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                  if (vErrors === null) {
                                                    vErrors = [err29];
                                                  } else {
                                                    vErrors.push(err29);
                                                  }
                                                  errors++;
                                                } else {
                                                  if (func2(data10) < 36) {
                                                    const err30 = { instancePath: instancePath + "/focusVocabIds/" + i3, schemaPath: "#/properties/focusVocabIds/anyOf/1/items/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                    if (vErrors === null) {
                                                      vErrors = [err30];
                                                    } else {
                                                      vErrors.push(err30);
                                                    }
                                                    errors++;
                                                  } else {
                                                    if (!formats0.test(data10)) {
                                                      const err31 = { instancePath: instancePath + "/focusVocabIds/" + i3, schemaPath: "#/properties/focusVocabIds/anyOf/1/items/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                      if (vErrors === null) {
                                                        vErrors = [err31];
                                                      } else {
                                                        vErrors.push(err31);
                                                      }
                                                      errors++;
                                                    }
                                                  }
                                                }
                                              } else {
                                                const err32 = { instancePath: instancePath + "/focusVocabIds/" + i3, schemaPath: "#/properties/focusVocabIds/anyOf/1/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                if (vErrors === null) {
                                                  vErrors = [err32];
                                                } else {
                                                  vErrors.push(err32);
                                                }
                                                errors++;
                                              }
                                            }
                                          }
                                          var valid8 = _errs44 === errors;
                                          if (!valid8) {
                                            break;
                                          }
                                        }
                                        if (valid8) {
                                          let i4 = data8.length;
                                          let j1;
                                          if (i4 > 1) {
                                            const indices1 = {};
                                            for (; i4--; ) {
                                              let item1 = data8[i4];
                                              if (typeof item1 !== "string") {
                                                continue;
                                              }
                                              if (typeof indices1[item1] == "number") {
                                                j1 = indices1[item1];
                                                const err33 = { instancePath: instancePath + "/focusVocabIds", schemaPath: "#/properties/focusVocabIds/anyOf/1/uniqueItems", keyword: "uniqueItems", params: { i: i4, j: j1 }, message: "must NOT have duplicate items (items ## " + j1 + " and " + i4 + " are identical)" };
                                                if (vErrors === null) {
                                                  vErrors = [err33];
                                                } else {
                                                  vErrors.push(err33);
                                                }
                                                errors++;
                                                break;
                                              }
                                              indices1[item1] = i4;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    const err34 = { instancePath: instancePath + "/focusVocabIds", schemaPath: "#/properties/focusVocabIds/anyOf/1/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                    if (vErrors === null) {
                                      vErrors = [err34];
                                    } else {
                                      vErrors.push(err34);
                                    }
                                    errors++;
                                  }
                                }
                                var _valid3 = _errs42 === errors;
                                valid6 = valid6 || _valid3;
                              }
                              if (!valid6) {
                                const err35 = { instancePath: instancePath + "/focusVocabIds", schemaPath: "#/properties/focusVocabIds/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                if (vErrors === null) {
                                  vErrors = [err35];
                                } else {
                                  vErrors.push(err35);
                                }
                                errors++;
                                validate19.errors = vErrors;
                                return false;
                              } else {
                                errors = _errs37;
                                if (vErrors !== null) {
                                  if (_errs37) {
                                    vErrors.length = _errs37;
                                  } else {
                                    vErrors = null;
                                  }
                                }
                              }
                              var valid0 = _errs36 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.adoptedSuggestionId !== void 0) {
                                let data11 = data.adoptedSuggestionId;
                                const _errs46 = errors;
                                const _errs47 = errors;
                                let valid10 = false;
                                const _errs48 = errors;
                                if (errors === _errs48) {
                                  if (errors === _errs48) {
                                    if (typeof data11 === "string") {
                                      if (func2(data11) > 36) {
                                        const err36 = { instancePath: instancePath + "/adoptedSuggestionId", schemaPath: "#/properties/adoptedSuggestionId/anyOf/0/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                        if (vErrors === null) {
                                          vErrors = [err36];
                                        } else {
                                          vErrors.push(err36);
                                        }
                                        errors++;
                                      } else {
                                        if (func2(data11) < 36) {
                                          const err37 = { instancePath: instancePath + "/adoptedSuggestionId", schemaPath: "#/properties/adoptedSuggestionId/anyOf/0/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                          if (vErrors === null) {
                                            vErrors = [err37];
                                          } else {
                                            vErrors.push(err37);
                                          }
                                          errors++;
                                        } else {
                                          if (!formats0.test(data11)) {
                                            const err38 = { instancePath: instancePath + "/adoptedSuggestionId", schemaPath: "#/properties/adoptedSuggestionId/anyOf/0/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                            if (vErrors === null) {
                                              vErrors = [err38];
                                            } else {
                                              vErrors.push(err38);
                                            }
                                            errors++;
                                          }
                                        }
                                      }
                                    } else {
                                      const err39 = { instancePath: instancePath + "/adoptedSuggestionId", schemaPath: "#/properties/adoptedSuggestionId/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                      if (vErrors === null) {
                                        vErrors = [err39];
                                      } else {
                                        vErrors.push(err39);
                                      }
                                      errors++;
                                    }
                                  }
                                }
                                var _valid4 = _errs48 === errors;
                                valid10 = valid10 || _valid4;
                                if (!valid10) {
                                  const _errs50 = errors;
                                  if (data11 !== null) {
                                    const err40 = { instancePath: instancePath + "/adoptedSuggestionId", schemaPath: "#/properties/adoptedSuggestionId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                    if (vErrors === null) {
                                      vErrors = [err40];
                                    } else {
                                      vErrors.push(err40);
                                    }
                                    errors++;
                                  }
                                  var _valid4 = _errs50 === errors;
                                  valid10 = valid10 || _valid4;
                                }
                                if (!valid10) {
                                  const err41 = { instancePath: instancePath + "/adoptedSuggestionId", schemaPath: "#/properties/adoptedSuggestionId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                  if (vErrors === null) {
                                    vErrors = [err41];
                                  } else {
                                    vErrors.push(err41);
                                  }
                                  errors++;
                                  validate19.errors = vErrors;
                                  return false;
                                } else {
                                  errors = _errs47;
                                  if (vErrors !== null) {
                                    if (_errs47) {
                                      vErrors.length = _errs47;
                                    } else {
                                      vErrors = null;
                                    }
                                  }
                                }
                                var valid0 = _errs46 === errors;
                              } else {
                                var valid0 = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          validate19.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
          return false;
        }
      }
      validate19.errors = vErrors;
      return errors === 0;
    }
    exports.Revision = validate20;
    function validate20(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (!(typeof data == "number" && (!(data % 1) && !isNaN(data)) && isFinite(data))) {
        validate20.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
        return false;
      }
      if (errors === 0) {
        if (typeof data == "number" && isFinite(data)) {
          if (data > 9007199254740991 || isNaN(data)) {
            validate20.errors = [{ instancePath, schemaPath: "#/maximum", keyword: "maximum", params: { comparison: "<=", limit: 9007199254740991 }, message: "must be <= 9007199254740991" }];
            return false;
          } else {
            if (data < 1 || isNaN(data)) {
              validate20.errors = [{ instancePath, schemaPath: "#/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" }];
              return false;
            }
          }
        }
      }
      validate20.errors = vErrors;
      return errors === 0;
    }
    exports.ChildLearningMaterial = validate21;
    var func0 = require_equal().default;
    function validate21(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (errors === 0) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
          let missing0;
          if (data.id === void 0 && (missing0 = "id") || data.lessonId === void 0 && (missing0 = "lessonId") || data.difficulty === void 0 && (missing0 = "difficulty") || data.sentences === void 0 && (missing0 = "sentences") || data.vocabCards === void 0 && (missing0 = "vocabCards") || data.exercises === void 0 && (missing0 = "exercises")) {
            validate21.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
            return false;
          } else {
            const _errs1 = errors;
            for (const key0 in data) {
              if (!(key0 === "id" || key0 === "lessonId" || key0 === "difficulty" || key0 === "sentences" || key0 === "vocabCards" || key0 === "exercises")) {
                validate21.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
                return false;
                break;
              }
            }
            if (_errs1 === errors) {
              if (data.id !== void 0) {
                let data0 = data.id;
                const _errs2 = errors;
                if (errors === _errs2) {
                  if (errors === _errs2) {
                    if (typeof data0 === "string") {
                      if (func2(data0) > 36) {
                        validate21.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" }];
                        return false;
                      } else {
                        if (func2(data0) < 36) {
                          validate21.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" }];
                          return false;
                        } else {
                          if (!formats0.test(data0)) {
                            validate21.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' }];
                            return false;
                          }
                        }
                      }
                    } else {
                      validate21.errors = [{ instancePath: instancePath + "/id", schemaPath: "#/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                      return false;
                    }
                  }
                }
                var valid0 = _errs2 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.lessonId !== void 0) {
                  let data1 = data.lessonId;
                  const _errs4 = errors;
                  if (errors === _errs4) {
                    if (errors === _errs4) {
                      if (typeof data1 === "string") {
                        if (func2(data1) > 36) {
                          validate21.errors = [{ instancePath: instancePath + "/lessonId", schemaPath: "#/properties/lessonId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" }];
                          return false;
                        } else {
                          if (func2(data1) < 36) {
                            validate21.errors = [{ instancePath: instancePath + "/lessonId", schemaPath: "#/properties/lessonId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" }];
                            return false;
                          } else {
                            if (!formats0.test(data1)) {
                              validate21.errors = [{ instancePath: instancePath + "/lessonId", schemaPath: "#/properties/lessonId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' }];
                              return false;
                            }
                          }
                        }
                      } else {
                        validate21.errors = [{ instancePath: instancePath + "/lessonId", schemaPath: "#/properties/lessonId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                    }
                  }
                  var valid0 = _errs4 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.difficulty !== void 0) {
                    let data2 = data.difficulty;
                    const _errs6 = errors;
                    const _errs7 = errors;
                    let valid1 = false;
                    const _errs8 = errors;
                    if (typeof data2 !== "string") {
                      const err0 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err0];
                      } else {
                        vErrors.push(err0);
                      }
                      errors++;
                    }
                    if ("L" !== data2) {
                      const err1 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/0/const", keyword: "const", params: { allowedValue: "L" }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err1];
                      } else {
                        vErrors.push(err1);
                      }
                      errors++;
                    }
                    var _valid0 = _errs8 === errors;
                    valid1 = valid1 || _valid0;
                    if (!valid1) {
                      const _errs10 = errors;
                      if (typeof data2 !== "string") {
                        const err2 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err2];
                        } else {
                          vErrors.push(err2);
                        }
                        errors++;
                      }
                      if ("M" !== data2) {
                        const err3 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/1/const", keyword: "const", params: { allowedValue: "M" }, message: "must be equal to constant" };
                        if (vErrors === null) {
                          vErrors = [err3];
                        } else {
                          vErrors.push(err3);
                        }
                        errors++;
                      }
                      var _valid0 = _errs10 === errors;
                      valid1 = valid1 || _valid0;
                      if (!valid1) {
                        const _errs12 = errors;
                        if (typeof data2 !== "string") {
                          const err4 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                          if (vErrors === null) {
                            vErrors = [err4];
                          } else {
                            vErrors.push(err4);
                          }
                          errors++;
                        }
                        if ("H" !== data2) {
                          const err5 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf/2/const", keyword: "const", params: { allowedValue: "H" }, message: "must be equal to constant" };
                          if (vErrors === null) {
                            vErrors = [err5];
                          } else {
                            vErrors.push(err5);
                          }
                          errors++;
                        }
                        var _valid0 = _errs12 === errors;
                        valid1 = valid1 || _valid0;
                      }
                    }
                    if (!valid1) {
                      const err6 = { instancePath: instancePath + "/difficulty", schemaPath: "#/properties/difficulty/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                      if (vErrors === null) {
                        vErrors = [err6];
                      } else {
                        vErrors.push(err6);
                      }
                      errors++;
                      validate21.errors = vErrors;
                      return false;
                    } else {
                      errors = _errs7;
                      if (vErrors !== null) {
                        if (_errs7) {
                          vErrors.length = _errs7;
                        } else {
                          vErrors = null;
                        }
                      }
                    }
                    var valid0 = _errs6 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.sentences !== void 0) {
                      let data3 = data.sentences;
                      const _errs14 = errors;
                      if (errors === _errs14) {
                        if (Array.isArray(data3)) {
                          if (data3.length > 5) {
                            validate21.errors = [{ instancePath: instancePath + "/sentences", schemaPath: "#/properties/sentences/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" }];
                            return false;
                          } else {
                            if (data3.length < 3) {
                              validate21.errors = [{ instancePath: instancePath + "/sentences", schemaPath: "#/properties/sentences/minItems", keyword: "minItems", params: { limit: 3 }, message: "must NOT have fewer than 3 items" }];
                              return false;
                            } else {
                              var valid2 = true;
                              const len0 = data3.length;
                              for (let i0 = 0; i0 < len0; i0++) {
                                let data4 = data3[i0];
                                const _errs16 = errors;
                                if (errors === _errs16) {
                                  if (data4 && typeof data4 == "object" && !Array.isArray(data4)) {
                                    let missing1;
                                    if (data4.id === void 0 && (missing1 = "id") || data4.order === void 0 && (missing1 = "order") || data4.en === void 0 && (missing1 = "en") || data4.zh === void 0 && (missing1 = "zh") || data4.imageAssetId === void 0 && (missing1 = "imageAssetId") || data4.audioAssetId === void 0 && (missing1 = "audioAssetId")) {
                                      validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0, schemaPath: "#/properties/sentences/items/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                                      return false;
                                    } else {
                                      const _errs18 = errors;
                                      for (const key1 in data4) {
                                        if (!(key1 === "id" || key1 === "order" || key1 === "en" || key1 === "zh" || key1 === "imageAssetId" || key1 === "audioAssetId")) {
                                          validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0, schemaPath: "#/properties/sentences/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                                          return false;
                                          break;
                                        }
                                      }
                                      if (_errs18 === errors) {
                                        if (data4.id !== void 0) {
                                          let data5 = data4.id;
                                          const _errs19 = errors;
                                          if (errors === _errs19) {
                                            if (errors === _errs19) {
                                              if (typeof data5 === "string") {
                                                if (func2(data5) > 36) {
                                                  validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/id", schemaPath: "#/properties/sentences/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" }];
                                                  return false;
                                                } else {
                                                  if (func2(data5) < 36) {
                                                    validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/id", schemaPath: "#/properties/sentences/items/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" }];
                                                    return false;
                                                  } else {
                                                    if (!formats0.test(data5)) {
                                                      validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/id", schemaPath: "#/properties/sentences/items/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' }];
                                                      return false;
                                                    }
                                                  }
                                                }
                                              } else {
                                                validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/id", schemaPath: "#/properties/sentences/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                return false;
                                              }
                                            }
                                          }
                                          var valid3 = _errs19 === errors;
                                        } else {
                                          var valid3 = true;
                                        }
                                        if (valid3) {
                                          if (data4.order !== void 0) {
                                            let data6 = data4.order;
                                            const _errs21 = errors;
                                            if (!(typeof data6 == "number" && (!(data6 % 1) && !isNaN(data6)) && isFinite(data6))) {
                                              validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/order", schemaPath: "#/properties/sentences/items/properties/order/type", keyword: "type", params: { type: "integer" }, message: "must be integer" }];
                                              return false;
                                            }
                                            if (errors === _errs21) {
                                              if (typeof data6 == "number" && isFinite(data6)) {
                                                if (data6 > 5 || isNaN(data6)) {
                                                  validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/order", schemaPath: "#/properties/sentences/items/properties/order/maximum", keyword: "maximum", params: { comparison: "<=", limit: 5 }, message: "must be <= 5" }];
                                                  return false;
                                                } else {
                                                  if (data6 < 1 || isNaN(data6)) {
                                                    validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/order", schemaPath: "#/properties/sentences/items/properties/order/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" }];
                                                    return false;
                                                  }
                                                }
                                              }
                                            }
                                            var valid3 = _errs21 === errors;
                                          } else {
                                            var valid3 = true;
                                          }
                                          if (valid3) {
                                            if (data4.en !== void 0) {
                                              let data7 = data4.en;
                                              const _errs23 = errors;
                                              if (errors === _errs23) {
                                                if (typeof data7 === "string") {
                                                  if (func2(data7) > 500) {
                                                    validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/en", schemaPath: "#/properties/sentences/items/properties/en/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" }];
                                                    return false;
                                                  } else {
                                                    if (func2(data7) < 1) {
                                                      validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/en", schemaPath: "#/properties/sentences/items/properties/en/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                      return false;
                                                    } else {
                                                      if (!pattern1.test(data7)) {
                                                        validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/en", schemaPath: "#/properties/sentences/items/properties/en/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                                                        return false;
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/en", schemaPath: "#/properties/sentences/items/properties/en/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                              }
                                              var valid3 = _errs23 === errors;
                                            } else {
                                              var valid3 = true;
                                            }
                                            if (valid3) {
                                              if (data4.zh !== void 0) {
                                                let data8 = data4.zh;
                                                const _errs25 = errors;
                                                if (errors === _errs25) {
                                                  if (typeof data8 === "string") {
                                                    if (func2(data8) > 300) {
                                                      validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/zh", schemaPath: "#/properties/sentences/items/properties/zh/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" }];
                                                      return false;
                                                    } else {
                                                      if (func2(data8) < 1) {
                                                        validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/zh", schemaPath: "#/properties/sentences/items/properties/zh/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                        return false;
                                                      } else {
                                                        if (!pattern1.test(data8)) {
                                                          validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/zh", schemaPath: "#/properties/sentences/items/properties/zh/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                                                          return false;
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/zh", schemaPath: "#/properties/sentences/items/properties/zh/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                    return false;
                                                  }
                                                }
                                                var valid3 = _errs25 === errors;
                                              } else {
                                                var valid3 = true;
                                              }
                                              if (valid3) {
                                                if (data4.imageAssetId !== void 0) {
                                                  let data9 = data4.imageAssetId;
                                                  const _errs27 = errors;
                                                  if (errors === _errs27) {
                                                    if (errors === _errs27) {
                                                      if (typeof data9 === "string") {
                                                        if (func2(data9) > 36) {
                                                          validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/imageAssetId", schemaPath: "#/properties/sentences/items/properties/imageAssetId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" }];
                                                          return false;
                                                        } else {
                                                          if (func2(data9) < 36) {
                                                            validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/imageAssetId", schemaPath: "#/properties/sentences/items/properties/imageAssetId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" }];
                                                            return false;
                                                          } else {
                                                            if (!formats0.test(data9)) {
                                                              validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/imageAssetId", schemaPath: "#/properties/sentences/items/properties/imageAssetId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' }];
                                                              return false;
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0 + "/imageAssetId", schemaPath: "#/properties/sentences/items/properties/imageAssetId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                    }
                                                  }
                                                  var valid3 = _errs27 === errors;
                                                } else {
                                                  var valid3 = true;
                                                }
                                                if (valid3) {
                                                  if (data4.audioAssetId !== void 0) {
                                                    let data10 = data4.audioAssetId;
                                                    const _errs29 = errors;
                                                    const _errs30 = errors;
                                                    let valid4 = false;
                                                    const _errs31 = errors;
                                                    if (errors === _errs31) {
                                                      if (errors === _errs31) {
                                                        if (typeof data10 === "string") {
                                                          if (func2(data10) > 36) {
                                                            const err7 = { instancePath: instancePath + "/sentences/" + i0 + "/audioAssetId", schemaPath: "#/properties/sentences/items/properties/audioAssetId/anyOf/0/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                            if (vErrors === null) {
                                                              vErrors = [err7];
                                                            } else {
                                                              vErrors.push(err7);
                                                            }
                                                            errors++;
                                                          } else {
                                                            if (func2(data10) < 36) {
                                                              const err8 = { instancePath: instancePath + "/sentences/" + i0 + "/audioAssetId", schemaPath: "#/properties/sentences/items/properties/audioAssetId/anyOf/0/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                              if (vErrors === null) {
                                                                vErrors = [err8];
                                                              } else {
                                                                vErrors.push(err8);
                                                              }
                                                              errors++;
                                                            } else {
                                                              if (!formats0.test(data10)) {
                                                                const err9 = { instancePath: instancePath + "/sentences/" + i0 + "/audioAssetId", schemaPath: "#/properties/sentences/items/properties/audioAssetId/anyOf/0/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                if (vErrors === null) {
                                                                  vErrors = [err9];
                                                                } else {
                                                                  vErrors.push(err9);
                                                                }
                                                                errors++;
                                                              }
                                                            }
                                                          }
                                                        } else {
                                                          const err10 = { instancePath: instancePath + "/sentences/" + i0 + "/audioAssetId", schemaPath: "#/properties/sentences/items/properties/audioAssetId/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                          if (vErrors === null) {
                                                            vErrors = [err10];
                                                          } else {
                                                            vErrors.push(err10);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                    }
                                                    var _valid1 = _errs31 === errors;
                                                    valid4 = valid4 || _valid1;
                                                    if (!valid4) {
                                                      const _errs33 = errors;
                                                      if (data10 !== null) {
                                                        const err11 = { instancePath: instancePath + "/sentences/" + i0 + "/audioAssetId", schemaPath: "#/properties/sentences/items/properties/audioAssetId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                        if (vErrors === null) {
                                                          vErrors = [err11];
                                                        } else {
                                                          vErrors.push(err11);
                                                        }
                                                        errors++;
                                                      }
                                                      var _valid1 = _errs33 === errors;
                                                      valid4 = valid4 || _valid1;
                                                    }
                                                    if (!valid4) {
                                                      const err12 = { instancePath: instancePath + "/sentences/" + i0 + "/audioAssetId", schemaPath: "#/properties/sentences/items/properties/audioAssetId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                      if (vErrors === null) {
                                                        vErrors = [err12];
                                                      } else {
                                                        vErrors.push(err12);
                                                      }
                                                      errors++;
                                                      validate21.errors = vErrors;
                                                      return false;
                                                    } else {
                                                      errors = _errs30;
                                                      if (vErrors !== null) {
                                                        if (_errs30) {
                                                          vErrors.length = _errs30;
                                                        } else {
                                                          vErrors = null;
                                                        }
                                                      }
                                                    }
                                                    var valid3 = _errs29 === errors;
                                                  } else {
                                                    var valid3 = true;
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    validate21.errors = [{ instancePath: instancePath + "/sentences/" + i0, schemaPath: "#/properties/sentences/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                    return false;
                                  }
                                }
                                var valid2 = _errs16 === errors;
                                if (!valid2) {
                                  break;
                                }
                              }
                            }
                          }
                        } else {
                          validate21.errors = [{ instancePath: instancePath + "/sentences", schemaPath: "#/properties/sentences/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                          return false;
                        }
                      }
                      var valid0 = _errs14 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.vocabCards !== void 0) {
                        let data11 = data.vocabCards;
                        const _errs35 = errors;
                        if (errors === _errs35) {
                          if (Array.isArray(data11)) {
                            if (data11.length > 5) {
                              validate21.errors = [{ instancePath: instancePath + "/vocabCards", schemaPath: "#/properties/vocabCards/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" }];
                              return false;
                            } else {
                              if (data11.length < 5) {
                                validate21.errors = [{ instancePath: instancePath + "/vocabCards", schemaPath: "#/properties/vocabCards/minItems", keyword: "minItems", params: { limit: 5 }, message: "must NOT have fewer than 5 items" }];
                                return false;
                              } else {
                                var valid5 = true;
                                const len1 = data11.length;
                                for (let i1 = 0; i1 < len1; i1++) {
                                  let data12 = data11[i1];
                                  const _errs37 = errors;
                                  if (errors === _errs37) {
                                    if (data12 && typeof data12 == "object" && !Array.isArray(data12)) {
                                      let missing2;
                                      if (data12.id === void 0 && (missing2 = "id") || data12.word === void 0 && (missing2 = "word") || data12.wordKey === void 0 && (missing2 = "wordKey") || data12.zhMeaning === void 0 && (missing2 = "zhMeaning") || data12.exampleSentenceId === void 0 && (missing2 = "exampleSentenceId") || data12.imageAssetId === void 0 && (missing2 = "imageAssetId") || data12.audioAssetId === void 0 && (missing2 = "audioAssetId")) {
                                        validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1, schemaPath: "#/properties/vocabCards/items/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                        return false;
                                      } else {
                                        const _errs39 = errors;
                                        for (const key2 in data12) {
                                          if (!(key2 === "id" || key2 === "word" || key2 === "wordKey" || key2 === "zhMeaning" || key2 === "exampleSentenceId" || key2 === "imageAssetId" || key2 === "audioAssetId")) {
                                            validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1, schemaPath: "#/properties/vocabCards/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                            return false;
                                            break;
                                          }
                                        }
                                        if (_errs39 === errors) {
                                          if (data12.id !== void 0) {
                                            let data13 = data12.id;
                                            const _errs40 = errors;
                                            if (errors === _errs40) {
                                              if (errors === _errs40) {
                                                if (typeof data13 === "string") {
                                                  if (func2(data13) > 36) {
                                                    validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/id", schemaPath: "#/properties/vocabCards/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" }];
                                                    return false;
                                                  } else {
                                                    if (func2(data13) < 36) {
                                                      validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/id", schemaPath: "#/properties/vocabCards/items/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" }];
                                                      return false;
                                                    } else {
                                                      if (!formats0.test(data13)) {
                                                        validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/id", schemaPath: "#/properties/vocabCards/items/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' }];
                                                        return false;
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/id", schemaPath: "#/properties/vocabCards/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                              }
                                            }
                                            var valid6 = _errs40 === errors;
                                          } else {
                                            var valid6 = true;
                                          }
                                          if (valid6) {
                                            if (data12.word !== void 0) {
                                              let data14 = data12.word;
                                              const _errs42 = errors;
                                              if (errors === _errs42) {
                                                if (typeof data14 === "string") {
                                                  if (func2(data14) > 80) {
                                                    validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/word", schemaPath: "#/properties/vocabCards/items/properties/word/maxLength", keyword: "maxLength", params: { limit: 80 }, message: "must NOT have more than 80 characters" }];
                                                    return false;
                                                  } else {
                                                    if (func2(data14) < 1) {
                                                      validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/word", schemaPath: "#/properties/vocabCards/items/properties/word/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                      return false;
                                                    } else {
                                                      if (!pattern1.test(data14)) {
                                                        validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/word", schemaPath: "#/properties/vocabCards/items/properties/word/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                                                        return false;
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/word", schemaPath: "#/properties/vocabCards/items/properties/word/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                  return false;
                                                }
                                              }
                                              var valid6 = _errs42 === errors;
                                            } else {
                                              var valid6 = true;
                                            }
                                            if (valid6) {
                                              if (data12.wordKey !== void 0) {
                                                let data15 = data12.wordKey;
                                                const _errs44 = errors;
                                                if (errors === _errs44) {
                                                  if (typeof data15 === "string") {
                                                    if (func2(data15) > 200) {
                                                      validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/wordKey", schemaPath: "#/properties/vocabCards/items/properties/wordKey/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" }];
                                                      return false;
                                                    } else {
                                                      if (func2(data15) < 1) {
                                                        validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/wordKey", schemaPath: "#/properties/vocabCards/items/properties/wordKey/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                        return false;
                                                      } else {
                                                        if (!pattern1.test(data15)) {
                                                          validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/wordKey", schemaPath: "#/properties/vocabCards/items/properties/wordKey/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                                                          return false;
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/wordKey", schemaPath: "#/properties/vocabCards/items/properties/wordKey/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                    return false;
                                                  }
                                                }
                                                var valid6 = _errs44 === errors;
                                              } else {
                                                var valid6 = true;
                                              }
                                              if (valid6) {
                                                if (data12.zhMeaning !== void 0) {
                                                  let data16 = data12.zhMeaning;
                                                  const _errs46 = errors;
                                                  if (errors === _errs46) {
                                                    if (typeof data16 === "string") {
                                                      if (func2(data16) > 200) {
                                                        validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/zhMeaning", schemaPath: "#/properties/vocabCards/items/properties/zhMeaning/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" }];
                                                        return false;
                                                      } else {
                                                        if (func2(data16) < 1) {
                                                          validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/zhMeaning", schemaPath: "#/properties/vocabCards/items/properties/zhMeaning/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                          return false;
                                                        } else {
                                                          if (!pattern1.test(data16)) {
                                                            validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/zhMeaning", schemaPath: "#/properties/vocabCards/items/properties/zhMeaning/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                                                            return false;
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/zhMeaning", schemaPath: "#/properties/vocabCards/items/properties/zhMeaning/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                      return false;
                                                    }
                                                  }
                                                  var valid6 = _errs46 === errors;
                                                } else {
                                                  var valid6 = true;
                                                }
                                                if (valid6) {
                                                  if (data12.exampleSentenceId !== void 0) {
                                                    let data17 = data12.exampleSentenceId;
                                                    const _errs48 = errors;
                                                    if (errors === _errs48) {
                                                      if (errors === _errs48) {
                                                        if (typeof data17 === "string") {
                                                          if (func2(data17) > 36) {
                                                            validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/exampleSentenceId", schemaPath: "#/properties/vocabCards/items/properties/exampleSentenceId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" }];
                                                            return false;
                                                          } else {
                                                            if (func2(data17) < 36) {
                                                              validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/exampleSentenceId", schemaPath: "#/properties/vocabCards/items/properties/exampleSentenceId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" }];
                                                              return false;
                                                            } else {
                                                              if (!formats0.test(data17)) {
                                                                validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/exampleSentenceId", schemaPath: "#/properties/vocabCards/items/properties/exampleSentenceId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' }];
                                                                return false;
                                                              }
                                                            }
                                                          }
                                                        } else {
                                                          validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/exampleSentenceId", schemaPath: "#/properties/vocabCards/items/properties/exampleSentenceId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                          return false;
                                                        }
                                                      }
                                                    }
                                                    var valid6 = _errs48 === errors;
                                                  } else {
                                                    var valid6 = true;
                                                  }
                                                  if (valid6) {
                                                    if (data12.imageAssetId !== void 0) {
                                                      let data18 = data12.imageAssetId;
                                                      const _errs50 = errors;
                                                      if (errors === _errs50) {
                                                        if (errors === _errs50) {
                                                          if (typeof data18 === "string") {
                                                            if (func2(data18) > 36) {
                                                              validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/imageAssetId", schemaPath: "#/properties/vocabCards/items/properties/imageAssetId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" }];
                                                              return false;
                                                            } else {
                                                              if (func2(data18) < 36) {
                                                                validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/imageAssetId", schemaPath: "#/properties/vocabCards/items/properties/imageAssetId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" }];
                                                                return false;
                                                              } else {
                                                                if (!formats0.test(data18)) {
                                                                  validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/imageAssetId", schemaPath: "#/properties/vocabCards/items/properties/imageAssetId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' }];
                                                                  return false;
                                                                }
                                                              }
                                                            }
                                                          } else {
                                                            validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1 + "/imageAssetId", schemaPath: "#/properties/vocabCards/items/properties/imageAssetId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                            return false;
                                                          }
                                                        }
                                                      }
                                                      var valid6 = _errs50 === errors;
                                                    } else {
                                                      var valid6 = true;
                                                    }
                                                    if (valid6) {
                                                      if (data12.audioAssetId !== void 0) {
                                                        let data19 = data12.audioAssetId;
                                                        const _errs52 = errors;
                                                        const _errs53 = errors;
                                                        let valid7 = false;
                                                        const _errs54 = errors;
                                                        if (errors === _errs54) {
                                                          if (errors === _errs54) {
                                                            if (typeof data19 === "string") {
                                                              if (func2(data19) > 36) {
                                                                const err13 = { instancePath: instancePath + "/vocabCards/" + i1 + "/audioAssetId", schemaPath: "#/properties/vocabCards/items/properties/audioAssetId/anyOf/0/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err13];
                                                                } else {
                                                                  vErrors.push(err13);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (func2(data19) < 36) {
                                                                  const err14 = { instancePath: instancePath + "/vocabCards/" + i1 + "/audioAssetId", schemaPath: "#/properties/vocabCards/items/properties/audioAssetId/anyOf/0/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err14];
                                                                  } else {
                                                                    vErrors.push(err14);
                                                                  }
                                                                  errors++;
                                                                } else {
                                                                  if (!formats0.test(data19)) {
                                                                    const err15 = { instancePath: instancePath + "/vocabCards/" + i1 + "/audioAssetId", schemaPath: "#/properties/vocabCards/items/properties/audioAssetId/anyOf/0/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err15];
                                                                    } else {
                                                                      vErrors.push(err15);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                }
                                                              }
                                                            } else {
                                                              const err16 = { instancePath: instancePath + "/vocabCards/" + i1 + "/audioAssetId", schemaPath: "#/properties/vocabCards/items/properties/audioAssetId/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                              if (vErrors === null) {
                                                                vErrors = [err16];
                                                              } else {
                                                                vErrors.push(err16);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                        }
                                                        var _valid2 = _errs54 === errors;
                                                        valid7 = valid7 || _valid2;
                                                        if (!valid7) {
                                                          const _errs56 = errors;
                                                          if (data19 !== null) {
                                                            const err17 = { instancePath: instancePath + "/vocabCards/" + i1 + "/audioAssetId", schemaPath: "#/properties/vocabCards/items/properties/audioAssetId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                            if (vErrors === null) {
                                                              vErrors = [err17];
                                                            } else {
                                                              vErrors.push(err17);
                                                            }
                                                            errors++;
                                                          }
                                                          var _valid2 = _errs56 === errors;
                                                          valid7 = valid7 || _valid2;
                                                        }
                                                        if (!valid7) {
                                                          const err18 = { instancePath: instancePath + "/vocabCards/" + i1 + "/audioAssetId", schemaPath: "#/properties/vocabCards/items/properties/audioAssetId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                          if (vErrors === null) {
                                                            vErrors = [err18];
                                                          } else {
                                                            vErrors.push(err18);
                                                          }
                                                          errors++;
                                                          validate21.errors = vErrors;
                                                          return false;
                                                        } else {
                                                          errors = _errs53;
                                                          if (vErrors !== null) {
                                                            if (_errs53) {
                                                              vErrors.length = _errs53;
                                                            } else {
                                                              vErrors = null;
                                                            }
                                                          }
                                                        }
                                                        var valid6 = _errs52 === errors;
                                                      } else {
                                                        var valid6 = true;
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    } else {
                                      validate21.errors = [{ instancePath: instancePath + "/vocabCards/" + i1, schemaPath: "#/properties/vocabCards/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                      return false;
                                    }
                                  }
                                  var valid5 = _errs37 === errors;
                                  if (!valid5) {
                                    break;
                                  }
                                }
                              }
                            }
                          } else {
                            validate21.errors = [{ instancePath: instancePath + "/vocabCards", schemaPath: "#/properties/vocabCards/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                            return false;
                          }
                        }
                        var valid0 = _errs35 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.exercises !== void 0) {
                          let data20 = data.exercises;
                          const _errs58 = errors;
                          const _errs60 = errors;
                          if (Array.isArray(data20)) {
                            const _errs61 = errors;
                            const len2 = data20.length;
                            for (let i2 = 0; i2 < len2; i2++) {
                              let data21 = data20[i2];
                              const _errs62 = errors;
                              if (errors === _errs62) {
                                if (data21 && typeof data21 == "object" && !Array.isArray(data21)) {
                                  let missing3;
                                  if (data21.id === void 0 && (missing3 = "id") || data21.targetVocabIds === void 0 && (missing3 = "targetVocabIds") || data21.promptZh === void 0 && (missing3 = "promptZh") || data21.instructionAudioAssetId === void 0 && (missing3 = "instructionAudioAssetId") || data21.hintId === void 0 && (missing3 = "hintId") || data21.type === void 0 && (missing3 = "type") || data21.options === void 0 && (missing3 = "options")) {
                                    const err19 = { instancePath: instancePath + "/exercises/" + i2, schemaPath: "#/properties/exercises/allOf/0/contains/required", keyword: "required", params: { missingProperty: missing3 }, message: "must have required property '" + missing3 + "'" };
                                    if (vErrors === null) {
                                      vErrors = [err19];
                                    } else {
                                      vErrors.push(err19);
                                    }
                                    errors++;
                                  } else {
                                    const _errs64 = errors;
                                    for (const key3 in data21) {
                                      if (!(key3 === "id" || key3 === "targetVocabIds" || key3 === "promptZh" || key3 === "instructionAudioAssetId" || key3 === "hintId" || key3 === "type" || key3 === "options")) {
                                        const err20 = { instancePath: instancePath + "/exercises/" + i2, schemaPath: "#/properties/exercises/allOf/0/contains/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" };
                                        if (vErrors === null) {
                                          vErrors = [err20];
                                        } else {
                                          vErrors.push(err20);
                                        }
                                        errors++;
                                        break;
                                      }
                                    }
                                    if (_errs64 === errors) {
                                      if (data21.id !== void 0) {
                                        let data22 = data21.id;
                                        const _errs65 = errors;
                                        if (errors === _errs65) {
                                          if (errors === _errs65) {
                                            if (typeof data22 === "string") {
                                              if (func2(data22) > 36) {
                                                const err21 = { instancePath: instancePath + "/exercises/" + i2 + "/id", schemaPath: "#/properties/exercises/allOf/0/contains/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                if (vErrors === null) {
                                                  vErrors = [err21];
                                                } else {
                                                  vErrors.push(err21);
                                                }
                                                errors++;
                                              } else {
                                                if (func2(data22) < 36) {
                                                  const err22 = { instancePath: instancePath + "/exercises/" + i2 + "/id", schemaPath: "#/properties/exercises/allOf/0/contains/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                  if (vErrors === null) {
                                                    vErrors = [err22];
                                                  } else {
                                                    vErrors.push(err22);
                                                  }
                                                  errors++;
                                                } else {
                                                  if (!formats0.test(data22)) {
                                                    const err23 = { instancePath: instancePath + "/exercises/" + i2 + "/id", schemaPath: "#/properties/exercises/allOf/0/contains/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                    if (vErrors === null) {
                                                      vErrors = [err23];
                                                    } else {
                                                      vErrors.push(err23);
                                                    }
                                                    errors++;
                                                  }
                                                }
                                              }
                                            } else {
                                              const err24 = { instancePath: instancePath + "/exercises/" + i2 + "/id", schemaPath: "#/properties/exercises/allOf/0/contains/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                              if (vErrors === null) {
                                                vErrors = [err24];
                                              } else {
                                                vErrors.push(err24);
                                              }
                                              errors++;
                                            }
                                          }
                                        }
                                        var valid10 = _errs65 === errors;
                                      } else {
                                        var valid10 = true;
                                      }
                                      if (valid10) {
                                        if (data21.targetVocabIds !== void 0) {
                                          let data23 = data21.targetVocabIds;
                                          const _errs67 = errors;
                                          if (errors === _errs67) {
                                            if (Array.isArray(data23)) {
                                              if (data23.length > 3) {
                                                const err25 = { instancePath: instancePath + "/exercises/" + i2 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/0/contains/properties/targetVocabIds/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                if (vErrors === null) {
                                                  vErrors = [err25];
                                                } else {
                                                  vErrors.push(err25);
                                                }
                                                errors++;
                                              } else {
                                                if (data23.length < 1) {
                                                  const err26 = { instancePath: instancePath + "/exercises/" + i2 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/0/contains/properties/targetVocabIds/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                                                  if (vErrors === null) {
                                                    vErrors = [err26];
                                                  } else {
                                                    vErrors.push(err26);
                                                  }
                                                  errors++;
                                                } else {
                                                  var valid11 = true;
                                                  const len3 = data23.length;
                                                  for (let i3 = 0; i3 < len3; i3++) {
                                                    let data24 = data23[i3];
                                                    const _errs69 = errors;
                                                    if (errors === _errs69) {
                                                      if (errors === _errs69) {
                                                        if (typeof data24 === "string") {
                                                          if (func2(data24) > 36) {
                                                            const err27 = { instancePath: instancePath + "/exercises/" + i2 + "/targetVocabIds/" + i3, schemaPath: "#/properties/exercises/allOf/0/contains/properties/targetVocabIds/items/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                            if (vErrors === null) {
                                                              vErrors = [err27];
                                                            } else {
                                                              vErrors.push(err27);
                                                            }
                                                            errors++;
                                                          } else {
                                                            if (func2(data24) < 36) {
                                                              const err28 = { instancePath: instancePath + "/exercises/" + i2 + "/targetVocabIds/" + i3, schemaPath: "#/properties/exercises/allOf/0/contains/properties/targetVocabIds/items/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                              if (vErrors === null) {
                                                                vErrors = [err28];
                                                              } else {
                                                                vErrors.push(err28);
                                                              }
                                                              errors++;
                                                            } else {
                                                              if (!formats0.test(data24)) {
                                                                const err29 = { instancePath: instancePath + "/exercises/" + i2 + "/targetVocabIds/" + i3, schemaPath: "#/properties/exercises/allOf/0/contains/properties/targetVocabIds/items/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                if (vErrors === null) {
                                                                  vErrors = [err29];
                                                                } else {
                                                                  vErrors.push(err29);
                                                                }
                                                                errors++;
                                                              }
                                                            }
                                                          }
                                                        } else {
                                                          const err30 = { instancePath: instancePath + "/exercises/" + i2 + "/targetVocabIds/" + i3, schemaPath: "#/properties/exercises/allOf/0/contains/properties/targetVocabIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                          if (vErrors === null) {
                                                            vErrors = [err30];
                                                          } else {
                                                            vErrors.push(err30);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                    }
                                                    var valid11 = _errs69 === errors;
                                                    if (!valid11) {
                                                      break;
                                                    }
                                                  }
                                                  if (valid11) {
                                                    let i4 = data23.length;
                                                    let j0;
                                                    if (i4 > 1) {
                                                      const indices0 = {};
                                                      for (; i4--; ) {
                                                        let item0 = data23[i4];
                                                        if (typeof item0 !== "string") {
                                                          continue;
                                                        }
                                                        if (typeof indices0[item0] == "number") {
                                                          j0 = indices0[item0];
                                                          const err31 = { instancePath: instancePath + "/exercises/" + i2 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/0/contains/properties/targetVocabIds/uniqueItems", keyword: "uniqueItems", params: { i: i4, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i4 + " are identical)" };
                                                          if (vErrors === null) {
                                                            vErrors = [err31];
                                                          } else {
                                                            vErrors.push(err31);
                                                          }
                                                          errors++;
                                                          break;
                                                        }
                                                        indices0[item0] = i4;
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            } else {
                                              const err32 = { instancePath: instancePath + "/exercises/" + i2 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/0/contains/properties/targetVocabIds/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                              if (vErrors === null) {
                                                vErrors = [err32];
                                              } else {
                                                vErrors.push(err32);
                                              }
                                              errors++;
                                            }
                                          }
                                          var valid10 = _errs67 === errors;
                                        } else {
                                          var valid10 = true;
                                        }
                                        if (valid10) {
                                          if (data21.promptZh !== void 0) {
                                            let data25 = data21.promptZh;
                                            const _errs71 = errors;
                                            if (errors === _errs71) {
                                              if (typeof data25 === "string") {
                                                if (func2(data25) > 200) {
                                                  const err33 = { instancePath: instancePath + "/exercises/" + i2 + "/promptZh", schemaPath: "#/properties/exercises/allOf/0/contains/properties/promptZh/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                  if (vErrors === null) {
                                                    vErrors = [err33];
                                                  } else {
                                                    vErrors.push(err33);
                                                  }
                                                  errors++;
                                                } else {
                                                  if (func2(data25) < 1) {
                                                    const err34 = { instancePath: instancePath + "/exercises/" + i2 + "/promptZh", schemaPath: "#/properties/exercises/allOf/0/contains/properties/promptZh/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                    if (vErrors === null) {
                                                      vErrors = [err34];
                                                    } else {
                                                      vErrors.push(err34);
                                                    }
                                                    errors++;
                                                  } else {
                                                    if (!pattern1.test(data25)) {
                                                      const err35 = { instancePath: instancePath + "/exercises/" + i2 + "/promptZh", schemaPath: "#/properties/exercises/allOf/0/contains/properties/promptZh/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                      if (vErrors === null) {
                                                        vErrors = [err35];
                                                      } else {
                                                        vErrors.push(err35);
                                                      }
                                                      errors++;
                                                    }
                                                  }
                                                }
                                              } else {
                                                const err36 = { instancePath: instancePath + "/exercises/" + i2 + "/promptZh", schemaPath: "#/properties/exercises/allOf/0/contains/properties/promptZh/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                if (vErrors === null) {
                                                  vErrors = [err36];
                                                } else {
                                                  vErrors.push(err36);
                                                }
                                                errors++;
                                              }
                                            }
                                            var valid10 = _errs71 === errors;
                                          } else {
                                            var valid10 = true;
                                          }
                                          if (valid10) {
                                            if (data21.instructionAudioAssetId !== void 0) {
                                              let data26 = data21.instructionAudioAssetId;
                                              const _errs73 = errors;
                                              const _errs74 = errors;
                                              let valid13 = false;
                                              const _errs75 = errors;
                                              if (errors === _errs75) {
                                                if (errors === _errs75) {
                                                  if (typeof data26 === "string") {
                                                    if (func2(data26) > 36) {
                                                      const err37 = { instancePath: instancePath + "/exercises/" + i2 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/0/contains/properties/instructionAudioAssetId/anyOf/0/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                      if (vErrors === null) {
                                                        vErrors = [err37];
                                                      } else {
                                                        vErrors.push(err37);
                                                      }
                                                      errors++;
                                                    } else {
                                                      if (func2(data26) < 36) {
                                                        const err38 = { instancePath: instancePath + "/exercises/" + i2 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/0/contains/properties/instructionAudioAssetId/anyOf/0/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                        if (vErrors === null) {
                                                          vErrors = [err38];
                                                        } else {
                                                          vErrors.push(err38);
                                                        }
                                                        errors++;
                                                      } else {
                                                        if (!formats0.test(data26)) {
                                                          const err39 = { instancePath: instancePath + "/exercises/" + i2 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/0/contains/properties/instructionAudioAssetId/anyOf/0/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                          if (vErrors === null) {
                                                            vErrors = [err39];
                                                          } else {
                                                            vErrors.push(err39);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    const err40 = { instancePath: instancePath + "/exercises/" + i2 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/0/contains/properties/instructionAudioAssetId/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err40];
                                                    } else {
                                                      vErrors.push(err40);
                                                    }
                                                    errors++;
                                                  }
                                                }
                                              }
                                              var _valid3 = _errs75 === errors;
                                              valid13 = valid13 || _valid3;
                                              if (!valid13) {
                                                const _errs77 = errors;
                                                if (data26 !== null) {
                                                  const err41 = { instancePath: instancePath + "/exercises/" + i2 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/0/contains/properties/instructionAudioAssetId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                  if (vErrors === null) {
                                                    vErrors = [err41];
                                                  } else {
                                                    vErrors.push(err41);
                                                  }
                                                  errors++;
                                                }
                                                var _valid3 = _errs77 === errors;
                                                valid13 = valid13 || _valid3;
                                              }
                                              if (!valid13) {
                                                const err42 = { instancePath: instancePath + "/exercises/" + i2 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/0/contains/properties/instructionAudioAssetId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                if (vErrors === null) {
                                                  vErrors = [err42];
                                                } else {
                                                  vErrors.push(err42);
                                                }
                                                errors++;
                                              } else {
                                                errors = _errs74;
                                                if (vErrors !== null) {
                                                  if (_errs74) {
                                                    vErrors.length = _errs74;
                                                  } else {
                                                    vErrors = null;
                                                  }
                                                }
                                              }
                                              var valid10 = _errs73 === errors;
                                            } else {
                                              var valid10 = true;
                                            }
                                            if (valid10) {
                                              if (data21.hintId !== void 0) {
                                                let data27 = data21.hintId;
                                                const _errs79 = errors;
                                                if (errors === _errs79) {
                                                  if (errors === _errs79) {
                                                    if (typeof data27 === "string") {
                                                      if (func2(data27) > 36) {
                                                        const err43 = { instancePath: instancePath + "/exercises/" + i2 + "/hintId", schemaPath: "#/properties/exercises/allOf/0/contains/properties/hintId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                        if (vErrors === null) {
                                                          vErrors = [err43];
                                                        } else {
                                                          vErrors.push(err43);
                                                        }
                                                        errors++;
                                                      } else {
                                                        if (func2(data27) < 36) {
                                                          const err44 = { instancePath: instancePath + "/exercises/" + i2 + "/hintId", schemaPath: "#/properties/exercises/allOf/0/contains/properties/hintId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                          if (vErrors === null) {
                                                            vErrors = [err44];
                                                          } else {
                                                            vErrors.push(err44);
                                                          }
                                                          errors++;
                                                        } else {
                                                          if (!formats0.test(data27)) {
                                                            const err45 = { instancePath: instancePath + "/exercises/" + i2 + "/hintId", schemaPath: "#/properties/exercises/allOf/0/contains/properties/hintId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                            if (vErrors === null) {
                                                              vErrors = [err45];
                                                            } else {
                                                              vErrors.push(err45);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      const err46 = { instancePath: instancePath + "/exercises/" + i2 + "/hintId", schemaPath: "#/properties/exercises/allOf/0/contains/properties/hintId/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err46];
                                                      } else {
                                                        vErrors.push(err46);
                                                      }
                                                      errors++;
                                                    }
                                                  }
                                                }
                                                var valid10 = _errs79 === errors;
                                              } else {
                                                var valid10 = true;
                                              }
                                              if (valid10) {
                                                if (data21.type !== void 0) {
                                                  let data28 = data21.type;
                                                  const _errs81 = errors;
                                                  if (typeof data28 !== "string") {
                                                    const err47 = { instancePath: instancePath + "/exercises/" + i2 + "/type", schemaPath: "#/properties/exercises/allOf/0/contains/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err47];
                                                    } else {
                                                      vErrors.push(err47);
                                                    }
                                                    errors++;
                                                  }
                                                  if ("choice" !== data28) {
                                                    const err48 = { instancePath: instancePath + "/exercises/" + i2 + "/type", schemaPath: "#/properties/exercises/allOf/0/contains/properties/type/const", keyword: "const", params: { allowedValue: "choice" }, message: "must be equal to constant" };
                                                    if (vErrors === null) {
                                                      vErrors = [err48];
                                                    } else {
                                                      vErrors.push(err48);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid10 = _errs81 === errors;
                                                } else {
                                                  var valid10 = true;
                                                }
                                                if (valid10) {
                                                  if (data21.options !== void 0) {
                                                    let data29 = data21.options;
                                                    const _errs83 = errors;
                                                    if (errors === _errs83) {
                                                      if (Array.isArray(data29)) {
                                                        if (data29.length > 3) {
                                                          const err49 = { instancePath: instancePath + "/exercises/" + i2 + "/options", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                          if (vErrors === null) {
                                                            vErrors = [err49];
                                                          } else {
                                                            vErrors.push(err49);
                                                          }
                                                          errors++;
                                                        } else {
                                                          if (data29.length < 3) {
                                                            const err50 = { instancePath: instancePath + "/exercises/" + i2 + "/options", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/minItems", keyword: "minItems", params: { limit: 3 }, message: "must NOT have fewer than 3 items" };
                                                            if (vErrors === null) {
                                                              vErrors = [err50];
                                                            } else {
                                                              vErrors.push(err50);
                                                            }
                                                            errors++;
                                                          } else {
                                                            var valid14 = true;
                                                            const len4 = data29.length;
                                                            for (let i5 = 0; i5 < len4; i5++) {
                                                              let data30 = data29[i5];
                                                              const _errs85 = errors;
                                                              if (errors === _errs85) {
                                                                if (data30 && typeof data30 == "object" && !Array.isArray(data30)) {
                                                                  let missing4;
                                                                  if (data30.id === void 0 && (missing4 = "id") || data30.text === void 0 && (missing4 = "text")) {
                                                                    const err51 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5, schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/required", keyword: "required", params: { missingProperty: missing4 }, message: "must have required property '" + missing4 + "'" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err51];
                                                                    } else {
                                                                      vErrors.push(err51);
                                                                    }
                                                                    errors++;
                                                                  } else {
                                                                    const _errs87 = errors;
                                                                    for (const key4 in data30) {
                                                                      if (!(key4 === "id" || key4 === "text")) {
                                                                        const err52 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5, schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err52];
                                                                        } else {
                                                                          vErrors.push(err52);
                                                                        }
                                                                        errors++;
                                                                        break;
                                                                      }
                                                                    }
                                                                    if (_errs87 === errors) {
                                                                      if (data30.id !== void 0) {
                                                                        let data31 = data30.id;
                                                                        const _errs88 = errors;
                                                                        if (errors === _errs88) {
                                                                          if (errors === _errs88) {
                                                                            if (typeof data31 === "string") {
                                                                              if (func2(data31) > 36) {
                                                                                const err53 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5 + "/id", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err53];
                                                                                } else {
                                                                                  vErrors.push(err53);
                                                                                }
                                                                                errors++;
                                                                              } else {
                                                                                if (func2(data31) < 36) {
                                                                                  const err54 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5 + "/id", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err54];
                                                                                  } else {
                                                                                    vErrors.push(err54);
                                                                                  }
                                                                                  errors++;
                                                                                } else {
                                                                                  if (!formats0.test(data31)) {
                                                                                    const err55 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5 + "/id", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err55];
                                                                                    } else {
                                                                                      vErrors.push(err55);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                }
                                                                              }
                                                                            } else {
                                                                              const err56 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5 + "/id", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err56];
                                                                              } else {
                                                                                vErrors.push(err56);
                                                                              }
                                                                              errors++;
                                                                            }
                                                                          }
                                                                        }
                                                                        var valid15 = _errs88 === errors;
                                                                      } else {
                                                                        var valid15 = true;
                                                                      }
                                                                      if (valid15) {
                                                                        if (data30.text !== void 0) {
                                                                          let data32 = data30.text;
                                                                          const _errs90 = errors;
                                                                          if (errors === _errs90) {
                                                                            if (typeof data32 === "string") {
                                                                              if (func2(data32) > 200) {
                                                                                const err57 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5 + "/text", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/properties/text/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err57];
                                                                                } else {
                                                                                  vErrors.push(err57);
                                                                                }
                                                                                errors++;
                                                                              } else {
                                                                                if (func2(data32) < 1) {
                                                                                  const err58 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5 + "/text", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/properties/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err58];
                                                                                  } else {
                                                                                    vErrors.push(err58);
                                                                                  }
                                                                                  errors++;
                                                                                } else {
                                                                                  if (!pattern1.test(data32)) {
                                                                                    const err59 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5 + "/text", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/properties/text/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err59];
                                                                                    } else {
                                                                                      vErrors.push(err59);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                }
                                                                              }
                                                                            } else {
                                                                              const err60 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5 + "/text", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/properties/text/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err60];
                                                                              } else {
                                                                                vErrors.push(err60);
                                                                              }
                                                                              errors++;
                                                                            }
                                                                          }
                                                                          var valid15 = _errs90 === errors;
                                                                        } else {
                                                                          var valid15 = true;
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                } else {
                                                                  const err61 = { instancePath: instancePath + "/exercises/" + i2 + "/options/" + i5, schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err61];
                                                                  } else {
                                                                    vErrors.push(err61);
                                                                  }
                                                                  errors++;
                                                                }
                                                              }
                                                              var valid14 = _errs85 === errors;
                                                              if (!valid14) {
                                                                break;
                                                              }
                                                            }
                                                            if (valid14) {
                                                              let i6 = data29.length;
                                                              let j1;
                                                              if (i6 > 1) {
                                                                outer0: for (; i6--; ) {
                                                                  for (j1 = i6; j1--; ) {
                                                                    if (func0(data29[i6], data29[j1])) {
                                                                      const err62 = { instancePath: instancePath + "/exercises/" + i2 + "/options", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/uniqueItems", keyword: "uniqueItems", params: { i: i6, j: j1 }, message: "must NOT have duplicate items (items ## " + j1 + " and " + i6 + " are identical)" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err62];
                                                                      } else {
                                                                        vErrors.push(err62);
                                                                      }
                                                                      errors++;
                                                                      break outer0;
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        const err63 = { instancePath: instancePath + "/exercises/" + i2 + "/options", schemaPath: "#/properties/exercises/allOf/0/contains/properties/options/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                        if (vErrors === null) {
                                                          vErrors = [err63];
                                                        } else {
                                                          vErrors.push(err63);
                                                        }
                                                        errors++;
                                                      }
                                                    }
                                                    var valid10 = _errs83 === errors;
                                                  } else {
                                                    var valid10 = true;
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  const err64 = { instancePath: instancePath + "/exercises/" + i2, schemaPath: "#/properties/exercises/allOf/0/contains/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                  if (vErrors === null) {
                                    vErrors = [err64];
                                  } else {
                                    vErrors.push(err64);
                                  }
                                  errors++;
                                }
                              }
                              var valid9 = _errs62 === errors;
                              if (valid9) {
                                break;
                              }
                            }
                            if (!valid9) {
                              validate21.errors = [{ instancePath: instancePath + "/exercises", schemaPath: "#/properties/exercises/allOf/0/contains", keyword: "contains", params: { minContains: 1 }, message: "must contain at least 1 valid item(s)" }];
                              return false;
                            } else {
                              errors = _errs61;
                              if (vErrors !== null) {
                                if (_errs61) {
                                  vErrors.length = _errs61;
                                } else {
                                  vErrors = null;
                                }
                              }
                            }
                          }
                          var valid8 = _errs60 === errors;
                          if (valid8) {
                            const _errs92 = errors;
                            if (Array.isArray(data20)) {
                              const _errs93 = errors;
                              const len5 = data20.length;
                              for (let i7 = 0; i7 < len5; i7++) {
                                let data33 = data20[i7];
                                const _errs94 = errors;
                                if (errors === _errs94) {
                                  if (data33 && typeof data33 == "object" && !Array.isArray(data33)) {
                                    let missing5;
                                    if (data33.id === void 0 && (missing5 = "id") || data33.targetVocabIds === void 0 && (missing5 = "targetVocabIds") || data33.promptZh === void 0 && (missing5 = "promptZh") || data33.instructionAudioAssetId === void 0 && (missing5 = "instructionAudioAssetId") || data33.hintId === void 0 && (missing5 = "hintId") || data33.type === void 0 && (missing5 = "type") || data33.leftItems === void 0 && (missing5 = "leftItems") || data33.rightItems === void 0 && (missing5 = "rightItems")) {
                                      const err65 = { instancePath: instancePath + "/exercises/" + i7, schemaPath: "#/properties/exercises/allOf/1/contains/required", keyword: "required", params: { missingProperty: missing5 }, message: "must have required property '" + missing5 + "'" };
                                      if (vErrors === null) {
                                        vErrors = [err65];
                                      } else {
                                        vErrors.push(err65);
                                      }
                                      errors++;
                                    } else {
                                      const _errs96 = errors;
                                      for (const key5 in data33) {
                                        if (!(key5 === "id" || key5 === "targetVocabIds" || key5 === "promptZh" || key5 === "instructionAudioAssetId" || key5 === "hintId" || key5 === "type" || key5 === "leftItems" || key5 === "rightItems")) {
                                          const err66 = { instancePath: instancePath + "/exercises/" + i7, schemaPath: "#/properties/exercises/allOf/1/contains/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key5 }, message: "must NOT have additional properties" };
                                          if (vErrors === null) {
                                            vErrors = [err66];
                                          } else {
                                            vErrors.push(err66);
                                          }
                                          errors++;
                                          break;
                                        }
                                      }
                                      if (_errs96 === errors) {
                                        if (data33.id !== void 0) {
                                          let data34 = data33.id;
                                          const _errs97 = errors;
                                          if (errors === _errs97) {
                                            if (errors === _errs97) {
                                              if (typeof data34 === "string") {
                                                if (func2(data34) > 36) {
                                                  const err67 = { instancePath: instancePath + "/exercises/" + i7 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                  if (vErrors === null) {
                                                    vErrors = [err67];
                                                  } else {
                                                    vErrors.push(err67);
                                                  }
                                                  errors++;
                                                } else {
                                                  if (func2(data34) < 36) {
                                                    const err68 = { instancePath: instancePath + "/exercises/" + i7 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                    if (vErrors === null) {
                                                      vErrors = [err68];
                                                    } else {
                                                      vErrors.push(err68);
                                                    }
                                                    errors++;
                                                  } else {
                                                    if (!formats0.test(data34)) {
                                                      const err69 = { instancePath: instancePath + "/exercises/" + i7 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                      if (vErrors === null) {
                                                        vErrors = [err69];
                                                      } else {
                                                        vErrors.push(err69);
                                                      }
                                                      errors++;
                                                    }
                                                  }
                                                }
                                              } else {
                                                const err70 = { instancePath: instancePath + "/exercises/" + i7 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                if (vErrors === null) {
                                                  vErrors = [err70];
                                                } else {
                                                  vErrors.push(err70);
                                                }
                                                errors++;
                                              }
                                            }
                                          }
                                          var valid18 = _errs97 === errors;
                                        } else {
                                          var valid18 = true;
                                        }
                                        if (valid18) {
                                          if (data33.targetVocabIds !== void 0) {
                                            let data35 = data33.targetVocabIds;
                                            const _errs99 = errors;
                                            if (errors === _errs99) {
                                              if (Array.isArray(data35)) {
                                                if (data35.length > 3) {
                                                  const err71 = { instancePath: instancePath + "/exercises/" + i7 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/1/contains/properties/targetVocabIds/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                  if (vErrors === null) {
                                                    vErrors = [err71];
                                                  } else {
                                                    vErrors.push(err71);
                                                  }
                                                  errors++;
                                                } else {
                                                  if (data35.length < 1) {
                                                    const err72 = { instancePath: instancePath + "/exercises/" + i7 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/1/contains/properties/targetVocabIds/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                                                    if (vErrors === null) {
                                                      vErrors = [err72];
                                                    } else {
                                                      vErrors.push(err72);
                                                    }
                                                    errors++;
                                                  } else {
                                                    var valid19 = true;
                                                    const len6 = data35.length;
                                                    for (let i8 = 0; i8 < len6; i8++) {
                                                      let data36 = data35[i8];
                                                      const _errs101 = errors;
                                                      if (errors === _errs101) {
                                                        if (errors === _errs101) {
                                                          if (typeof data36 === "string") {
                                                            if (func2(data36) > 36) {
                                                              const err73 = { instancePath: instancePath + "/exercises/" + i7 + "/targetVocabIds/" + i8, schemaPath: "#/properties/exercises/allOf/1/contains/properties/targetVocabIds/items/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                              if (vErrors === null) {
                                                                vErrors = [err73];
                                                              } else {
                                                                vErrors.push(err73);
                                                              }
                                                              errors++;
                                                            } else {
                                                              if (func2(data36) < 36) {
                                                                const err74 = { instancePath: instancePath + "/exercises/" + i7 + "/targetVocabIds/" + i8, schemaPath: "#/properties/exercises/allOf/1/contains/properties/targetVocabIds/items/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err74];
                                                                } else {
                                                                  vErrors.push(err74);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (!formats0.test(data36)) {
                                                                  const err75 = { instancePath: instancePath + "/exercises/" + i7 + "/targetVocabIds/" + i8, schemaPath: "#/properties/exercises/allOf/1/contains/properties/targetVocabIds/items/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err75];
                                                                  } else {
                                                                    vErrors.push(err75);
                                                                  }
                                                                  errors++;
                                                                }
                                                              }
                                                            }
                                                          } else {
                                                            const err76 = { instancePath: instancePath + "/exercises/" + i7 + "/targetVocabIds/" + i8, schemaPath: "#/properties/exercises/allOf/1/contains/properties/targetVocabIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                            if (vErrors === null) {
                                                              vErrors = [err76];
                                                            } else {
                                                              vErrors.push(err76);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                      }
                                                      var valid19 = _errs101 === errors;
                                                      if (!valid19) {
                                                        break;
                                                      }
                                                    }
                                                    if (valid19) {
                                                      let i9 = data35.length;
                                                      let j2;
                                                      if (i9 > 1) {
                                                        const indices1 = {};
                                                        for (; i9--; ) {
                                                          let item1 = data35[i9];
                                                          if (typeof item1 !== "string") {
                                                            continue;
                                                          }
                                                          if (typeof indices1[item1] == "number") {
                                                            j2 = indices1[item1];
                                                            const err77 = { instancePath: instancePath + "/exercises/" + i7 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/1/contains/properties/targetVocabIds/uniqueItems", keyword: "uniqueItems", params: { i: i9, j: j2 }, message: "must NOT have duplicate items (items ## " + j2 + " and " + i9 + " are identical)" };
                                                            if (vErrors === null) {
                                                              vErrors = [err77];
                                                            } else {
                                                              vErrors.push(err77);
                                                            }
                                                            errors++;
                                                            break;
                                                          }
                                                          indices1[item1] = i9;
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              } else {
                                                const err78 = { instancePath: instancePath + "/exercises/" + i7 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/1/contains/properties/targetVocabIds/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                if (vErrors === null) {
                                                  vErrors = [err78];
                                                } else {
                                                  vErrors.push(err78);
                                                }
                                                errors++;
                                              }
                                            }
                                            var valid18 = _errs99 === errors;
                                          } else {
                                            var valid18 = true;
                                          }
                                          if (valid18) {
                                            if (data33.promptZh !== void 0) {
                                              let data37 = data33.promptZh;
                                              const _errs103 = errors;
                                              if (errors === _errs103) {
                                                if (typeof data37 === "string") {
                                                  if (func2(data37) > 200) {
                                                    const err79 = { instancePath: instancePath + "/exercises/" + i7 + "/promptZh", schemaPath: "#/properties/exercises/allOf/1/contains/properties/promptZh/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                    if (vErrors === null) {
                                                      vErrors = [err79];
                                                    } else {
                                                      vErrors.push(err79);
                                                    }
                                                    errors++;
                                                  } else {
                                                    if (func2(data37) < 1) {
                                                      const err80 = { instancePath: instancePath + "/exercises/" + i7 + "/promptZh", schemaPath: "#/properties/exercises/allOf/1/contains/properties/promptZh/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                      if (vErrors === null) {
                                                        vErrors = [err80];
                                                      } else {
                                                        vErrors.push(err80);
                                                      }
                                                      errors++;
                                                    } else {
                                                      if (!pattern1.test(data37)) {
                                                        const err81 = { instancePath: instancePath + "/exercises/" + i7 + "/promptZh", schemaPath: "#/properties/exercises/allOf/1/contains/properties/promptZh/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                        if (vErrors === null) {
                                                          vErrors = [err81];
                                                        } else {
                                                          vErrors.push(err81);
                                                        }
                                                        errors++;
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  const err82 = { instancePath: instancePath + "/exercises/" + i7 + "/promptZh", schemaPath: "#/properties/exercises/allOf/1/contains/properties/promptZh/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                  if (vErrors === null) {
                                                    vErrors = [err82];
                                                  } else {
                                                    vErrors.push(err82);
                                                  }
                                                  errors++;
                                                }
                                              }
                                              var valid18 = _errs103 === errors;
                                            } else {
                                              var valid18 = true;
                                            }
                                            if (valid18) {
                                              if (data33.instructionAudioAssetId !== void 0) {
                                                let data38 = data33.instructionAudioAssetId;
                                                const _errs105 = errors;
                                                const _errs106 = errors;
                                                let valid21 = false;
                                                const _errs107 = errors;
                                                if (errors === _errs107) {
                                                  if (errors === _errs107) {
                                                    if (typeof data38 === "string") {
                                                      if (func2(data38) > 36) {
                                                        const err83 = { instancePath: instancePath + "/exercises/" + i7 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/1/contains/properties/instructionAudioAssetId/anyOf/0/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                        if (vErrors === null) {
                                                          vErrors = [err83];
                                                        } else {
                                                          vErrors.push(err83);
                                                        }
                                                        errors++;
                                                      } else {
                                                        if (func2(data38) < 36) {
                                                          const err84 = { instancePath: instancePath + "/exercises/" + i7 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/1/contains/properties/instructionAudioAssetId/anyOf/0/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                          if (vErrors === null) {
                                                            vErrors = [err84];
                                                          } else {
                                                            vErrors.push(err84);
                                                          }
                                                          errors++;
                                                        } else {
                                                          if (!formats0.test(data38)) {
                                                            const err85 = { instancePath: instancePath + "/exercises/" + i7 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/1/contains/properties/instructionAudioAssetId/anyOf/0/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                            if (vErrors === null) {
                                                              vErrors = [err85];
                                                            } else {
                                                              vErrors.push(err85);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      const err86 = { instancePath: instancePath + "/exercises/" + i7 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/1/contains/properties/instructionAudioAssetId/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err86];
                                                      } else {
                                                        vErrors.push(err86);
                                                      }
                                                      errors++;
                                                    }
                                                  }
                                                }
                                                var _valid4 = _errs107 === errors;
                                                valid21 = valid21 || _valid4;
                                                if (!valid21) {
                                                  const _errs109 = errors;
                                                  if (data38 !== null) {
                                                    const err87 = { instancePath: instancePath + "/exercises/" + i7 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/1/contains/properties/instructionAudioAssetId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                    if (vErrors === null) {
                                                      vErrors = [err87];
                                                    } else {
                                                      vErrors.push(err87);
                                                    }
                                                    errors++;
                                                  }
                                                  var _valid4 = _errs109 === errors;
                                                  valid21 = valid21 || _valid4;
                                                }
                                                if (!valid21) {
                                                  const err88 = { instancePath: instancePath + "/exercises/" + i7 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/1/contains/properties/instructionAudioAssetId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                  if (vErrors === null) {
                                                    vErrors = [err88];
                                                  } else {
                                                    vErrors.push(err88);
                                                  }
                                                  errors++;
                                                } else {
                                                  errors = _errs106;
                                                  if (vErrors !== null) {
                                                    if (_errs106) {
                                                      vErrors.length = _errs106;
                                                    } else {
                                                      vErrors = null;
                                                    }
                                                  }
                                                }
                                                var valid18 = _errs105 === errors;
                                              } else {
                                                var valid18 = true;
                                              }
                                              if (valid18) {
                                                if (data33.hintId !== void 0) {
                                                  let data39 = data33.hintId;
                                                  const _errs111 = errors;
                                                  if (errors === _errs111) {
                                                    if (errors === _errs111) {
                                                      if (typeof data39 === "string") {
                                                        if (func2(data39) > 36) {
                                                          const err89 = { instancePath: instancePath + "/exercises/" + i7 + "/hintId", schemaPath: "#/properties/exercises/allOf/1/contains/properties/hintId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                          if (vErrors === null) {
                                                            vErrors = [err89];
                                                          } else {
                                                            vErrors.push(err89);
                                                          }
                                                          errors++;
                                                        } else {
                                                          if (func2(data39) < 36) {
                                                            const err90 = { instancePath: instancePath + "/exercises/" + i7 + "/hintId", schemaPath: "#/properties/exercises/allOf/1/contains/properties/hintId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                            if (vErrors === null) {
                                                              vErrors = [err90];
                                                            } else {
                                                              vErrors.push(err90);
                                                            }
                                                            errors++;
                                                          } else {
                                                            if (!formats0.test(data39)) {
                                                              const err91 = { instancePath: instancePath + "/exercises/" + i7 + "/hintId", schemaPath: "#/properties/exercises/allOf/1/contains/properties/hintId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                              if (vErrors === null) {
                                                                vErrors = [err91];
                                                              } else {
                                                                vErrors.push(err91);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        const err92 = { instancePath: instancePath + "/exercises/" + i7 + "/hintId", schemaPath: "#/properties/exercises/allOf/1/contains/properties/hintId/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err92];
                                                        } else {
                                                          vErrors.push(err92);
                                                        }
                                                        errors++;
                                                      }
                                                    }
                                                  }
                                                  var valid18 = _errs111 === errors;
                                                } else {
                                                  var valid18 = true;
                                                }
                                                if (valid18) {
                                                  if (data33.type !== void 0) {
                                                    let data40 = data33.type;
                                                    const _errs113 = errors;
                                                    if (typeof data40 !== "string") {
                                                      const err93 = { instancePath: instancePath + "/exercises/" + i7 + "/type", schemaPath: "#/properties/exercises/allOf/1/contains/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err93];
                                                      } else {
                                                        vErrors.push(err93);
                                                      }
                                                      errors++;
                                                    }
                                                    if ("match" !== data40) {
                                                      const err94 = { instancePath: instancePath + "/exercises/" + i7 + "/type", schemaPath: "#/properties/exercises/allOf/1/contains/properties/type/const", keyword: "const", params: { allowedValue: "match" }, message: "must be equal to constant" };
                                                      if (vErrors === null) {
                                                        vErrors = [err94];
                                                      } else {
                                                        vErrors.push(err94);
                                                      }
                                                      errors++;
                                                    }
                                                    var valid18 = _errs113 === errors;
                                                  } else {
                                                    var valid18 = true;
                                                  }
                                                  if (valid18) {
                                                    if (data33.leftItems !== void 0) {
                                                      let data41 = data33.leftItems;
                                                      const _errs115 = errors;
                                                      if (errors === _errs115) {
                                                        if (Array.isArray(data41)) {
                                                          if (data41.length > 3) {
                                                            const err95 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                            if (vErrors === null) {
                                                              vErrors = [err95];
                                                            } else {
                                                              vErrors.push(err95);
                                                            }
                                                            errors++;
                                                          } else {
                                                            if (data41.length < 2) {
                                                              const err96 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" };
                                                              if (vErrors === null) {
                                                                vErrors = [err96];
                                                              } else {
                                                                vErrors.push(err96);
                                                              }
                                                              errors++;
                                                            } else {
                                                              var valid22 = true;
                                                              const len7 = data41.length;
                                                              for (let i10 = 0; i10 < len7; i10++) {
                                                                let data42 = data41[i10];
                                                                const _errs117 = errors;
                                                                if (errors === _errs117) {
                                                                  if (data42 && typeof data42 == "object" && !Array.isArray(data42)) {
                                                                    let missing6;
                                                                    if (data42.id === void 0 && (missing6 = "id") || data42.text === void 0 && (missing6 = "text")) {
                                                                      const err97 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10, schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/required", keyword: "required", params: { missingProperty: missing6 }, message: "must have required property '" + missing6 + "'" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err97];
                                                                      } else {
                                                                        vErrors.push(err97);
                                                                      }
                                                                      errors++;
                                                                    } else {
                                                                      const _errs119 = errors;
                                                                      for (const key6 in data42) {
                                                                        if (!(key6 === "id" || key6 === "text")) {
                                                                          const err98 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10, schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key6 }, message: "must NOT have additional properties" };
                                                                          if (vErrors === null) {
                                                                            vErrors = [err98];
                                                                          } else {
                                                                            vErrors.push(err98);
                                                                          }
                                                                          errors++;
                                                                          break;
                                                                        }
                                                                      }
                                                                      if (_errs119 === errors) {
                                                                        if (data42.id !== void 0) {
                                                                          let data43 = data42.id;
                                                                          const _errs120 = errors;
                                                                          if (errors === _errs120) {
                                                                            if (errors === _errs120) {
                                                                              if (typeof data43 === "string") {
                                                                                if (func2(data43) > 36) {
                                                                                  const err99 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err99];
                                                                                  } else {
                                                                                    vErrors.push(err99);
                                                                                  }
                                                                                  errors++;
                                                                                } else {
                                                                                  if (func2(data43) < 36) {
                                                                                    const err100 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err100];
                                                                                    } else {
                                                                                      vErrors.push(err100);
                                                                                    }
                                                                                    errors++;
                                                                                  } else {
                                                                                    if (!formats0.test(data43)) {
                                                                                      const err101 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err101];
                                                                                      } else {
                                                                                        vErrors.push(err101);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                  }
                                                                                }
                                                                              } else {
                                                                                const err102 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err102];
                                                                                } else {
                                                                                  vErrors.push(err102);
                                                                                }
                                                                                errors++;
                                                                              }
                                                                            }
                                                                          }
                                                                          var valid23 = _errs120 === errors;
                                                                        } else {
                                                                          var valid23 = true;
                                                                        }
                                                                        if (valid23) {
                                                                          if (data42.text !== void 0) {
                                                                            let data44 = data42.text;
                                                                            const _errs122 = errors;
                                                                            if (errors === _errs122) {
                                                                              if (typeof data44 === "string") {
                                                                                if (func2(data44) > 200) {
                                                                                  const err103 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10 + "/text", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/properties/text/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err103];
                                                                                  } else {
                                                                                    vErrors.push(err103);
                                                                                  }
                                                                                  errors++;
                                                                                } else {
                                                                                  if (func2(data44) < 1) {
                                                                                    const err104 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10 + "/text", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/properties/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err104];
                                                                                    } else {
                                                                                      vErrors.push(err104);
                                                                                    }
                                                                                    errors++;
                                                                                  } else {
                                                                                    if (!pattern1.test(data44)) {
                                                                                      const err105 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10 + "/text", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/properties/text/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err105];
                                                                                      } else {
                                                                                        vErrors.push(err105);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                  }
                                                                                }
                                                                              } else {
                                                                                const err106 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10 + "/text", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/properties/text/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err106];
                                                                                } else {
                                                                                  vErrors.push(err106);
                                                                                }
                                                                                errors++;
                                                                              }
                                                                            }
                                                                            var valid23 = _errs122 === errors;
                                                                          } else {
                                                                            var valid23 = true;
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  } else {
                                                                    const err107 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems/" + i10, schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err107];
                                                                    } else {
                                                                      vErrors.push(err107);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                }
                                                                var valid22 = _errs117 === errors;
                                                                if (!valid22) {
                                                                  break;
                                                                }
                                                              }
                                                              if (valid22) {
                                                                let i11 = data41.length;
                                                                let j3;
                                                                if (i11 > 1) {
                                                                  outer1: for (; i11--; ) {
                                                                    for (j3 = i11; j3--; ) {
                                                                      if (func0(data41[i11], data41[j3])) {
                                                                        const err108 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/uniqueItems", keyword: "uniqueItems", params: { i: i11, j: j3 }, message: "must NOT have duplicate items (items ## " + j3 + " and " + i11 + " are identical)" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err108];
                                                                        } else {
                                                                          vErrors.push(err108);
                                                                        }
                                                                        errors++;
                                                                        break outer1;
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        } else {
                                                          const err109 = { instancePath: instancePath + "/exercises/" + i7 + "/leftItems", schemaPath: "#/properties/exercises/allOf/1/contains/properties/leftItems/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                          if (vErrors === null) {
                                                            vErrors = [err109];
                                                          } else {
                                                            vErrors.push(err109);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                      var valid18 = _errs115 === errors;
                                                    } else {
                                                      var valid18 = true;
                                                    }
                                                    if (valid18) {
                                                      if (data33.rightItems !== void 0) {
                                                        let data45 = data33.rightItems;
                                                        const _errs124 = errors;
                                                        if (errors === _errs124) {
                                                          if (Array.isArray(data45)) {
                                                            if (data45.length > 3) {
                                                              const err110 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                              if (vErrors === null) {
                                                                vErrors = [err110];
                                                              } else {
                                                                vErrors.push(err110);
                                                              }
                                                              errors++;
                                                            } else {
                                                              if (data45.length < 2) {
                                                                const err111 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err111];
                                                                } else {
                                                                  vErrors.push(err111);
                                                                }
                                                                errors++;
                                                              } else {
                                                                var valid25 = true;
                                                                const len8 = data45.length;
                                                                for (let i12 = 0; i12 < len8; i12++) {
                                                                  let data46 = data45[i12];
                                                                  const _errs126 = errors;
                                                                  if (errors === _errs126) {
                                                                    if (data46 && typeof data46 == "object" && !Array.isArray(data46)) {
                                                                      let missing7;
                                                                      if (data46.id === void 0 && (missing7 = "id") || data46.text === void 0 && (missing7 = "text")) {
                                                                        const err112 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12, schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/required", keyword: "required", params: { missingProperty: missing7 }, message: "must have required property '" + missing7 + "'" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err112];
                                                                        } else {
                                                                          vErrors.push(err112);
                                                                        }
                                                                        errors++;
                                                                      } else {
                                                                        const _errs128 = errors;
                                                                        for (const key7 in data46) {
                                                                          if (!(key7 === "id" || key7 === "text")) {
                                                                            const err113 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12, schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key7 }, message: "must NOT have additional properties" };
                                                                            if (vErrors === null) {
                                                                              vErrors = [err113];
                                                                            } else {
                                                                              vErrors.push(err113);
                                                                            }
                                                                            errors++;
                                                                            break;
                                                                          }
                                                                        }
                                                                        if (_errs128 === errors) {
                                                                          if (data46.id !== void 0) {
                                                                            let data47 = data46.id;
                                                                            const _errs129 = errors;
                                                                            if (errors === _errs129) {
                                                                              if (errors === _errs129) {
                                                                                if (typeof data47 === "string") {
                                                                                  if (func2(data47) > 36) {
                                                                                    const err114 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err114];
                                                                                    } else {
                                                                                      vErrors.push(err114);
                                                                                    }
                                                                                    errors++;
                                                                                  } else {
                                                                                    if (func2(data47) < 36) {
                                                                                      const err115 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err115];
                                                                                      } else {
                                                                                        vErrors.push(err115);
                                                                                      }
                                                                                      errors++;
                                                                                    } else {
                                                                                      if (!formats0.test(data47)) {
                                                                                        const err116 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err116];
                                                                                        } else {
                                                                                          vErrors.push(err116);
                                                                                        }
                                                                                        errors++;
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                } else {
                                                                                  const err117 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12 + "/id", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err117];
                                                                                  } else {
                                                                                    vErrors.push(err117);
                                                                                  }
                                                                                  errors++;
                                                                                }
                                                                              }
                                                                            }
                                                                            var valid26 = _errs129 === errors;
                                                                          } else {
                                                                            var valid26 = true;
                                                                          }
                                                                          if (valid26) {
                                                                            if (data46.text !== void 0) {
                                                                              let data48 = data46.text;
                                                                              const _errs131 = errors;
                                                                              if (errors === _errs131) {
                                                                                if (typeof data48 === "string") {
                                                                                  if (func2(data48) > 200) {
                                                                                    const err118 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12 + "/text", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/properties/text/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err118];
                                                                                    } else {
                                                                                      vErrors.push(err118);
                                                                                    }
                                                                                    errors++;
                                                                                  } else {
                                                                                    if (func2(data48) < 1) {
                                                                                      const err119 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12 + "/text", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/properties/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err119];
                                                                                      } else {
                                                                                        vErrors.push(err119);
                                                                                      }
                                                                                      errors++;
                                                                                    } else {
                                                                                      if (!pattern1.test(data48)) {
                                                                                        const err120 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12 + "/text", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/properties/text/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err120];
                                                                                        } else {
                                                                                          vErrors.push(err120);
                                                                                        }
                                                                                        errors++;
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                } else {
                                                                                  const err121 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12 + "/text", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/properties/text/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err121];
                                                                                  } else {
                                                                                    vErrors.push(err121);
                                                                                  }
                                                                                  errors++;
                                                                                }
                                                                              }
                                                                              var valid26 = _errs131 === errors;
                                                                            } else {
                                                                              var valid26 = true;
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    } else {
                                                                      const err122 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems/" + i12, schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err122];
                                                                      } else {
                                                                        vErrors.push(err122);
                                                                      }
                                                                      errors++;
                                                                    }
                                                                  }
                                                                  var valid25 = _errs126 === errors;
                                                                  if (!valid25) {
                                                                    break;
                                                                  }
                                                                }
                                                                if (valid25) {
                                                                  let i13 = data45.length;
                                                                  let j4;
                                                                  if (i13 > 1) {
                                                                    outer2: for (; i13--; ) {
                                                                      for (j4 = i13; j4--; ) {
                                                                        if (func0(data45[i13], data45[j4])) {
                                                                          const err123 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/uniqueItems", keyword: "uniqueItems", params: { i: i13, j: j4 }, message: "must NOT have duplicate items (items ## " + j4 + " and " + i13 + " are identical)" };
                                                                          if (vErrors === null) {
                                                                            vErrors = [err123];
                                                                          } else {
                                                                            vErrors.push(err123);
                                                                          }
                                                                          errors++;
                                                                          break outer2;
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          } else {
                                                            const err124 = { instancePath: instancePath + "/exercises/" + i7 + "/rightItems", schemaPath: "#/properties/exercises/allOf/1/contains/properties/rightItems/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                            if (vErrors === null) {
                                                              vErrors = [err124];
                                                            } else {
                                                              vErrors.push(err124);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                        var valid18 = _errs124 === errors;
                                                      } else {
                                                        var valid18 = true;
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    const err125 = { instancePath: instancePath + "/exercises/" + i7, schemaPath: "#/properties/exercises/allOf/1/contains/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                    if (vErrors === null) {
                                      vErrors = [err125];
                                    } else {
                                      vErrors.push(err125);
                                    }
                                    errors++;
                                  }
                                }
                                var valid17 = _errs94 === errors;
                                if (valid17) {
                                  break;
                                }
                              }
                              if (!valid17) {
                                validate21.errors = [{ instancePath: instancePath + "/exercises", schemaPath: "#/properties/exercises/allOf/1/contains", keyword: "contains", params: { minContains: 1 }, message: "must contain at least 1 valid item(s)" }];
                                return false;
                              } else {
                                errors = _errs93;
                                if (vErrors !== null) {
                                  if (_errs93) {
                                    vErrors.length = _errs93;
                                  } else {
                                    vErrors = null;
                                  }
                                }
                              }
                            }
                            var valid8 = _errs92 === errors;
                            if (valid8) {
                              const _errs133 = errors;
                              if (Array.isArray(data20)) {
                                const _errs134 = errors;
                                const len9 = data20.length;
                                for (let i14 = 0; i14 < len9; i14++) {
                                  let data49 = data20[i14];
                                  const _errs135 = errors;
                                  if (errors === _errs135) {
                                    if (data49 && typeof data49 == "object" && !Array.isArray(data49)) {
                                      let missing8;
                                      if (data49.id === void 0 && (missing8 = "id") || data49.targetVocabIds === void 0 && (missing8 = "targetVocabIds") || data49.promptZh === void 0 && (missing8 = "promptZh") || data49.instructionAudioAssetId === void 0 && (missing8 = "instructionAudioAssetId") || data49.hintId === void 0 && (missing8 = "hintId") || data49.type === void 0 && (missing8 = "type") || data49.sentenceEn === void 0 && (missing8 = "sentenceEn") || data49.options === void 0 && (missing8 = "options")) {
                                        const err126 = { instancePath: instancePath + "/exercises/" + i14, schemaPath: "#/properties/exercises/allOf/2/contains/required", keyword: "required", params: { missingProperty: missing8 }, message: "must have required property '" + missing8 + "'" };
                                        if (vErrors === null) {
                                          vErrors = [err126];
                                        } else {
                                          vErrors.push(err126);
                                        }
                                        errors++;
                                      } else {
                                        const _errs137 = errors;
                                        for (const key8 in data49) {
                                          if (!(key8 === "id" || key8 === "targetVocabIds" || key8 === "promptZh" || key8 === "instructionAudioAssetId" || key8 === "hintId" || key8 === "type" || key8 === "sentenceEn" || key8 === "options")) {
                                            const err127 = { instancePath: instancePath + "/exercises/" + i14, schemaPath: "#/properties/exercises/allOf/2/contains/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key8 }, message: "must NOT have additional properties" };
                                            if (vErrors === null) {
                                              vErrors = [err127];
                                            } else {
                                              vErrors.push(err127);
                                            }
                                            errors++;
                                            break;
                                          }
                                        }
                                        if (_errs137 === errors) {
                                          if (data49.id !== void 0) {
                                            let data50 = data49.id;
                                            const _errs138 = errors;
                                            if (errors === _errs138) {
                                              if (errors === _errs138) {
                                                if (typeof data50 === "string") {
                                                  if (func2(data50) > 36) {
                                                    const err128 = { instancePath: instancePath + "/exercises/" + i14 + "/id", schemaPath: "#/properties/exercises/allOf/2/contains/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                    if (vErrors === null) {
                                                      vErrors = [err128];
                                                    } else {
                                                      vErrors.push(err128);
                                                    }
                                                    errors++;
                                                  } else {
                                                    if (func2(data50) < 36) {
                                                      const err129 = { instancePath: instancePath + "/exercises/" + i14 + "/id", schemaPath: "#/properties/exercises/allOf/2/contains/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                      if (vErrors === null) {
                                                        vErrors = [err129];
                                                      } else {
                                                        vErrors.push(err129);
                                                      }
                                                      errors++;
                                                    } else {
                                                      if (!formats0.test(data50)) {
                                                        const err130 = { instancePath: instancePath + "/exercises/" + i14 + "/id", schemaPath: "#/properties/exercises/allOf/2/contains/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                        if (vErrors === null) {
                                                          vErrors = [err130];
                                                        } else {
                                                          vErrors.push(err130);
                                                        }
                                                        errors++;
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  const err131 = { instancePath: instancePath + "/exercises/" + i14 + "/id", schemaPath: "#/properties/exercises/allOf/2/contains/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                  if (vErrors === null) {
                                                    vErrors = [err131];
                                                  } else {
                                                    vErrors.push(err131);
                                                  }
                                                  errors++;
                                                }
                                              }
                                            }
                                            var valid29 = _errs138 === errors;
                                          } else {
                                            var valid29 = true;
                                          }
                                          if (valid29) {
                                            if (data49.targetVocabIds !== void 0) {
                                              let data51 = data49.targetVocabIds;
                                              const _errs140 = errors;
                                              if (errors === _errs140) {
                                                if (Array.isArray(data51)) {
                                                  if (data51.length > 3) {
                                                    const err132 = { instancePath: instancePath + "/exercises/" + i14 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/2/contains/properties/targetVocabIds/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                    if (vErrors === null) {
                                                      vErrors = [err132];
                                                    } else {
                                                      vErrors.push(err132);
                                                    }
                                                    errors++;
                                                  } else {
                                                    if (data51.length < 1) {
                                                      const err133 = { instancePath: instancePath + "/exercises/" + i14 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/2/contains/properties/targetVocabIds/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                                                      if (vErrors === null) {
                                                        vErrors = [err133];
                                                      } else {
                                                        vErrors.push(err133);
                                                      }
                                                      errors++;
                                                    } else {
                                                      var valid30 = true;
                                                      const len10 = data51.length;
                                                      for (let i15 = 0; i15 < len10; i15++) {
                                                        let data52 = data51[i15];
                                                        const _errs142 = errors;
                                                        if (errors === _errs142) {
                                                          if (errors === _errs142) {
                                                            if (typeof data52 === "string") {
                                                              if (func2(data52) > 36) {
                                                                const err134 = { instancePath: instancePath + "/exercises/" + i14 + "/targetVocabIds/" + i15, schemaPath: "#/properties/exercises/allOf/2/contains/properties/targetVocabIds/items/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err134];
                                                                } else {
                                                                  vErrors.push(err134);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (func2(data52) < 36) {
                                                                  const err135 = { instancePath: instancePath + "/exercises/" + i14 + "/targetVocabIds/" + i15, schemaPath: "#/properties/exercises/allOf/2/contains/properties/targetVocabIds/items/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err135];
                                                                  } else {
                                                                    vErrors.push(err135);
                                                                  }
                                                                  errors++;
                                                                } else {
                                                                  if (!formats0.test(data52)) {
                                                                    const err136 = { instancePath: instancePath + "/exercises/" + i14 + "/targetVocabIds/" + i15, schemaPath: "#/properties/exercises/allOf/2/contains/properties/targetVocabIds/items/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err136];
                                                                    } else {
                                                                      vErrors.push(err136);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                }
                                                              }
                                                            } else {
                                                              const err137 = { instancePath: instancePath + "/exercises/" + i14 + "/targetVocabIds/" + i15, schemaPath: "#/properties/exercises/allOf/2/contains/properties/targetVocabIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                              if (vErrors === null) {
                                                                vErrors = [err137];
                                                              } else {
                                                                vErrors.push(err137);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                        }
                                                        var valid30 = _errs142 === errors;
                                                        if (!valid30) {
                                                          break;
                                                        }
                                                      }
                                                      if (valid30) {
                                                        let i16 = data51.length;
                                                        let j5;
                                                        if (i16 > 1) {
                                                          const indices2 = {};
                                                          for (; i16--; ) {
                                                            let item2 = data51[i16];
                                                            if (typeof item2 !== "string") {
                                                              continue;
                                                            }
                                                            if (typeof indices2[item2] == "number") {
                                                              j5 = indices2[item2];
                                                              const err138 = { instancePath: instancePath + "/exercises/" + i14 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/2/contains/properties/targetVocabIds/uniqueItems", keyword: "uniqueItems", params: { i: i16, j: j5 }, message: "must NOT have duplicate items (items ## " + j5 + " and " + i16 + " are identical)" };
                                                              if (vErrors === null) {
                                                                vErrors = [err138];
                                                              } else {
                                                                vErrors.push(err138);
                                                              }
                                                              errors++;
                                                              break;
                                                            }
                                                            indices2[item2] = i16;
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  const err139 = { instancePath: instancePath + "/exercises/" + i14 + "/targetVocabIds", schemaPath: "#/properties/exercises/allOf/2/contains/properties/targetVocabIds/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                  if (vErrors === null) {
                                                    vErrors = [err139];
                                                  } else {
                                                    vErrors.push(err139);
                                                  }
                                                  errors++;
                                                }
                                              }
                                              var valid29 = _errs140 === errors;
                                            } else {
                                              var valid29 = true;
                                            }
                                            if (valid29) {
                                              if (data49.promptZh !== void 0) {
                                                let data53 = data49.promptZh;
                                                const _errs144 = errors;
                                                if (errors === _errs144) {
                                                  if (typeof data53 === "string") {
                                                    if (func2(data53) > 200) {
                                                      const err140 = { instancePath: instancePath + "/exercises/" + i14 + "/promptZh", schemaPath: "#/properties/exercises/allOf/2/contains/properties/promptZh/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                      if (vErrors === null) {
                                                        vErrors = [err140];
                                                      } else {
                                                        vErrors.push(err140);
                                                      }
                                                      errors++;
                                                    } else {
                                                      if (func2(data53) < 1) {
                                                        const err141 = { instancePath: instancePath + "/exercises/" + i14 + "/promptZh", schemaPath: "#/properties/exercises/allOf/2/contains/properties/promptZh/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                        if (vErrors === null) {
                                                          vErrors = [err141];
                                                        } else {
                                                          vErrors.push(err141);
                                                        }
                                                        errors++;
                                                      } else {
                                                        if (!pattern1.test(data53)) {
                                                          const err142 = { instancePath: instancePath + "/exercises/" + i14 + "/promptZh", schemaPath: "#/properties/exercises/allOf/2/contains/properties/promptZh/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                          if (vErrors === null) {
                                                            vErrors = [err142];
                                                          } else {
                                                            vErrors.push(err142);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    const err143 = { instancePath: instancePath + "/exercises/" + i14 + "/promptZh", schemaPath: "#/properties/exercises/allOf/2/contains/properties/promptZh/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err143];
                                                    } else {
                                                      vErrors.push(err143);
                                                    }
                                                    errors++;
                                                  }
                                                }
                                                var valid29 = _errs144 === errors;
                                              } else {
                                                var valid29 = true;
                                              }
                                              if (valid29) {
                                                if (data49.instructionAudioAssetId !== void 0) {
                                                  let data54 = data49.instructionAudioAssetId;
                                                  const _errs146 = errors;
                                                  const _errs147 = errors;
                                                  let valid32 = false;
                                                  const _errs148 = errors;
                                                  if (errors === _errs148) {
                                                    if (errors === _errs148) {
                                                      if (typeof data54 === "string") {
                                                        if (func2(data54) > 36) {
                                                          const err144 = { instancePath: instancePath + "/exercises/" + i14 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/2/contains/properties/instructionAudioAssetId/anyOf/0/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                          if (vErrors === null) {
                                                            vErrors = [err144];
                                                          } else {
                                                            vErrors.push(err144);
                                                          }
                                                          errors++;
                                                        } else {
                                                          if (func2(data54) < 36) {
                                                            const err145 = { instancePath: instancePath + "/exercises/" + i14 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/2/contains/properties/instructionAudioAssetId/anyOf/0/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                            if (vErrors === null) {
                                                              vErrors = [err145];
                                                            } else {
                                                              vErrors.push(err145);
                                                            }
                                                            errors++;
                                                          } else {
                                                            if (!formats0.test(data54)) {
                                                              const err146 = { instancePath: instancePath + "/exercises/" + i14 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/2/contains/properties/instructionAudioAssetId/anyOf/0/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                              if (vErrors === null) {
                                                                vErrors = [err146];
                                                              } else {
                                                                vErrors.push(err146);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        const err147 = { instancePath: instancePath + "/exercises/" + i14 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/2/contains/properties/instructionAudioAssetId/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err147];
                                                        } else {
                                                          vErrors.push(err147);
                                                        }
                                                        errors++;
                                                      }
                                                    }
                                                  }
                                                  var _valid5 = _errs148 === errors;
                                                  valid32 = valid32 || _valid5;
                                                  if (!valid32) {
                                                    const _errs150 = errors;
                                                    if (data54 !== null) {
                                                      const err148 = { instancePath: instancePath + "/exercises/" + i14 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/2/contains/properties/instructionAudioAssetId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                      if (vErrors === null) {
                                                        vErrors = [err148];
                                                      } else {
                                                        vErrors.push(err148);
                                                      }
                                                      errors++;
                                                    }
                                                    var _valid5 = _errs150 === errors;
                                                    valid32 = valid32 || _valid5;
                                                  }
                                                  if (!valid32) {
                                                    const err149 = { instancePath: instancePath + "/exercises/" + i14 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/allOf/2/contains/properties/instructionAudioAssetId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                    if (vErrors === null) {
                                                      vErrors = [err149];
                                                    } else {
                                                      vErrors.push(err149);
                                                    }
                                                    errors++;
                                                  } else {
                                                    errors = _errs147;
                                                    if (vErrors !== null) {
                                                      if (_errs147) {
                                                        vErrors.length = _errs147;
                                                      } else {
                                                        vErrors = null;
                                                      }
                                                    }
                                                  }
                                                  var valid29 = _errs146 === errors;
                                                } else {
                                                  var valid29 = true;
                                                }
                                                if (valid29) {
                                                  if (data49.hintId !== void 0) {
                                                    let data55 = data49.hintId;
                                                    const _errs152 = errors;
                                                    if (errors === _errs152) {
                                                      if (errors === _errs152) {
                                                        if (typeof data55 === "string") {
                                                          if (func2(data55) > 36) {
                                                            const err150 = { instancePath: instancePath + "/exercises/" + i14 + "/hintId", schemaPath: "#/properties/exercises/allOf/2/contains/properties/hintId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                            if (vErrors === null) {
                                                              vErrors = [err150];
                                                            } else {
                                                              vErrors.push(err150);
                                                            }
                                                            errors++;
                                                          } else {
                                                            if (func2(data55) < 36) {
                                                              const err151 = { instancePath: instancePath + "/exercises/" + i14 + "/hintId", schemaPath: "#/properties/exercises/allOf/2/contains/properties/hintId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                              if (vErrors === null) {
                                                                vErrors = [err151];
                                                              } else {
                                                                vErrors.push(err151);
                                                              }
                                                              errors++;
                                                            } else {
                                                              if (!formats0.test(data55)) {
                                                                const err152 = { instancePath: instancePath + "/exercises/" + i14 + "/hintId", schemaPath: "#/properties/exercises/allOf/2/contains/properties/hintId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                if (vErrors === null) {
                                                                  vErrors = [err152];
                                                                } else {
                                                                  vErrors.push(err152);
                                                                }
                                                                errors++;
                                                              }
                                                            }
                                                          }
                                                        } else {
                                                          const err153 = { instancePath: instancePath + "/exercises/" + i14 + "/hintId", schemaPath: "#/properties/exercises/allOf/2/contains/properties/hintId/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                          if (vErrors === null) {
                                                            vErrors = [err153];
                                                          } else {
                                                            vErrors.push(err153);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                    }
                                                    var valid29 = _errs152 === errors;
                                                  } else {
                                                    var valid29 = true;
                                                  }
                                                  if (valid29) {
                                                    if (data49.type !== void 0) {
                                                      let data56 = data49.type;
                                                      const _errs154 = errors;
                                                      if (typeof data56 !== "string") {
                                                        const err154 = { instancePath: instancePath + "/exercises/" + i14 + "/type", schemaPath: "#/properties/exercises/allOf/2/contains/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err154];
                                                        } else {
                                                          vErrors.push(err154);
                                                        }
                                                        errors++;
                                                      }
                                                      if ("cloze" !== data56) {
                                                        const err155 = { instancePath: instancePath + "/exercises/" + i14 + "/type", schemaPath: "#/properties/exercises/allOf/2/contains/properties/type/const", keyword: "const", params: { allowedValue: "cloze" }, message: "must be equal to constant" };
                                                        if (vErrors === null) {
                                                          vErrors = [err155];
                                                        } else {
                                                          vErrors.push(err155);
                                                        }
                                                        errors++;
                                                      }
                                                      var valid29 = _errs154 === errors;
                                                    } else {
                                                      var valid29 = true;
                                                    }
                                                    if (valid29) {
                                                      if (data49.sentenceEn !== void 0) {
                                                        let data57 = data49.sentenceEn;
                                                        const _errs156 = errors;
                                                        if (errors === _errs156) {
                                                          if (typeof data57 === "string") {
                                                            if (func2(data57) > 500) {
                                                              const err156 = { instancePath: instancePath + "/exercises/" + i14 + "/sentenceEn", schemaPath: "#/properties/exercises/allOf/2/contains/properties/sentenceEn/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" };
                                                              if (vErrors === null) {
                                                                vErrors = [err156];
                                                              } else {
                                                                vErrors.push(err156);
                                                              }
                                                              errors++;
                                                            } else {
                                                              if (func2(data57) < 1) {
                                                                const err157 = { instancePath: instancePath + "/exercises/" + i14 + "/sentenceEn", schemaPath: "#/properties/exercises/allOf/2/contains/properties/sentenceEn/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err157];
                                                                } else {
                                                                  vErrors.push(err157);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (!pattern1.test(data57)) {
                                                                  const err158 = { instancePath: instancePath + "/exercises/" + i14 + "/sentenceEn", schemaPath: "#/properties/exercises/allOf/2/contains/properties/sentenceEn/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err158];
                                                                  } else {
                                                                    vErrors.push(err158);
                                                                  }
                                                                  errors++;
                                                                }
                                                              }
                                                            }
                                                          } else {
                                                            const err159 = { instancePath: instancePath + "/exercises/" + i14 + "/sentenceEn", schemaPath: "#/properties/exercises/allOf/2/contains/properties/sentenceEn/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                            if (vErrors === null) {
                                                              vErrors = [err159];
                                                            } else {
                                                              vErrors.push(err159);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                        var valid29 = _errs156 === errors;
                                                      } else {
                                                        var valid29 = true;
                                                      }
                                                      if (valid29) {
                                                        if (data49.options !== void 0) {
                                                          let data58 = data49.options;
                                                          const _errs158 = errors;
                                                          if (errors === _errs158) {
                                                            if (Array.isArray(data58)) {
                                                              if (data58.length > 3) {
                                                                const err160 = { instancePath: instancePath + "/exercises/" + i14 + "/options", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err160];
                                                                } else {
                                                                  vErrors.push(err160);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (data58.length < 2) {
                                                                  const err161 = { instancePath: instancePath + "/exercises/" + i14 + "/options", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err161];
                                                                  } else {
                                                                    vErrors.push(err161);
                                                                  }
                                                                  errors++;
                                                                } else {
                                                                  var valid33 = true;
                                                                  const len11 = data58.length;
                                                                  for (let i17 = 0; i17 < len11; i17++) {
                                                                    let data59 = data58[i17];
                                                                    const _errs160 = errors;
                                                                    if (errors === _errs160) {
                                                                      if (data59 && typeof data59 == "object" && !Array.isArray(data59)) {
                                                                        let missing9;
                                                                        if (data59.id === void 0 && (missing9 = "id") || data59.text === void 0 && (missing9 = "text")) {
                                                                          const err162 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17, schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/required", keyword: "required", params: { missingProperty: missing9 }, message: "must have required property '" + missing9 + "'" };
                                                                          if (vErrors === null) {
                                                                            vErrors = [err162];
                                                                          } else {
                                                                            vErrors.push(err162);
                                                                          }
                                                                          errors++;
                                                                        } else {
                                                                          const _errs162 = errors;
                                                                          for (const key9 in data59) {
                                                                            if (!(key9 === "id" || key9 === "text")) {
                                                                              const err163 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17, schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key9 }, message: "must NOT have additional properties" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err163];
                                                                              } else {
                                                                                vErrors.push(err163);
                                                                              }
                                                                              errors++;
                                                                              break;
                                                                            }
                                                                          }
                                                                          if (_errs162 === errors) {
                                                                            if (data59.id !== void 0) {
                                                                              let data60 = data59.id;
                                                                              const _errs163 = errors;
                                                                              if (errors === _errs163) {
                                                                                if (errors === _errs163) {
                                                                                  if (typeof data60 === "string") {
                                                                                    if (func2(data60) > 36) {
                                                                                      const err164 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17 + "/id", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err164];
                                                                                      } else {
                                                                                        vErrors.push(err164);
                                                                                      }
                                                                                      errors++;
                                                                                    } else {
                                                                                      if (func2(data60) < 36) {
                                                                                        const err165 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17 + "/id", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err165];
                                                                                        } else {
                                                                                          vErrors.push(err165);
                                                                                        }
                                                                                        errors++;
                                                                                      } else {
                                                                                        if (!formats0.test(data60)) {
                                                                                          const err166 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17 + "/id", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err166];
                                                                                          } else {
                                                                                            vErrors.push(err166);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  } else {
                                                                                    const err167 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17 + "/id", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err167];
                                                                                    } else {
                                                                                      vErrors.push(err167);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                }
                                                                              }
                                                                              var valid34 = _errs163 === errors;
                                                                            } else {
                                                                              var valid34 = true;
                                                                            }
                                                                            if (valid34) {
                                                                              if (data59.text !== void 0) {
                                                                                let data61 = data59.text;
                                                                                const _errs165 = errors;
                                                                                if (errors === _errs165) {
                                                                                  if (typeof data61 === "string") {
                                                                                    if (func2(data61) > 200) {
                                                                                      const err168 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17 + "/text", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/properties/text/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err168];
                                                                                      } else {
                                                                                        vErrors.push(err168);
                                                                                      }
                                                                                      errors++;
                                                                                    } else {
                                                                                      if (func2(data61) < 1) {
                                                                                        const err169 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17 + "/text", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/properties/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err169];
                                                                                        } else {
                                                                                          vErrors.push(err169);
                                                                                        }
                                                                                        errors++;
                                                                                      } else {
                                                                                        if (!pattern1.test(data61)) {
                                                                                          const err170 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17 + "/text", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/properties/text/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err170];
                                                                                          } else {
                                                                                            vErrors.push(err170);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  } else {
                                                                                    const err171 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17 + "/text", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/properties/text/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err171];
                                                                                    } else {
                                                                                      vErrors.push(err171);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                }
                                                                                var valid34 = _errs165 === errors;
                                                                              } else {
                                                                                var valid34 = true;
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      } else {
                                                                        const err172 = { instancePath: instancePath + "/exercises/" + i14 + "/options/" + i17, schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err172];
                                                                        } else {
                                                                          vErrors.push(err172);
                                                                        }
                                                                        errors++;
                                                                      }
                                                                    }
                                                                    var valid33 = _errs160 === errors;
                                                                    if (!valid33) {
                                                                      break;
                                                                    }
                                                                  }
                                                                  if (valid33) {
                                                                    let i18 = data58.length;
                                                                    let j6;
                                                                    if (i18 > 1) {
                                                                      outer3: for (; i18--; ) {
                                                                        for (j6 = i18; j6--; ) {
                                                                          if (func0(data58[i18], data58[j6])) {
                                                                            const err173 = { instancePath: instancePath + "/exercises/" + i14 + "/options", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/uniqueItems", keyword: "uniqueItems", params: { i: i18, j: j6 }, message: "must NOT have duplicate items (items ## " + j6 + " and " + i18 + " are identical)" };
                                                                            if (vErrors === null) {
                                                                              vErrors = [err173];
                                                                            } else {
                                                                              vErrors.push(err173);
                                                                            }
                                                                            errors++;
                                                                            break outer3;
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            } else {
                                                              const err174 = { instancePath: instancePath + "/exercises/" + i14 + "/options", schemaPath: "#/properties/exercises/allOf/2/contains/properties/options/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                              if (vErrors === null) {
                                                                vErrors = [err174];
                                                              } else {
                                                                vErrors.push(err174);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                          var valid29 = _errs158 === errors;
                                                        } else {
                                                          var valid29 = true;
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    } else {
                                      const err175 = { instancePath: instancePath + "/exercises/" + i14, schemaPath: "#/properties/exercises/allOf/2/contains/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                      if (vErrors === null) {
                                        vErrors = [err175];
                                      } else {
                                        vErrors.push(err175);
                                      }
                                      errors++;
                                    }
                                  }
                                  var valid28 = _errs135 === errors;
                                  if (valid28) {
                                    break;
                                  }
                                }
                                if (!valid28) {
                                  validate21.errors = [{ instancePath: instancePath + "/exercises", schemaPath: "#/properties/exercises/allOf/2/contains", keyword: "contains", params: { minContains: 1 }, message: "must contain at least 1 valid item(s)" }];
                                  return false;
                                } else {
                                  errors = _errs134;
                                  if (vErrors !== null) {
                                    if (_errs134) {
                                      vErrors.length = _errs134;
                                    } else {
                                      vErrors = null;
                                    }
                                  }
                                }
                              }
                              var valid8 = _errs133 === errors;
                            }
                          }
                          if (errors === _errs58) {
                            if (Array.isArray(data20)) {
                              if (data20.length > 3) {
                                validate21.errors = [{ instancePath: instancePath + "/exercises", schemaPath: "#/properties/exercises/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" }];
                                return false;
                              } else {
                                if (data20.length < 3) {
                                  validate21.errors = [{ instancePath: instancePath + "/exercises", schemaPath: "#/properties/exercises/minItems", keyword: "minItems", params: { limit: 3 }, message: "must NOT have fewer than 3 items" }];
                                  return false;
                                } else {
                                  var valid36 = true;
                                  const len12 = data20.length;
                                  for (let i19 = 0; i19 < len12; i19++) {
                                    let data62 = data20[i19];
                                    const _errs167 = errors;
                                    const _errs168 = errors;
                                    let valid37 = false;
                                    const _errs169 = errors;
                                    if (errors === _errs169) {
                                      if (data62 && typeof data62 == "object" && !Array.isArray(data62)) {
                                        let missing10;
                                        if (data62.id === void 0 && (missing10 = "id") || data62.targetVocabIds === void 0 && (missing10 = "targetVocabIds") || data62.promptZh === void 0 && (missing10 = "promptZh") || data62.instructionAudioAssetId === void 0 && (missing10 = "instructionAudioAssetId") || data62.hintId === void 0 && (missing10 = "hintId") || data62.type === void 0 && (missing10 = "type") || data62.options === void 0 && (missing10 = "options")) {
                                          const err176 = { instancePath: instancePath + "/exercises/" + i19, schemaPath: "#/properties/exercises/items/anyOf/0/required", keyword: "required", params: { missingProperty: missing10 }, message: "must have required property '" + missing10 + "'" };
                                          if (vErrors === null) {
                                            vErrors = [err176];
                                          } else {
                                            vErrors.push(err176);
                                          }
                                          errors++;
                                        } else {
                                          const _errs171 = errors;
                                          for (const key10 in data62) {
                                            if (!(key10 === "id" || key10 === "targetVocabIds" || key10 === "promptZh" || key10 === "instructionAudioAssetId" || key10 === "hintId" || key10 === "type" || key10 === "options")) {
                                              const err177 = { instancePath: instancePath + "/exercises/" + i19, schemaPath: "#/properties/exercises/items/anyOf/0/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key10 }, message: "must NOT have additional properties" };
                                              if (vErrors === null) {
                                                vErrors = [err177];
                                              } else {
                                                vErrors.push(err177);
                                              }
                                              errors++;
                                              break;
                                            }
                                          }
                                          if (_errs171 === errors) {
                                            if (data62.id !== void 0) {
                                              let data63 = data62.id;
                                              const _errs172 = errors;
                                              if (errors === _errs172) {
                                                if (errors === _errs172) {
                                                  if (typeof data63 === "string") {
                                                    if (func2(data63) > 36) {
                                                      const err178 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/0/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                      if (vErrors === null) {
                                                        vErrors = [err178];
                                                      } else {
                                                        vErrors.push(err178);
                                                      }
                                                      errors++;
                                                    } else {
                                                      if (func2(data63) < 36) {
                                                        const err179 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/0/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                        if (vErrors === null) {
                                                          vErrors = [err179];
                                                        } else {
                                                          vErrors.push(err179);
                                                        }
                                                        errors++;
                                                      } else {
                                                        if (!formats0.test(data63)) {
                                                          const err180 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/0/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                          if (vErrors === null) {
                                                            vErrors = [err180];
                                                          } else {
                                                            vErrors.push(err180);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    const err181 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/0/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err181];
                                                    } else {
                                                      vErrors.push(err181);
                                                    }
                                                    errors++;
                                                  }
                                                }
                                              }
                                              var valid38 = _errs172 === errors;
                                            } else {
                                              var valid38 = true;
                                            }
                                            if (valid38) {
                                              if (data62.targetVocabIds !== void 0) {
                                                let data64 = data62.targetVocabIds;
                                                const _errs174 = errors;
                                                if (errors === _errs174) {
                                                  if (Array.isArray(data64)) {
                                                    if (data64.length > 3) {
                                                      const err182 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/0/properties/targetVocabIds/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                      if (vErrors === null) {
                                                        vErrors = [err182];
                                                      } else {
                                                        vErrors.push(err182);
                                                      }
                                                      errors++;
                                                    } else {
                                                      if (data64.length < 1) {
                                                        const err183 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/0/properties/targetVocabIds/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                                                        if (vErrors === null) {
                                                          vErrors = [err183];
                                                        } else {
                                                          vErrors.push(err183);
                                                        }
                                                        errors++;
                                                      } else {
                                                        var valid39 = true;
                                                        const len13 = data64.length;
                                                        for (let i20 = 0; i20 < len13; i20++) {
                                                          let data65 = data64[i20];
                                                          const _errs176 = errors;
                                                          if (errors === _errs176) {
                                                            if (errors === _errs176) {
                                                              if (typeof data65 === "string") {
                                                                if (func2(data65) > 36) {
                                                                  const err184 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i20, schemaPath: "#/properties/exercises/items/anyOf/0/properties/targetVocabIds/items/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err184];
                                                                  } else {
                                                                    vErrors.push(err184);
                                                                  }
                                                                  errors++;
                                                                } else {
                                                                  if (func2(data65) < 36) {
                                                                    const err185 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i20, schemaPath: "#/properties/exercises/items/anyOf/0/properties/targetVocabIds/items/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err185];
                                                                    } else {
                                                                      vErrors.push(err185);
                                                                    }
                                                                    errors++;
                                                                  } else {
                                                                    if (!formats0.test(data65)) {
                                                                      const err186 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i20, schemaPath: "#/properties/exercises/items/anyOf/0/properties/targetVocabIds/items/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err186];
                                                                      } else {
                                                                        vErrors.push(err186);
                                                                      }
                                                                      errors++;
                                                                    }
                                                                  }
                                                                }
                                                              } else {
                                                                const err187 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i20, schemaPath: "#/properties/exercises/items/anyOf/0/properties/targetVocabIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err187];
                                                                } else {
                                                                  vErrors.push(err187);
                                                                }
                                                                errors++;
                                                              }
                                                            }
                                                          }
                                                          var valid39 = _errs176 === errors;
                                                          if (!valid39) {
                                                            break;
                                                          }
                                                        }
                                                        if (valid39) {
                                                          let i21 = data64.length;
                                                          let j7;
                                                          if (i21 > 1) {
                                                            const indices3 = {};
                                                            for (; i21--; ) {
                                                              let item3 = data64[i21];
                                                              if (typeof item3 !== "string") {
                                                                continue;
                                                              }
                                                              if (typeof indices3[item3] == "number") {
                                                                j7 = indices3[item3];
                                                                const err188 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/0/properties/targetVocabIds/uniqueItems", keyword: "uniqueItems", params: { i: i21, j: j7 }, message: "must NOT have duplicate items (items ## " + j7 + " and " + i21 + " are identical)" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err188];
                                                                } else {
                                                                  vErrors.push(err188);
                                                                }
                                                                errors++;
                                                                break;
                                                              }
                                                              indices3[item3] = i21;
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    const err189 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/0/properties/targetVocabIds/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                    if (vErrors === null) {
                                                      vErrors = [err189];
                                                    } else {
                                                      vErrors.push(err189);
                                                    }
                                                    errors++;
                                                  }
                                                }
                                                var valid38 = _errs174 === errors;
                                              } else {
                                                var valid38 = true;
                                              }
                                              if (valid38) {
                                                if (data62.promptZh !== void 0) {
                                                  let data66 = data62.promptZh;
                                                  const _errs178 = errors;
                                                  if (errors === _errs178) {
                                                    if (typeof data66 === "string") {
                                                      if (func2(data66) > 200) {
                                                        const err190 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/0/properties/promptZh/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                        if (vErrors === null) {
                                                          vErrors = [err190];
                                                        } else {
                                                          vErrors.push(err190);
                                                        }
                                                        errors++;
                                                      } else {
                                                        if (func2(data66) < 1) {
                                                          const err191 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/0/properties/promptZh/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                          if (vErrors === null) {
                                                            vErrors = [err191];
                                                          } else {
                                                            vErrors.push(err191);
                                                          }
                                                          errors++;
                                                        } else {
                                                          if (!pattern1.test(data66)) {
                                                            const err192 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/0/properties/promptZh/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                            if (vErrors === null) {
                                                              vErrors = [err192];
                                                            } else {
                                                              vErrors.push(err192);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      const err193 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/0/properties/promptZh/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err193];
                                                      } else {
                                                        vErrors.push(err193);
                                                      }
                                                      errors++;
                                                    }
                                                  }
                                                  var valid38 = _errs178 === errors;
                                                } else {
                                                  var valid38 = true;
                                                }
                                                if (valid38) {
                                                  if (data62.instructionAudioAssetId !== void 0) {
                                                    let data67 = data62.instructionAudioAssetId;
                                                    const _errs180 = errors;
                                                    const _errs181 = errors;
                                                    let valid41 = false;
                                                    const _errs182 = errors;
                                                    if (errors === _errs182) {
                                                      if (errors === _errs182) {
                                                        if (typeof data67 === "string") {
                                                          if (func2(data67) > 36) {
                                                            const err194 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/0/properties/instructionAudioAssetId/anyOf/0/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                            if (vErrors === null) {
                                                              vErrors = [err194];
                                                            } else {
                                                              vErrors.push(err194);
                                                            }
                                                            errors++;
                                                          } else {
                                                            if (func2(data67) < 36) {
                                                              const err195 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/0/properties/instructionAudioAssetId/anyOf/0/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                              if (vErrors === null) {
                                                                vErrors = [err195];
                                                              } else {
                                                                vErrors.push(err195);
                                                              }
                                                              errors++;
                                                            } else {
                                                              if (!formats0.test(data67)) {
                                                                const err196 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/0/properties/instructionAudioAssetId/anyOf/0/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                if (vErrors === null) {
                                                                  vErrors = [err196];
                                                                } else {
                                                                  vErrors.push(err196);
                                                                }
                                                                errors++;
                                                              }
                                                            }
                                                          }
                                                        } else {
                                                          const err197 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/0/properties/instructionAudioAssetId/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                          if (vErrors === null) {
                                                            vErrors = [err197];
                                                          } else {
                                                            vErrors.push(err197);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                    }
                                                    var _valid7 = _errs182 === errors;
                                                    valid41 = valid41 || _valid7;
                                                    if (!valid41) {
                                                      const _errs184 = errors;
                                                      if (data67 !== null) {
                                                        const err198 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/0/properties/instructionAudioAssetId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                        if (vErrors === null) {
                                                          vErrors = [err198];
                                                        } else {
                                                          vErrors.push(err198);
                                                        }
                                                        errors++;
                                                      }
                                                      var _valid7 = _errs184 === errors;
                                                      valid41 = valid41 || _valid7;
                                                    }
                                                    if (!valid41) {
                                                      const err199 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/0/properties/instructionAudioAssetId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                      if (vErrors === null) {
                                                        vErrors = [err199];
                                                      } else {
                                                        vErrors.push(err199);
                                                      }
                                                      errors++;
                                                    } else {
                                                      errors = _errs181;
                                                      if (vErrors !== null) {
                                                        if (_errs181) {
                                                          vErrors.length = _errs181;
                                                        } else {
                                                          vErrors = null;
                                                        }
                                                      }
                                                    }
                                                    var valid38 = _errs180 === errors;
                                                  } else {
                                                    var valid38 = true;
                                                  }
                                                  if (valid38) {
                                                    if (data62.hintId !== void 0) {
                                                      let data68 = data62.hintId;
                                                      const _errs186 = errors;
                                                      if (errors === _errs186) {
                                                        if (errors === _errs186) {
                                                          if (typeof data68 === "string") {
                                                            if (func2(data68) > 36) {
                                                              const err200 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/0/properties/hintId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                              if (vErrors === null) {
                                                                vErrors = [err200];
                                                              } else {
                                                                vErrors.push(err200);
                                                              }
                                                              errors++;
                                                            } else {
                                                              if (func2(data68) < 36) {
                                                                const err201 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/0/properties/hintId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err201];
                                                                } else {
                                                                  vErrors.push(err201);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (!formats0.test(data68)) {
                                                                  const err202 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/0/properties/hintId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err202];
                                                                  } else {
                                                                    vErrors.push(err202);
                                                                  }
                                                                  errors++;
                                                                }
                                                              }
                                                            }
                                                          } else {
                                                            const err203 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/0/properties/hintId/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                            if (vErrors === null) {
                                                              vErrors = [err203];
                                                            } else {
                                                              vErrors.push(err203);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                      }
                                                      var valid38 = _errs186 === errors;
                                                    } else {
                                                      var valid38 = true;
                                                    }
                                                    if (valid38) {
                                                      if (data62.type !== void 0) {
                                                        let data69 = data62.type;
                                                        const _errs188 = errors;
                                                        if (typeof data69 !== "string") {
                                                          const err204 = { instancePath: instancePath + "/exercises/" + i19 + "/type", schemaPath: "#/properties/exercises/items/anyOf/0/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                          if (vErrors === null) {
                                                            vErrors = [err204];
                                                          } else {
                                                            vErrors.push(err204);
                                                          }
                                                          errors++;
                                                        }
                                                        if ("choice" !== data69) {
                                                          const err205 = { instancePath: instancePath + "/exercises/" + i19 + "/type", schemaPath: "#/properties/exercises/items/anyOf/0/properties/type/const", keyword: "const", params: { allowedValue: "choice" }, message: "must be equal to constant" };
                                                          if (vErrors === null) {
                                                            vErrors = [err205];
                                                          } else {
                                                            vErrors.push(err205);
                                                          }
                                                          errors++;
                                                        }
                                                        var valid38 = _errs188 === errors;
                                                      } else {
                                                        var valid38 = true;
                                                      }
                                                      if (valid38) {
                                                        if (data62.options !== void 0) {
                                                          let data70 = data62.options;
                                                          const _errs190 = errors;
                                                          if (errors === _errs190) {
                                                            if (Array.isArray(data70)) {
                                                              if (data70.length > 3) {
                                                                const err206 = { instancePath: instancePath + "/exercises/" + i19 + "/options", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err206];
                                                                } else {
                                                                  vErrors.push(err206);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (data70.length < 3) {
                                                                  const err207 = { instancePath: instancePath + "/exercises/" + i19 + "/options", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/minItems", keyword: "minItems", params: { limit: 3 }, message: "must NOT have fewer than 3 items" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err207];
                                                                  } else {
                                                                    vErrors.push(err207);
                                                                  }
                                                                  errors++;
                                                                } else {
                                                                  var valid42 = true;
                                                                  const len14 = data70.length;
                                                                  for (let i22 = 0; i22 < len14; i22++) {
                                                                    let data71 = data70[i22];
                                                                    const _errs192 = errors;
                                                                    if (errors === _errs192) {
                                                                      if (data71 && typeof data71 == "object" && !Array.isArray(data71)) {
                                                                        let missing11;
                                                                        if (data71.id === void 0 && (missing11 = "id") || data71.text === void 0 && (missing11 = "text")) {
                                                                          const err208 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22, schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/required", keyword: "required", params: { missingProperty: missing11 }, message: "must have required property '" + missing11 + "'" };
                                                                          if (vErrors === null) {
                                                                            vErrors = [err208];
                                                                          } else {
                                                                            vErrors.push(err208);
                                                                          }
                                                                          errors++;
                                                                        } else {
                                                                          const _errs194 = errors;
                                                                          for (const key11 in data71) {
                                                                            if (!(key11 === "id" || key11 === "text")) {
                                                                              const err209 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22, schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key11 }, message: "must NOT have additional properties" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err209];
                                                                              } else {
                                                                                vErrors.push(err209);
                                                                              }
                                                                              errors++;
                                                                              break;
                                                                            }
                                                                          }
                                                                          if (_errs194 === errors) {
                                                                            if (data71.id !== void 0) {
                                                                              let data72 = data71.id;
                                                                              const _errs195 = errors;
                                                                              if (errors === _errs195) {
                                                                                if (errors === _errs195) {
                                                                                  if (typeof data72 === "string") {
                                                                                    if (func2(data72) > 36) {
                                                                                      const err210 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22 + "/id", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err210];
                                                                                      } else {
                                                                                        vErrors.push(err210);
                                                                                      }
                                                                                      errors++;
                                                                                    } else {
                                                                                      if (func2(data72) < 36) {
                                                                                        const err211 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22 + "/id", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err211];
                                                                                        } else {
                                                                                          vErrors.push(err211);
                                                                                        }
                                                                                        errors++;
                                                                                      } else {
                                                                                        if (!formats0.test(data72)) {
                                                                                          const err212 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22 + "/id", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err212];
                                                                                          } else {
                                                                                            vErrors.push(err212);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  } else {
                                                                                    const err213 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22 + "/id", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err213];
                                                                                    } else {
                                                                                      vErrors.push(err213);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                }
                                                                              }
                                                                              var valid43 = _errs195 === errors;
                                                                            } else {
                                                                              var valid43 = true;
                                                                            }
                                                                            if (valid43) {
                                                                              if (data71.text !== void 0) {
                                                                                let data73 = data71.text;
                                                                                const _errs197 = errors;
                                                                                if (errors === _errs197) {
                                                                                  if (typeof data73 === "string") {
                                                                                    if (func2(data73) > 200) {
                                                                                      const err214 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22 + "/text", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/properties/text/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err214];
                                                                                      } else {
                                                                                        vErrors.push(err214);
                                                                                      }
                                                                                      errors++;
                                                                                    } else {
                                                                                      if (func2(data73) < 1) {
                                                                                        const err215 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22 + "/text", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/properties/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err215];
                                                                                        } else {
                                                                                          vErrors.push(err215);
                                                                                        }
                                                                                        errors++;
                                                                                      } else {
                                                                                        if (!pattern1.test(data73)) {
                                                                                          const err216 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22 + "/text", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/properties/text/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err216];
                                                                                          } else {
                                                                                            vErrors.push(err216);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  } else {
                                                                                    const err217 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22 + "/text", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/properties/text/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err217];
                                                                                    } else {
                                                                                      vErrors.push(err217);
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                }
                                                                                var valid43 = _errs197 === errors;
                                                                              } else {
                                                                                var valid43 = true;
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      } else {
                                                                        const err218 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i22, schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err218];
                                                                        } else {
                                                                          vErrors.push(err218);
                                                                        }
                                                                        errors++;
                                                                      }
                                                                    }
                                                                    var valid42 = _errs192 === errors;
                                                                    if (!valid42) {
                                                                      break;
                                                                    }
                                                                  }
                                                                  if (valid42) {
                                                                    let i23 = data70.length;
                                                                    let j8;
                                                                    if (i23 > 1) {
                                                                      outer4: for (; i23--; ) {
                                                                        for (j8 = i23; j8--; ) {
                                                                          if (func0(data70[i23], data70[j8])) {
                                                                            const err219 = { instancePath: instancePath + "/exercises/" + i19 + "/options", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/uniqueItems", keyword: "uniqueItems", params: { i: i23, j: j8 }, message: "must NOT have duplicate items (items ## " + j8 + " and " + i23 + " are identical)" };
                                                                            if (vErrors === null) {
                                                                              vErrors = [err219];
                                                                            } else {
                                                                              vErrors.push(err219);
                                                                            }
                                                                            errors++;
                                                                            break outer4;
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            } else {
                                                              const err220 = { instancePath: instancePath + "/exercises/" + i19 + "/options", schemaPath: "#/properties/exercises/items/anyOf/0/properties/options/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                              if (vErrors === null) {
                                                                vErrors = [err220];
                                                              } else {
                                                                vErrors.push(err220);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                          var valid38 = _errs190 === errors;
                                                        } else {
                                                          var valid38 = true;
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      } else {
                                        const err221 = { instancePath: instancePath + "/exercises/" + i19, schemaPath: "#/properties/exercises/items/anyOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                        if (vErrors === null) {
                                          vErrors = [err221];
                                        } else {
                                          vErrors.push(err221);
                                        }
                                        errors++;
                                      }
                                    }
                                    var _valid6 = _errs169 === errors;
                                    valid37 = valid37 || _valid6;
                                    if (!valid37) {
                                      const _errs199 = errors;
                                      if (errors === _errs199) {
                                        if (data62 && typeof data62 == "object" && !Array.isArray(data62)) {
                                          let missing12;
                                          if (data62.id === void 0 && (missing12 = "id") || data62.targetVocabIds === void 0 && (missing12 = "targetVocabIds") || data62.promptZh === void 0 && (missing12 = "promptZh") || data62.instructionAudioAssetId === void 0 && (missing12 = "instructionAudioAssetId") || data62.hintId === void 0 && (missing12 = "hintId") || data62.type === void 0 && (missing12 = "type") || data62.leftItems === void 0 && (missing12 = "leftItems") || data62.rightItems === void 0 && (missing12 = "rightItems")) {
                                            const err222 = { instancePath: instancePath + "/exercises/" + i19, schemaPath: "#/properties/exercises/items/anyOf/1/required", keyword: "required", params: { missingProperty: missing12 }, message: "must have required property '" + missing12 + "'" };
                                            if (vErrors === null) {
                                              vErrors = [err222];
                                            } else {
                                              vErrors.push(err222);
                                            }
                                            errors++;
                                          } else {
                                            const _errs201 = errors;
                                            for (const key12 in data62) {
                                              if (!(key12 === "id" || key12 === "targetVocabIds" || key12 === "promptZh" || key12 === "instructionAudioAssetId" || key12 === "hintId" || key12 === "type" || key12 === "leftItems" || key12 === "rightItems")) {
                                                const err223 = { instancePath: instancePath + "/exercises/" + i19, schemaPath: "#/properties/exercises/items/anyOf/1/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key12 }, message: "must NOT have additional properties" };
                                                if (vErrors === null) {
                                                  vErrors = [err223];
                                                } else {
                                                  vErrors.push(err223);
                                                }
                                                errors++;
                                                break;
                                              }
                                            }
                                            if (_errs201 === errors) {
                                              if (data62.id !== void 0) {
                                                let data74 = data62.id;
                                                const _errs202 = errors;
                                                if (errors === _errs202) {
                                                  if (errors === _errs202) {
                                                    if (typeof data74 === "string") {
                                                      if (func2(data74) > 36) {
                                                        const err224 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                        if (vErrors === null) {
                                                          vErrors = [err224];
                                                        } else {
                                                          vErrors.push(err224);
                                                        }
                                                        errors++;
                                                      } else {
                                                        if (func2(data74) < 36) {
                                                          const err225 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                          if (vErrors === null) {
                                                            vErrors = [err225];
                                                          } else {
                                                            vErrors.push(err225);
                                                          }
                                                          errors++;
                                                        } else {
                                                          if (!formats0.test(data74)) {
                                                            const err226 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                            if (vErrors === null) {
                                                              vErrors = [err226];
                                                            } else {
                                                              vErrors.push(err226);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      const err227 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err227];
                                                      } else {
                                                        vErrors.push(err227);
                                                      }
                                                      errors++;
                                                    }
                                                  }
                                                }
                                                var valid45 = _errs202 === errors;
                                              } else {
                                                var valid45 = true;
                                              }
                                              if (valid45) {
                                                if (data62.targetVocabIds !== void 0) {
                                                  let data75 = data62.targetVocabIds;
                                                  const _errs204 = errors;
                                                  if (errors === _errs204) {
                                                    if (Array.isArray(data75)) {
                                                      if (data75.length > 3) {
                                                        const err228 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/1/properties/targetVocabIds/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                        if (vErrors === null) {
                                                          vErrors = [err228];
                                                        } else {
                                                          vErrors.push(err228);
                                                        }
                                                        errors++;
                                                      } else {
                                                        if (data75.length < 1) {
                                                          const err229 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/1/properties/targetVocabIds/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                                                          if (vErrors === null) {
                                                            vErrors = [err229];
                                                          } else {
                                                            vErrors.push(err229);
                                                          }
                                                          errors++;
                                                        } else {
                                                          var valid46 = true;
                                                          const len15 = data75.length;
                                                          for (let i24 = 0; i24 < len15; i24++) {
                                                            let data76 = data75[i24];
                                                            const _errs206 = errors;
                                                            if (errors === _errs206) {
                                                              if (errors === _errs206) {
                                                                if (typeof data76 === "string") {
                                                                  if (func2(data76) > 36) {
                                                                    const err230 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i24, schemaPath: "#/properties/exercises/items/anyOf/1/properties/targetVocabIds/items/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err230];
                                                                    } else {
                                                                      vErrors.push(err230);
                                                                    }
                                                                    errors++;
                                                                  } else {
                                                                    if (func2(data76) < 36) {
                                                                      const err231 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i24, schemaPath: "#/properties/exercises/items/anyOf/1/properties/targetVocabIds/items/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err231];
                                                                      } else {
                                                                        vErrors.push(err231);
                                                                      }
                                                                      errors++;
                                                                    } else {
                                                                      if (!formats0.test(data76)) {
                                                                        const err232 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i24, schemaPath: "#/properties/exercises/items/anyOf/1/properties/targetVocabIds/items/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err232];
                                                                        } else {
                                                                          vErrors.push(err232);
                                                                        }
                                                                        errors++;
                                                                      }
                                                                    }
                                                                  }
                                                                } else {
                                                                  const err233 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i24, schemaPath: "#/properties/exercises/items/anyOf/1/properties/targetVocabIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err233];
                                                                  } else {
                                                                    vErrors.push(err233);
                                                                  }
                                                                  errors++;
                                                                }
                                                              }
                                                            }
                                                            var valid46 = _errs206 === errors;
                                                            if (!valid46) {
                                                              break;
                                                            }
                                                          }
                                                          if (valid46) {
                                                            let i25 = data75.length;
                                                            let j9;
                                                            if (i25 > 1) {
                                                              const indices4 = {};
                                                              for (; i25--; ) {
                                                                let item4 = data75[i25];
                                                                if (typeof item4 !== "string") {
                                                                  continue;
                                                                }
                                                                if (typeof indices4[item4] == "number") {
                                                                  j9 = indices4[item4];
                                                                  const err234 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/1/properties/targetVocabIds/uniqueItems", keyword: "uniqueItems", params: { i: i25, j: j9 }, message: "must NOT have duplicate items (items ## " + j9 + " and " + i25 + " are identical)" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err234];
                                                                  } else {
                                                                    vErrors.push(err234);
                                                                  }
                                                                  errors++;
                                                                  break;
                                                                }
                                                                indices4[item4] = i25;
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      const err235 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/1/properties/targetVocabIds/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                      if (vErrors === null) {
                                                        vErrors = [err235];
                                                      } else {
                                                        vErrors.push(err235);
                                                      }
                                                      errors++;
                                                    }
                                                  }
                                                  var valid45 = _errs204 === errors;
                                                } else {
                                                  var valid45 = true;
                                                }
                                                if (valid45) {
                                                  if (data62.promptZh !== void 0) {
                                                    let data77 = data62.promptZh;
                                                    const _errs208 = errors;
                                                    if (errors === _errs208) {
                                                      if (typeof data77 === "string") {
                                                        if (func2(data77) > 200) {
                                                          const err236 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/1/properties/promptZh/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                          if (vErrors === null) {
                                                            vErrors = [err236];
                                                          } else {
                                                            vErrors.push(err236);
                                                          }
                                                          errors++;
                                                        } else {
                                                          if (func2(data77) < 1) {
                                                            const err237 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/1/properties/promptZh/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                            if (vErrors === null) {
                                                              vErrors = [err237];
                                                            } else {
                                                              vErrors.push(err237);
                                                            }
                                                            errors++;
                                                          } else {
                                                            if (!pattern1.test(data77)) {
                                                              const err238 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/1/properties/promptZh/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                              if (vErrors === null) {
                                                                vErrors = [err238];
                                                              } else {
                                                                vErrors.push(err238);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        const err239 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/1/properties/promptZh/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err239];
                                                        } else {
                                                          vErrors.push(err239);
                                                        }
                                                        errors++;
                                                      }
                                                    }
                                                    var valid45 = _errs208 === errors;
                                                  } else {
                                                    var valid45 = true;
                                                  }
                                                  if (valid45) {
                                                    if (data62.instructionAudioAssetId !== void 0) {
                                                      let data78 = data62.instructionAudioAssetId;
                                                      const _errs210 = errors;
                                                      const _errs211 = errors;
                                                      let valid48 = false;
                                                      const _errs212 = errors;
                                                      if (errors === _errs212) {
                                                        if (errors === _errs212) {
                                                          if (typeof data78 === "string") {
                                                            if (func2(data78) > 36) {
                                                              const err240 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/1/properties/instructionAudioAssetId/anyOf/0/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                              if (vErrors === null) {
                                                                vErrors = [err240];
                                                              } else {
                                                                vErrors.push(err240);
                                                              }
                                                              errors++;
                                                            } else {
                                                              if (func2(data78) < 36) {
                                                                const err241 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/1/properties/instructionAudioAssetId/anyOf/0/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err241];
                                                                } else {
                                                                  vErrors.push(err241);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (!formats0.test(data78)) {
                                                                  const err242 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/1/properties/instructionAudioAssetId/anyOf/0/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err242];
                                                                  } else {
                                                                    vErrors.push(err242);
                                                                  }
                                                                  errors++;
                                                                }
                                                              }
                                                            }
                                                          } else {
                                                            const err243 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/1/properties/instructionAudioAssetId/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                            if (vErrors === null) {
                                                              vErrors = [err243];
                                                            } else {
                                                              vErrors.push(err243);
                                                            }
                                                            errors++;
                                                          }
                                                        }
                                                      }
                                                      var _valid8 = _errs212 === errors;
                                                      valid48 = valid48 || _valid8;
                                                      if (!valid48) {
                                                        const _errs214 = errors;
                                                        if (data78 !== null) {
                                                          const err244 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/1/properties/instructionAudioAssetId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                          if (vErrors === null) {
                                                            vErrors = [err244];
                                                          } else {
                                                            vErrors.push(err244);
                                                          }
                                                          errors++;
                                                        }
                                                        var _valid8 = _errs214 === errors;
                                                        valid48 = valid48 || _valid8;
                                                      }
                                                      if (!valid48) {
                                                        const err245 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/1/properties/instructionAudioAssetId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                        if (vErrors === null) {
                                                          vErrors = [err245];
                                                        } else {
                                                          vErrors.push(err245);
                                                        }
                                                        errors++;
                                                      } else {
                                                        errors = _errs211;
                                                        if (vErrors !== null) {
                                                          if (_errs211) {
                                                            vErrors.length = _errs211;
                                                          } else {
                                                            vErrors = null;
                                                          }
                                                        }
                                                      }
                                                      var valid45 = _errs210 === errors;
                                                    } else {
                                                      var valid45 = true;
                                                    }
                                                    if (valid45) {
                                                      if (data62.hintId !== void 0) {
                                                        let data79 = data62.hintId;
                                                        const _errs216 = errors;
                                                        if (errors === _errs216) {
                                                          if (errors === _errs216) {
                                                            if (typeof data79 === "string") {
                                                              if (func2(data79) > 36) {
                                                                const err246 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/1/properties/hintId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err246];
                                                                } else {
                                                                  vErrors.push(err246);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (func2(data79) < 36) {
                                                                  const err247 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/1/properties/hintId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err247];
                                                                  } else {
                                                                    vErrors.push(err247);
                                                                  }
                                                                  errors++;
                                                                } else {
                                                                  if (!formats0.test(data79)) {
                                                                    const err248 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/1/properties/hintId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err248];
                                                                    } else {
                                                                      vErrors.push(err248);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                }
                                                              }
                                                            } else {
                                                              const err249 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/1/properties/hintId/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                              if (vErrors === null) {
                                                                vErrors = [err249];
                                                              } else {
                                                                vErrors.push(err249);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                        }
                                                        var valid45 = _errs216 === errors;
                                                      } else {
                                                        var valid45 = true;
                                                      }
                                                      if (valid45) {
                                                        if (data62.type !== void 0) {
                                                          let data80 = data62.type;
                                                          const _errs218 = errors;
                                                          if (typeof data80 !== "string") {
                                                            const err250 = { instancePath: instancePath + "/exercises/" + i19 + "/type", schemaPath: "#/properties/exercises/items/anyOf/1/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                            if (vErrors === null) {
                                                              vErrors = [err250];
                                                            } else {
                                                              vErrors.push(err250);
                                                            }
                                                            errors++;
                                                          }
                                                          if ("match" !== data80) {
                                                            const err251 = { instancePath: instancePath + "/exercises/" + i19 + "/type", schemaPath: "#/properties/exercises/items/anyOf/1/properties/type/const", keyword: "const", params: { allowedValue: "match" }, message: "must be equal to constant" };
                                                            if (vErrors === null) {
                                                              vErrors = [err251];
                                                            } else {
                                                              vErrors.push(err251);
                                                            }
                                                            errors++;
                                                          }
                                                          var valid45 = _errs218 === errors;
                                                        } else {
                                                          var valid45 = true;
                                                        }
                                                        if (valid45) {
                                                          if (data62.leftItems !== void 0) {
                                                            let data81 = data62.leftItems;
                                                            const _errs220 = errors;
                                                            if (errors === _errs220) {
                                                              if (Array.isArray(data81)) {
                                                                if (data81.length > 3) {
                                                                  const err252 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err252];
                                                                  } else {
                                                                    vErrors.push(err252);
                                                                  }
                                                                  errors++;
                                                                } else {
                                                                  if (data81.length < 2) {
                                                                    const err253 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err253];
                                                                    } else {
                                                                      vErrors.push(err253);
                                                                    }
                                                                    errors++;
                                                                  } else {
                                                                    var valid49 = true;
                                                                    const len16 = data81.length;
                                                                    for (let i26 = 0; i26 < len16; i26++) {
                                                                      let data82 = data81[i26];
                                                                      const _errs222 = errors;
                                                                      if (errors === _errs222) {
                                                                        if (data82 && typeof data82 == "object" && !Array.isArray(data82)) {
                                                                          let missing13;
                                                                          if (data82.id === void 0 && (missing13 = "id") || data82.text === void 0 && (missing13 = "text")) {
                                                                            const err254 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26, schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/required", keyword: "required", params: { missingProperty: missing13 }, message: "must have required property '" + missing13 + "'" };
                                                                            if (vErrors === null) {
                                                                              vErrors = [err254];
                                                                            } else {
                                                                              vErrors.push(err254);
                                                                            }
                                                                            errors++;
                                                                          } else {
                                                                            const _errs224 = errors;
                                                                            for (const key13 in data82) {
                                                                              if (!(key13 === "id" || key13 === "text")) {
                                                                                const err255 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26, schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key13 }, message: "must NOT have additional properties" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err255];
                                                                                } else {
                                                                                  vErrors.push(err255);
                                                                                }
                                                                                errors++;
                                                                                break;
                                                                              }
                                                                            }
                                                                            if (_errs224 === errors) {
                                                                              if (data82.id !== void 0) {
                                                                                let data83 = data82.id;
                                                                                const _errs225 = errors;
                                                                                if (errors === _errs225) {
                                                                                  if (errors === _errs225) {
                                                                                    if (typeof data83 === "string") {
                                                                                      if (func2(data83) > 36) {
                                                                                        const err256 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err256];
                                                                                        } else {
                                                                                          vErrors.push(err256);
                                                                                        }
                                                                                        errors++;
                                                                                      } else {
                                                                                        if (func2(data83) < 36) {
                                                                                          const err257 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err257];
                                                                                          } else {
                                                                                            vErrors.push(err257);
                                                                                          }
                                                                                          errors++;
                                                                                        } else {
                                                                                          if (!formats0.test(data83)) {
                                                                                            const err258 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                                            if (vErrors === null) {
                                                                                              vErrors = [err258];
                                                                                            } else {
                                                                                              vErrors.push(err258);
                                                                                            }
                                                                                            errors++;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    } else {
                                                                                      const err259 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err259];
                                                                                      } else {
                                                                                        vErrors.push(err259);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                  }
                                                                                }
                                                                                var valid50 = _errs225 === errors;
                                                                              } else {
                                                                                var valid50 = true;
                                                                              }
                                                                              if (valid50) {
                                                                                if (data82.text !== void 0) {
                                                                                  let data84 = data82.text;
                                                                                  const _errs227 = errors;
                                                                                  if (errors === _errs227) {
                                                                                    if (typeof data84 === "string") {
                                                                                      if (func2(data84) > 200) {
                                                                                        const err260 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26 + "/text", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/properties/text/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err260];
                                                                                        } else {
                                                                                          vErrors.push(err260);
                                                                                        }
                                                                                        errors++;
                                                                                      } else {
                                                                                        if (func2(data84) < 1) {
                                                                                          const err261 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26 + "/text", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/properties/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err261];
                                                                                          } else {
                                                                                            vErrors.push(err261);
                                                                                          }
                                                                                          errors++;
                                                                                        } else {
                                                                                          if (!pattern1.test(data84)) {
                                                                                            const err262 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26 + "/text", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/properties/text/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                                            if (vErrors === null) {
                                                                                              vErrors = [err262];
                                                                                            } else {
                                                                                              vErrors.push(err262);
                                                                                            }
                                                                                            errors++;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    } else {
                                                                                      const err263 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26 + "/text", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/properties/text/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                      if (vErrors === null) {
                                                                                        vErrors = [err263];
                                                                                      } else {
                                                                                        vErrors.push(err263);
                                                                                      }
                                                                                      errors++;
                                                                                    }
                                                                                  }
                                                                                  var valid50 = _errs227 === errors;
                                                                                } else {
                                                                                  var valid50 = true;
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        } else {
                                                                          const err264 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems/" + i26, schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                          if (vErrors === null) {
                                                                            vErrors = [err264];
                                                                          } else {
                                                                            vErrors.push(err264);
                                                                          }
                                                                          errors++;
                                                                        }
                                                                      }
                                                                      var valid49 = _errs222 === errors;
                                                                      if (!valid49) {
                                                                        break;
                                                                      }
                                                                    }
                                                                    if (valid49) {
                                                                      let i27 = data81.length;
                                                                      let j10;
                                                                      if (i27 > 1) {
                                                                        outer5: for (; i27--; ) {
                                                                          for (j10 = i27; j10--; ) {
                                                                            if (func0(data81[i27], data81[j10])) {
                                                                              const err265 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/uniqueItems", keyword: "uniqueItems", params: { i: i27, j: j10 }, message: "must NOT have duplicate items (items ## " + j10 + " and " + i27 + " are identical)" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err265];
                                                                              } else {
                                                                                vErrors.push(err265);
                                                                              }
                                                                              errors++;
                                                                              break outer5;
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              } else {
                                                                const err266 = { instancePath: instancePath + "/exercises/" + i19 + "/leftItems", schemaPath: "#/properties/exercises/items/anyOf/1/properties/leftItems/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err266];
                                                                } else {
                                                                  vErrors.push(err266);
                                                                }
                                                                errors++;
                                                              }
                                                            }
                                                            var valid45 = _errs220 === errors;
                                                          } else {
                                                            var valid45 = true;
                                                          }
                                                          if (valid45) {
                                                            if (data62.rightItems !== void 0) {
                                                              let data85 = data62.rightItems;
                                                              const _errs229 = errors;
                                                              if (errors === _errs229) {
                                                                if (Array.isArray(data85)) {
                                                                  if (data85.length > 3) {
                                                                    const err267 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err267];
                                                                    } else {
                                                                      vErrors.push(err267);
                                                                    }
                                                                    errors++;
                                                                  } else {
                                                                    if (data85.length < 2) {
                                                                      const err268 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err268];
                                                                      } else {
                                                                        vErrors.push(err268);
                                                                      }
                                                                      errors++;
                                                                    } else {
                                                                      var valid52 = true;
                                                                      const len17 = data85.length;
                                                                      for (let i28 = 0; i28 < len17; i28++) {
                                                                        let data86 = data85[i28];
                                                                        const _errs231 = errors;
                                                                        if (errors === _errs231) {
                                                                          if (data86 && typeof data86 == "object" && !Array.isArray(data86)) {
                                                                            let missing14;
                                                                            if (data86.id === void 0 && (missing14 = "id") || data86.text === void 0 && (missing14 = "text")) {
                                                                              const err269 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28, schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/required", keyword: "required", params: { missingProperty: missing14 }, message: "must have required property '" + missing14 + "'" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err269];
                                                                              } else {
                                                                                vErrors.push(err269);
                                                                              }
                                                                              errors++;
                                                                            } else {
                                                                              const _errs233 = errors;
                                                                              for (const key14 in data86) {
                                                                                if (!(key14 === "id" || key14 === "text")) {
                                                                                  const err270 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28, schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key14 }, message: "must NOT have additional properties" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err270];
                                                                                  } else {
                                                                                    vErrors.push(err270);
                                                                                  }
                                                                                  errors++;
                                                                                  break;
                                                                                }
                                                                              }
                                                                              if (_errs233 === errors) {
                                                                                if (data86.id !== void 0) {
                                                                                  let data87 = data86.id;
                                                                                  const _errs234 = errors;
                                                                                  if (errors === _errs234) {
                                                                                    if (errors === _errs234) {
                                                                                      if (typeof data87 === "string") {
                                                                                        if (func2(data87) > 36) {
                                                                                          const err271 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err271];
                                                                                          } else {
                                                                                            vErrors.push(err271);
                                                                                          }
                                                                                          errors++;
                                                                                        } else {
                                                                                          if (func2(data87) < 36) {
                                                                                            const err272 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                                            if (vErrors === null) {
                                                                                              vErrors = [err272];
                                                                                            } else {
                                                                                              vErrors.push(err272);
                                                                                            }
                                                                                            errors++;
                                                                                          } else {
                                                                                            if (!formats0.test(data87)) {
                                                                                              const err273 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                                              if (vErrors === null) {
                                                                                                vErrors = [err273];
                                                                                              } else {
                                                                                                vErrors.push(err273);
                                                                                              }
                                                                                              errors++;
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      } else {
                                                                                        const err274 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28 + "/id", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err274];
                                                                                        } else {
                                                                                          vErrors.push(err274);
                                                                                        }
                                                                                        errors++;
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                  var valid53 = _errs234 === errors;
                                                                                } else {
                                                                                  var valid53 = true;
                                                                                }
                                                                                if (valid53) {
                                                                                  if (data86.text !== void 0) {
                                                                                    let data88 = data86.text;
                                                                                    const _errs236 = errors;
                                                                                    if (errors === _errs236) {
                                                                                      if (typeof data88 === "string") {
                                                                                        if (func2(data88) > 200) {
                                                                                          const err275 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28 + "/text", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/properties/text/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err275];
                                                                                          } else {
                                                                                            vErrors.push(err275);
                                                                                          }
                                                                                          errors++;
                                                                                        } else {
                                                                                          if (func2(data88) < 1) {
                                                                                            const err276 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28 + "/text", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/properties/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                                            if (vErrors === null) {
                                                                                              vErrors = [err276];
                                                                                            } else {
                                                                                              vErrors.push(err276);
                                                                                            }
                                                                                            errors++;
                                                                                          } else {
                                                                                            if (!pattern1.test(data88)) {
                                                                                              const err277 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28 + "/text", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/properties/text/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                                              if (vErrors === null) {
                                                                                                vErrors = [err277];
                                                                                              } else {
                                                                                                vErrors.push(err277);
                                                                                              }
                                                                                              errors++;
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      } else {
                                                                                        const err278 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28 + "/text", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/properties/text/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                        if (vErrors === null) {
                                                                                          vErrors = [err278];
                                                                                        } else {
                                                                                          vErrors.push(err278);
                                                                                        }
                                                                                        errors++;
                                                                                      }
                                                                                    }
                                                                                    var valid53 = _errs236 === errors;
                                                                                  } else {
                                                                                    var valid53 = true;
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          } else {
                                                                            const err279 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems/" + i28, schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                            if (vErrors === null) {
                                                                              vErrors = [err279];
                                                                            } else {
                                                                              vErrors.push(err279);
                                                                            }
                                                                            errors++;
                                                                          }
                                                                        }
                                                                        var valid52 = _errs231 === errors;
                                                                        if (!valid52) {
                                                                          break;
                                                                        }
                                                                      }
                                                                      if (valid52) {
                                                                        let i29 = data85.length;
                                                                        let j11;
                                                                        if (i29 > 1) {
                                                                          outer6: for (; i29--; ) {
                                                                            for (j11 = i29; j11--; ) {
                                                                              if (func0(data85[i29], data85[j11])) {
                                                                                const err280 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/uniqueItems", keyword: "uniqueItems", params: { i: i29, j: j11 }, message: "must NOT have duplicate items (items ## " + j11 + " and " + i29 + " are identical)" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err280];
                                                                                } else {
                                                                                  vErrors.push(err280);
                                                                                }
                                                                                errors++;
                                                                                break outer6;
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                } else {
                                                                  const err281 = { instancePath: instancePath + "/exercises/" + i19 + "/rightItems", schemaPath: "#/properties/exercises/items/anyOf/1/properties/rightItems/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err281];
                                                                  } else {
                                                                    vErrors.push(err281);
                                                                  }
                                                                  errors++;
                                                                }
                                                              }
                                                              var valid45 = _errs229 === errors;
                                                            } else {
                                                              var valid45 = true;
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        } else {
                                          const err282 = { instancePath: instancePath + "/exercises/" + i19, schemaPath: "#/properties/exercises/items/anyOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                          if (vErrors === null) {
                                            vErrors = [err282];
                                          } else {
                                            vErrors.push(err282);
                                          }
                                          errors++;
                                        }
                                      }
                                      var _valid6 = _errs199 === errors;
                                      valid37 = valid37 || _valid6;
                                      if (!valid37) {
                                        const _errs238 = errors;
                                        if (errors === _errs238) {
                                          if (data62 && typeof data62 == "object" && !Array.isArray(data62)) {
                                            let missing15;
                                            if (data62.id === void 0 && (missing15 = "id") || data62.targetVocabIds === void 0 && (missing15 = "targetVocabIds") || data62.promptZh === void 0 && (missing15 = "promptZh") || data62.instructionAudioAssetId === void 0 && (missing15 = "instructionAudioAssetId") || data62.hintId === void 0 && (missing15 = "hintId") || data62.type === void 0 && (missing15 = "type") || data62.sentenceEn === void 0 && (missing15 = "sentenceEn") || data62.options === void 0 && (missing15 = "options")) {
                                              const err283 = { instancePath: instancePath + "/exercises/" + i19, schemaPath: "#/properties/exercises/items/anyOf/2/required", keyword: "required", params: { missingProperty: missing15 }, message: "must have required property '" + missing15 + "'" };
                                              if (vErrors === null) {
                                                vErrors = [err283];
                                              } else {
                                                vErrors.push(err283);
                                              }
                                              errors++;
                                            } else {
                                              const _errs240 = errors;
                                              for (const key15 in data62) {
                                                if (!(key15 === "id" || key15 === "targetVocabIds" || key15 === "promptZh" || key15 === "instructionAudioAssetId" || key15 === "hintId" || key15 === "type" || key15 === "sentenceEn" || key15 === "options")) {
                                                  const err284 = { instancePath: instancePath + "/exercises/" + i19, schemaPath: "#/properties/exercises/items/anyOf/2/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key15 }, message: "must NOT have additional properties" };
                                                  if (vErrors === null) {
                                                    vErrors = [err284];
                                                  } else {
                                                    vErrors.push(err284);
                                                  }
                                                  errors++;
                                                  break;
                                                }
                                              }
                                              if (_errs240 === errors) {
                                                if (data62.id !== void 0) {
                                                  let data89 = data62.id;
                                                  const _errs241 = errors;
                                                  if (errors === _errs241) {
                                                    if (errors === _errs241) {
                                                      if (typeof data89 === "string") {
                                                        if (func2(data89) > 36) {
                                                          const err285 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/2/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                          if (vErrors === null) {
                                                            vErrors = [err285];
                                                          } else {
                                                            vErrors.push(err285);
                                                          }
                                                          errors++;
                                                        } else {
                                                          if (func2(data89) < 36) {
                                                            const err286 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/2/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                            if (vErrors === null) {
                                                              vErrors = [err286];
                                                            } else {
                                                              vErrors.push(err286);
                                                            }
                                                            errors++;
                                                          } else {
                                                            if (!formats0.test(data89)) {
                                                              const err287 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/2/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                              if (vErrors === null) {
                                                                vErrors = [err287];
                                                              } else {
                                                                vErrors.push(err287);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        const err288 = { instancePath: instancePath + "/exercises/" + i19 + "/id", schemaPath: "#/properties/exercises/items/anyOf/2/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err288];
                                                        } else {
                                                          vErrors.push(err288);
                                                        }
                                                        errors++;
                                                      }
                                                    }
                                                  }
                                                  var valid55 = _errs241 === errors;
                                                } else {
                                                  var valid55 = true;
                                                }
                                                if (valid55) {
                                                  if (data62.targetVocabIds !== void 0) {
                                                    let data90 = data62.targetVocabIds;
                                                    const _errs243 = errors;
                                                    if (errors === _errs243) {
                                                      if (Array.isArray(data90)) {
                                                        if (data90.length > 3) {
                                                          const err289 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/2/properties/targetVocabIds/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                          if (vErrors === null) {
                                                            vErrors = [err289];
                                                          } else {
                                                            vErrors.push(err289);
                                                          }
                                                          errors++;
                                                        } else {
                                                          if (data90.length < 1) {
                                                            const err290 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/2/properties/targetVocabIds/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                                                            if (vErrors === null) {
                                                              vErrors = [err290];
                                                            } else {
                                                              vErrors.push(err290);
                                                            }
                                                            errors++;
                                                          } else {
                                                            var valid56 = true;
                                                            const len18 = data90.length;
                                                            for (let i30 = 0; i30 < len18; i30++) {
                                                              let data91 = data90[i30];
                                                              const _errs245 = errors;
                                                              if (errors === _errs245) {
                                                                if (errors === _errs245) {
                                                                  if (typeof data91 === "string") {
                                                                    if (func2(data91) > 36) {
                                                                      const err291 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i30, schemaPath: "#/properties/exercises/items/anyOf/2/properties/targetVocabIds/items/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err291];
                                                                      } else {
                                                                        vErrors.push(err291);
                                                                      }
                                                                      errors++;
                                                                    } else {
                                                                      if (func2(data91) < 36) {
                                                                        const err292 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i30, schemaPath: "#/properties/exercises/items/anyOf/2/properties/targetVocabIds/items/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err292];
                                                                        } else {
                                                                          vErrors.push(err292);
                                                                        }
                                                                        errors++;
                                                                      } else {
                                                                        if (!formats0.test(data91)) {
                                                                          const err293 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i30, schemaPath: "#/properties/exercises/items/anyOf/2/properties/targetVocabIds/items/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                          if (vErrors === null) {
                                                                            vErrors = [err293];
                                                                          } else {
                                                                            vErrors.push(err293);
                                                                          }
                                                                          errors++;
                                                                        }
                                                                      }
                                                                    }
                                                                  } else {
                                                                    const err294 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds/" + i30, schemaPath: "#/properties/exercises/items/anyOf/2/properties/targetVocabIds/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err294];
                                                                    } else {
                                                                      vErrors.push(err294);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                }
                                                              }
                                                              var valid56 = _errs245 === errors;
                                                              if (!valid56) {
                                                                break;
                                                              }
                                                            }
                                                            if (valid56) {
                                                              let i31 = data90.length;
                                                              let j12;
                                                              if (i31 > 1) {
                                                                const indices5 = {};
                                                                for (; i31--; ) {
                                                                  let item5 = data90[i31];
                                                                  if (typeof item5 !== "string") {
                                                                    continue;
                                                                  }
                                                                  if (typeof indices5[item5] == "number") {
                                                                    j12 = indices5[item5];
                                                                    const err295 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/2/properties/targetVocabIds/uniqueItems", keyword: "uniqueItems", params: { i: i31, j: j12 }, message: "must NOT have duplicate items (items ## " + j12 + " and " + i31 + " are identical)" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err295];
                                                                    } else {
                                                                      vErrors.push(err295);
                                                                    }
                                                                    errors++;
                                                                    break;
                                                                  }
                                                                  indices5[item5] = i31;
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        const err296 = { instancePath: instancePath + "/exercises/" + i19 + "/targetVocabIds", schemaPath: "#/properties/exercises/items/anyOf/2/properties/targetVocabIds/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                        if (vErrors === null) {
                                                          vErrors = [err296];
                                                        } else {
                                                          vErrors.push(err296);
                                                        }
                                                        errors++;
                                                      }
                                                    }
                                                    var valid55 = _errs243 === errors;
                                                  } else {
                                                    var valid55 = true;
                                                  }
                                                  if (valid55) {
                                                    if (data62.promptZh !== void 0) {
                                                      let data92 = data62.promptZh;
                                                      const _errs247 = errors;
                                                      if (errors === _errs247) {
                                                        if (typeof data92 === "string") {
                                                          if (func2(data92) > 200) {
                                                            const err297 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/2/properties/promptZh/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                            if (vErrors === null) {
                                                              vErrors = [err297];
                                                            } else {
                                                              vErrors.push(err297);
                                                            }
                                                            errors++;
                                                          } else {
                                                            if (func2(data92) < 1) {
                                                              const err298 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/2/properties/promptZh/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                              if (vErrors === null) {
                                                                vErrors = [err298];
                                                              } else {
                                                                vErrors.push(err298);
                                                              }
                                                              errors++;
                                                            } else {
                                                              if (!pattern1.test(data92)) {
                                                                const err299 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/2/properties/promptZh/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                if (vErrors === null) {
                                                                  vErrors = [err299];
                                                                } else {
                                                                  vErrors.push(err299);
                                                                }
                                                                errors++;
                                                              }
                                                            }
                                                          }
                                                        } else {
                                                          const err300 = { instancePath: instancePath + "/exercises/" + i19 + "/promptZh", schemaPath: "#/properties/exercises/items/anyOf/2/properties/promptZh/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                          if (vErrors === null) {
                                                            vErrors = [err300];
                                                          } else {
                                                            vErrors.push(err300);
                                                          }
                                                          errors++;
                                                        }
                                                      }
                                                      var valid55 = _errs247 === errors;
                                                    } else {
                                                      var valid55 = true;
                                                    }
                                                    if (valid55) {
                                                      if (data62.instructionAudioAssetId !== void 0) {
                                                        let data93 = data62.instructionAudioAssetId;
                                                        const _errs249 = errors;
                                                        const _errs250 = errors;
                                                        let valid58 = false;
                                                        const _errs251 = errors;
                                                        if (errors === _errs251) {
                                                          if (errors === _errs251) {
                                                            if (typeof data93 === "string") {
                                                              if (func2(data93) > 36) {
                                                                const err301 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/2/properties/instructionAudioAssetId/anyOf/0/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err301];
                                                                } else {
                                                                  vErrors.push(err301);
                                                                }
                                                                errors++;
                                                              } else {
                                                                if (func2(data93) < 36) {
                                                                  const err302 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/2/properties/instructionAudioAssetId/anyOf/0/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err302];
                                                                  } else {
                                                                    vErrors.push(err302);
                                                                  }
                                                                  errors++;
                                                                } else {
                                                                  if (!formats0.test(data93)) {
                                                                    const err303 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/2/properties/instructionAudioAssetId/anyOf/0/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err303];
                                                                    } else {
                                                                      vErrors.push(err303);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                }
                                                              }
                                                            } else {
                                                              const err304 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/2/properties/instructionAudioAssetId/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                              if (vErrors === null) {
                                                                vErrors = [err304];
                                                              } else {
                                                                vErrors.push(err304);
                                                              }
                                                              errors++;
                                                            }
                                                          }
                                                        }
                                                        var _valid9 = _errs251 === errors;
                                                        valid58 = valid58 || _valid9;
                                                        if (!valid58) {
                                                          const _errs253 = errors;
                                                          if (data93 !== null) {
                                                            const err305 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/2/properties/instructionAudioAssetId/anyOf/1/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                                                            if (vErrors === null) {
                                                              vErrors = [err305];
                                                            } else {
                                                              vErrors.push(err305);
                                                            }
                                                            errors++;
                                                          }
                                                          var _valid9 = _errs253 === errors;
                                                          valid58 = valid58 || _valid9;
                                                        }
                                                        if (!valid58) {
                                                          const err306 = { instancePath: instancePath + "/exercises/" + i19 + "/instructionAudioAssetId", schemaPath: "#/properties/exercises/items/anyOf/2/properties/instructionAudioAssetId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                                          if (vErrors === null) {
                                                            vErrors = [err306];
                                                          } else {
                                                            vErrors.push(err306);
                                                          }
                                                          errors++;
                                                        } else {
                                                          errors = _errs250;
                                                          if (vErrors !== null) {
                                                            if (_errs250) {
                                                              vErrors.length = _errs250;
                                                            } else {
                                                              vErrors = null;
                                                            }
                                                          }
                                                        }
                                                        var valid55 = _errs249 === errors;
                                                      } else {
                                                        var valid55 = true;
                                                      }
                                                      if (valid55) {
                                                        if (data62.hintId !== void 0) {
                                                          let data94 = data62.hintId;
                                                          const _errs255 = errors;
                                                          if (errors === _errs255) {
                                                            if (errors === _errs255) {
                                                              if (typeof data94 === "string") {
                                                                if (func2(data94) > 36) {
                                                                  const err307 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/2/properties/hintId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err307];
                                                                  } else {
                                                                    vErrors.push(err307);
                                                                  }
                                                                  errors++;
                                                                } else {
                                                                  if (func2(data94) < 36) {
                                                                    const err308 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/2/properties/hintId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err308];
                                                                    } else {
                                                                      vErrors.push(err308);
                                                                    }
                                                                    errors++;
                                                                  } else {
                                                                    if (!formats0.test(data94)) {
                                                                      const err309 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/2/properties/hintId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err309];
                                                                      } else {
                                                                        vErrors.push(err309);
                                                                      }
                                                                      errors++;
                                                                    }
                                                                  }
                                                                }
                                                              } else {
                                                                const err310 = { instancePath: instancePath + "/exercises/" + i19 + "/hintId", schemaPath: "#/properties/exercises/items/anyOf/2/properties/hintId/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err310];
                                                                } else {
                                                                  vErrors.push(err310);
                                                                }
                                                                errors++;
                                                              }
                                                            }
                                                          }
                                                          var valid55 = _errs255 === errors;
                                                        } else {
                                                          var valid55 = true;
                                                        }
                                                        if (valid55) {
                                                          if (data62.type !== void 0) {
                                                            let data95 = data62.type;
                                                            const _errs257 = errors;
                                                            if (typeof data95 !== "string") {
                                                              const err311 = { instancePath: instancePath + "/exercises/" + i19 + "/type", schemaPath: "#/properties/exercises/items/anyOf/2/properties/type/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                              if (vErrors === null) {
                                                                vErrors = [err311];
                                                              } else {
                                                                vErrors.push(err311);
                                                              }
                                                              errors++;
                                                            }
                                                            if ("cloze" !== data95) {
                                                              const err312 = { instancePath: instancePath + "/exercises/" + i19 + "/type", schemaPath: "#/properties/exercises/items/anyOf/2/properties/type/const", keyword: "const", params: { allowedValue: "cloze" }, message: "must be equal to constant" };
                                                              if (vErrors === null) {
                                                                vErrors = [err312];
                                                              } else {
                                                                vErrors.push(err312);
                                                              }
                                                              errors++;
                                                            }
                                                            var valid55 = _errs257 === errors;
                                                          } else {
                                                            var valid55 = true;
                                                          }
                                                          if (valid55) {
                                                            if (data62.sentenceEn !== void 0) {
                                                              let data96 = data62.sentenceEn;
                                                              const _errs259 = errors;
                                                              if (errors === _errs259) {
                                                                if (typeof data96 === "string") {
                                                                  if (func2(data96) > 500) {
                                                                    const err313 = { instancePath: instancePath + "/exercises/" + i19 + "/sentenceEn", schemaPath: "#/properties/exercises/items/anyOf/2/properties/sentenceEn/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err313];
                                                                    } else {
                                                                      vErrors.push(err313);
                                                                    }
                                                                    errors++;
                                                                  } else {
                                                                    if (func2(data96) < 1) {
                                                                      const err314 = { instancePath: instancePath + "/exercises/" + i19 + "/sentenceEn", schemaPath: "#/properties/exercises/items/anyOf/2/properties/sentenceEn/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err314];
                                                                      } else {
                                                                        vErrors.push(err314);
                                                                      }
                                                                      errors++;
                                                                    } else {
                                                                      if (!pattern1.test(data96)) {
                                                                        const err315 = { instancePath: instancePath + "/exercises/" + i19 + "/sentenceEn", schemaPath: "#/properties/exercises/items/anyOf/2/properties/sentenceEn/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err315];
                                                                        } else {
                                                                          vErrors.push(err315);
                                                                        }
                                                                        errors++;
                                                                      }
                                                                    }
                                                                  }
                                                                } else {
                                                                  const err316 = { instancePath: instancePath + "/exercises/" + i19 + "/sentenceEn", schemaPath: "#/properties/exercises/items/anyOf/2/properties/sentenceEn/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err316];
                                                                  } else {
                                                                    vErrors.push(err316);
                                                                  }
                                                                  errors++;
                                                                }
                                                              }
                                                              var valid55 = _errs259 === errors;
                                                            } else {
                                                              var valid55 = true;
                                                            }
                                                            if (valid55) {
                                                              if (data62.options !== void 0) {
                                                                let data97 = data62.options;
                                                                const _errs261 = errors;
                                                                if (errors === _errs261) {
                                                                  if (Array.isArray(data97)) {
                                                                    if (data97.length > 3) {
                                                                      const err317 = { instancePath: instancePath + "/exercises/" + i19 + "/options", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/maxItems", keyword: "maxItems", params: { limit: 3 }, message: "must NOT have more than 3 items" };
                                                                      if (vErrors === null) {
                                                                        vErrors = [err317];
                                                                      } else {
                                                                        vErrors.push(err317);
                                                                      }
                                                                      errors++;
                                                                    } else {
                                                                      if (data97.length < 2) {
                                                                        const err318 = { instancePath: instancePath + "/exercises/" + i19 + "/options", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/minItems", keyword: "minItems", params: { limit: 2 }, message: "must NOT have fewer than 2 items" };
                                                                        if (vErrors === null) {
                                                                          vErrors = [err318];
                                                                        } else {
                                                                          vErrors.push(err318);
                                                                        }
                                                                        errors++;
                                                                      } else {
                                                                        var valid59 = true;
                                                                        const len19 = data97.length;
                                                                        for (let i32 = 0; i32 < len19; i32++) {
                                                                          let data98 = data97[i32];
                                                                          const _errs263 = errors;
                                                                          if (errors === _errs263) {
                                                                            if (data98 && typeof data98 == "object" && !Array.isArray(data98)) {
                                                                              let missing16;
                                                                              if (data98.id === void 0 && (missing16 = "id") || data98.text === void 0 && (missing16 = "text")) {
                                                                                const err319 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32, schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/required", keyword: "required", params: { missingProperty: missing16 }, message: "must have required property '" + missing16 + "'" };
                                                                                if (vErrors === null) {
                                                                                  vErrors = [err319];
                                                                                } else {
                                                                                  vErrors.push(err319);
                                                                                }
                                                                                errors++;
                                                                              } else {
                                                                                const _errs265 = errors;
                                                                                for (const key16 in data98) {
                                                                                  if (!(key16 === "id" || key16 === "text")) {
                                                                                    const err320 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32, schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key16 }, message: "must NOT have additional properties" };
                                                                                    if (vErrors === null) {
                                                                                      vErrors = [err320];
                                                                                    } else {
                                                                                      vErrors.push(err320);
                                                                                    }
                                                                                    errors++;
                                                                                    break;
                                                                                  }
                                                                                }
                                                                                if (_errs265 === errors) {
                                                                                  if (data98.id !== void 0) {
                                                                                    let data99 = data98.id;
                                                                                    const _errs266 = errors;
                                                                                    if (errors === _errs266) {
                                                                                      if (errors === _errs266) {
                                                                                        if (typeof data99 === "string") {
                                                                                          if (func2(data99) > 36) {
                                                                                            const err321 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32 + "/id", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/properties/id/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" };
                                                                                            if (vErrors === null) {
                                                                                              vErrors = [err321];
                                                                                            } else {
                                                                                              vErrors.push(err321);
                                                                                            }
                                                                                            errors++;
                                                                                          } else {
                                                                                            if (func2(data99) < 36) {
                                                                                              const err322 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32 + "/id", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/properties/id/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" };
                                                                                              if (vErrors === null) {
                                                                                                vErrors = [err322];
                                                                                              } else {
                                                                                                vErrors.push(err322);
                                                                                              }
                                                                                              errors++;
                                                                                            } else {
                                                                                              if (!formats0.test(data99)) {
                                                                                                const err323 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32 + "/id", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/properties/id/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' };
                                                                                                if (vErrors === null) {
                                                                                                  vErrors = [err323];
                                                                                                } else {
                                                                                                  vErrors.push(err323);
                                                                                                }
                                                                                                errors++;
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        } else {
                                                                                          const err324 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32 + "/id", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err324];
                                                                                          } else {
                                                                                            vErrors.push(err324);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                    var valid60 = _errs266 === errors;
                                                                                  } else {
                                                                                    var valid60 = true;
                                                                                  }
                                                                                  if (valid60) {
                                                                                    if (data98.text !== void 0) {
                                                                                      let data100 = data98.text;
                                                                                      const _errs268 = errors;
                                                                                      if (errors === _errs268) {
                                                                                        if (typeof data100 === "string") {
                                                                                          if (func2(data100) > 200) {
                                                                                            const err325 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32 + "/text", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/properties/text/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" };
                                                                                            if (vErrors === null) {
                                                                                              vErrors = [err325];
                                                                                            } else {
                                                                                              vErrors.push(err325);
                                                                                            }
                                                                                            errors++;
                                                                                          } else {
                                                                                            if (func2(data100) < 1) {
                                                                                              const err326 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32 + "/text", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/properties/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                                                                              if (vErrors === null) {
                                                                                                vErrors = [err326];
                                                                                              } else {
                                                                                                vErrors.push(err326);
                                                                                              }
                                                                                              errors++;
                                                                                            } else {
                                                                                              if (!pattern1.test(data100)) {
                                                                                                const err327 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32 + "/text", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/properties/text/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' };
                                                                                                if (vErrors === null) {
                                                                                                  vErrors = [err327];
                                                                                                } else {
                                                                                                  vErrors.push(err327);
                                                                                                }
                                                                                                errors++;
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        } else {
                                                                                          const err328 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32 + "/text", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/properties/text/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                                          if (vErrors === null) {
                                                                                            vErrors = [err328];
                                                                                          } else {
                                                                                            vErrors.push(err328);
                                                                                          }
                                                                                          errors++;
                                                                                        }
                                                                                      }
                                                                                      var valid60 = _errs268 === errors;
                                                                                    } else {
                                                                                      var valid60 = true;
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            } else {
                                                                              const err329 = { instancePath: instancePath + "/exercises/" + i19 + "/options/" + i32, schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                                                              if (vErrors === null) {
                                                                                vErrors = [err329];
                                                                              } else {
                                                                                vErrors.push(err329);
                                                                              }
                                                                              errors++;
                                                                            }
                                                                          }
                                                                          var valid59 = _errs263 === errors;
                                                                          if (!valid59) {
                                                                            break;
                                                                          }
                                                                        }
                                                                        if (valid59) {
                                                                          let i33 = data97.length;
                                                                          let j13;
                                                                          if (i33 > 1) {
                                                                            outer7: for (; i33--; ) {
                                                                              for (j13 = i33; j13--; ) {
                                                                                if (func0(data97[i33], data97[j13])) {
                                                                                  const err330 = { instancePath: instancePath + "/exercises/" + i19 + "/options", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/uniqueItems", keyword: "uniqueItems", params: { i: i33, j: j13 }, message: "must NOT have duplicate items (items ## " + j13 + " and " + i33 + " are identical)" };
                                                                                  if (vErrors === null) {
                                                                                    vErrors = [err330];
                                                                                  } else {
                                                                                    vErrors.push(err330);
                                                                                  }
                                                                                  errors++;
                                                                                  break outer7;
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  } else {
                                                                    const err331 = { instancePath: instancePath + "/exercises/" + i19 + "/options", schemaPath: "#/properties/exercises/items/anyOf/2/properties/options/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err331];
                                                                    } else {
                                                                      vErrors.push(err331);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                }
                                                                var valid55 = _errs261 === errors;
                                                              } else {
                                                                var valid55 = true;
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          } else {
                                            const err332 = { instancePath: instancePath + "/exercises/" + i19, schemaPath: "#/properties/exercises/items/anyOf/2/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                            if (vErrors === null) {
                                              vErrors = [err332];
                                            } else {
                                              vErrors.push(err332);
                                            }
                                            errors++;
                                          }
                                        }
                                        var _valid6 = _errs238 === errors;
                                        valid37 = valid37 || _valid6;
                                      }
                                    }
                                    if (!valid37) {
                                      const err333 = { instancePath: instancePath + "/exercises/" + i19, schemaPath: "#/properties/exercises/items/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                                      if (vErrors === null) {
                                        vErrors = [err333];
                                      } else {
                                        vErrors.push(err333);
                                      }
                                      errors++;
                                      validate21.errors = vErrors;
                                      return false;
                                    } else {
                                      errors = _errs168;
                                      if (vErrors !== null) {
                                        if (_errs168) {
                                          vErrors.length = _errs168;
                                        } else {
                                          vErrors = null;
                                        }
                                      }
                                    }
                                    var valid36 = _errs167 === errors;
                                    if (!valid36) {
                                      break;
                                    }
                                  }
                                }
                              }
                            } else {
                              validate21.errors = [{ instancePath: instancePath + "/exercises", schemaPath: "#/properties/exercises/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                              return false;
                            }
                          }
                          var valid0 = _errs58 === errors;
                        } else {
                          var valid0 = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          validate21.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
          return false;
        }
      }
      validate21.errors = vErrors;
      return errors === 0;
    }
    exports.LiveResponse = validate22;
    function validate22(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (errors === 0) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
          let missing0;
          if (data.status === void 0 && (missing0 = "status") || data.service === void 0 && (missing0 = "service") || data.requestId === void 0 && (missing0 = "requestId")) {
            validate22.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
            return false;
          } else {
            const _errs1 = errors;
            for (const key0 in data) {
              if (!(key0 === "status" || key0 === "service" || key0 === "requestId")) {
                validate22.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
                return false;
                break;
              }
            }
            if (_errs1 === errors) {
              if (data.status !== void 0) {
                let data0 = data.status;
                const _errs2 = errors;
                if (typeof data0 !== "string") {
                  validate22.errors = [{ instancePath: instancePath + "/status", schemaPath: "#/properties/status/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
                if ("alive" !== data0) {
                  validate22.errors = [{ instancePath: instancePath + "/status", schemaPath: "#/properties/status/const", keyword: "const", params: { allowedValue: "alive" }, message: "must be equal to constant" }];
                  return false;
                }
                var valid0 = _errs2 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.service !== void 0) {
                  let data1 = data.service;
                  const _errs4 = errors;
                  if (typeof data1 !== "string") {
                    validate22.errors = [{ instancePath: instancePath + "/service", schemaPath: "#/properties/service/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                    return false;
                  }
                  if ("telltale-api" !== data1) {
                    validate22.errors = [{ instancePath: instancePath + "/service", schemaPath: "#/properties/service/const", keyword: "const", params: { allowedValue: "telltale-api" }, message: "must be equal to constant" }];
                    return false;
                  }
                  var valid0 = _errs4 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.requestId !== void 0) {
                    let data2 = data.requestId;
                    const _errs6 = errors;
                    if (errors === _errs6) {
                      if (errors === _errs6) {
                        if (typeof data2 === "string") {
                          if (func2(data2) > 36) {
                            validate22.errors = [{ instancePath: instancePath + "/requestId", schemaPath: "#/properties/requestId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" }];
                            return false;
                          } else {
                            if (func2(data2) < 36) {
                              validate22.errors = [{ instancePath: instancePath + "/requestId", schemaPath: "#/properties/requestId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" }];
                              return false;
                            } else {
                              if (!formats0.test(data2)) {
                                validate22.errors = [{ instancePath: instancePath + "/requestId", schemaPath: "#/properties/requestId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' }];
                                return false;
                              }
                            }
                          }
                        } else {
                          validate22.errors = [{ instancePath: instancePath + "/requestId", schemaPath: "#/properties/requestId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                          return false;
                        }
                      }
                    }
                    var valid0 = _errs6 === errors;
                  } else {
                    var valid0 = true;
                  }
                }
              }
            }
          }
        } else {
          validate22.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
          return false;
        }
      }
      validate22.errors = vErrors;
      return errors === 0;
    }
    exports.ErrorResponse = validate23;
    function validate23(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (errors === 0) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
          let missing0;
          if (data.error === void 0 && (missing0 = "error") || data.requestId === void 0 && (missing0 = "requestId")) {
            validate23.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
            return false;
          } else {
            const _errs1 = errors;
            for (const key0 in data) {
              if (!(key0 === "error" || key0 === "requestId")) {
                validate23.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
                return false;
                break;
              }
            }
            if (_errs1 === errors) {
              if (data.error !== void 0) {
                let data0 = data.error;
                const _errs2 = errors;
                if (errors === _errs2) {
                  if (data0 && typeof data0 == "object" && !Array.isArray(data0)) {
                    let missing1;
                    if (data0.code === void 0 && (missing1 = "code") || data0.message === void 0 && (missing1 = "message") || data0.retryable === void 0 && (missing1 = "retryable")) {
                      validate23.errors = [{ instancePath: instancePath + "/error", schemaPath: "#/properties/error/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                      return false;
                    } else {
                      const _errs4 = errors;
                      for (const key1 in data0) {
                        if (!(key1 === "code" || key1 === "message" || key1 === "retryable" || key1 === "fieldErrors")) {
                          validate23.errors = [{ instancePath: instancePath + "/error", schemaPath: "#/properties/error/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                          return false;
                          break;
                        }
                      }
                      if (_errs4 === errors) {
                        if (data0.code !== void 0) {
                          let data1 = data0.code;
                          const _errs5 = errors;
                          const _errs6 = errors;
                          let valid2 = false;
                          const _errs7 = errors;
                          if (typeof data1 !== "string") {
                            const err0 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/0/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err0];
                            } else {
                              vErrors.push(err0);
                            }
                            errors++;
                          }
                          if ("INPUT_INVALID" !== data1) {
                            const err1 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/0/const", keyword: "const", params: { allowedValue: "INPUT_INVALID" }, message: "must be equal to constant" };
                            if (vErrors === null) {
                              vErrors = [err1];
                            } else {
                              vErrors.push(err1);
                            }
                            errors++;
                          }
                          var _valid0 = _errs7 === errors;
                          valid2 = valid2 || _valid0;
                          if (!valid2) {
                            const _errs9 = errors;
                            if (typeof data1 !== "string") {
                              const err2 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                              if (vErrors === null) {
                                vErrors = [err2];
                              } else {
                                vErrors.push(err2);
                              }
                              errors++;
                            }
                            if ("INPUT_NEEDS_DETAIL" !== data1) {
                              const err3 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/1/const", keyword: "const", params: { allowedValue: "INPUT_NEEDS_DETAIL" }, message: "must be equal to constant" };
                              if (vErrors === null) {
                                vErrors = [err3];
                              } else {
                                vErrors.push(err3);
                              }
                              errors++;
                            }
                            var _valid0 = _errs9 === errors;
                            valid2 = valid2 || _valid0;
                            if (!valid2) {
                              const _errs11 = errors;
                              if (typeof data1 !== "string") {
                                const err4 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/2/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err4];
                                } else {
                                  vErrors.push(err4);
                                }
                                errors++;
                              }
                              if ("SESSION_EXPIRED" !== data1) {
                                const err5 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/2/const", keyword: "const", params: { allowedValue: "SESSION_EXPIRED" }, message: "must be equal to constant" };
                                if (vErrors === null) {
                                  vErrors = [err5];
                                } else {
                                  vErrors.push(err5);
                                }
                                errors++;
                              }
                              var _valid0 = _errs11 === errors;
                              valid2 = valid2 || _valid0;
                              if (!valid2) {
                                const _errs13 = errors;
                                if (typeof data1 !== "string") {
                                  const err6 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/3/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err6];
                                  } else {
                                    vErrors.push(err6);
                                  }
                                  errors++;
                                }
                                if ("CONSENT_REQUIRED" !== data1) {
                                  const err7 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/3/const", keyword: "const", params: { allowedValue: "CONSENT_REQUIRED" }, message: "must be equal to constant" };
                                  if (vErrors === null) {
                                    vErrors = [err7];
                                  } else {
                                    vErrors.push(err7);
                                  }
                                  errors++;
                                }
                                var _valid0 = _errs13 === errors;
                                valid2 = valid2 || _valid0;
                                if (!valid2) {
                                  const _errs15 = errors;
                                  if (typeof data1 !== "string") {
                                    const err8 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/4/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                    if (vErrors === null) {
                                      vErrors = [err8];
                                    } else {
                                      vErrors.push(err8);
                                    }
                                    errors++;
                                  }
                                  if ("ADULT_REQUIRED" !== data1) {
                                    const err9 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/4/const", keyword: "const", params: { allowedValue: "ADULT_REQUIRED" }, message: "must be equal to constant" };
                                    if (vErrors === null) {
                                      vErrors = [err9];
                                    } else {
                                      vErrors.push(err9);
                                    }
                                    errors++;
                                  }
                                  var _valid0 = _errs15 === errors;
                                  valid2 = valid2 || _valid0;
                                  if (!valid2) {
                                    const _errs17 = errors;
                                    if (typeof data1 !== "string") {
                                      const err10 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/5/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                      if (vErrors === null) {
                                        vErrors = [err10];
                                      } else {
                                        vErrors.push(err10);
                                      }
                                      errors++;
                                    }
                                    if ("RESOURCE_NOT_FOUND" !== data1) {
                                      const err11 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/5/const", keyword: "const", params: { allowedValue: "RESOURCE_NOT_FOUND" }, message: "must be equal to constant" };
                                      if (vErrors === null) {
                                        vErrors = [err11];
                                      } else {
                                        vErrors.push(err11);
                                      }
                                      errors++;
                                    }
                                    var _valid0 = _errs17 === errors;
                                    valid2 = valid2 || _valid0;
                                    if (!valid2) {
                                      const _errs19 = errors;
                                      if (typeof data1 !== "string") {
                                        const err12 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/6/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                        if (vErrors === null) {
                                          vErrors = [err12];
                                        } else {
                                          vErrors.push(err12);
                                        }
                                        errors++;
                                      }
                                      if ("REVISION_CONFLICT" !== data1) {
                                        const err13 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/6/const", keyword: "const", params: { allowedValue: "REVISION_CONFLICT" }, message: "must be equal to constant" };
                                        if (vErrors === null) {
                                          vErrors = [err13];
                                        } else {
                                          vErrors.push(err13);
                                        }
                                        errors++;
                                      }
                                      var _valid0 = _errs19 === errors;
                                      valid2 = valid2 || _valid0;
                                      if (!valid2) {
                                        const _errs21 = errors;
                                        if (typeof data1 !== "string") {
                                          const err14 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/7/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                          if (vErrors === null) {
                                            vErrors = [err14];
                                          } else {
                                            vErrors.push(err14);
                                          }
                                          errors++;
                                        }
                                        if ("IDEMPOTENCY_CONFLICT" !== data1) {
                                          const err15 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/7/const", keyword: "const", params: { allowedValue: "IDEMPOTENCY_CONFLICT" }, message: "must be equal to constant" };
                                          if (vErrors === null) {
                                            vErrors = [err15];
                                          } else {
                                            vErrors.push(err15);
                                          }
                                          errors++;
                                        }
                                        var _valid0 = _errs21 === errors;
                                        valid2 = valid2 || _valid0;
                                        if (!valid2) {
                                          const _errs23 = errors;
                                          if (typeof data1 !== "string") {
                                            const err16 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/8/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                            if (vErrors === null) {
                                              vErrors = [err16];
                                            } else {
                                              vErrors.push(err16);
                                            }
                                            errors++;
                                          }
                                          if ("CONTENT_VERSION_MISMATCH" !== data1) {
                                            const err17 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/8/const", keyword: "const", params: { allowedValue: "CONTENT_VERSION_MISMATCH" }, message: "must be equal to constant" };
                                            if (vErrors === null) {
                                              vErrors = [err17];
                                            } else {
                                              vErrors.push(err17);
                                            }
                                            errors++;
                                          }
                                          var _valid0 = _errs23 === errors;
                                          valid2 = valid2 || _valid0;
                                          if (!valid2) {
                                            const _errs25 = errors;
                                            if (typeof data1 !== "string") {
                                              const err18 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/9/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                              if (vErrors === null) {
                                                vErrors = [err18];
                                              } else {
                                                vErrors.push(err18);
                                              }
                                              errors++;
                                            }
                                            if ("INVALID_TRANSITION" !== data1) {
                                              const err19 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/9/const", keyword: "const", params: { allowedValue: "INVALID_TRANSITION" }, message: "must be equal to constant" };
                                              if (vErrors === null) {
                                                vErrors = [err19];
                                              } else {
                                                vErrors.push(err19);
                                              }
                                              errors++;
                                            }
                                            var _valid0 = _errs25 === errors;
                                            valid2 = valid2 || _valid0;
                                            if (!valid2) {
                                              const _errs27 = errors;
                                              if (typeof data1 !== "string") {
                                                const err20 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/10/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                if (vErrors === null) {
                                                  vErrors = [err20];
                                                } else {
                                                  vErrors.push(err20);
                                                }
                                                errors++;
                                              }
                                              if ("RUN_EXPIRED" !== data1) {
                                                const err21 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/10/const", keyword: "const", params: { allowedValue: "RUN_EXPIRED" }, message: "must be equal to constant" };
                                                if (vErrors === null) {
                                                  vErrors = [err21];
                                                } else {
                                                  vErrors.push(err21);
                                                }
                                                errors++;
                                              }
                                              var _valid0 = _errs27 === errors;
                                              valid2 = valid2 || _valid0;
                                              if (!valid2) {
                                                const _errs29 = errors;
                                                if (typeof data1 !== "string") {
                                                  const err22 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/11/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                  if (vErrors === null) {
                                                    vErrors = [err22];
                                                  } else {
                                                    vErrors.push(err22);
                                                  }
                                                  errors++;
                                                }
                                                if ("SHARE_REVOKED" !== data1) {
                                                  const err23 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/11/const", keyword: "const", params: { allowedValue: "SHARE_REVOKED" }, message: "must be equal to constant" };
                                                  if (vErrors === null) {
                                                    vErrors = [err23];
                                                  } else {
                                                    vErrors.push(err23);
                                                  }
                                                  errors++;
                                                }
                                                var _valid0 = _errs29 === errors;
                                                valid2 = valid2 || _valid0;
                                                if (!valid2) {
                                                  const _errs31 = errors;
                                                  if (typeof data1 !== "string") {
                                                    const err24 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/12/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                    if (vErrors === null) {
                                                      vErrors = [err24];
                                                    } else {
                                                      vErrors.push(err24);
                                                    }
                                                    errors++;
                                                  }
                                                  if ("VOICE_TOO_LARGE" !== data1) {
                                                    const err25 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/12/const", keyword: "const", params: { allowedValue: "VOICE_TOO_LARGE" }, message: "must be equal to constant" };
                                                    if (vErrors === null) {
                                                      vErrors = [err25];
                                                    } else {
                                                      vErrors.push(err25);
                                                    }
                                                    errors++;
                                                  }
                                                  var _valid0 = _errs31 === errors;
                                                  valid2 = valid2 || _valid0;
                                                  if (!valid2) {
                                                    const _errs33 = errors;
                                                    if (typeof data1 !== "string") {
                                                      const err26 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/13/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                      if (vErrors === null) {
                                                        vErrors = [err26];
                                                      } else {
                                                        vErrors.push(err26);
                                                      }
                                                      errors++;
                                                    }
                                                    if ("CONTENT_INVALID" !== data1) {
                                                      const err27 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/13/const", keyword: "const", params: { allowedValue: "CONTENT_INVALID" }, message: "must be equal to constant" };
                                                      if (vErrors === null) {
                                                        vErrors = [err27];
                                                      } else {
                                                        vErrors.push(err27);
                                                      }
                                                      errors++;
                                                    }
                                                    var _valid0 = _errs33 === errors;
                                                    valid2 = valid2 || _valid0;
                                                    if (!valid2) {
                                                      const _errs35 = errors;
                                                      if (typeof data1 !== "string") {
                                                        const err28 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/14/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                        if (vErrors === null) {
                                                          vErrors = [err28];
                                                        } else {
                                                          vErrors.push(err28);
                                                        }
                                                        errors++;
                                                      }
                                                      if ("SAFETY_REJECTED" !== data1) {
                                                        const err29 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/14/const", keyword: "const", params: { allowedValue: "SAFETY_REJECTED" }, message: "must be equal to constant" };
                                                        if (vErrors === null) {
                                                          vErrors = [err29];
                                                        } else {
                                                          vErrors.push(err29);
                                                        }
                                                        errors++;
                                                      }
                                                      var _valid0 = _errs35 === errors;
                                                      valid2 = valid2 || _valid0;
                                                      if (!valid2) {
                                                        const _errs37 = errors;
                                                        if (typeof data1 !== "string") {
                                                          const err30 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/15/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                          if (vErrors === null) {
                                                            vErrors = [err30];
                                                          } else {
                                                            vErrors.push(err30);
                                                          }
                                                          errors++;
                                                        }
                                                        if ("RATE_LIMITED" !== data1) {
                                                          const err31 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/15/const", keyword: "const", params: { allowedValue: "RATE_LIMITED" }, message: "must be equal to constant" };
                                                          if (vErrors === null) {
                                                            vErrors = [err31];
                                                          } else {
                                                            vErrors.push(err31);
                                                          }
                                                          errors++;
                                                        }
                                                        var _valid0 = _errs37 === errors;
                                                        valid2 = valid2 || _valid0;
                                                        if (!valid2) {
                                                          const _errs39 = errors;
                                                          if (typeof data1 !== "string") {
                                                            const err32 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/16/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                            if (vErrors === null) {
                                                              vErrors = [err32];
                                                            } else {
                                                              vErrors.push(err32);
                                                            }
                                                            errors++;
                                                          }
                                                          if ("PROVIDER_FAILED" !== data1) {
                                                            const err33 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/16/const", keyword: "const", params: { allowedValue: "PROVIDER_FAILED" }, message: "must be equal to constant" };
                                                            if (vErrors === null) {
                                                              vErrors = [err33];
                                                            } else {
                                                              vErrors.push(err33);
                                                            }
                                                            errors++;
                                                          }
                                                          var _valid0 = _errs39 === errors;
                                                          valid2 = valid2 || _valid0;
                                                          if (!valid2) {
                                                            const _errs41 = errors;
                                                            if (typeof data1 !== "string") {
                                                              const err34 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/17/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                              if (vErrors === null) {
                                                                vErrors = [err34];
                                                              } else {
                                                                vErrors.push(err34);
                                                              }
                                                              errors++;
                                                            }
                                                            if ("PROVIDER_RESULT_UNKNOWN" !== data1) {
                                                              const err35 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/17/const", keyword: "const", params: { allowedValue: "PROVIDER_RESULT_UNKNOWN" }, message: "must be equal to constant" };
                                                              if (vErrors === null) {
                                                                vErrors = [err35];
                                                              } else {
                                                                vErrors.push(err35);
                                                              }
                                                              errors++;
                                                            }
                                                            var _valid0 = _errs41 === errors;
                                                            valid2 = valid2 || _valid0;
                                                            if (!valid2) {
                                                              const _errs43 = errors;
                                                              if (typeof data1 !== "string") {
                                                                const err36 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/18/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err36];
                                                                } else {
                                                                  vErrors.push(err36);
                                                                }
                                                                errors++;
                                                              }
                                                              if ("JOB_DEADLINE_EXCEEDED" !== data1) {
                                                                const err37 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/18/const", keyword: "const", params: { allowedValue: "JOB_DEADLINE_EXCEEDED" }, message: "must be equal to constant" };
                                                                if (vErrors === null) {
                                                                  vErrors = [err37];
                                                                } else {
                                                                  vErrors.push(err37);
                                                                }
                                                                errors++;
                                                              }
                                                              var _valid0 = _errs43 === errors;
                                                              valid2 = valid2 || _valid0;
                                                              if (!valid2) {
                                                                const _errs45 = errors;
                                                                if (typeof data1 !== "string") {
                                                                  const err38 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/19/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err38];
                                                                  } else {
                                                                    vErrors.push(err38);
                                                                  }
                                                                  errors++;
                                                                }
                                                                if ("INTERNAL_ERROR" !== data1) {
                                                                  const err39 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf/19/const", keyword: "const", params: { allowedValue: "INTERNAL_ERROR" }, message: "must be equal to constant" };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err39];
                                                                  } else {
                                                                    vErrors.push(err39);
                                                                  }
                                                                  errors++;
                                                                }
                                                                var _valid0 = _errs45 === errors;
                                                                valid2 = valid2 || _valid0;
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                          if (!valid2) {
                            const err40 = { instancePath: instancePath + "/error/code", schemaPath: "#/properties/error/properties/code/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                            if (vErrors === null) {
                              vErrors = [err40];
                            } else {
                              vErrors.push(err40);
                            }
                            errors++;
                            validate23.errors = vErrors;
                            return false;
                          } else {
                            errors = _errs6;
                            if (vErrors !== null) {
                              if (_errs6) {
                                vErrors.length = _errs6;
                              } else {
                                vErrors = null;
                              }
                            }
                          }
                          var valid1 = _errs5 === errors;
                        } else {
                          var valid1 = true;
                        }
                        if (valid1) {
                          if (data0.message !== void 0) {
                            let data2 = data0.message;
                            const _errs47 = errors;
                            if (errors === _errs47) {
                              if (typeof data2 === "string") {
                                if (func2(data2) > 300) {
                                  validate23.errors = [{ instancePath: instancePath + "/error/message", schemaPath: "#/properties/error/properties/message/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" }];
                                  return false;
                                } else {
                                  if (func2(data2) < 1) {
                                    validate23.errors = [{ instancePath: instancePath + "/error/message", schemaPath: "#/properties/error/properties/message/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                    return false;
                                  }
                                }
                              } else {
                                validate23.errors = [{ instancePath: instancePath + "/error/message", schemaPath: "#/properties/error/properties/message/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                return false;
                              }
                            }
                            var valid1 = _errs47 === errors;
                          } else {
                            var valid1 = true;
                          }
                          if (valid1) {
                            if (data0.retryable !== void 0) {
                              const _errs49 = errors;
                              if (typeof data0.retryable !== "boolean") {
                                validate23.errors = [{ instancePath: instancePath + "/error/retryable", schemaPath: "#/properties/error/properties/retryable/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" }];
                                return false;
                              }
                              var valid1 = _errs49 === errors;
                            } else {
                              var valid1 = true;
                            }
                            if (valid1) {
                              if (data0.fieldErrors !== void 0) {
                                let data4 = data0.fieldErrors;
                                const _errs51 = errors;
                                if (errors === _errs51) {
                                  if (Array.isArray(data4)) {
                                    if (data4.length > 100) {
                                      validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors", schemaPath: "#/properties/error/properties/fieldErrors/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" }];
                                      return false;
                                    } else {
                                      var valid3 = true;
                                      const len0 = data4.length;
                                      for (let i0 = 0; i0 < len0; i0++) {
                                        let data5 = data4[i0];
                                        const _errs53 = errors;
                                        if (errors === _errs53) {
                                          if (data5 && typeof data5 == "object" && !Array.isArray(data5)) {
                                            let missing2;
                                            if (data5.field === void 0 && (missing2 = "field") || data5.code === void 0 && (missing2 = "code")) {
                                              validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0, schemaPath: "#/properties/error/properties/fieldErrors/items/required", keyword: "required", params: { missingProperty: missing2 }, message: "must have required property '" + missing2 + "'" }];
                                              return false;
                                            } else {
                                              const _errs55 = errors;
                                              for (const key2 in data5) {
                                                if (!(key2 === "field" || key2 === "code")) {
                                                  validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0, schemaPath: "#/properties/error/properties/fieldErrors/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" }];
                                                  return false;
                                                  break;
                                                }
                                              }
                                              if (_errs55 === errors) {
                                                if (data5.field !== void 0) {
                                                  let data6 = data5.field;
                                                  const _errs56 = errors;
                                                  if (errors === _errs56) {
                                                    if (typeof data6 === "string") {
                                                      if (func2(data6) > 200) {
                                                        validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0 + "/field", schemaPath: "#/properties/error/properties/fieldErrors/items/properties/field/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" }];
                                                        return false;
                                                      } else {
                                                        if (func2(data6) < 1) {
                                                          validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0 + "/field", schemaPath: "#/properties/error/properties/fieldErrors/items/properties/field/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                          return false;
                                                        } else {
                                                          if (!pattern1.test(data6)) {
                                                            validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0 + "/field", schemaPath: "#/properties/error/properties/fieldErrors/items/properties/field/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                                                            return false;
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0 + "/field", schemaPath: "#/properties/error/properties/fieldErrors/items/properties/field/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                      return false;
                                                    }
                                                  }
                                                  var valid4 = _errs56 === errors;
                                                } else {
                                                  var valid4 = true;
                                                }
                                                if (valid4) {
                                                  if (data5.code !== void 0) {
                                                    let data7 = data5.code;
                                                    const _errs58 = errors;
                                                    if (errors === _errs58) {
                                                      if (typeof data7 === "string") {
                                                        if (func2(data7) > 200) {
                                                          validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0 + "/code", schemaPath: "#/properties/error/properties/fieldErrors/items/properties/code/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" }];
                                                          return false;
                                                        } else {
                                                          if (func2(data7) < 1) {
                                                            validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0 + "/code", schemaPath: "#/properties/error/properties/fieldErrors/items/properties/code/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                                                            return false;
                                                          } else {
                                                            if (!pattern1.test(data7)) {
                                                              validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0 + "/code", schemaPath: "#/properties/error/properties/fieldErrors/items/properties/code/pattern", keyword: "pattern", params: { pattern: "\\S" }, message: 'must match pattern "\\S"' }];
                                                              return false;
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0 + "/code", schemaPath: "#/properties/error/properties/fieldErrors/items/properties/code/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                                                        return false;
                                                      }
                                                    }
                                                    var valid4 = _errs58 === errors;
                                                  } else {
                                                    var valid4 = true;
                                                  }
                                                }
                                              }
                                            }
                                          } else {
                                            validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors/" + i0, schemaPath: "#/properties/error/properties/fieldErrors/items/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                                            return false;
                                          }
                                        }
                                        var valid3 = _errs53 === errors;
                                        if (!valid3) {
                                          break;
                                        }
                                      }
                                    }
                                  } else {
                                    validate23.errors = [{ instancePath: instancePath + "/error/fieldErrors", schemaPath: "#/properties/error/properties/fieldErrors/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                    return false;
                                  }
                                }
                                var valid1 = _errs51 === errors;
                              } else {
                                var valid1 = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  } else {
                    validate23.errors = [{ instancePath: instancePath + "/error", schemaPath: "#/properties/error/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                    return false;
                  }
                }
                var valid0 = _errs2 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.requestId !== void 0) {
                  let data8 = data.requestId;
                  const _errs60 = errors;
                  if (errors === _errs60) {
                    if (errors === _errs60) {
                      if (typeof data8 === "string") {
                        if (func2(data8) > 36) {
                          validate23.errors = [{ instancePath: instancePath + "/requestId", schemaPath: "#/properties/requestId/maxLength", keyword: "maxLength", params: { limit: 36 }, message: "must NOT have more than 36 characters" }];
                          return false;
                        } else {
                          if (func2(data8) < 36) {
                            validate23.errors = [{ instancePath: instancePath + "/requestId", schemaPath: "#/properties/requestId/minLength", keyword: "minLength", params: { limit: 36 }, message: "must NOT have fewer than 36 characters" }];
                            return false;
                          } else {
                            if (!formats0.test(data8)) {
                              validate23.errors = [{ instancePath: instancePath + "/requestId", schemaPath: "#/properties/requestId/format", keyword: "format", params: { format: "uuid" }, message: 'must match format "uuid"' }];
                              return false;
                            }
                          }
                        }
                      } else {
                        validate23.errors = [{ instancePath: instancePath + "/requestId", schemaPath: "#/properties/requestId/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                    }
                  }
                  var valid0 = _errs60 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        } else {
          validate23.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
          return false;
        }
      }
      validate23.errors = vErrors;
      return errors === 0;
    }
  }
});
export default require_validators();
