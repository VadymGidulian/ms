'use strict';

// https://tc39.es/ecma262/#prod-DecimalLiteral
const NUMERIC_LITERAL_SEPARATOR = '_';
const DECIMAL_DIGIT = '[0-9]';
const NONZERO_DIGIT = '[1-9]';
const DECIMAL_DIGITS = `(?:(?:${DECIMAL_DIGIT}(?:${DECIMAL_DIGIT}|${NUMERIC_LITERAL_SEPARATOR})*)?${DECIMAL_DIGIT})`;
const SIGNED_INTEGER = `(?:[+-]?${DECIMAL_DIGITS})`;
const EXPONENT_PART = `(?:e${SIGNED_INTEGER})`;
const DECIMAL_INTEGER_LITERAL = `(?:0|${NONZERO_DIGIT}(?:${NUMERIC_LITERAL_SEPARATOR}?${DECIMAL_DIGITS})?)`;
const DECIMAL_LITERAL = `(?:${DECIMAL_INTEGER_LITERAL}\\.${DECIMAL_DIGITS}?${EXPONENT_PART}?|\\.${DECIMAL_DIGITS}${EXPONENT_PART}?|${DECIMAL_INTEGER_LITERAL}${EXPONENT_PART}?)`;

const MILLISECONDS = '(?<ms>ms|msecs?|milliseconds?)';
const SECONDS      = '(?<s>s|secs?|seconds?)';
const MINUTES      = '(?<m>m|mins?|minutes?)';
const HOURS        = '(?<h>h|hrs?|hours?)';
const DAYS         = '(?<d>d|days?)';
const WEEKS        = '(?<w>w|weeks?)';
const UNIT         = `(?:${MILLISECONDS}|${SECONDS}|${MINUTES}|${HOURS}|${DAYS}|${WEEKS})`;

const DURATION = `(?:(?<value>${DECIMAL_LITERAL})\\s*${UNIT}(?=\\b|\\d))`;

const MILLISECONDS_MAP = {
	ms: 1,
	s:  1000,
	m:  1000 * 60,
	h:  1000 * 60 * 60,
	d:  1000 * 60 * 60 * 24,
	w:  1000 * 60 * 60 * 24 * 7
};

module.exports = function ms(string) {
	const RE = new RegExp(DURATION, 'gi');
	
	let res = NaN;
	
	let matches;
	while (matches = RE.exec(string)) {
		const [unit] = Object.entries(matches.groups)
			.filter(([key, value]) => value && (key in MILLISECONDS_MAP))[0];
		
		res = (res || 0) + matches.groups.value.replace(/_/g, '') * MILLISECONDS_MAP[unit];
	}
	
	return res;
};
