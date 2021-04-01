# 🕒 ms

Converts durations in human-readable format to milliseconds.

## 🎯 Motivation

The module is designed to be usable with strings containing multiple durations in human-readable format
(e.g.: `1h 30m` (and even `1 hour and 30 minutes`) instead of `1.5h` as in most of popular modules).

## ✨ Features

- Easy to use with (multiple) durations in human-readable format
- Works both in Node.js and in the browser
- <0.5KB minified+gzipped

## 📝 Usage

The module searches for pairs `<number><unit>`.

`<number>` is a non-negative decimal number (according to JS decimal literal syntax).

`<unit>` is one of:
- ms, msec, msecs, millisecond, milliseconds
- s,  sec,  secs,  second,      seconds
- m,  min,  mins,  minute,      minutes
- h,  hr,   hrs,   hour,        hours
- d,               day,         days
- w,               week,        weeks

`<number>` and `<unit>` may be separated by any number of space symbols.

```js
const ms = require('@vadym.gidulian/ms');

ms('10 s') // 10_000
ms('1m30s') // 90_000
ms('1h 30m') // 5_400_000
ms('1e2 mins') // 6_000_000
ms('1_000 minutes') // 60_000_000
ms('1 eternity') // NaN

setInterval(fn, ms('every 2 hours and 24 minutes')) // 8_640_000

setTimeout(fn, ms('the function specified as the 1st argument ' +
				  'will be executed in 5 seconds and will take less than a minute')) // 5_000
```
