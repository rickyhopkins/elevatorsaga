let rng = new Math.seedrandom("HI");

const INFINITY = Number.POSITIVE_INFINITY;
const MAX_INTEGER = Number.MAX_SAFE_INTEGER;

const reSeed = (seed) => {
	rng = new Math.seedrandom(seed);
};

const toNumber = (value) => {
	if (typeof value == "number") {
		return value;
	}
	if (isSymbol(value)) {
		return NAN;
	}
	if (isObject(value)) {
		var other = typeof value.valueOf == "function" ? value.valueOf() : value;
		value = isObject(other) ? other + "" : other;
	}
	if (typeof value != "string") {
		return value === 0 ? value : +value;
	}
	value = value.replace(reTrim, "");
	var isBinary = reIsBinary.test(value);
	return isBinary || reIsOctal.test(value)
		? freeParseInt(value.slice(2), isBinary ? 2 : 8)
		: reIsBadHex.test(value)
		? NAN
		: +value;
};

const toFinite = (value) => {
	if (!value) {
		return value === 0 ? value : 0;
	}
	value = toNumber(value);
	if (value === INFINITY || value === -INFINITY) {
		var sign = value < 0 ? -1 : 1;
		return sign * MAX_INTEGER;
	}
	return value === value ? value : 0;
};

const isIndex = (value, length) => {
	var type = typeof value;
	length = length == null ? MAX_SAFE_INTEGER : length;

	return (
		!!length &&
		(type == "number" || (type != "symbol" && reIsUint.test(value))) &&
		(value > -1 && value % 1 == 0 && value < length)
	);
};

const isIterateeCall = (value, index, object) => {
	if (!_.isObject(object)) {
		return false;
	}
	var type = typeof index;
	if (
		type == "number" ? _.isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object
	) {
		return _.eq(object[index], value);
	}
	return false;
};

const random = (lower, upper, floating) => {
	if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
		upper = floating = undefined;
	}
	if (floating === undefined) {
		if (typeof upper == "boolean") {
			floating = upper;
			upper = undefined;
		} else if (typeof lower == "boolean") {
			floating = lower;
			lower = undefined;
		}
	}
	if (lower === undefined && upper === undefined) {
		lower = 0;
		upper = 1;
	} else {
		lower = toFinite(lower);
		if (upper === undefined) {
			upper = lower;
			lower = 0;
		} else {
			upper = toFinite(upper);
		}
	}
	if (lower > upper) {
		var temp = lower;
		lower = upper;
		upper = temp;
	}
	if (floating || lower % 1 || upper % 1) {
		var rand = nativeRandom();
		return Math.min(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
	}
	return lower + Math.floor(rng() * (upper - lower + 1));
};
