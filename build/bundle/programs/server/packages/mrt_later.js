(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var later, r;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/mrt_later/packages/mrt_later.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mrt:later/later/later.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
later = function() {                                                                                                   // 1
  var later = {                                                                                                        // 2
    version: "1.1.6"                                                                                                   // 3
  };                                                                                                                   // 4
  if (!Array.prototype.indexOf) {                                                                                      // 5
    Array.prototype.indexOf = function(searchElement) {                                                                // 6
      "use strict";                                                                                                    // 7
      if (this == null) {                                                                                              // 8
        throw new TypeError();                                                                                         // 9
      }                                                                                                                // 10
      var t = Object(this);                                                                                            // 11
      var len = t.length >>> 0;                                                                                        // 12
      if (len === 0) {                                                                                                 // 13
        return -1;                                                                                                     // 14
      }                                                                                                                // 15
      var n = 0;                                                                                                       // 16
      if (arguments.length > 1) {                                                                                      // 17
        n = Number(arguments[1]);                                                                                      // 18
        if (n != n) {                                                                                                  // 19
          n = 0;                                                                                                       // 20
        } else if (n != 0 && n != Infinity && n != -Infinity) {                                                        // 21
          n = (n > 0 || -1) * Math.floor(Math.abs(n));                                                                 // 22
        }                                                                                                              // 23
      }                                                                                                                // 24
      if (n >= len) {                                                                                                  // 25
        return -1;                                                                                                     // 26
      }                                                                                                                // 27
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);                                                             // 28
      for (;k < len; k++) {                                                                                            // 29
        if (k in t && t[k] === searchElement) {                                                                        // 30
          return k;                                                                                                    // 31
        }                                                                                                              // 32
      }                                                                                                                // 33
      return -1;                                                                                                       // 34
    };                                                                                                                 // 35
  }                                                                                                                    // 36
  if (!String.prototype.trim) {                                                                                        // 37
    String.prototype.trim = function() {                                                                               // 38
      return this.replace(/^\s+|\s+$/g, "");                                                                           // 39
    };                                                                                                                 // 40
  }                                                                                                                    // 41
  later.array = {};                                                                                                    // 42
  later.array.sort = function(arr, zeroIsLast) {                                                                       // 43
    arr.sort(function(a, b) {                                                                                          // 44
      return +a - +b;                                                                                                  // 45
    });                                                                                                                // 46
    if (zeroIsLast && arr[0] === 0) {                                                                                  // 47
      arr.push(arr.shift());                                                                                           // 48
    }                                                                                                                  // 49
  };                                                                                                                   // 50
  later.array.next = function(val, values, extent) {                                                                   // 51
    var cur, zeroIsLargest = extent[0] !== 0, nextIdx = 0;                                                             // 52
    for (var i = values.length - 1; i > -1; --i) {                                                                     // 53
      cur = values[i];                                                                                                 // 54
      if (cur === val) {                                                                                               // 55
        return cur;                                                                                                    // 56
      }                                                                                                                // 57
      if (cur > val || cur === 0 && zeroIsLargest && extent[1] > val) {                                                // 58
        nextIdx = i;                                                                                                   // 59
        continue;                                                                                                      // 60
      }                                                                                                                // 61
      break;                                                                                                           // 62
    }                                                                                                                  // 63
    return values[nextIdx];                                                                                            // 64
  };                                                                                                                   // 65
  later.array.nextInvalid = function(val, values, extent) {                                                            // 66
    var min = extent[0], max = extent[1], len = values.length, zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0, next = val, i = values.indexOf(val), start = next;
    while (next === (values[i] || zeroVal)) {                                                                          // 68
      next++;                                                                                                          // 69
      if (next > max) {                                                                                                // 70
        next = min;                                                                                                    // 71
      }                                                                                                                // 72
      i++;                                                                                                             // 73
      if (i === len) {                                                                                                 // 74
        i = 0;                                                                                                         // 75
      }                                                                                                                // 76
      if (next === start) {                                                                                            // 77
        return undefined;                                                                                              // 78
      }                                                                                                                // 79
    }                                                                                                                  // 80
    return next;                                                                                                       // 81
  };                                                                                                                   // 82
  later.array.prev = function(val, values, extent) {                                                                   // 83
    var cur, len = values.length, zeroIsLargest = extent[0] !== 0, prevIdx = len - 1;                                  // 84
    for (var i = 0; i < len; i++) {                                                                                    // 85
      cur = values[i];                                                                                                 // 86
      if (cur === val) {                                                                                               // 87
        return cur;                                                                                                    // 88
      }                                                                                                                // 89
      if (cur < val || cur === 0 && zeroIsLargest && extent[1] < val) {                                                // 90
        prevIdx = i;                                                                                                   // 91
        continue;                                                                                                      // 92
      }                                                                                                                // 93
      break;                                                                                                           // 94
    }                                                                                                                  // 95
    return values[prevIdx];                                                                                            // 96
  };                                                                                                                   // 97
  later.array.prevInvalid = function(val, values, extent) {                                                            // 98
    var min = extent[0], max = extent[1], len = values.length, zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0, next = val, i = values.indexOf(val), start = next;
    while (next === (values[i] || zeroVal)) {                                                                          // 100
      next--;                                                                                                          // 101
      if (next < min) {                                                                                                // 102
        next = max;                                                                                                    // 103
      }                                                                                                                // 104
      i--;                                                                                                             // 105
      if (i === -1) {                                                                                                  // 106
        i = len - 1;                                                                                                   // 107
      }                                                                                                                // 108
      if (next === start) {                                                                                            // 109
        return undefined;                                                                                              // 110
      }                                                                                                                // 111
    }                                                                                                                  // 112
    return next;                                                                                                       // 113
  };                                                                                                                   // 114
  later.day = later.D = {                                                                                              // 115
    name: "day",                                                                                                       // 116
    range: 86400,                                                                                                      // 117
    val: function(d) {                                                                                                 // 118
      return d.D || (d.D = later.date.getDate.call(d));                                                                // 119
    },                                                                                                                 // 120
    isValid: function(d, val) {                                                                                        // 121
      return later.D.val(d) === (val || later.D.extent(d)[1]);                                                         // 122
    },                                                                                                                 // 123
    extent: function(d) {                                                                                              // 124
      if (d.DExtent) return d.DExtent;                                                                                 // 125
      var month = later.M.val(d), max = later.DAYS_IN_MONTH[month - 1];                                                // 126
      if (month === 2 && later.dy.extent(d)[1] === 366) {                                                              // 127
        max = max + 1;                                                                                                 // 128
      }                                                                                                                // 129
      return d.DExtent = [ 1, max ];                                                                                   // 130
    },                                                                                                                 // 131
    start: function(d) {                                                                                               // 132
      return d.DStart || (d.DStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d)));                 // 133
    },                                                                                                                 // 134
    end: function(d) {                                                                                                 // 135
      return d.DEnd || (d.DEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d)));                     // 136
    },                                                                                                                 // 137
    next: function(d, val) {                                                                                           // 138
      val = val > later.D.extent(d)[1] ? 1 : val;                                                                      // 139
      var month = later.date.nextRollover(d, val, later.D, later.M), DMax = later.D.extent(month)[1];                  // 140
      val = val > DMax ? 1 : val || DMax;                                                                              // 141
      return later.date.next(later.Y.val(month), later.M.val(month), val);                                             // 142
    },                                                                                                                 // 143
    prev: function(d, val) {                                                                                           // 144
      var month = later.date.prevRollover(d, val, later.D, later.M), DMax = later.D.extent(month)[1];                  // 145
      return later.date.prev(later.Y.val(month), later.M.val(month), val > DMax ? DMax : val || DMax);                 // 146
    }                                                                                                                  // 147
  };                                                                                                                   // 148
  later.dayOfWeekCount = later.dc = {                                                                                  // 149
    name: "day of week count",                                                                                         // 150
    range: 604800,                                                                                                     // 151
    val: function(d) {                                                                                                 // 152
      return d.dc || (d.dc = Math.floor((later.D.val(d) - 1) / 7) + 1);                                                // 153
    },                                                                                                                 // 154
    isValid: function(d, val) {                                                                                        // 155
      return later.dc.val(d) === val || val === 0 && later.D.val(d) > later.D.extent(d)[1] - 7;                        // 156
    },                                                                                                                 // 157
    extent: function(d) {                                                                                              // 158
      return d.dcExtent || (d.dcExtent = [ 1, Math.ceil(later.D.extent(d)[1] / 7) ]);                                  // 159
    },                                                                                                                 // 160
    start: function(d) {                                                                                               // 161
      return d.dcStart || (d.dcStart = later.date.next(later.Y.val(d), later.M.val(d), Math.max(1, (later.dc.val(d) - 1) * 7 + 1 || 1)));
    },                                                                                                                 // 163
    end: function(d) {                                                                                                 // 164
      return d.dcEnd || (d.dcEnd = later.date.prev(later.Y.val(d), later.M.val(d), Math.min(later.dc.val(d) * 7, later.D.extent(d)[1])));
    },                                                                                                                 // 166
    next: function(d, val) {                                                                                           // 167
      val = val > later.dc.extent(d)[1] ? 1 : val;                                                                     // 168
      var month = later.date.nextRollover(d, val, later.dc, later.M), dcMax = later.dc.extent(month)[1];               // 169
      val = val > dcMax ? 1 : val;                                                                                     // 170
      var next = later.date.next(later.Y.val(month), later.M.val(month), val === 0 ? later.D.extent(month)[1] - 6 : 1 + 7 * (val - 1));
      if (next.getTime() <= d.getTime()) {                                                                             // 172
        month = later.M.next(d, later.M.val(d) + 1);                                                                   // 173
        return later.date.next(later.Y.val(month), later.M.val(month), val === 0 ? later.D.extent(month)[1] - 6 : 1 + 7 * (val - 1));
      }                                                                                                                // 175
      return next;                                                                                                     // 176
    },                                                                                                                 // 177
    prev: function(d, val) {                                                                                           // 178
      var month = later.date.prevRollover(d, val, later.dc, later.M), dcMax = later.dc.extent(month)[1];               // 179
      val = val > dcMax ? dcMax : val || dcMax;                                                                        // 180
      return later.dc.end(later.date.prev(later.Y.val(month), later.M.val(month), 1 + 7 * (val - 1)));                 // 181
    }                                                                                                                  // 182
  };                                                                                                                   // 183
  later.dayOfWeek = later.dw = later.d = {                                                                             // 184
    name: "day of week",                                                                                               // 185
    range: 86400,                                                                                                      // 186
    val: function(d) {                                                                                                 // 187
      return d.dw || (d.dw = later.date.getDay.call(d) + 1);                                                           // 188
    },                                                                                                                 // 189
    isValid: function(d, val) {                                                                                        // 190
      return later.dw.val(d) === (val || 7);                                                                           // 191
    },                                                                                                                 // 192
    extent: function() {                                                                                               // 193
      return [ 1, 7 ];                                                                                                 // 194
    },                                                                                                                 // 195
    start: function(d) {                                                                                               // 196
      return later.D.start(d);                                                                                         // 197
    },                                                                                                                 // 198
    end: function(d) {                                                                                                 // 199
      return later.D.end(d);                                                                                           // 200
    },                                                                                                                 // 201
    next: function(d, val) {                                                                                           // 202
      val = val > 7 ? 1 : val || 7;                                                                                    // 203
      return later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val - later.dw.val(d)) + (val <= later.dw.val(d) ? 7 : 0));
    },                                                                                                                 // 205
    prev: function(d, val) {                                                                                           // 206
      val = val > 7 ? 7 : val || 7;                                                                                    // 207
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (val - later.dw.val(d)) + (val >= later.dw.val(d) ? -7 : 0));
    }                                                                                                                  // 209
  };                                                                                                                   // 210
  later.dayOfYear = later.dy = {                                                                                       // 211
    name: "day of year",                                                                                               // 212
    range: 86400,                                                                                                      // 213
    val: function(d) {                                                                                                 // 214
      return d.dy || (d.dy = Math.ceil(1 + (later.D.start(d).getTime() - later.Y.start(d).getTime()) / later.DAY));    // 215
    },                                                                                                                 // 216
    isValid: function(d, val) {                                                                                        // 217
      return later.dy.val(d) === (val || later.dy.extent(d)[1]);                                                       // 218
    },                                                                                                                 // 219
    extent: function(d) {                                                                                              // 220
      var year = later.Y.val(d);                                                                                       // 221
      return d.dyExtent || (d.dyExtent = [ 1, year % 4 ? 365 : 366 ]);                                                 // 222
    },                                                                                                                 // 223
    start: function(d) {                                                                                               // 224
      return later.D.start(d);                                                                                         // 225
    },                                                                                                                 // 226
    end: function(d) {                                                                                                 // 227
      return later.D.end(d);                                                                                           // 228
    },                                                                                                                 // 229
    next: function(d, val) {                                                                                           // 230
      val = val > later.dy.extent(d)[1] ? 1 : val;                                                                     // 231
      var year = later.date.nextRollover(d, val, later.dy, later.Y), dyMax = later.dy.extent(year)[1];                 // 232
      val = val > dyMax ? 1 : val || dyMax;                                                                            // 233
      return later.date.next(later.Y.val(year), later.M.val(year), val);                                               // 234
    },                                                                                                                 // 235
    prev: function(d, val) {                                                                                           // 236
      var year = later.date.prevRollover(d, val, later.dy, later.Y), dyMax = later.dy.extent(year)[1];                 // 237
      val = val > dyMax ? dyMax : val || dyMax;                                                                        // 238
      return later.date.prev(later.Y.val(year), later.M.val(year), val);                                               // 239
    }                                                                                                                  // 240
  };                                                                                                                   // 241
  later.hour = later.h = {                                                                                             // 242
    name: "hour",                                                                                                      // 243
    range: 3600,                                                                                                       // 244
    val: function(d) {                                                                                                 // 245
      return d.h || (d.h = later.date.getHour.call(d));                                                                // 246
    },                                                                                                                 // 247
    isValid: function(d, val) {                                                                                        // 248
      return later.h.val(d) === val;                                                                                   // 249
    },                                                                                                                 // 250
    extent: function() {                                                                                               // 251
      return [ 0, 23 ];                                                                                                // 252
    },                                                                                                                 // 253
    start: function(d) {                                                                                               // 254
      return d.hStart || (d.hStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d))); // 255
    },                                                                                                                 // 256
    end: function(d) {                                                                                                 // 257
      return d.hEnd || (d.hEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d)));     // 258
    },                                                                                                                 // 259
    next: function(d, val) {                                                                                           // 260
      val = val > 23 ? 0 : val;                                                                                        // 261
      var next = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val <= later.h.val(d) ? 1 : 0), val);
      if (!later.date.isUTC && next.getTime() <= d.getTime()) {                                                        // 263
        next = later.date.next(later.Y.val(next), later.M.val(next), later.D.val(next), val + 1);                      // 264
      }                                                                                                                // 265
      return next;                                                                                                     // 266
    },                                                                                                                 // 267
    prev: function(d, val) {                                                                                           // 268
      val = val > 23 ? 23 : val;                                                                                       // 269
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (val >= later.h.val(d) ? -1 : 0), val);  // 270
    }                                                                                                                  // 271
  };                                                                                                                   // 272
  later.minute = later.m = {                                                                                           // 273
    name: "minute",                                                                                                    // 274
    range: 60,                                                                                                         // 275
    val: function(d) {                                                                                                 // 276
      return d.m || (d.m = later.date.getMin.call(d));                                                                 // 277
    },                                                                                                                 // 278
    isValid: function(d, val) {                                                                                        // 279
      return later.m.val(d) === val;                                                                                   // 280
    },                                                                                                                 // 281
    extent: function(d) {                                                                                              // 282
      return [ 0, 59 ];                                                                                                // 283
    },                                                                                                                 // 284
    start: function(d) {                                                                                               // 285
      return d.mStart || (d.mStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d)));
    },                                                                                                                 // 287
    end: function(d) {                                                                                                 // 288
      return d.mEnd || (d.mEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d)));
    },                                                                                                                 // 290
    next: function(d, val) {                                                                                           // 291
      var m = later.m.val(d), s = later.s.val(d), inc = val > 59 ? 60 - m : val <= m ? 60 - m + val : val - m, next = new Date(d.getTime() + inc * later.MIN - s * later.SEC);
      if (!later.date.isUTC && next.getTime() <= d.getTime()) {                                                        // 293
        next = new Date(d.getTime() + (inc + 120) * later.MIN - s * later.SEC);                                        // 294
      }                                                                                                                // 295
      return next;                                                                                                     // 296
    },                                                                                                                 // 297
    prev: function(d, val) {                                                                                           // 298
      val = val > 59 ? 59 : val;                                                                                       // 299
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d) + (val >= later.m.val(d) ? -1 : 0), val);
    }                                                                                                                  // 301
  };                                                                                                                   // 302
  later.month = later.M = {                                                                                            // 303
    name: "month",                                                                                                     // 304
    range: 2629740,                                                                                                    // 305
    val: function(d) {                                                                                                 // 306
      return d.M || (d.M = later.date.getMonth.call(d) + 1);                                                           // 307
    },                                                                                                                 // 308
    isValid: function(d, val) {                                                                                        // 309
      return later.M.val(d) === (val || 12);                                                                           // 310
    },                                                                                                                 // 311
    extent: function() {                                                                                               // 312
      return [ 1, 12 ];                                                                                                // 313
    },                                                                                                                 // 314
    start: function(d) {                                                                                               // 315
      return d.MStart || (d.MStart = later.date.next(later.Y.val(d), later.M.val(d)));                                 // 316
    },                                                                                                                 // 317
    end: function(d) {                                                                                                 // 318
      return d.MEnd || (d.MEnd = later.date.prev(later.Y.val(d), later.M.val(d)));                                     // 319
    },                                                                                                                 // 320
    next: function(d, val) {                                                                                           // 321
      val = val > 12 ? 1 : val || 12;                                                                                  // 322
      return later.date.next(later.Y.val(d) + (val > later.M.val(d) ? 0 : 1), val);                                    // 323
    },                                                                                                                 // 324
    prev: function(d, val) {                                                                                           // 325
      val = val > 12 ? 12 : val || 12;                                                                                 // 326
      return later.date.prev(later.Y.val(d) - (val >= later.M.val(d) ? 1 : 0), val);                                   // 327
    }                                                                                                                  // 328
  };                                                                                                                   // 329
  later.second = later.s = {                                                                                           // 330
    name: "second",                                                                                                    // 331
    range: 1,                                                                                                          // 332
    val: function(d) {                                                                                                 // 333
      return d.s || (d.s = later.date.getSec.call(d));                                                                 // 334
    },                                                                                                                 // 335
    isValid: function(d, val) {                                                                                        // 336
      return later.s.val(d) === val;                                                                                   // 337
    },                                                                                                                 // 338
    extent: function() {                                                                                               // 339
      return [ 0, 59 ];                                                                                                // 340
    },                                                                                                                 // 341
    start: function(d) {                                                                                               // 342
      return d;                                                                                                        // 343
    },                                                                                                                 // 344
    end: function(d) {                                                                                                 // 345
      return d;                                                                                                        // 346
    },                                                                                                                 // 347
    next: function(d, val) {                                                                                           // 348
      var s = later.s.val(d), inc = val > 59 ? 60 - s : val <= s ? 60 - s + val : val - s, next = new Date(d.getTime() + inc * later.SEC);
      if (!later.date.isUTC && next.getTime() <= d.getTime()) {                                                        // 350
        next = new Date(d.getTime() + (inc + 7200) * later.SEC);                                                       // 351
      }                                                                                                                // 352
      return next;                                                                                                     // 353
    },                                                                                                                 // 354
    prev: function(d, val, cache) {                                                                                    // 355
      val = val > 59 ? 59 : val;                                                                                       // 356
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d) + (val >= later.s.val(d) ? -1 : 0), val);
    }                                                                                                                  // 358
  };                                                                                                                   // 359
  later.time = later.t = {                                                                                             // 360
    name: "time",                                                                                                      // 361
    range: 1,                                                                                                          // 362
    val: function(d) {                                                                                                 // 363
      return d.t || (d.t = later.h.val(d) * 3600 + later.m.val(d) * 60 + later.s.val(d));                              // 364
    },                                                                                                                 // 365
    isValid: function(d, val) {                                                                                        // 366
      return later.t.val(d) === val;                                                                                   // 367
    },                                                                                                                 // 368
    extent: function() {                                                                                               // 369
      return [ 0, 86399 ];                                                                                             // 370
    },                                                                                                                 // 371
    start: function(d) {                                                                                               // 372
      return d;                                                                                                        // 373
    },                                                                                                                 // 374
    end: function(d) {                                                                                                 // 375
      return d;                                                                                                        // 376
    },                                                                                                                 // 377
    next: function(d, val) {                                                                                           // 378
      val = val > 86399 ? 0 : val;                                                                                     // 379
      var next = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val <= later.t.val(d) ? 1 : 0), 0, 0, val);
      if (!later.date.isUTC && next.getTime() < d.getTime()) {                                                         // 381
        next = later.date.next(later.Y.val(next), later.M.val(next), later.D.val(next), later.h.val(next), later.m.val(next), val + 7200);
      }                                                                                                                // 383
      return next;                                                                                                     // 384
    },                                                                                                                 // 385
    prev: function(d, val) {                                                                                           // 386
      val = val > 86399 ? 86399 : val;                                                                                 // 387
      return later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val >= later.t.val(d) ? -1 : 0), 0, 0, val);
    }                                                                                                                  // 389
  };                                                                                                                   // 390
  later.weekOfMonth = later.wm = {                                                                                     // 391
    name: "week of month",                                                                                             // 392
    range: 604800,                                                                                                     // 393
    val: function(d) {                                                                                                 // 394
      return d.wm || (d.wm = (later.D.val(d) + (later.dw.val(later.M.start(d)) - 1) + (7 - later.dw.val(d))) / 7);     // 395
    },                                                                                                                 // 396
    isValid: function(d, val) {                                                                                        // 397
      return later.wm.val(d) === (val || later.wm.extent(d)[1]);                                                       // 398
    },                                                                                                                 // 399
    extent: function(d) {                                                                                              // 400
      return d.wmExtent || (d.wmExtent = [ 1, (later.D.extent(d)[1] + (later.dw.val(later.M.start(d)) - 1) + (7 - later.dw.val(later.M.end(d)))) / 7 ]);
    },                                                                                                                 // 402
    start: function(d) {                                                                                               // 403
      return d.wmStart || (d.wmStart = later.date.next(later.Y.val(d), later.M.val(d), Math.max(later.D.val(d) - later.dw.val(d) + 1, 1)));
    },                                                                                                                 // 405
    end: function(d) {                                                                                                 // 406
      return d.wmEnd || (d.wmEnd = later.date.prev(later.Y.val(d), later.M.val(d), Math.min(later.D.val(d) + (7 - later.dw.val(d)), later.D.extent(d)[1])));
    },                                                                                                                 // 408
    next: function(d, val) {                                                                                           // 409
      val = val > later.wm.extent(d)[1] ? 1 : val;                                                                     // 410
      var month = later.date.nextRollover(d, val, later.wm, later.M), wmMax = later.wm.extent(month)[1];               // 411
      val = val > wmMax ? 1 : val || wmMax;                                                                            // 412
      return later.date.next(later.Y.val(month), later.M.val(month), Math.max(1, (val - 1) * 7 - (later.dw.val(month) - 2)));
    },                                                                                                                 // 414
    prev: function(d, val) {                                                                                           // 415
      var month = later.date.prevRollover(d, val, later.wm, later.M), wmMax = later.wm.extent(month)[1];               // 416
      val = val > wmMax ? wmMax : val || wmMax;                                                                        // 417
      return later.wm.end(later.date.next(later.Y.val(month), later.M.val(month), Math.max(1, (val - 1) * 7 - (later.dw.val(month) - 2))));
    }                                                                                                                  // 419
  };                                                                                                                   // 420
  later.weekOfYear = later.wy = {                                                                                      // 421
    name: "week of year (ISO)",                                                                                        // 422
    range: 604800,                                                                                                     // 423
    val: function(d) {                                                                                                 // 424
      if (d.wy) return d.wy;                                                                                           // 425
      var wThur = later.dw.next(later.wy.start(d), 5), YThur = later.dw.next(later.Y.prev(wThur, later.Y.val(wThur) - 1), 5);
      return d.wy = 1 + Math.ceil((wThur.getTime() - YThur.getTime()) / later.WEEK);                                   // 427
    },                                                                                                                 // 428
    isValid: function(d, val) {                                                                                        // 429
      return later.wy.val(d) === (val || later.wy.extent(d)[1]);                                                       // 430
    },                                                                                                                 // 431
    extent: function(d) {                                                                                              // 432
      if (d.wyExtent) return d.wyExtent;                                                                               // 433
      var year = later.dw.next(later.wy.start(d), 5), dwFirst = later.dw.val(later.Y.start(year)), dwLast = later.dw.val(later.Y.end(year));
      return d.wyExtent = [ 1, dwFirst === 5 || dwLast === 5 ? 53 : 52 ];                                              // 435
    },                                                                                                                 // 436
    start: function(d) {                                                                                               // 437
      return d.wyStart || (d.wyStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) - (later.dw.val(d) > 1 ? later.dw.val(d) - 2 : 6)));
    },                                                                                                                 // 439
    end: function(d) {                                                                                                 // 440
      return d.wyEnd || (d.wyEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (later.dw.val(d) > 1 ? 8 - later.dw.val(d) : 0)));
    },                                                                                                                 // 442
    next: function(d, val) {                                                                                           // 443
      val = val > later.wy.extent(d)[1] ? 1 : val;                                                                     // 444
      var wyThur = later.dw.next(later.wy.start(d), 5), year = later.date.nextRollover(wyThur, val, later.wy, later.Y);
      if (later.wy.val(year) !== 1) {                                                                                  // 446
        year = later.dw.next(year, 2);                                                                                 // 447
      }                                                                                                                // 448
      var wyMax = later.wy.extent(year)[1], wyStart = later.wy.start(year);                                            // 449
      val = val > wyMax ? 1 : val || wyMax;                                                                            // 450
      return later.date.next(later.Y.val(wyStart), later.M.val(wyStart), later.D.val(wyStart) + 7 * (val - 1));        // 451
    },                                                                                                                 // 452
    prev: function(d, val) {                                                                                           // 453
      var wyThur = later.dw.next(later.wy.start(d), 5), year = later.date.prevRollover(wyThur, val, later.wy, later.Y);
      if (later.wy.val(year) !== 1) {                                                                                  // 455
        year = later.dw.next(year, 2);                                                                                 // 456
      }                                                                                                                // 457
      var wyMax = later.wy.extent(year)[1], wyEnd = later.wy.end(year);                                                // 458
      val = val > wyMax ? wyMax : val || wyMax;                                                                        // 459
      return later.wy.end(later.date.next(later.Y.val(wyEnd), later.M.val(wyEnd), later.D.val(wyEnd) + 7 * (val - 1)));
    }                                                                                                                  // 461
  };                                                                                                                   // 462
  later.year = later.Y = {                                                                                             // 463
    name: "year",                                                                                                      // 464
    range: 31556900,                                                                                                   // 465
    val: function(d) {                                                                                                 // 466
      return d.Y || (d.Y = later.date.getYear.call(d));                                                                // 467
    },                                                                                                                 // 468
    isValid: function(d, val) {                                                                                        // 469
      return later.Y.val(d) === val;                                                                                   // 470
    },                                                                                                                 // 471
    extent: function() {                                                                                               // 472
      return [ 1970, 2099 ];                                                                                           // 473
    },                                                                                                                 // 474
    start: function(d) {                                                                                               // 475
      return d.YStart || (d.YStart = later.date.next(later.Y.val(d)));                                                 // 476
    },                                                                                                                 // 477
    end: function(d) {                                                                                                 // 478
      return d.YEnd || (d.YEnd = later.date.prev(later.Y.val(d)));                                                     // 479
    },                                                                                                                 // 480
    next: function(d, val) {                                                                                           // 481
      return val > later.Y.val(d) && val <= later.Y.extent()[1] ? later.date.next(val) : later.NEVER;                  // 482
    },                                                                                                                 // 483
    prev: function(d, val) {                                                                                           // 484
      return val < later.Y.val(d) && val >= later.Y.extent()[0] ? later.date.prev(val) : later.NEVER;                  // 485
    }                                                                                                                  // 486
  };                                                                                                                   // 487
  later.fullDate = later.fd = {                                                                                        // 488
    name: "full date",                                                                                                 // 489
    range: 1,                                                                                                          // 490
    val: function(d) {                                                                                                 // 491
      return d.fd || (d.fd = d.getTime());                                                                             // 492
    },                                                                                                                 // 493
    isValid: function(d, val) {                                                                                        // 494
      return later.fd.val(d) === val;                                                                                  // 495
    },                                                                                                                 // 496
    extent: function() {                                                                                               // 497
      return [ 0, 3250368e7 ];                                                                                         // 498
    },                                                                                                                 // 499
    start: function(d) {                                                                                               // 500
      return d;                                                                                                        // 501
    },                                                                                                                 // 502
    end: function(d) {                                                                                                 // 503
      return d;                                                                                                        // 504
    },                                                                                                                 // 505
    next: function(d, val) {                                                                                           // 506
      return later.fd.val(d) < val ? new Date(val) : later.NEVER;                                                      // 507
    },                                                                                                                 // 508
    prev: function(d, val) {                                                                                           // 509
      return later.fd.val(d) > val ? new Date(val) : later.NEVER;                                                      // 510
    }                                                                                                                  // 511
  };                                                                                                                   // 512
  later.modifier = {};                                                                                                 // 513
  later.modifier.after = later.modifier.a = function(constraint, values) {                                             // 514
    var value = values[0];                                                                                             // 515
    return {                                                                                                           // 516
      name: "after " + constraint.name,                                                                                // 517
      range: (constraint.extent(new Date())[1] - value) * constraint.range,                                            // 518
      val: constraint.val,                                                                                             // 519
      isValid: function(d, val) {                                                                                      // 520
        return this.val(d) >= value;                                                                                   // 521
      },                                                                                                               // 522
      extent: constraint.extent,                                                                                       // 523
      start: constraint.start,                                                                                         // 524
      end: constraint.end,                                                                                             // 525
      next: function(startDate, val) {                                                                                 // 526
        if (val != value) val = constraint.extent(startDate)[0];                                                       // 527
        return constraint.next(startDate, val);                                                                        // 528
      },                                                                                                               // 529
      prev: function(startDate, val) {                                                                                 // 530
        val = val === value ? constraint.extent(startDate)[1] : value - 1;                                             // 531
        return constraint.prev(startDate, val);                                                                        // 532
      }                                                                                                                // 533
    };                                                                                                                 // 534
  };                                                                                                                   // 535
  later.modifier.before = later.modifier.b = function(constraint, values) {                                            // 536
    var value = values[values.length - 1];                                                                             // 537
    return {                                                                                                           // 538
      name: "before " + constraint.name,                                                                               // 539
      range: constraint.range * (value - 1),                                                                           // 540
      val: constraint.val,                                                                                             // 541
      isValid: function(d, val) {                                                                                      // 542
        return this.val(d) < value;                                                                                    // 543
      },                                                                                                               // 544
      extent: constraint.extent,                                                                                       // 545
      start: constraint.start,                                                                                         // 546
      end: constraint.end,                                                                                             // 547
      next: function(startDate, val) {                                                                                 // 548
        val = val === value ? constraint.extent(startDate)[0] : value;                                                 // 549
        return constraint.next(startDate, val);                                                                        // 550
      },                                                                                                               // 551
      prev: function(startDate, val) {                                                                                 // 552
        val = val === value ? value - 1 : constraint.extent(startDate)[1];                                             // 553
        return constraint.prev(startDate, val);                                                                        // 554
      }                                                                                                                // 555
    };                                                                                                                 // 556
  };                                                                                                                   // 557
  later.compile = function(schedDef) {                                                                                 // 558
    var constraints = [], constraintsLen = 0, tickConstraint;                                                          // 559
    for (var key in schedDef) {                                                                                        // 560
      var nameParts = key.split("_"), name = nameParts[0], mod = nameParts[1], vals = schedDef[key], constraint = mod ? later.modifier[mod](later[name], vals) : later[name];
      constraints.push({                                                                                               // 562
        constraint: constraint,                                                                                        // 563
        vals: vals                                                                                                     // 564
      });                                                                                                              // 565
      constraintsLen++;                                                                                                // 566
    }                                                                                                                  // 567
    constraints.sort(function(a, b) {                                                                                  // 568
      var ra = a.constraint.range, rb = b.constraint.range;                                                            // 569
      return rb < ra ? -1 : rb > ra ? 1 : 0;                                                                           // 570
    });                                                                                                                // 571
    tickConstraint = constraints[constraintsLen - 1].constraint;                                                       // 572
    function compareFn(dir) {                                                                                          // 573
      return dir === "next" ? function(a, b) {                                                                         // 574
        return a.getTime() > b.getTime();                                                                              // 575
      } : function(a, b) {                                                                                             // 576
        return b.getTime() > a.getTime();                                                                              // 577
      };                                                                                                               // 578
    }                                                                                                                  // 579
    return {                                                                                                           // 580
      start: function(dir, startDate) {                                                                                // 581
        var next = startDate, nextVal = later.array[dir], maxAttempts = 1e3, done;                                     // 582
        while (maxAttempts-- && !done && next) {                                                                       // 583
          done = true;                                                                                                 // 584
          for (var i = 0; i < constraintsLen; i++) {                                                                   // 585
            var constraint = constraints[i].constraint, curVal = constraint.val(next), extent = constraint.extent(next), newVal = nextVal(curVal, constraints[i].vals, extent);
            if (!constraint.isValid(next, newVal)) {                                                                   // 587
              next = constraint[dir](next, newVal);                                                                    // 588
              done = false;                                                                                            // 589
              break;                                                                                                   // 590
            }                                                                                                          // 591
          }                                                                                                            // 592
        }                                                                                                              // 593
        if (next !== later.NEVER) {                                                                                    // 594
          next = dir === "next" ? tickConstraint.start(next) : tickConstraint.end(next);                               // 595
        }                                                                                                              // 596
        return next;                                                                                                   // 597
      },                                                                                                               // 598
      end: function(dir, startDate) {                                                                                  // 599
        var result, nextVal = later.array[dir + "Invalid"], compare = compareFn(dir);                                  // 600
        for (var i = constraintsLen - 1; i >= 0; i--) {                                                                // 601
          var constraint = constraints[i].constraint, curVal = constraint.val(startDate), extent = constraint.extent(startDate), newVal = nextVal(curVal, constraints[i].vals, extent), next;
          if (newVal !== undefined) {                                                                                  // 603
            next = constraint[dir](startDate, newVal);                                                                 // 604
            if (next && (!result || compare(result, next))) {                                                          // 605
              result = next;                                                                                           // 606
            }                                                                                                          // 607
          }                                                                                                            // 608
        }                                                                                                              // 609
        return result;                                                                                                 // 610
      },                                                                                                               // 611
      tick: function(dir, date) {                                                                                      // 612
        return new Date(dir === "next" ? tickConstraint.end(date).getTime() + later.SEC : tickConstraint.start(date).getTime() - later.SEC);
      },                                                                                                               // 614
      tickStart: function(date) {                                                                                      // 615
        return tickConstraint.start(date);                                                                             // 616
      }                                                                                                                // 617
    };                                                                                                                 // 618
  };                                                                                                                   // 619
  later.schedule = function(sched) {                                                                                   // 620
    if (!sched) throw new Error("Missing schedule definition.");                                                       // 621
    if (!sched.schedules) throw new Error("Definition must include at least one schedule.");                           // 622
    var schedules = [], schedulesLen = sched.schedules.length, exceptions = [], exceptionsLen = sched.exceptions ? sched.exceptions.length : 0;
    for (var i = 0; i < schedulesLen; i++) {                                                                           // 624
      schedules.push(later.compile(sched.schedules[i]));                                                               // 625
    }                                                                                                                  // 626
    for (var j = 0; j < exceptionsLen; j++) {                                                                          // 627
      exceptions.push(later.compile(sched.exceptions[j]));                                                             // 628
    }                                                                                                                  // 629
    function getInstances(dir, count, startDate, endDate, isRange) {                                                   // 630
      var compare = compareFn(dir), loopCount = count, maxAttempts = 1e3, schedStarts = [], exceptStarts = [], next, end, results = [], isForward = dir === "next", lastResult, rStart = isForward ? 0 : 1, rEnd = isForward ? 1 : 0;
      startDate = startDate ? new Date(startDate) : new Date();                                                        // 632
      if (!startDate || !startDate.getTime()) throw new Error("Invalid start date.");                                  // 633
      setNextStarts(dir, schedules, schedStarts, startDate);                                                           // 634
      setRangeStarts(dir, exceptions, exceptStarts, startDate);                                                        // 635
      while (maxAttempts-- && loopCount && (next = findNext(schedStarts, compare))) {                                  // 636
        if (endDate && compare(next, endDate)) {                                                                       // 637
          break;                                                                                                       // 638
        }                                                                                                              // 639
        if (exceptionsLen) {                                                                                           // 640
          updateRangeStarts(dir, exceptions, exceptStarts, next);                                                      // 641
          if (end = calcRangeOverlap(dir, exceptStarts, next)) {                                                       // 642
            updateNextStarts(dir, schedules, schedStarts, end);                                                        // 643
            continue;                                                                                                  // 644
          }                                                                                                            // 645
        }                                                                                                              // 646
        if (isRange) {                                                                                                 // 647
          var maxEndDate = calcMaxEndDate(exceptStarts, compare);                                                      // 648
          end = calcEnd(dir, schedules, schedStarts, next, maxEndDate);                                                // 649
          r = isForward ? [ new Date(Math.max(startDate, next)), end ? new Date(endDate ? Math.min(end, endDate) : end) : undefined ] : [ end ? new Date(endDate ? Math.max(endDate, end.getTime() + later.SEC) : end.getTime() + later.SEC) : undefined, new Date(Math.min(startDate, next.getTime() + later.SEC)) ];
          if (lastResult && r[rStart].getTime() === lastResult[rEnd].getTime()) {                                      // 651
            lastResult[rEnd] = r[rEnd];                                                                                // 652
            loopCount++;                                                                                               // 653
          } else {                                                                                                     // 654
            lastResult = r;                                                                                            // 655
            results.push(lastResult);                                                                                  // 656
          }                                                                                                            // 657
          if (!end) break;                                                                                             // 658
          updateNextStarts(dir, schedules, schedStarts, end);                                                          // 659
        } else {                                                                                                       // 660
          results.push(isForward ? new Date(Math.max(startDate, next)) : getStart(schedules, schedStarts, next, endDate));
          tickStarts(dir, schedules, schedStarts, next);                                                               // 662
        }                                                                                                              // 663
        loopCount--;                                                                                                   // 664
      }                                                                                                                // 665
      return results.length === 0 ? later.NEVER : count === 1 ? results[0] : results;                                  // 666
    }                                                                                                                  // 667
    function setNextStarts(dir, schedArr, startsArr, startDate) {                                                      // 668
      for (var i = 0, len = schedArr.length; i < len; i++) {                                                           // 669
        startsArr[i] = schedArr[i].start(dir, startDate);                                                              // 670
      }                                                                                                                // 671
    }                                                                                                                  // 672
    function updateNextStarts(dir, schedArr, startsArr, startDate) {                                                   // 673
      var compare = compareFn(dir);                                                                                    // 674
      for (var i = 0, len = schedArr.length; i < len; i++) {                                                           // 675
        if (startsArr[i] && !compare(startsArr[i], startDate)) {                                                       // 676
          startsArr[i] = schedArr[i].start(dir, startDate);                                                            // 677
        }                                                                                                              // 678
      }                                                                                                                // 679
    }                                                                                                                  // 680
    function setRangeStarts(dir, schedArr, rangesArr, startDate) {                                                     // 681
      var compare = compareFn(dir);                                                                                    // 682
      for (var i = 0, len = schedArr.length; i < len; i++) {                                                           // 683
        var nextStart = schedArr[i].start(dir, startDate);                                                             // 684
        if (!nextStart) {                                                                                              // 685
          rangesArr[i] = later.NEVER;                                                                                  // 686
        } else {                                                                                                       // 687
          rangesArr[i] = [ nextStart, schedArr[i].end(dir, nextStart) ];                                               // 688
        }                                                                                                              // 689
      }                                                                                                                // 690
    }                                                                                                                  // 691
    function updateRangeStarts(dir, schedArr, rangesArr, startDate) {                                                  // 692
      var compare = compareFn(dir);                                                                                    // 693
      for (var i = 0, len = schedArr.length; i < len; i++) {                                                           // 694
        if (rangesArr[i] && !compare(rangesArr[i][0], startDate)) {                                                    // 695
          var nextStart = schedArr[i].start(dir, startDate);                                                           // 696
          if (!nextStart) {                                                                                            // 697
            rangesArr[i] = later.NEVER;                                                                                // 698
          } else {                                                                                                     // 699
            rangesArr[i] = [ nextStart, schedArr[i].end(dir, nextStart) ];                                             // 700
          }                                                                                                            // 701
        }                                                                                                              // 702
      }                                                                                                                // 703
    }                                                                                                                  // 704
    function tickStarts(dir, schedArr, startsArr, startDate) {                                                         // 705
      for (var i = 0, len = schedArr.length; i < len; i++) {                                                           // 706
        if (startsArr[i] && startsArr[i].getTime() === startDate.getTime()) {                                          // 707
          startsArr[i] = schedArr[i].start(dir, schedArr[i].tick(dir, startDate));                                     // 708
        }                                                                                                              // 709
      }                                                                                                                // 710
    }                                                                                                                  // 711
    function getStart(schedArr, startsArr, startDate, minEndDate) {                                                    // 712
      var result;                                                                                                      // 713
      for (var i = 0, len = startsArr.length; i < len; i++) {                                                          // 714
        if (startsArr[i] && startsArr[i].getTime() === startDate.getTime()) {                                          // 715
          var start = schedArr[i].tickStart(startDate);                                                                // 716
          if (minEndDate && start < minEndDate) {                                                                      // 717
            return minEndDate;                                                                                         // 718
          }                                                                                                            // 719
          if (!result || start > result) {                                                                             // 720
            result = start;                                                                                            // 721
          }                                                                                                            // 722
        }                                                                                                              // 723
      }                                                                                                                // 724
      return result;                                                                                                   // 725
    }                                                                                                                  // 726
    function calcRangeOverlap(dir, rangesArr, startDate) {                                                             // 727
      var compare = compareFn(dir), result;                                                                            // 728
      for (var i = 0, len = rangesArr.length; i < len; i++) {                                                          // 729
        var range = rangesArr[i];                                                                                      // 730
        if (range && !compare(range[0], startDate) && (!range[1] || compare(range[1], startDate))) {                   // 731
          if (!result || compare(range[1], result)) {                                                                  // 732
            result = range[1];                                                                                         // 733
          }                                                                                                            // 734
        }                                                                                                              // 735
      }                                                                                                                // 736
      return result;                                                                                                   // 737
    }                                                                                                                  // 738
    function calcMaxEndDate(exceptsArr, compare) {                                                                     // 739
      var result;                                                                                                      // 740
      for (var i = 0, len = exceptsArr.length; i < len; i++) {                                                         // 741
        if (exceptsArr[i] && (!result || compare(result, exceptsArr[i][0]))) {                                         // 742
          result = exceptsArr[i][0];                                                                                   // 743
        }                                                                                                              // 744
      }                                                                                                                // 745
      return result;                                                                                                   // 746
    }                                                                                                                  // 747
    function calcEnd(dir, schedArr, startsArr, startDate, maxEndDate) {                                                // 748
      var compare = compareFn(dir), result;                                                                            // 749
      for (var i = 0, len = schedArr.length; i < len; i++) {                                                           // 750
        var start = startsArr[i];                                                                                      // 751
        if (start && start.getTime() === startDate.getTime()) {                                                        // 752
          var end = schedArr[i].end(dir, start);                                                                       // 753
          if (maxEndDate && (!end || compare(end, maxEndDate))) {                                                      // 754
            return maxEndDate;                                                                                         // 755
          }                                                                                                            // 756
          if (!result || compare(end, result)) {                                                                       // 757
            result = end;                                                                                              // 758
          }                                                                                                            // 759
        }                                                                                                              // 760
      }                                                                                                                // 761
      return result;                                                                                                   // 762
    }                                                                                                                  // 763
    function compareFn(dir) {                                                                                          // 764
      return dir === "next" ? function(a, b) {                                                                         // 765
        return !b || a.getTime() > b.getTime();                                                                        // 766
      } : function(a, b) {                                                                                             // 767
        return !a || b.getTime() > a.getTime();                                                                        // 768
      };                                                                                                               // 769
    }                                                                                                                  // 770
    function findNext(arr, compare) {                                                                                  // 771
      var next = arr[0];                                                                                               // 772
      for (var i = 1, len = arr.length; i < len; i++) {                                                                // 773
        if (arr[i] && compare(next, arr[i])) {                                                                         // 774
          next = arr[i];                                                                                               // 775
        }                                                                                                              // 776
      }                                                                                                                // 777
      return next;                                                                                                     // 778
    }                                                                                                                  // 779
    return {                                                                                                           // 780
      isValid: function(d) {                                                                                           // 781
        return getInstances("next", 1, d, d) !== later.NEVER;                                                          // 782
      },                                                                                                               // 783
      next: function(count, startDate, endDate) {                                                                      // 784
        return getInstances("next", count || 1, startDate, endDate);                                                   // 785
      },                                                                                                               // 786
      prev: function(count, startDate, endDate) {                                                                      // 787
        return getInstances("prev", count || 1, startDate, endDate);                                                   // 788
      },                                                                                                               // 789
      nextRange: function(count, startDate, endDate) {                                                                 // 790
        return getInstances("next", count || 1, startDate, endDate, true);                                             // 791
      },                                                                                                               // 792
      prevRange: function(count, startDate, endDate) {                                                                 // 793
        return getInstances("prev", count || 1, startDate, endDate, true);                                             // 794
      }                                                                                                                // 795
    };                                                                                                                 // 796
  };                                                                                                                   // 797
  later.setTimeout = function(fn, sched) {                                                                             // 798
    var s = later.schedule(sched), t;                                                                                  // 799
    scheduleTimeout();                                                                                                 // 800
    function scheduleTimeout() {                                                                                       // 801
      var now = Date.now(), next = s.next(2, now), diff = next[0].getTime() - now;                                     // 802
      if (diff < 1e3) {                                                                                                // 803
        diff = next[1].getTime() - now;                                                                                // 804
      }                                                                                                                // 805
      if (diff < 2147483647) {                                                                                         // 806
        t = setTimeout(fn, diff);                                                                                      // 807
      } else {                                                                                                         // 808
        t = setTimeout(scheduleTimeout, 2147483647);                                                                   // 809
      }                                                                                                                // 810
    }                                                                                                                  // 811
    return {                                                                                                           // 812
      clear: function() {                                                                                              // 813
        clearTimeout(t);                                                                                               // 814
      }                                                                                                                // 815
    };                                                                                                                 // 816
  };                                                                                                                   // 817
  later.setInterval = function(fn, sched) {                                                                            // 818
    var t = later.setTimeout(scheduleTimeout, sched), done = false;                                                    // 819
    function scheduleTimeout() {                                                                                       // 820
      if (!done) {                                                                                                     // 821
        fn();                                                                                                          // 822
        t = later.setTimeout(scheduleTimeout, sched);                                                                  // 823
      }                                                                                                                // 824
    }                                                                                                                  // 825
    return {                                                                                                           // 826
      clear: function() {                                                                                              // 827
        done = true;                                                                                                   // 828
        t.clear();                                                                                                     // 829
      }                                                                                                                // 830
    };                                                                                                                 // 831
  };                                                                                                                   // 832
  later.date = {};                                                                                                     // 833
  later.date.timezone = function(useLocalTime) {                                                                       // 834
    later.date.build = useLocalTime ? function(Y, M, D, h, m, s) {                                                     // 835
      return new Date(Y, M, D, h, m, s);                                                                               // 836
    } : function(Y, M, D, h, m, s) {                                                                                   // 837
      return new Date(Date.UTC(Y, M, D, h, m, s));                                                                     // 838
    };                                                                                                                 // 839
    var get = useLocalTime ? "get" : "getUTC", d = Date.prototype;                                                     // 840
    later.date.getYear = d[get + "FullYear"];                                                                          // 841
    later.date.getMonth = d[get + "Month"];                                                                            // 842
    later.date.getDate = d[get + "Date"];                                                                              // 843
    later.date.getDay = d[get + "Day"];                                                                                // 844
    later.date.getHour = d[get + "Hours"];                                                                             // 845
    later.date.getMin = d[get + "Minutes"];                                                                            // 846
    later.date.getSec = d[get + "Seconds"];                                                                            // 847
    later.date.isUTC = !useLocalTime;                                                                                  // 848
  };                                                                                                                   // 849
  later.date.UTC = function() {                                                                                        // 850
    later.date.timezone(false);                                                                                        // 851
  };                                                                                                                   // 852
  later.date.localTime = function() {                                                                                  // 853
    later.date.timezone(true);                                                                                         // 854
  };                                                                                                                   // 855
  later.date.UTC();                                                                                                    // 856
  later.SEC = 1e3;                                                                                                     // 857
  later.MIN = later.SEC * 60;                                                                                          // 858
  later.HOUR = later.MIN * 60;                                                                                         // 859
  later.DAY = later.HOUR * 24;                                                                                         // 860
  later.WEEK = later.DAY * 7;                                                                                          // 861
  later.DAYS_IN_MONTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];                                            // 862
  later.NEVER = 0;                                                                                                     // 863
  later.date.next = function(Y, M, D, h, m, s) {                                                                       // 864
    return later.date.build(Y, M !== undefined ? M - 1 : 0, D !== undefined ? D : 1, h || 0, m || 0, s || 0);          // 865
  };                                                                                                                   // 866
  later.date.nextRollover = function(d, val, constraint, period) {                                                     // 867
    var cur = constraint.val(d), max = constraint.extent(d)[1];                                                        // 868
    return (val || max) <= cur || val > max ? new Date(period.end(d).getTime() + later.SEC) : period.start(d);         // 869
  };                                                                                                                   // 870
  later.date.prev = function(Y, M, D, h, m, s) {                                                                       // 871
    var len = arguments.length;                                                                                        // 872
    M = len < 2 ? 11 : M - 1;                                                                                          // 873
    D = len < 3 ? later.D.extent(later.date.next(Y, M + 1))[1] : D;                                                    // 874
    h = len < 4 ? 23 : h;                                                                                              // 875
    m = len < 5 ? 59 : m;                                                                                              // 876
    s = len < 6 ? 59 : s;                                                                                              // 877
    return later.date.build(Y, M, D, h, m, s);                                                                         // 878
  };                                                                                                                   // 879
  later.date.prevRollover = function(d, val, constraint, period) {                                                     // 880
    var cur = constraint.val(d);                                                                                       // 881
    return val >= cur || !val ? period.start(period.prev(d, period.val(d) - 1)) : period.start(d);                     // 882
  };                                                                                                                   // 883
  later.parse = {};                                                                                                    // 884
  later.parse.cron = function(expr, hasSeconds) {                                                                      // 885
    var NAMES = {                                                                                                      // 886
      JAN: 1,                                                                                                          // 887
      FEB: 2,                                                                                                          // 888
      MAR: 3,                                                                                                          // 889
      APR: 4,                                                                                                          // 890
      MAY: 5,                                                                                                          // 891
      JUN: 6,                                                                                                          // 892
      JUL: 7,                                                                                                          // 893
      AUG: 8,                                                                                                          // 894
      SEP: 9,                                                                                                          // 895
      OCT: 10,                                                                                                         // 896
      NOV: 11,                                                                                                         // 897
      DEC: 12,                                                                                                         // 898
      SUN: 1,                                                                                                          // 899
      MON: 2,                                                                                                          // 900
      TUE: 3,                                                                                                          // 901
      WED: 4,                                                                                                          // 902
      THU: 5,                                                                                                          // 903
      FRI: 6,                                                                                                          // 904
      SAT: 7                                                                                                           // 905
    };                                                                                                                 // 906
    var FIELDS = {                                                                                                     // 907
      s: [ 0, 0, 59 ],                                                                                                 // 908
      m: [ 1, 0, 59 ],                                                                                                 // 909
      h: [ 2, 0, 23 ],                                                                                                 // 910
      D: [ 3, 1, 31 ],                                                                                                 // 911
      M: [ 4, 1, 12 ],                                                                                                 // 912
      Y: [ 6, 1970, 2099 ],                                                                                            // 913
      d: [ 5, 1, 7, 1 ]                                                                                                // 914
    };                                                                                                                 // 915
    function getValue(value, offset) {                                                                                 // 916
      return isNaN(value) ? NAMES[value] || null : +value + (offset || 0);                                             // 917
    }                                                                                                                  // 918
    function cloneSchedule(sched) {                                                                                    // 919
      var clone = {}, field;                                                                                           // 920
      for (field in sched) {                                                                                           // 921
        if (field !== "dc" && field !== "d") {                                                                         // 922
          clone[field] = sched[field].slice(0);                                                                        // 923
        }                                                                                                              // 924
      }                                                                                                                // 925
      return clone;                                                                                                    // 926
    }                                                                                                                  // 927
    function add(sched, name, min, max, inc) {                                                                         // 928
      var i = min;                                                                                                     // 929
      if (!sched[name]) {                                                                                              // 930
        sched[name] = [];                                                                                              // 931
      }                                                                                                                // 932
      while (i <= max) {                                                                                               // 933
        if (sched[name].indexOf(i) < 0) {                                                                              // 934
          sched[name].push(i);                                                                                         // 935
        }                                                                                                              // 936
        i += inc || 1;                                                                                                 // 937
      }                                                                                                                // 938
    }                                                                                                                  // 939
    function addHash(schedules, curSched, value, hash) {                                                               // 940
      if (curSched.d && !curSched.dc || curSched.dc && curSched.dc.indexOf(hash) < 0) {                                // 941
        schedules.push(cloneSchedule(curSched));                                                                       // 942
        curSched = schedules[schedules.length - 1];                                                                    // 943
      }                                                                                                                // 944
      add(curSched, "d", value, value);                                                                                // 945
      add(curSched, "dc", hash, hash);                                                                                 // 946
    }                                                                                                                  // 947
    function addWeekday(s, curSched, value) {                                                                          // 948
      var except1 = {}, except2 = {};                                                                                  // 949
      if (value === 1) {                                                                                               // 950
        add(curSched, "D", 1, 3);                                                                                      // 951
        add(curSched, "d", NAMES.MON, NAMES.FRI);                                                                      // 952
        add(except1, "D", 2, 2);                                                                                       // 953
        add(except1, "d", NAMES.TUE, NAMES.FRI);                                                                       // 954
        add(except2, "D", 3, 3);                                                                                       // 955
        add(except2, "d", NAMES.TUE, NAMES.FRI);                                                                       // 956
      } else {                                                                                                         // 957
        add(curSched, "D", value - 1, value + 1);                                                                      // 958
        add(curSched, "d", NAMES.MON, NAMES.FRI);                                                                      // 959
        add(except1, "D", value - 1, value - 1);                                                                       // 960
        add(except1, "d", NAMES.MON, NAMES.THU);                                                                       // 961
        add(except2, "D", value + 1, value + 1);                                                                       // 962
        add(except2, "d", NAMES.TUE, NAMES.FRI);                                                                       // 963
      }                                                                                                                // 964
      s.exceptions.push(except1);                                                                                      // 965
      s.exceptions.push(except2);                                                                                      // 966
    }                                                                                                                  // 967
    function addRange(item, curSched, name, min, max, offset) {                                                        // 968
      var incSplit = item.split("/"), inc = +incSplit[1], range = incSplit[0];                                         // 969
      if (range !== "*" && range !== "0") {                                                                            // 970
        var rangeSplit = range.split("-");                                                                             // 971
        min = getValue(rangeSplit[0], offset);                                                                         // 972
        max = getValue(rangeSplit[1], offset) || max;                                                                  // 973
      }                                                                                                                // 974
      add(curSched, name, min, max, inc);                                                                              // 975
    }                                                                                                                  // 976
    function parse(item, s, name, min, max, offset) {                                                                  // 977
      var value, split, schedules = s.schedules, curSched = schedules[schedules.length - 1];                           // 978
      if (item === "L") {                                                                                              // 979
        item = min - 1;                                                                                                // 980
      }                                                                                                                // 981
      if ((value = getValue(item, offset)) !== null) {                                                                 // 982
        add(curSched, name, value, value);                                                                             // 983
      } else if ((value = getValue(item.replace("W", ""), offset)) !== null) {                                         // 984
        addWeekday(s, curSched, value);                                                                                // 985
      } else if ((value = getValue(item.replace("L", ""), offset)) !== null) {                                         // 986
        addHash(schedules, curSched, value, min - 1);                                                                  // 987
      } else if ((split = item.split("#")).length === 2) {                                                             // 988
        value = getValue(split[0], offset);                                                                            // 989
        addHash(schedules, curSched, value, getValue(split[1]));                                                       // 990
      } else {                                                                                                         // 991
        addRange(item, curSched, name, min, max, offset);                                                              // 992
      }                                                                                                                // 993
    }                                                                                                                  // 994
    function isHash(item) {                                                                                            // 995
      return item.indexOf("#") > -1 || item.indexOf("L") > 0;                                                          // 996
    }                                                                                                                  // 997
    function itemSorter(a, b) {                                                                                        // 998
      return isHash(a) && !isHash(b) ? 1 : 0;                                                                          // 999
    }                                                                                                                  // 1000
    function parseExpr(expr) {                                                                                         // 1001
      if (expr === "* * * * * *") {                                                                                    // 1002
        expr = "0/1 * * * * *";                                                                                        // 1003
      }                                                                                                                // 1004
      var schedule = {                                                                                                 // 1005
        schedules: [ {} ],                                                                                             // 1006
        exceptions: []                                                                                                 // 1007
      }, components = expr.split(" "), field, f, component, items;                                                     // 1008
      for (field in FIELDS) {                                                                                          // 1009
        f = FIELDS[field];                                                                                             // 1010
        component = components[f[0]];                                                                                  // 1011
        if (component && component !== "*" && component !== "?") {                                                     // 1012
          items = component.split(",").sort(itemSorter);                                                               // 1013
          var i, length = items.length;                                                                                // 1014
          for (i = 0; i < length; i++) {                                                                               // 1015
            parse(items[i], schedule, field, f[1], f[2], f[3]);                                                        // 1016
          }                                                                                                            // 1017
        }                                                                                                              // 1018
      }                                                                                                                // 1019
      return schedule;                                                                                                 // 1020
    }                                                                                                                  // 1021
    var e = expr.toUpperCase();                                                                                        // 1022
    return parseExpr(hasSeconds ? e : "0 " + e);                                                                       // 1023
  };                                                                                                                   // 1024
  later.parse.recur = function() {                                                                                     // 1025
    var schedules = [], exceptions = [], cur, curArr = schedules, curName, values, every, modifier, applyMin, applyMax, i, last;
    function add(name, min, max) {                                                                                     // 1027
      name = modifier ? name + "_" + modifier : name;                                                                  // 1028
      if (!cur) {                                                                                                      // 1029
        curArr.push({});                                                                                               // 1030
        cur = curArr[0];                                                                                               // 1031
      }                                                                                                                // 1032
      if (!cur[name]) {                                                                                                // 1033
        cur[name] = [];                                                                                                // 1034
      }                                                                                                                // 1035
      curName = cur[name];                                                                                             // 1036
      if (every) {                                                                                                     // 1037
        values = [];                                                                                                   // 1038
        for (i = min; i <= max; i += every) {                                                                          // 1039
          values.push(i);                                                                                              // 1040
        }                                                                                                              // 1041
        last = {                                                                                                       // 1042
          n: name,                                                                                                     // 1043
          x: every,                                                                                                    // 1044
          c: curName.length,                                                                                           // 1045
          m: max                                                                                                       // 1046
        };                                                                                                             // 1047
      }                                                                                                                // 1048
      values = applyMin ? [ min ] : applyMax ? [ max ] : values;                                                       // 1049
      var length = values.length;                                                                                      // 1050
      for (i = 0; i < length; i += 1) {                                                                                // 1051
        var val = values[i];                                                                                           // 1052
        if (curName.indexOf(val) < 0) {                                                                                // 1053
          curName.push(val);                                                                                           // 1054
        }                                                                                                              // 1055
      }                                                                                                                // 1056
      values = every = modifier = applyMin = applyMax = 0;                                                             // 1057
    }                                                                                                                  // 1058
    return {                                                                                                           // 1059
      schedules: schedules,                                                                                            // 1060
      exceptions: exceptions,                                                                                          // 1061
      on: function() {                                                                                                 // 1062
        values = arguments[0] instanceof Array ? arguments[0] : arguments;                                             // 1063
        return this;                                                                                                   // 1064
      },                                                                                                               // 1065
      every: function(x) {                                                                                             // 1066
        every = x || 1;                                                                                                // 1067
        return this;                                                                                                   // 1068
      },                                                                                                               // 1069
      after: function(x) {                                                                                             // 1070
        modifier = "a";                                                                                                // 1071
        values = [ x ];                                                                                                // 1072
        return this;                                                                                                   // 1073
      },                                                                                                               // 1074
      before: function(x) {                                                                                            // 1075
        modifier = "b";                                                                                                // 1076
        values = [ x ];                                                                                                // 1077
        return this;                                                                                                   // 1078
      },                                                                                                               // 1079
      first: function() {                                                                                              // 1080
        applyMin = 1;                                                                                                  // 1081
        return this;                                                                                                   // 1082
      },                                                                                                               // 1083
      last: function() {                                                                                               // 1084
        applyMax = 1;                                                                                                  // 1085
        return this;                                                                                                   // 1086
      },                                                                                                               // 1087
      time: function() {                                                                                               // 1088
        for (var i = 0, len = values.length; i < len; i++) {                                                           // 1089
          var split = values[i].split(":");                                                                            // 1090
          if (split.length < 3) split.push(0);                                                                         // 1091
          values[i] = +split[0] * 3600 + +split[1] * 60 + +split[2];                                                   // 1092
        }                                                                                                              // 1093
        add("t");                                                                                                      // 1094
        return this;                                                                                                   // 1095
      },                                                                                                               // 1096
      second: function() {                                                                                             // 1097
        add("s", 0, 59);                                                                                               // 1098
        return this;                                                                                                   // 1099
      },                                                                                                               // 1100
      minute: function() {                                                                                             // 1101
        add("m", 0, 59);                                                                                               // 1102
        return this;                                                                                                   // 1103
      },                                                                                                               // 1104
      hour: function() {                                                                                               // 1105
        add("h", 0, 23);                                                                                               // 1106
        return this;                                                                                                   // 1107
      },                                                                                                               // 1108
      dayOfMonth: function() {                                                                                         // 1109
        add("D", 1, applyMax ? 0 : 31);                                                                                // 1110
        return this;                                                                                                   // 1111
      },                                                                                                               // 1112
      dayOfWeek: function() {                                                                                          // 1113
        add("d", 1, 7);                                                                                                // 1114
        return this;                                                                                                   // 1115
      },                                                                                                               // 1116
      onWeekend: function() {                                                                                          // 1117
        values = [ 1, 7 ];                                                                                             // 1118
        return this.dayOfWeek();                                                                                       // 1119
      },                                                                                                               // 1120
      onWeekday: function() {                                                                                          // 1121
        values = [ 2, 3, 4, 5, 6 ];                                                                                    // 1122
        return this.dayOfWeek();                                                                                       // 1123
      },                                                                                                               // 1124
      dayOfWeekCount: function() {                                                                                     // 1125
        add("dc", 1, applyMax ? 0 : 5);                                                                                // 1126
        return this;                                                                                                   // 1127
      },                                                                                                               // 1128
      dayOfYear: function() {                                                                                          // 1129
        add("dy", 1, applyMax ? 0 : 366);                                                                              // 1130
        return this;                                                                                                   // 1131
      },                                                                                                               // 1132
      weekOfMonth: function() {                                                                                        // 1133
        add("wm", 1, applyMax ? 0 : 5);                                                                                // 1134
        return this;                                                                                                   // 1135
      },                                                                                                               // 1136
      weekOfYear: function() {                                                                                         // 1137
        add("wy", 1, applyMax ? 0 : 53);                                                                               // 1138
        return this;                                                                                                   // 1139
      },                                                                                                               // 1140
      month: function() {                                                                                              // 1141
        add("M", 1, 12);                                                                                               // 1142
        return this;                                                                                                   // 1143
      },                                                                                                               // 1144
      year: function() {                                                                                               // 1145
        add("Y", 1970, 2450);                                                                                          // 1146
        return this;                                                                                                   // 1147
      },                                                                                                               // 1148
      fullDate: function() {                                                                                           // 1149
        for (var i = 0, len = values.length; i < len; i++) {                                                           // 1150
          values[i] = values[i].getTime();                                                                             // 1151
        }                                                                                                              // 1152
        add("fd");                                                                                                     // 1153
        return this;                                                                                                   // 1154
      },                                                                                                               // 1155
      customModifier: function(id, vals) {                                                                             // 1156
        var custom = later.modifier[id];                                                                               // 1157
        if (!custom) throw new Error("Custom modifier " + id + " not recognized!");                                    // 1158
        modifier = id;                                                                                                 // 1159
        values = arguments[1] instanceof Array ? arguments[1] : [ arguments[1] ];                                      // 1160
        return this;                                                                                                   // 1161
      },                                                                                                               // 1162
      customPeriod: function(id) {                                                                                     // 1163
        var custom = later[id];                                                                                        // 1164
        if (!custom) throw new Error("Custom time period " + id + " not recognized!");                                 // 1165
        add(id, custom.extent(new Date())[0], custom.extent(new Date())[1]);                                           // 1166
        return this;                                                                                                   // 1167
      },                                                                                                               // 1168
      startingOn: function(start) {                                                                                    // 1169
        return this.between(start, last.m);                                                                            // 1170
      },                                                                                                               // 1171
      between: function(start, end) {                                                                                  // 1172
        cur[last.n] = cur[last.n].splice(0, last.c);                                                                   // 1173
        every = last.x;                                                                                                // 1174
        add(last.n, start, end);                                                                                       // 1175
        return this;                                                                                                   // 1176
      },                                                                                                               // 1177
      and: function() {                                                                                                // 1178
        cur = curArr[curArr.push({}) - 1];                                                                             // 1179
        return this;                                                                                                   // 1180
      },                                                                                                               // 1181
      except: function() {                                                                                             // 1182
        curArr = exceptions;                                                                                           // 1183
        cur = null;                                                                                                    // 1184
        return this;                                                                                                   // 1185
      }                                                                                                                // 1186
    };                                                                                                                 // 1187
  };                                                                                                                   // 1188
  later.parse.text = function(str) {                                                                                   // 1189
    var recur = later.parse.recur, pos = 0, input = "", error;                                                         // 1190
    var TOKENTYPES = {                                                                                                 // 1191
      eof: /^$/,                                                                                                       // 1192
      rank: /^((\d\d\d\d)|([2-5]?1(st)?|[2-5]?2(nd)?|[2-5]?3(rd)?|(0|[1-5]?[4-9]|[1-5]0|1[1-3])(th)?))\b/,             // 1193
      time: /^((([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))|(([0]?\d|1\d|2[0-3]):[0-5]\d))\b/,                             // 1194
      dayName: /^((sun|mon|tue(s)?|wed(nes)?|thu(r(s)?)?|fri|sat(ur)?)(day)?)\b/,                                      // 1195
      monthName: /^(jan(uary)?|feb(ruary)?|ma((r(ch)?)?|y)|apr(il)?|ju(ly|ne)|aug(ust)?|oct(ober)?|(sept|nov|dec)(ember)?)\b/,
      yearIndex: /^(\d\d\d\d)\b/,                                                                                      // 1197
      every: /^every\b/,                                                                                               // 1198
      after: /^after\b/,                                                                                               // 1199
      before: /^before\b/,                                                                                             // 1200
      second: /^(s|sec(ond)?(s)?)\b/,                                                                                  // 1201
      minute: /^(m|min(ute)?(s)?)\b/,                                                                                  // 1202
      hour: /^(h|hour(s)?)\b/,                                                                                         // 1203
      day: /^(day(s)?( of the month)?)\b/,                                                                             // 1204
      dayInstance: /^day instance\b/,                                                                                  // 1205
      dayOfWeek: /^day(s)? of the week\b/,                                                                             // 1206
      dayOfYear: /^day(s)? of the year\b/,                                                                             // 1207
      weekOfYear: /^week(s)?( of the year)?\b/,                                                                        // 1208
      weekOfMonth: /^week(s)? of the month\b/,                                                                         // 1209
      weekday: /^weekday\b/,                                                                                           // 1210
      weekend: /^weekend\b/,                                                                                           // 1211
      month: /^month(s)?\b/,                                                                                           // 1212
      year: /^year(s)?\b/,                                                                                             // 1213
      between: /^between (the)?\b/,                                                                                    // 1214
      start: /^(start(ing)? (at|on( the)?)?)\b/,                                                                       // 1215
      at: /^(at|@)\b/,                                                                                                 // 1216
      and: /^(,|and\b)/,                                                                                               // 1217
      except: /^(except\b)/,                                                                                           // 1218
      also: /(also)\b/,                                                                                                // 1219
      first: /^(first)\b/,                                                                                             // 1220
      last: /^last\b/,                                                                                                 // 1221
      "in": /^in\b/,                                                                                                   // 1222
      of: /^of\b/,                                                                                                     // 1223
      onthe: /^on the\b/,                                                                                              // 1224
      on: /^on\b/,                                                                                                     // 1225
      through: /(-|^(to|through)\b)/                                                                                   // 1226
    };                                                                                                                 // 1227
    var NAMES = {                                                                                                      // 1228
      jan: 1,                                                                                                          // 1229
      feb: 2,                                                                                                          // 1230
      mar: 3,                                                                                                          // 1231
      apr: 4,                                                                                                          // 1232
      may: 5,                                                                                                          // 1233
      jun: 6,                                                                                                          // 1234
      jul: 7,                                                                                                          // 1235
      aug: 8,                                                                                                          // 1236
      sep: 9,                                                                                                          // 1237
      oct: 10,                                                                                                         // 1238
      nov: 11,                                                                                                         // 1239
      dec: 12,                                                                                                         // 1240
      sun: 1,                                                                                                          // 1241
      mon: 2,                                                                                                          // 1242
      tue: 3,                                                                                                          // 1243
      wed: 4,                                                                                                          // 1244
      thu: 5,                                                                                                          // 1245
      fri: 6,                                                                                                          // 1246
      sat: 7,                                                                                                          // 1247
      "1st": 1,                                                                                                        // 1248
      fir: 1,                                                                                                          // 1249
      "2nd": 2,                                                                                                        // 1250
      sec: 2,                                                                                                          // 1251
      "3rd": 3,                                                                                                        // 1252
      thi: 3,                                                                                                          // 1253
      "4th": 4,                                                                                                        // 1254
      "for": 4                                                                                                         // 1255
    };                                                                                                                 // 1256
    function t(start, end, text, type) {                                                                               // 1257
      return {                                                                                                         // 1258
        startPos: start,                                                                                               // 1259
        endPos: end,                                                                                                   // 1260
        text: text,                                                                                                    // 1261
        type: type                                                                                                     // 1262
      };                                                                                                               // 1263
    }                                                                                                                  // 1264
    function peek(expected) {                                                                                          // 1265
      var scanTokens = expected instanceof Array ? expected : [ expected ], whiteSpace = /\s+/, token, curInput, m, scanToken, start, len;
      scanTokens.push(whiteSpace);                                                                                     // 1267
      start = pos;                                                                                                     // 1268
      while (!token || token.type === whiteSpace) {                                                                    // 1269
        len = -1;                                                                                                      // 1270
        curInput = input.substring(start);                                                                             // 1271
        token = t(start, start, input.split(whiteSpace)[0]);                                                           // 1272
        var i, length = scanTokens.length;                                                                             // 1273
        for (i = 0; i < length; i++) {                                                                                 // 1274
          scanToken = scanTokens[i];                                                                                   // 1275
          m = scanToken.exec(curInput);                                                                                // 1276
          if (m && m.index === 0 && m[0].length > len) {                                                               // 1277
            len = m[0].length;                                                                                         // 1278
            token = t(start, start + len, curInput.substring(0, len), scanToken);                                      // 1279
          }                                                                                                            // 1280
        }                                                                                                              // 1281
        if (token.type === whiteSpace) {                                                                               // 1282
          start = token.endPos;                                                                                        // 1283
        }                                                                                                              // 1284
      }                                                                                                                // 1285
      return token;                                                                                                    // 1286
    }                                                                                                                  // 1287
    function scan(expectedToken) {                                                                                     // 1288
      var token = peek(expectedToken);                                                                                 // 1289
      pos = token.endPos;                                                                                              // 1290
      return token;                                                                                                    // 1291
    }                                                                                                                  // 1292
    function parseThroughExpr(tokenType) {                                                                             // 1293
      var start = +parseTokenValue(tokenType), end = checkAndParse(TOKENTYPES.through) ? +parseTokenValue(tokenType) : start, nums = [];
      for (var i = start; i <= end; i++) {                                                                             // 1295
        nums.push(i);                                                                                                  // 1296
      }                                                                                                                // 1297
      return nums;                                                                                                     // 1298
    }                                                                                                                  // 1299
    function parseRanges(tokenType) {                                                                                  // 1300
      var nums = parseThroughExpr(tokenType);                                                                          // 1301
      while (checkAndParse(TOKENTYPES.and)) {                                                                          // 1302
        nums = nums.concat(parseThroughExpr(tokenType));                                                               // 1303
      }                                                                                                                // 1304
      return nums;                                                                                                     // 1305
    }                                                                                                                  // 1306
    function parseEvery(r) {                                                                                           // 1307
      var num, period, start, end;                                                                                     // 1308
      if (checkAndParse(TOKENTYPES.weekend)) {                                                                         // 1309
        r.on(NAMES.sun, NAMES.sat).dayOfWeek();                                                                        // 1310
      } else if (checkAndParse(TOKENTYPES.weekday)) {                                                                  // 1311
        r.on(NAMES.mon, NAMES.tue, NAMES.wed, NAMES.thu, NAMES.fri).dayOfWeek();                                       // 1312
      } else {                                                                                                         // 1313
        num = parseTokenValue(TOKENTYPES.rank);                                                                        // 1314
        r.every(num);                                                                                                  // 1315
        period = parseTimePeriod(r);                                                                                   // 1316
        if (checkAndParse(TOKENTYPES.start)) {                                                                         // 1317
          num = parseTokenValue(TOKENTYPES.rank);                                                                      // 1318
          r.startingOn(num);                                                                                           // 1319
          parseToken(period.type);                                                                                     // 1320
        } else if (checkAndParse(TOKENTYPES.between)) {                                                                // 1321
          start = parseTokenValue(TOKENTYPES.rank);                                                                    // 1322
          if (checkAndParse(TOKENTYPES.and)) {                                                                         // 1323
            end = parseTokenValue(TOKENTYPES.rank);                                                                    // 1324
            r.between(start, end);                                                                                     // 1325
          }                                                                                                            // 1326
        }                                                                                                              // 1327
      }                                                                                                                // 1328
    }                                                                                                                  // 1329
    function parseOnThe(r) {                                                                                           // 1330
      if (checkAndParse(TOKENTYPES.first)) {                                                                           // 1331
        r.first();                                                                                                     // 1332
      } else if (checkAndParse(TOKENTYPES.last)) {                                                                     // 1333
        r.last();                                                                                                      // 1334
      } else {                                                                                                         // 1335
        r.on(parseRanges(TOKENTYPES.rank));                                                                            // 1336
      }                                                                                                                // 1337
      parseTimePeriod(r);                                                                                              // 1338
    }                                                                                                                  // 1339
    function parseScheduleExpr(str) {                                                                                  // 1340
      pos = 0;                                                                                                         // 1341
      input = str;                                                                                                     // 1342
      error = -1;                                                                                                      // 1343
      var r = recur();                                                                                                 // 1344
      while (pos < input.length && error < 0) {                                                                        // 1345
        var token = parseToken([ TOKENTYPES.every, TOKENTYPES.after, TOKENTYPES.before, TOKENTYPES.onthe, TOKENTYPES.on, TOKENTYPES.of, TOKENTYPES["in"], TOKENTYPES.at, TOKENTYPES.and, TOKENTYPES.except, TOKENTYPES.also ]);
        switch (token.type) {                                                                                          // 1347
         case TOKENTYPES.every:                                                                                        // 1348
          parseEvery(r);                                                                                               // 1349
          break;                                                                                                       // 1350
                                                                                                                       // 1351
         case TOKENTYPES.after:                                                                                        // 1352
          if (peek(TOKENTYPES.time).type !== undefined) {                                                              // 1353
            r.after(parseTokenValue(TOKENTYPES.time));                                                                 // 1354
            r.time();                                                                                                  // 1355
          } else {                                                                                                     // 1356
            r.after(parseTokenValue(TOKENTYPES.rank));                                                                 // 1357
            parseTimePeriod(r);                                                                                        // 1358
          }                                                                                                            // 1359
          break;                                                                                                       // 1360
                                                                                                                       // 1361
         case TOKENTYPES.before:                                                                                       // 1362
          if (peek(TOKENTYPES.time).type !== undefined) {                                                              // 1363
            r.before(parseTokenValue(TOKENTYPES.time));                                                                // 1364
            r.time();                                                                                                  // 1365
          } else {                                                                                                     // 1366
            r.before(parseTokenValue(TOKENTYPES.rank));                                                                // 1367
            parseTimePeriod(r);                                                                                        // 1368
          }                                                                                                            // 1369
          break;                                                                                                       // 1370
                                                                                                                       // 1371
         case TOKENTYPES.onthe:                                                                                        // 1372
          parseOnThe(r);                                                                                               // 1373
          break;                                                                                                       // 1374
                                                                                                                       // 1375
         case TOKENTYPES.on:                                                                                           // 1376
          r.on(parseRanges(TOKENTYPES.dayName)).dayOfWeek();                                                           // 1377
          break;                                                                                                       // 1378
                                                                                                                       // 1379
         case TOKENTYPES.of:                                                                                           // 1380
          r.on(parseRanges(TOKENTYPES.monthName)).month();                                                             // 1381
          break;                                                                                                       // 1382
                                                                                                                       // 1383
         case TOKENTYPES["in"]:                                                                                        // 1384
          r.on(parseRanges(TOKENTYPES.yearIndex)).year();                                                              // 1385
          break;                                                                                                       // 1386
                                                                                                                       // 1387
         case TOKENTYPES.at:                                                                                           // 1388
          r.on(parseTokenValue(TOKENTYPES.time)).time();                                                               // 1389
          while (checkAndParse(TOKENTYPES.and)) {                                                                      // 1390
            r.on(parseTokenValue(TOKENTYPES.time)).time();                                                             // 1391
          }                                                                                                            // 1392
          break;                                                                                                       // 1393
                                                                                                                       // 1394
         case TOKENTYPES.and:                                                                                          // 1395
          break;                                                                                                       // 1396
                                                                                                                       // 1397
         case TOKENTYPES.also:                                                                                         // 1398
          r.and();                                                                                                     // 1399
          break;                                                                                                       // 1400
                                                                                                                       // 1401
         case TOKENTYPES.except:                                                                                       // 1402
          r.except();                                                                                                  // 1403
          break;                                                                                                       // 1404
                                                                                                                       // 1405
         default:                                                                                                      // 1406
          error = pos;                                                                                                 // 1407
        }                                                                                                              // 1408
      }                                                                                                                // 1409
      return {                                                                                                         // 1410
        schedules: r.schedules,                                                                                        // 1411
        exceptions: r.exceptions,                                                                                      // 1412
        error: error                                                                                                   // 1413
      };                                                                                                               // 1414
    }                                                                                                                  // 1415
    function parseTimePeriod(r) {                                                                                      // 1416
      var timePeriod = parseToken([ TOKENTYPES.second, TOKENTYPES.minute, TOKENTYPES.hour, TOKENTYPES.dayOfYear, TOKENTYPES.dayOfWeek, TOKENTYPES.dayInstance, TOKENTYPES.day, TOKENTYPES.month, TOKENTYPES.year, TOKENTYPES.weekOfMonth, TOKENTYPES.weekOfYear ]);
      switch (timePeriod.type) {                                                                                       // 1418
       case TOKENTYPES.second:                                                                                         // 1419
        r.second();                                                                                                    // 1420
        break;                                                                                                         // 1421
                                                                                                                       // 1422
       case TOKENTYPES.minute:                                                                                         // 1423
        r.minute();                                                                                                    // 1424
        break;                                                                                                         // 1425
                                                                                                                       // 1426
       case TOKENTYPES.hour:                                                                                           // 1427
        r.hour();                                                                                                      // 1428
        break;                                                                                                         // 1429
                                                                                                                       // 1430
       case TOKENTYPES.dayOfYear:                                                                                      // 1431
        r.dayOfYear();                                                                                                 // 1432
        break;                                                                                                         // 1433
                                                                                                                       // 1434
       case TOKENTYPES.dayOfWeek:                                                                                      // 1435
        r.dayOfWeek();                                                                                                 // 1436
        break;                                                                                                         // 1437
                                                                                                                       // 1438
       case TOKENTYPES.dayInstance:                                                                                    // 1439
        r.dayOfWeekCount();                                                                                            // 1440
        break;                                                                                                         // 1441
                                                                                                                       // 1442
       case TOKENTYPES.day:                                                                                            // 1443
        r.dayOfMonth();                                                                                                // 1444
        break;                                                                                                         // 1445
                                                                                                                       // 1446
       case TOKENTYPES.weekOfMonth:                                                                                    // 1447
        r.weekOfMonth();                                                                                               // 1448
        break;                                                                                                         // 1449
                                                                                                                       // 1450
       case TOKENTYPES.weekOfYear:                                                                                     // 1451
        r.weekOfYear();                                                                                                // 1452
        break;                                                                                                         // 1453
                                                                                                                       // 1454
       case TOKENTYPES.month:                                                                                          // 1455
        r.month();                                                                                                     // 1456
        break;                                                                                                         // 1457
                                                                                                                       // 1458
       case TOKENTYPES.year:                                                                                           // 1459
        r.year();                                                                                                      // 1460
        break;                                                                                                         // 1461
                                                                                                                       // 1462
       default:                                                                                                        // 1463
        error = pos;                                                                                                   // 1464
      }                                                                                                                // 1465
      return timePeriod;                                                                                               // 1466
    }                                                                                                                  // 1467
    function checkAndParse(tokenType) {                                                                                // 1468
      var found = peek(tokenType).type === tokenType;                                                                  // 1469
      if (found) {                                                                                                     // 1470
        scan(tokenType);                                                                                               // 1471
      }                                                                                                                // 1472
      return found;                                                                                                    // 1473
    }                                                                                                                  // 1474
    function parseToken(tokenType) {                                                                                   // 1475
      var t = scan(tokenType);                                                                                         // 1476
      if (t.type) {                                                                                                    // 1477
        t.text = convertString(t.text, tokenType);                                                                     // 1478
      } else {                                                                                                         // 1479
        error = pos;                                                                                                   // 1480
      }                                                                                                                // 1481
      return t;                                                                                                        // 1482
    }                                                                                                                  // 1483
    function parseTokenValue(tokenType) {                                                                              // 1484
      return parseToken(tokenType).text;                                                                               // 1485
    }                                                                                                                  // 1486
    function convertString(str, tokenType) {                                                                           // 1487
      var output = str;                                                                                                // 1488
      switch (tokenType) {                                                                                             // 1489
       case TOKENTYPES.time:                                                                                           // 1490
        var parts = str.split(/(:|am|pm)/), hour = parts[3] === "pm" && parts[0] < 12 ? parseInt(parts[0], 10) + 12 : parts[0], min = parts[2].trim();
        output = (hour.length === 1 ? "0" : "") + hour + ":" + min;                                                    // 1492
        break;                                                                                                         // 1493
                                                                                                                       // 1494
       case TOKENTYPES.rank:                                                                                           // 1495
        output = parseInt(/^\d+/.exec(str)[0], 10);                                                                    // 1496
        break;                                                                                                         // 1497
                                                                                                                       // 1498
       case TOKENTYPES.monthName:                                                                                      // 1499
       case TOKENTYPES.dayName:                                                                                        // 1500
        output = NAMES[str.substring(0, 3)];                                                                           // 1501
        break;                                                                                                         // 1502
      }                                                                                                                // 1503
      return output;                                                                                                   // 1504
    }                                                                                                                  // 1505
    return parseScheduleExpr(str.toLowerCase());                                                                       // 1506
  };                                                                                                                   // 1507
  return later;                                                                                                        // 1508
}();                                                                                                                   // 1509
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("mrt:later", {
  later: later
});

})();
