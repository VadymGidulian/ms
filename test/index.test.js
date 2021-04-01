'use strict';

const ms = require('../src');

const VALUES = [
	'0', '1',
	'1e1', '1e+1', '1e-1', '1e0', '1e+0', '1e-0', '0e0',
	'0.0', '1.1',
	'1.1e1', '1.1e+1', '1.1e-1', '1.1e0', '1.1e+0', '1.1e-0',
	'0.', '1.',
	'1.e1', '1.e+1', '1.e-1', '1.e0', '1.e+0', '1.e-0',
	'.0', '.1',
	'.1e1', '.1e+1', '.1e-1', '.1e0', '.1e+0', '.1e-0',
	'1_000', '1_000.000_1', '1_000.', '0.000_1', '.000_1', '1_0e1_0', '1_0e-1_0'
];
const UNITS = {
	[1]:                        ['ms', 'msec', 'msecs', 'millisecond', 'milliseconds'],
	[1_000]:                    ['s',  'sec',  'secs',  'second',      'seconds'],
	[1_000 * 60]:               ['m',  'min',  'mins',  'minute',      'minutes'],
	[1_000 * 60 * 60]:          ['h',  'hr',   'hrs',   'hour',        'hours'],
	[1_000 * 60 * 60 * 24]:     ['d',                   'day',         'days'],
	[1_000 * 60 * 60 * 24 * 7]: ['w',                   'week',        'weeks']
};

describe('Single value', () => {
	const strings = [];
	
	for (let value of VALUES.map(v => v.includes('e') ? [v, v.toUpperCase()] : v).flat()) {
		const v = +value.replace(/_/g, '');
		
		for (let [unitValue, unitVariants] of Object.entries(UNITS)) {
			const expected = v * unitValue;
			
			for (let unit of unitVariants.map(uv => [uv, uv.toUpperCase()]).flat()) {
				for (let joiner of ['', ' ', '   ', '\t', '\n']) {
					strings.push([value + joiner + unit, expected]);
				}
			}
		}
	}
	
	test.each(strings)('`%s` should be converted to %d', (string, value) => {
		expect(ms(string)).toBe(value);
	});
});

describe('Multiple values', () => {
	const values = VALUES
		.map(v => v.includes('e') ? [v, v.toUpperCase()] : v)
		.flat();
	
	const units = Object.entries(UNITS)
		.map(([unitValue, unitVariants]) => [unitValue, unitVariants.map(uv => [uv, uv.toUpperCase()]).flat()]);
	
	const joiners1 = ['', ' ', '   ', '\t', '\n'];
	const joiners2 = ['', ' ', '   ', '\t', '\n', '+', ' + ', ' plus '];
	
	const strings = [];
	
	for (let i = 0; i < 10_000; i++) {
		let string   = '';
		let expected = 0;
		for (let j = 0; j < Math.ceil(Math.random() * 10); j++) {
			const value = pickOneOf(values);
			const [unitValue, unitVariants] = pickOneOf(units);
			
			string   += value + pickOneOf(joiners1) + pickOneOf(unitVariants) + pickOneOf(joiners2);
			expected += value.replace(/_/g, '') * unitValue;
		}
		strings.push([string, expected]);
	}
	
	test.each(strings)('`%s` should be converted to %d', (string, value) => {
		expect(ms(string)).toBe(value);
	});
});

describe('Invalid input', function() {
	test.each([undefined, null, 100, Infinity, NaN, '', 'abc', {}, []])('`%s` should be converted to NaN', value => {
		expect(ms(value)).toBeNaN();
	});
});



function pickOneOf(array) {
	return array[Math.floor(Math.random() * array.length)];
}
