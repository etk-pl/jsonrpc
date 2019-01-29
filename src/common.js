/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
module.exports = {
	uc_first
};

/**
 *
 * @param {string} string
 * @returns {string}
 */
function uc_first(string) {
	if (typeof string !== "string" || string.length === 0) {
		return "";
	}
	const first = string.charAt(0);
	return first.toUpperCase() + string.slice(1);
}
