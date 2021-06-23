/**
 * A monster blueprint containing a set of user inputs.
 * Blueprints are saved and used to create monsters.
 */
class Blueprint {

	constructor(options) {
		this.vid = 1;
		this.method = "quickstart";
		this.description = {
			name: null,
			size: "medium",
			type: "humanoid",
			alignment: "unaligned",
			level: 1,
			role: "striker",
			rank: "standard",
			players: 4,
			phase: 1,
			phases: 1
		};
		this.tags = [];
		this.display = {
			theme: "default",
			columns: 1,
			image: {
				url: null,
				position: "inline"
			}
		};
		this.ac = {
			base: null,
			modifier: null,
			type: null
		};
		this.hp = {
			average: null,
			modifier: null,
			roll: null
		};
		this.damage = {
			modifier: null
		};
		this.speed = {
			normal: null,
			burrow: null,
			climb: null,
			fly: null,
			swim: null,
			other: null
		};
		this.abilities = {
			str: 10,
			dex: 10,
			con: 10,
			int: 10,
			wis: 10,
			cha: 10,
			quickstart: [
				{ ability: "str" },
				{ ability: "dex" },
				{ ability: "con" },
				{ ability: "int" },
				{ ability: "wis" },
				{ ability: "cha" }
			]
		};
		this.savingThrows = {
			manual: [],
			quickstartMode: "sync",
			quickstart: [
				{ ability: "str" },
				{ ability: "dex" },
				{ ability: "con" },
				{ ability: "int" },
				{ ability: "wis" },
				{ ability: "cha" }
			]
		};
		this.skills = [];
		this.vulnerabilities = [];
		this.resistances = [];
		this.immunities = [];
		this.conditions = [];
		this.senses = {
			blindsight: null,
			darkvision: null,
			tremorsense: null,
			truesight: null,
			other: null
		};
		this.languages = [];
		this.challenge = {
			rating: 1,
			custom: {
				rating: null,
				proficiency: null,
				xp: null,
			}
		};
		this.traits = [];
		this.actions = [];
		this.reactions = [];
		this.paragonActions = {
			type: "default",
			amount: null
		};
		this.legendaryActionsPerRound = 0;
		this.legendaryActions = [];
		this.lairActionsInitiative = 0;
		this.lairActions = [];
		this.notes = [];

		if (options) {
			switch (options.vid) {
				case null:
				case undefined:
				case 0:
					this.load_v0(options);
					break;
				default:
					this.load_v1(options);
					break;
			}
		}
	}

	load_v0(options) {
		this.vid = 1;
		this.method = options.method ? parseString(options.method) : this.method;
		this.description.name = options.name ? parseString(options.name) : this.description.name;
		this.description.level = options.level ? parseNumber(options.level) : this.description.level;
		this.description.role = options.role ? parseString(options.role.toLowerCase()) : this.description.role;
		this.description.rank = options.type ? parseString(options.type.toLowerCase()) : this.description.rank;
		this.description.players = options.partySize ? parseNumber(options.partySize) : this.description.players;
		let abilitiesQuickstart = (options.abilities && Array.isArray(options.abilities)) ? options.abilities.map(function(ability) { return { ability: ability }}) : this.abilities.quickstart;
		this.abilities.quickstart = abilitiesQuickstart;
		this.savingThrows.quickstart = abilitiesQuickstart;
		this.traits = parseArray(options.traits, function(trait) {
			return {
				name: parseString(trait.name),
				detail: parseString(trait.description)
			};
		});
		if (options.notes) {
			this.notes.push({
				detail: options.notes
			});
		}

		function parseString(value) {
			return (value == undefined || value == null || $.trim(value).length == 0) ? null : value;
		}

		function parseNumber(value) {
			return (value == undefined || value == null || $.trim(value).length == 0) ? null : Number(value);
		}

		function parseArray(array, map) {
			return (array == undefined || array == null) ? [] : array.map(map);
		}
	}

	load_v1(options) {
		this.vid = 1;
		this.method = options.method ? parseString(options.method) : this.method;
		this.description = {
			name: options.description ? parseString(options.description.name) : this.description.name,
			size: options.description ? parseString(options.description.size) : this.description.size,
			type: options.description ? parseString(options.description.type) : this.description.type,
			alignment: options.description ? parseString(options.description.alignment) : this.description.alignment,
			level: options.description ? parseNumber(options.description.level) : this.description.level,
			role: options.description ? parseString(options.description.role) : this.description.striker,
			rank: options.description ? parseString(options.description.rank) : this.description.standard,
			players: options.description ? parseNumber(options.description.players) : this.description.players,
			phase: options.description ? parseNumber(options.description.phase) : this.description.phase,
			phases: options.description ? parseNumber(options.description.phases) : this.description.phases
		};
		this.tags = parseArray(options.tags, function(tag) {
			return {
				name: parseString(tag.name)
			}
		});
		this.display = {
			theme: options.display && options.display.theme ? parseString(options.display.theme) : this.display.theme,
			columns: options.display && options.display.columns ? parseNumber(options.display.columns) : this.display.columns,
			image: {
				url: options.display && options.display.image ? parseString(options.display.image.url) : this.display.image.url,
				position: options.display && options.display.image ? parseString(options.display.image.position) : this.display.image.position
			}
		};
		this.ac = {
			base: options.ac ? parseNumber(options.ac.base) : this.ac.base,
			modifier: options.ac ? parseNumber(options.ac.modifier) : this.ac.modifier,
			type: options.ac ? parseString(options.ac.type) : this.ac.type
		};
		this.hp = {
			average: options.hp ? parseNumber(options.hp.average) : this.hp.average,
			modifier: options.hp ? parseNumber(options.hp.modifier) : this.hp.modifier,
			roll: options.hp ? parseString(options.hp.roll) : this.hp.roll
		};
		this.damage = {
			modifier: options.damage ? parseNumber(options.damage.modifier) : this.damage.modifier
		};
		this.speed = {
			normal: options.speed ? parseString(options.speed.normal) : this.speed.normal,
			burrow: options.speed ? parseString(options.speed.burrow) : this.speed.burrow,
			climb: options.speed ? parseString(options.speed.climb) : this.speed.climb,
			fly: options.speed ? parseString(options.speed.fly) : this.speed.fly,
			swim: options.speed ? parseString(options.speed.swim) : this.speed.swim,
			other: options.speed ? parseString(options.speed.other) : this.speed.other
		};
		let abilitiesQuickstart = options.abilities ? options.abilities.quickstart : this.abilities.quickstart;
		this.abilities = {
			str: options.abilities ? parseNumber(options.abilities.str) : this.abilities.str,
			dex: options.abilities ? parseNumber(options.abilities.dex) : this.abilities.dex,
			con: options.abilities ? parseNumber(options.abilities.con) : this.abilities.con,
			int: options.abilities ? parseNumber(options.abilities.int) : this.abilities.int,
			wis: options.abilities ? parseNumber(options.abilities.wis) : this.abilities.wis,
			cha: options.abilities ? parseNumber(options.abilities.cha) : this.abilities.cha,
			quickstart: parseArray(abilitiesQuickstart, function(ability) {
				return {
					ability: parseString(ability.ability)
				};
			})
		};
		let savingThrowsManual = parseArray(options.savingThrows ? options.savingThrows.manual : [], function(savingThrow) {
			return {
				ability: parseString(savingThrow.ability)
			};
		});
		let savingThrowsQuickstartMode = options.savingThrows ? options.savingThrows.quickstartMode : this.savingThrows.quickstartMode;
		let savingThrowsQuickstart = options.savingThrows ? options.savingThrows.quickstart : this.savingThrows.quickstart;
		this.savingThrows = {
			manual: savingThrowsManual,
			quickstartMode: savingThrowsQuickstartMode,
			quickstart: savingThrowsQuickstart
		};
		this.skills = parseArray(options.skills, function(skill) {
			return {
				name: parseString(skill.name),
				custom: {
					name: parseString(skill.custom ? skill.custom.name : ""),
					ability: parseString(skill.custom ? skill.custom.ability : "")
				},
				proficiency: parseString(skill.proficiency)
			};
		});
		this.vulnerabilities = parseArray(options.vulnerabilities, function(vulnerability) {
			return {
				type: parseString(vulnerability.type),
				custom: parseString(vulnerability.custom)
			};
		});
		this.resistances = parseArray(options.resistances, function(resistance) {
			return {
				type: parseString(resistance.type),
				custom: parseString(resistance.custom)
			};
		});
		this.immunities = parseArray(options.immunities, function(immunity) {
			return {
				type: parseString(immunity.type),
				custom: parseString(immunity.custom)
			};
		});
		this.conditions = parseArray(options.conditions, function(condition) {
			return {
				type: parseString(condition.type == "unconcious" ? "unconscious" : condition.type),
				custom: parseString(condition.custom)
			};
		});
		this.senses = {
			blindsight: options.senses ? parseString(options.senses.blindsight) : this.senses.blindsight,
			darkvision: options.senses ? parseString(options.senses.darkvision) : this.senses.darkvision,
			tremorsense: options.senses ? parseString(options.senses.tremorsense) : this.senses.tremorsense,
			truesight: options.senses ? parseString(options.senses.truesight) : this.senses.truesight,
			other: options.senses ? parseString(options.senses.other) : this.senses.other
		};
		this.languages = parseArray(options.languages, function(language) {
			return {
				name: parseString(language.name),
				custom: parseString(language.custom)
			};
		});
		this.challenge = {
			rating: options.challenge ? parseString(options.challenge.rating) : this.challenge.rating,
			custom: {
				rating: options.challenge && options.challenge.custom ? parseString(options.challenge.custom.rating) : this.challenge.custom.rating,
				proficiency: options.challenge && options.challenge.custom ? parseNumber(options.challenge.custom.proficiency) : this.challenge.custom.proficiency,
				xp: options.challenge && options.challenge.custom ? parseNumber(options.challenge.custom.xp) : this.challenge.custom.xp,
			}
		};
		this.traits = parseArray(options.traits, function(trait) {
			return {
				name: parseString(trait.name),
				detail: parseString(trait.detail)
			};
		});
		this.actions = parseArray(options.actions, function(action) {
			return {
				name: parseString(action.name),
				detail: parseString(action.detail)
			};
		});
		this.reactions = parseArray(options.reactions, function(reaction) {
			return {
				name: parseString(reaction.name),
				detail: parseString(reaction.detail)
			};
		});
		this.paragonActions = {
			type: options.paragonActions ? parseString(options.paragonActions.type) : this.paragonActions.type,
			amount: options.paragonActions ? parseNumber(options.paragonActions.amount) : this.paragonActions.amount
		};
		this.legendaryActionsPerRound = parseNumber(options.legendaryActionsPerRound);
		this.legendaryActions = parseArray(options.legendaryActions, function(legendaryAction) {
			return {
				name: parseString(legendaryAction.name),
				detail: parseString(legendaryAction.detail)
			};
		});
		this.lairActionsInitiative = parseNumber(options.lairActionsInitiative);
		this.lairActions = parseArray(options.lairActions, function(lairAction) {
			return {
				name: parseString(lairAction.name),
				detail: parseString(lairAction.detail)
			};
		});
		this.notes = parseArray(options.notes, function(note) {
			return {
				detail: parseString(note.detail)
			};
		})

		function parseString(value) {
			return (value == undefined || value == null || $.trim(value).length == 0) ? null : value;
		}

		function parseNumber(value) {
			return (value == undefined || value == null || $.trim(value).length == 0) ? null : Number(value);
		}

		function parseArray(array, map) {
			return (array == undefined || array == null) ? [] : array.map(map);
		}
	}

	getVid() {
		return this.vid;
	}

	getMethod() {
		return this.method;
	}

	setMethod(method) {
		this.method = method;
	}

	getName() {
		return this.description.name;
	}

	setName(name) {
		this.description.name = name;
	}

	getSize() {
		return this.description.size;
	}

	setSize(size) {
		this.description.size = size;
	}

	getType() {
		return this.description.type;
	}

	setType(type) {
		this.description.type = type;
	}

	getAlignment() {
		return this.description.alignment;
	}

	setAlignment(alignment) {
		this.description.alignment = alignment;
	}

	getLevel() {
		return this.description.level;
	}

	getRole() {
		return this.description.role;
	}

	getRank() {
		return this.description.rank;
	}

	getPlayers() {
		return this.description.players
	}

	getPhase() {
		return this.description.phase;
	}

	getPhases() {
		return this.description.phases;
	}

	getTags() {
		return this.tags;
	}

	setTags(tags) {
		this.tags = tags;
	}

	getDisplayTheme() {
		return this.display.theme;
	}

	getDisplayColumns() {
		return this.display.columns;
	}

	getImageUrl() {
		return this.display.image.url;
	}

	getImagePosition() {
		return this.display.image.position;
	}

	getAcBase() {
		return this.ac.base;
	}

	setAcBase(ac) {
		this.ac.base = ac;
	}

	getAcModifier() {
		return this.ac.modifier;
	}

	setAcModifier(modifier) {
		this.ac.modifier = modifier;
	}

	getAcType() {
		return this.ac.type;
	}

	setAcType(type) {
		this.ac.type = type;
	}

	getHpAverage() {
		return this.hp.average;
	}

	setHpAverage(hp) {
		this.hp.average = hp;
	}

	getHpModifier() {
		return this.hp.modifier;
	}

	setHpModifier(modifier) {
		this.hp.modifier = modifier;
	}

	getHpRoll() {
		return this.hp.roll;
	}

	setHpRoll(roll) {
		this.hp.roll = roll;
	}

	getDamageModifier() {
		return this.damage.modifier;
	}

	setDamageModifier(modifier) {
		this.damage.modifier = modifier;
	}

	getSpeedNormal() {
		return this.speed.normal;
	}

	setSpeedNormal(speed) {
		this.speed.normal = speed;
	}

	getSpeedBurrow() {
		return this.speed.burrow;
	}

	setSpeedBurrow(speed) {
		this.speed.burrow = speed;
	}

	getSpeedClimb() {
		return this.speed.climb;
	}

	setSpeedClimb(speed) {
		this.speed.climb = speed;
	}

	getSpeedFly() {
		return this.speed.fly;
	}

	setSpeedFly(speed) {
		this.speed.fly = speed;
	}

	getSpeedSwim() {
		return this.speed.swim;
	}

	setSpeedSwim(speed) {
		this.speed.swim = speed;
	}

	getSpeedOther() {
		return this.speed.other;
	}

	setSpeedOther(speed) {
		this.speed.other = speed;
	}

	getAbilities() {
		return this.abilities;
	}

	getAbilityStr() {
		return this.abilities.str;
	}

	setAbilityStr(ability) {
		this.abilities.str = ability;
	}

	getAbilityDex() {
		return this.abilities.dex;
	}

	setAbilityDex(ability) {
		this.abilities.dex = ability;
	}

	getAbilityCon() {
		return this.abilities.con;
	}

	setAbilityCon(ability) {
		this.abilities.con = ability;
	}

	getAbilityInt() {
		return this.abilities.int;
	}

	setAbilityInt(ability) {
		this.abilities.int = ability;
	}

	getAbilityWis() {
		return this.abilities.wis;
	}

	setAbilityWis(ability) {
		this.abilities.wis = ability;
	}

	getAbilityCha() {
		return this.abilities.cha;
	}

	setAbilityCha(ability) {
		this.abilities.cha = ability;
	}

	getAbilityQuickstart() {
		return this.abilities.quickstart;
	}

	getAbilityQuickstartRank(ability) {
		return this.abilities.quickstart.findIndex(x => x.ability == ability);
	}

	getSavingThrowsManual() {
		return this.savingThrows.manual;
	}

	setSavingThrowsManual(savingThrows) {
		this.savingThrows.manual = savingThrows;
	}

	setSavingThrowsQuickstartMode(mode) {
		this.savingThrows.quickstartMode = mode;
	}

	getSavingThrowsQuickstartMode() {
		return this.savingThrows.quickstartMode;
	}

	getSavingThrowsQuickstart() {
		return this.savingThrows.quickstart;
	}

	getSavingThrowQuickstartRank(ability) {
		return this.savingThrows.quickstart.findIndex(x => x.ability == ability);
	}

	getSkills() {
		return this.skills;
	}

	setSkills(skills) {
		this.skills = skills;
	}

	getVulnerabilities() {
		return this.vulnerabilities;
	}

	setVulnerabilities(vulnerabilities) {
		this.vulnerabilities = vulnerabilities;
	}

	getResistances() {
		return this.resistances;
	}

	setResistances(resistances) {
		this.resistances = resistances;
	}

	getImmunities() {
		return this.immunities;
	}

	setImmunities(immunities) {
		this.immunities = immunities;
	}

	getConditions() {
		return this.conditions;
	}

	setConditions(conditions) {
		this.conditions = conditions;
	}

	getSenseBlindsight() {
		return this.senses.blindsight;
	}

	setSenseBlindsight(sense) {
		this.senses.blindsight = sense;
	}

	getSenseDarkvision() {
		return this.senses.darkvision;
	}

	setSenseDarkvision(sense) {
		this.senses.darkvision = sense;
	}

	getSenseTremorsense() {
		return this.senses.tremorsense;
	}

	setSenseTremorsense(sense) {
		this.senses.tremorsense = sense;
	}

	getSenseTruesight() {
		return this.senses.truesight;
	}

	setSenseTruesight(sense) {
		this.senses.truesight = sense;
	}

	getSenseOther() {
		return this.senses.other;
	}

	getLanguages() {
		return this.languages;
	}

	setLanguages(languages) {
		this.languages = languages;
	}

	getChallengeRating() {
		return this.challenge.rating;
	}

	setChallengeRating(cr) {
		this.challenge.rating = cr;
	}

	getChallengeCustomRating() {
		return this.challenge.custom.rating;
	}

	getChallengeCustomProficiency() {
		return this.challenge.custom.proficiency;
	}

	getChallengeCustomXp() {
		return this.challenge.custom.xp;
	}

	getTraits() {
		return this.traits;
	}

	setTraits(traits) {
		this.traits = traits;
	}

	getActions() {
		return this.actions;
	}

	setActions(actions) {
		this.actions = actions;
	}

	getReactions() {
		return this.reactions;
	}

	setReactions(reactions) {
		this.reactions = reactions;
	}

	getParagonActionsType() {
		return this.paragonActions.type;
	}

	getParagonActionsAmount() {
		return this.paragonActions.amount;
	}

	getLegendaryActionsPerRound() {
		return this.legendaryActionsPerRound;
	}

	setLegendaryActionsPerRound(legendaryActionsPerRound) {
		this.legendaryActionsPerRound = legendaryActionsPerRound;
	}

	getLegendaryActions() {
		return this.legendaryActions;
	}

	setLegendaryActions(legendaryActions) {
		this.legendaryActions = legendaryActions;
	}

	getLairActionsInitiative() {
		return this.lairActionsInitiative;
	}

	getLairActions() {
		return this.lairActions;
	}

	setLairActions(lairActions) {
		this.lairActions = lairActions;
	}

	getNotes() {
		return this.notes;
	}
}

export default Blueprint;
