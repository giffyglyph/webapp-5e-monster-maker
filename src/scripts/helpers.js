import './templates.js';

/**
 * Common helpers and handlebars functions.
 */
const Helpers = (function(){

	/**
	 * Initialise the handlebars helpers.
	 */
	function initialise() {

		// Set list of handlebars partials
		Handlebars.partials = Handlebars.templates;

		// Helpers used by the blueprint form

		Handlebars.registerHelper('setValue', function(value) {
			return (value == undefined || value == null) ? "" : "value=\"" + value.toString().replace(/"/g, "'") + "\"";
		});

		Handlebars.registerHelper('customToggle', function(state) {
			return (state == undefined || state == null || state != "custom") ? "style='display: none'" : "";
		});

		Handlebars.registerHelper('selected', function(key, value) {
			return key == value ? 'selected' : '';
		});

		Handlebars.registerHelper('selectedDefault', function(key, value) {
			return (key == value || key == null) ? 'selected' : '';
		});

		Handlebars.registerHelper('checked', function(key, value) {
			return key == value ? 'checked' : '';
		});

		Handlebars.registerHelper('fmtTextarea', function(value) {
			return (value) ? value.replace(/\r\n|\n/g, "&#10;") : null;
		});

		Handlebars.registerHelper('fmtModifier', function(value) {
			return (value >= 0 ? '+' : "−") + Math.abs(value);
		});

		Handlebars.registerHelper('fmtCapitalise', function(text) {
			return capitalise(text);
		});

		Handlebars.registerHelper('fmtLocaleString', function(value) {
			return Number(value).toLocaleString();
		});

		Handlebars.registerHelper('fmtMonsterDescription', function(size, type, tags, alignment) {
			return formatMonsterDescription(size, type, tags, alignment);
		});

		Handlebars.registerHelper('fmtVaultCell', function(value) {
			return (value == "—") ? "<span style='opacity:0.25'>—</span>" : value;
		});

		Handlebars.registerHelper('fmtMonsterSpeeds', function(speeds) {
			let output = "";
			speeds.forEach(function(speed, index) {
				switch(speed.type) {
					case "normal":
					case "other":
						output += speed.value;
						break;
					default:
						output += speed.type + " " + speed.value;
						break;
				}
				if (index < (speeds.length - 1)) {
					output += ", ";
				}
			});
			return output;
		});

		Handlebars.registerHelper('fmtMonsterSenses', function(senses) {
			let output = "";
			senses.forEach(function(sense, index) {
				switch(sense.type) {
					case "other":
						output += sense.value;
						break;
					default:
						output += sense.type + " " + sense.value;
						break;
				}
				if (index < (senses.length - 1)) {
					output += ", ";
				}
			});
			return output;
		});

		Handlebars.registerHelper('fmtMonsterSavingThrows', function(savingThrows) {
			let output = "";
			let count = 0;
			["str", "dex", "con", "int", "wis", "cha"].forEach(function(attribute) {
				let save = savingThrows.find(x => x.ability == attribute);
				if (save) {
					output += capitalise(attribute) + " " + (save.modifier >= 0 ? '+' : "−") + Math.abs(save.modifier);
					count++;
					if (count < savingThrows.length) {
						output += ", ";
					}
				}
			});
			return output;
		});

		Handlebars.registerHelper('fmtMonsterSavingThrowsQuickstart', function(savingThrows) {
			let output = "";
			let group = groupBy(savingThrows, s => s.modifier);
			let order = Object.keys(group).map(x => Number(x)).sort(function(a, b) { return b - a; });
			order.forEach(function(key, i) {
				group[key].forEach(function(save, j) {
					output += capitalise(save.ability);
					if (j < group[key].length - 1) {
						output += "/";
					} else {
						output += " " + ((save.modifier >= 0) ? ("+" + save.modifier) : save.modifier);
					}
				});
				if (i < order.length - 1) {
					output += ", ";
				}
			});
			return output;
		});

		Handlebars.registerHelper('fmtMonsterSavingThrowsQuickstartActive', function(savingThrows) {
			let output = "<i>(";
			let group = groupBy(savingThrows, s => s.modifier);
			let order = Object.keys(group).map(x => Number(x)).sort(function(a, b) { return b - a; });
			order.forEach(function(key, i) {
				group[key].forEach(function(save, j) {
					output += capitalise(save.ability);
					if (j < group[key].length - 1) {
						output += "/";
					} else {
						output += ")</i> DC " + save.modifier;
					}
				});
				if (i < order.length - 1) {
					output += ", <i>(";
				}
			});
			return output;
		});

		Handlebars.registerHelper('fmtMonsterSavingThrowsQuickstartActiveGMBinder', function(savingThrows) {
			let output = "_(";
			let group = groupBy(savingThrows, s => s.modifier);
			let order = Object.keys(group).map(x => Number(x)).sort(function(a, b) { return b - a; });
			order.forEach(function(key, i) {
				group[key].forEach(function(save, j) {
					output += capitalise(save.ability);
					if (j < group[key].length - 1) {
						output += "/";
					} else {
						output += ")_ DC " + save.modifier;
					}
				});
				if (i < order.length - 1) {
					output += ", _(";
				}
			});
			return output;
		});

		Handlebars.registerHelper('fmtGMBinderMarkdown', function(text) {
			let output = text;
			output = output.replace(/<\/?b>/g, "**");
			output = output.replace(/<\/?i>/g, "_");
			output = output.replace(/<span class="line-break">&nbsp;<\/span>/g, "\n> ");
			return output;
		});
	}

	/**
	 * Capitalise a string.
	 * @param {string} text - A string to capitalise.
	 * @return {string} A capitalised string.
	 */
	function capitalise(text) {
		return (text && text.length > 0) ? text.charAt(0).toUpperCase() + text.slice(1) : null;
	}

	function groupBy(xs, f) {
		return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
	}

	/**
	 * Sanitise a string to a safe filename.
	 * Original src: https://github.com/parshap/node-sanitize-filename/blob/master/index.js
	 * @param {string} filename - The target filename.
	 * @returns {string} - A sanitised string (max length 200).
	 */
	function sanitiseFilename(filename) {
		let illegalRe = /[\/\?<>\\:\*\|":]/g;
		let controlRe = /[\x00-\x1f\x80-\x9f]/g;
		let reservedRe = /^\.+$/;
		let windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
		let windowsTrailingRe = /[\. ]+$/;
		let output = filename
			.replace(illegalRe, '')
			.replace(controlRe, '')
			.replace(reservedRe, '')
			.replace(windowsReservedRe, '')
			.replace(windowsTrailingRe, '');
		return output.substring(0, Math.min(200, output.length));
	}

	/**
	 * Formats monster description details into a standarised string.
	 * @param {string} size - The monster's size.
	 * @param {string} type - The monster's type.
	 * @param {string} tags - The monster's tags.
	 * @param {string} alignment - The monster's alignmnet.
	 * @returns {string} - The monster description.
	 */
	function formatMonsterDescription(size, type, tags, alignment) {
		let output = "";
		if (size != null) {
			output += size;
		}
		if (type != null) {
			if (output.length != 0) {
				output += " ";
			}
			output += type;
		}
		if (tags != null && tags.length > 0) {
			if (output.length != 0) {
				output += " ";
			}
			output += "(";
			tags.forEach(function(tag, index) {
				output += tag;
				if (index < (tags.length - 1)) {
					output += ", ";
				}
			});
			output += ")";
		}
		if (alignment != null) {
			if (output.length != 0) {
				output += ", ";
			}
			output += alignment;
		}
		return output;
	}

	/**
	 * Dispatches a new custom event.
	 * @param {string} name - The name of the new event.
	 * @param {object} details - Data we wish to send with the event.
	 */
	function dispatchEvent(name, details) {
		document.dispatchEvent(new CustomEvent(name, { detail: details }));
	}

	return {
		initialise: initialise,
		capitalise: capitalise,
		sanitiseFilename: sanitiseFilename,
		dispatchEvent: dispatchEvent,
		formatMonsterDescription: formatMonsterDescription
	}
})();

export default Helpers;
