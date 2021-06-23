import Monster from './classes/monster.js';
import Quickstarter from './classes/quickstarter.js';
import Storage from './storage.js';

/**
 * Create monsters from laboratory blueprints.
 */
const Frankenstein = (function() {

	let data = {
		challenges: null,
		roles: null,
		ranks: null
	}

	/**
	* Initialises the entity.
	* @param {object} challenges - A collection of challenge fragments.
	* @param {object} roles - A collection of monster role fragments.
	* @param {object} ranks - A collection of monster rank fragments.
	*/
	function initialise(challenges, roles, ranks) {
		data.challenges = challenges;
		data.roles = roles;
		data.ranks = ranks;
	}

	/**
	* Creates a new monster from a blueprint.
	* @param {blueprint} blueprint - A set of monster blueprints.
	* @return {monster} A new monster entity.
	*/
	function createMonster(blueprint) {
		let monster = new Monster();

		// Set version id
		monster.setVid(blueprint.getVid());

		// Set method
		monster.setMethod(blueprint.getMethod());

		// Set descriptions
		let name = blueprint.getName() == null ? "Monster" : blueprint.getName();
		if (blueprint.getRank() == "solo" && blueprint.getPhase() != null && blueprint.getPhases() > 1) {
			name += " (" + blueprint.getPhase() + "/" + blueprint.getPhases() + ")";
		}
		monster.setName(name);
		monster.setSize(blueprint.getSize());
		monster.setType(blueprint.getType());
		monster.setAlignment(blueprint.getAlignment());
		if (blueprint.getMethod() == "quickstart") {
			monster.setLevel(blueprint.getLevel() == null ? 0 : blueprint.getLevel());
			monster.setRole(blueprint.getRole());
			monster.setRank(blueprint.getRank());
		} else {
			monster.setLevel("—");
			monster.setRole("—");
			monster.setRank("—");
		}
		monster.setPlayers(blueprint.getPlayers() == null ? 0 : blueprint.getPlayers());
		monster.setIsQuickstart(blueprint.getMethod() == "quickstart");

		// Set tags
		let tags = [];
		blueprint.getTags().forEach(function(tag) {
			if (tag != null && tag.name != null && tags.findIndex(x => x == tag.name) == -1) {
				tags.push(tag.name);
			}
		});
		monster.setTags(tags);

		// Set diplay theme and columns
		if (blueprint.getDisplayTheme() == "default") {
			let settings = Storage.getSettings();
			monster.setDisplayTheme(settings.theme.monster);
		} else {
			monster.setDisplayTheme(blueprint.getDisplayTheme());
		}
		monster.setDisplayColumns(blueprint.getDisplayColumns());

		// Set image
		monster.setImageUrl(blueprint.getImageUrl());
		monster.setImagePosition(blueprint.getImagePosition());

		// Get quickstarter details for easy-reference values
		let quickstarter = null;
		if (blueprint.getMethod() == "quickstart") {
			quickstarter = new Quickstarter(monster.getLevel());
			quickstarter.setRole(data.roles[blueprint.getRole()]);
			quickstarter.setRank(data.ranks[blueprint.getRank()]);
			if (blueprint.getRank() == "solo") {
				quickstarter.rank.hp = blueprint.getPlayers();
			}
		}

		// Set ac
		if (blueprint.getMethod() == "quickstart") {
			monster.setAcValue(quickstarter.getAc() + (blueprint.getAcModifier() == null ? 0 : blueprint.getAcModifier()));
		} else {
			monster.setAcValue(blueprint.getAcBase() == null ? "—" : blueprint.getAcBase());
		}
		monster.setAcType(blueprint.getAcType());

		// Set hp
		if (blueprint.getMethod() == "quickstart") {
			let phases = (blueprint.getPhases() == null) ? 1 : blueprint.getPhases();
			let phaseHp = blueprint.getRank() == "solo" ? (1 / phases) : 1;
			monster.setHpAverage(Math.floor((quickstarter.getHp() * phaseHp) + (blueprint.getHpModifier() == null ? 0 : blueprint.getHpModifier())));
		} else {
			monster.setHpAverage(blueprint.getHpAverage() == null ? "—" : blueprint.getHpAverage());
			monster.setHpRoll(blueprint.getHpRoll());
		}

		// Set speeds
		let speeds = [];
		["Normal", "Burrow", "Climb", "Fly", "Swim", "Other"].forEach(function(field) {
			let speed = blueprint["getSpeed" + field]();
			if (speed != null) {
				speeds.push({
					type: field.toLowerCase(),
					value: speed
				});
			}
		});
		if (speeds.length == 0) {
			speeds.push({
				type: "other",
				value: "—"
			});
		}
		monster.setSpeeds(speeds);

		// Set ability scores and modifiers
		["Str", "Dex", "Con", "Int", "Wis", "Cha"].forEach(function(field) {
			let ability = null;
			if (blueprint.getMethod() == "quickstart") {
				let modifier = quickstarter.getAbility(blueprint.getAbilityQuickstartRank(field.toLowerCase()));
				ability = {
					score: (modifier * 2) + 10,
					modifier: modifier
				}
			} else {
				let score = (blueprint["getAbility" + field]() == null) ? 0 : blueprint["getAbility" + field]();
				ability = {
					score: score,
					modifier: Math.floor((score - 10) / 2)
				}
			}
			monster["setAbility" + field](ability);
		});

		// Set challenge
		if (blueprint.getMethod() == "quickstart") {
			monster.setChallengeRating(quickstarter.getChallengeRating());
			monster.setChallengeProficiency(quickstarter.getProficiency());
			monster.setChallengeXp(quickstarter.getXp());
		} else {
			if (blueprint.getChallengeRating() == "custom") {
				monster.setChallengeRating(blueprint.getChallengeCustomRating() == null ? 0 : blueprint.getChallengeCustomRating());
				monster.setChallengeProficiency(blueprint.getChallengeCustomProficiency() == null ? 0 : blueprint.getChallengeCustomProficiency());
				monster.setChallengeXp(blueprint.getChallengeCustomXp() == null ? 0 : blueprint.getChallengeCustomXp());
			} else {
				let challenge = getChallenge(blueprint.getChallengeRating());
				monster.setChallengeRating(challenge.getRating());
				monster.setChallengeProficiency(challenge.getProficiency());
				monster.setChallengeXp(challenge.getXp());
			}
		}

		// Set saving throws
		let savingThrows = [];
		if (blueprint.getMethod() == "quickstart") {
			let settings = Storage.getSettings();
			blueprint.getSavingThrowsQuickstart().forEach(function(savingThrow) {
				let modifier = 0;
				if (blueprint.getSavingThrowsQuickstartMode() == "sync") {
					modifier = quickstarter.getSavingThrow(blueprint.getAbilityQuickstartRank(savingThrow.ability));
				} else {
					modifier = quickstarter.getSavingThrow(blueprint.getSavingThrowQuickstartRank(savingThrow.ability));
				}
				switch (settings.defence) {
					case "normal":
						savingThrows.push({
							ability: savingThrow.ability,
							modifier: modifier + 22
						});
						monster.setAttackIsActive(true);
						monster.setAttackIsActiveSmaller(false);
						break;
					case "small":
						savingThrows.push({
							ability: savingThrow.ability,
							modifier: modifier + 14
						});
						monster.setAttackIsActive(true);
						monster.setAttackIsActiveSmaller(true);
						break;
					default:
						savingThrows.push({
							ability: savingThrow.ability,
							modifier: modifier
						});
						monster.setAttackIsActive(false);
						break;
				}
			});
		} else {
			blueprint.getSavingThrowsManual().forEach(function(savingThrow) {
				if (savingThrows.findIndex(x => x.ability == savingThrow.ability) == -1) {
					savingThrows.push({
						ability: savingThrow.ability,
						modifier: getMonsterAbilityModifier(monster, savingThrow.ability) + monster.getChallengeProficiency()
					});
				}
			});
		}
		monster.setSavingThrows(savingThrows);

		// Set skills
		let skills = [];
		blueprint.getSkills().forEach(function(skill) {
			let name = (skill.name == "custom") ? skill.custom.name : skill.name;
			if (name != null && skill != null && skills.findIndex(x => x.name == name) == -1) {
				if (skill.name == "custom") {
					skills.push({
						name: skill.custom.name,
						modifier: getMonsterAbilityModifier(monster, skill.custom.ability) + getMonsterProficiencyBonus(monster, skill.proficiency)
					});
				} else {
					let targetAbility = getAbilityFromSkill(skill.name);
					skills.push({
						name: skill.name,
						modifier: getMonsterAbilityModifier(monster, targetAbility) + getMonsterProficiencyBonus(monster, skill.proficiency)
					});
				}
			}
		});
		monster.setSkills(skills);

		// Set senses
		let senses = [];
		["Blindsight", "Darkvision", "Tremorsense", "Truesight", "Other"].forEach(function(field) {
			let sense = blueprint["getSense" + field]();
			if (sense != null) {
				senses.push({
					type: field.toLowerCase(),
					value: sense
				});
			}
		});
		senses.push({
			type: "passive Perception",
			value: 10 + getSkillModifier(monster, "perception")
		});
		monster.setSenses(senses);

		// Set quickstart attack/dc
		if (blueprint.getMethod() == "quickstart") {
			let settings = Storage.getSettings();
			switch (settings.defence) {
				case "normal":
					monster.setAttackBonus(quickstarter.getAttack() + 22);
					monster.setAttackIsActive(true);
					monster.setAttackIsActiveSmaller(false);
					break;
				case "small":
					monster.setAttackBonus(quickstarter.getAttack() + 12);
					monster.setAttackIsActive(true);
					monster.setAttackIsActiveSmaller(true);
					break;
				default:
					monster.setAttackBonus(quickstarter.getAttack());
					monster.setAttackIsActive(false);
					break;
			}

			monster.setAttackDamage(quickstarter.getDamage() + (blueprint.getDamageModifier() == null ? 0 : blueprint.getDamageModifier()));
			monster.setDcPrimary(quickstarter.getDcPrimary());
			monster.setDcSecondary(quickstarter.getDcSecondary());
		}

		// Set vulnerabilities
		let vulnerabilities = [];
		blueprint.getVulnerabilities().forEach(function(vulnerability) {
			let type = (vulnerability.type == "custom") ? vulnerability.custom : vulnerability.type;
			if (type != null && vulnerabilities.findIndex(x => x == type) == -1) {
				vulnerabilities.push(type);
			}
		});
		monster.setVulnerabilities(vulnerabilities);

		// Set resistances
		let resistances = [];
		blueprint.getResistances().forEach(function(resistance) {
			let type = (resistance.type == "custom") ? resistance.custom : resistance.type;
			if (type != null && resistances.findIndex(x => x == type) == -1) {
				resistances.push(type);
			}
		});
		monster.setResistances(resistances);

		// Set immunities
		let immunities = [];
		blueprint.getImmunities().forEach(function(immunity) {
			let type = (immunity.type == "custom") ? immunity.custom : immunity.type;
			if (type != null && immunities.findIndex(x => x == type) == -1) {
				immunities.push(type);
			}
		});
		monster.setImmunities(immunities);

		// Set conditions
		let conditions = [];
		blueprint.getConditions().forEach(function(condition) {
			let type = (condition.type == "custom") ? condition.custom : condition.type;
			if (type != null && conditions.findIndex(x => x == type) == -1) {
				conditions.push(type);
			}
		});
		monster.setConditions(conditions);

		// Set languages
		let languages = [];
		blueprint.getLanguages().forEach(function(language) {
			let name = (language.name == "custom") ? language.custom : language.name;
			if (name != null && languages.findIndex(x => x == name) == -1) {
				languages.push(name);
			}
		});
		if (languages.length == 0) {
			languages.push("—");
		}
		monster.setLanguages(languages);

		// Set traits
		let traits = [];
		if (blueprint.getRank() == "solo") {
			if (blueprint.getPhase() != null && blueprint.getPhase() < blueprint.getPhases()) {
				traits.push({
					name: "Phase Transition (Transformation)",
					detail: "When reduced to 0 hit points, remove all on-going effects on yourself as you transform and start a new phase transition event."
				});
			} else if (blueprint.getPhases() == 1) {
				traits.push({
					name: "Phase Transition",
					detail: "At 66% and 33% hit points, you may remove all on-going effects on yourself and start a new phase transition event."
				});
			}
		}
		blueprint.getTraits().forEach(function(trait) {
			if (trait.name != null || trait.detail != null) {
				traits.push({
					name: trait.name,
					detail: parseMarkdown(trait.detail, monster)
				});
			}
		});
		monster.setTraits(traits);

		// Set actions
		let actions = [];
		blueprint.getActions().forEach(function(action) {
			if (action.name != null || action.detail != null) {
				actions.push({
					name: action.name,
					detail: parseMarkdown(action.detail, monster)
				});
			}
		});
		monster.setActions(actions);

		// Set reactions
		let reactions = [];
		blueprint.getReactions().forEach(function(reaction) {
			if (reaction.name != null || reaction.detail != null) {
				reactions.push({
					name: reaction.name,
					detail: parseMarkdown(reaction.detail, monster)
				});
			}
		});
		monster.setReactions(reactions);

		// Set paragon actions
		if (blueprint.getParagonActionsType() == "custom") {
				monster.setParagonActions(blueprint.getParagonActionsAmount() == null ? 0 : blueprint.getParagonActionsAmount());
		} else if (blueprint.getParagonActionsType() == "default") {
			if (blueprint.getRank() == "elite") {
				monster.setParagonActions(1);
			} else if (blueprint.getRank() == "solo") {
				monster.setParagonActions(Math.max(blueprint.getPlayers() - 1, 0));
			}
		}

		// Set legendary actions
		monster.setLegendaryActionsPerRound(blueprint.getLegendaryActionsPerRound() == null ? 0 : blueprint.getLegendaryActionsPerRound());
		let legendaryActions = [];
		blueprint.getLegendaryActions().forEach(function(legendaryAction) {
			if (legendaryAction.name != null || legendaryAction.detail != null) {
				legendaryActions.push({
					name: legendaryAction.name,
					detail: parseMarkdown(legendaryAction.detail, monster)
				});
			}
		});
		monster.setLegendaryActions(legendaryActions);

		// Set lair actions
		monster.setLairActionsInitiative(blueprint.getLairActionsInitiative());
		let lairActions = [];
		blueprint.getLairActions().forEach(function(lairAction) {
			if (lairAction.name != null || lairAction.detail != null) {
				lairActions.push({
					name: lairAction.name,
					detail: parseMarkdown(lairAction.detail, monster)
				});
			}
		});
		monster.setLairActions(lairActions);

		// Set notes
		let notes = [];
		blueprint.getNotes().forEach(function(note) {
			if (note != null && note.detail != null && notes.findIndex(x => x == note.detail) == -1) {
				notes.push(parseMarkdown(note.detail, monster));
			}
		});
		monster.setNotes(notes);

		return monster;
	}

	/**
	* Creates a slimline monster from a blueprint, visible in the vault table.
	* @param {blueprint} blueprint - A set of monster blueprints.
	* @return {monster} A slimline monster entity.
	*/
	function createVaultMonster(blueprint) {

		let monster = new Monster();

		// Set method
		monster.setMethod(blueprint.getMethod());

		// Set descriptions
		let name = blueprint.getName() == null ? "Monster" : blueprint.getName();
		if (blueprint.getRank() == "solo" && blueprint.getPhase() != null && blueprint.getPhases() > 1) {
			name += " (" + blueprint.getPhase() + "/" + blueprint.getPhases() + ")";
		}
		monster.setName(name);
		monster.setSize(blueprint.getSize());
		monster.setType(blueprint.getType());
		monster.setAlignment(blueprint.getAlignment());
		if (blueprint.getMethod() == "quickstart") {
			monster.setLevel(blueprint.getLevel() == null ? 0 : blueprint.getLevel());
			monster.setRole(blueprint.getRole());
			monster.setRank(blueprint.getRank());
		} else {
			monster.setLevel("—");
			monster.setRole("—");
			monster.setRank("—");
		}
		monster.setPlayers(blueprint.getPlayers() == null ? 0 : blueprint.getPlayers());

		// Set tags
		let tags = [];
		blueprint.getTags().forEach(function(tag) {
			if (tag != null && tag.name != null && tags.findIndex(x => x == tag.name) == -1) {
				tags.push(tag.name);
			}
		});
		monster.setTags(tags);

		// Set challenge
		if (blueprint.getMethod() == "quickstart") {
			// Get quickstarter details for easy-reference values
			let quickstarter = new Quickstarter(monster.getLevel());
			quickstarter.setRole(data.roles[blueprint.getRole()]);
			quickstarter.setRank(data.ranks[blueprint.getRank()]);
			monster.setChallengeRating(quickstarter.getChallengeRating());
			monster.setChallengeProficiency(quickstarter.getProficiency());
			monster.setChallengeXp(quickstarter.getXp());

			monster.setAcValue(quickstarter.getAc() + (blueprint.getAcModifier() == null ? 0 : blueprint.getAcModifier()));

			let phases = (blueprint.getPhases() == null) ? 1 : blueprint.getPhases();
			let phaseHp = blueprint.getRank() == "solo" ? (1 / phases) : 1;
			monster.setHpAverage(Math.floor((quickstarter.getHp() * phaseHp) + (blueprint.getHpModifier() == null ? 0 : blueprint.getHpModifier())));
		} else {
			if (blueprint.getChallengeRating() == "custom") {
				monster.setChallengeRating(blueprint.getChallengeCustomRating() == null ? 0 : blueprint.getChallengeCustomRating());
				monster.setChallengeProficiency(blueprint.getChallengeCustomProficiency() == null ? 0 : blueprint.getChallengeCustomProficiency());
				monster.setChallengeXp(blueprint.getChallengeCustomXp() == null ? 0 : blueprint.getChallengeCustomXp());
			} else {
				let challenge = getChallenge(blueprint.getChallengeRating());
				monster.setChallengeRating(challenge.getRating());
				monster.setChallengeProficiency(challenge.getProficiency());
				monster.setChallengeXp(challenge.getXp());
			}

			monster.setAcValue(blueprint.getAcBase() == null ? "—" : blueprint.getAcBase());
			monster.setHpAverage(blueprint.getHpAverage() == null ? "—" : blueprint.getHpAverage());
		}

		return monster;
	}

	/**
	* Gets a specified ability modifier from a monster.
	* @param {monster} monster - A target monster.
	* @param {string} ability - The target ability (str, dex, con, etc).
	* @return {number} The monster's ability bonus.
	*/
	function getMonsterAbilityModifier(monster, ability) {
		let field = "getAbility" + ability.charAt(0).toUpperCase() + ability.slice(1);
		return monster[field]().modifier;
	}

	/**
	* Gets a proficiency bonus from a monster.
	* @param {monster} monster - A target monster.
	* @param {string} proficiency - Proficient/Expertise or nothing.
	* @return {number} The monster's proficiency bonus.
	*/
	function getMonsterProficiencyBonus(monster, proficiency) {
		switch (proficiency) {
			case "proficient":
				return monster.getChallengeProficiency();
				break;
			case "expertise":
				return monster.getChallengeProficiency() * 2;
				break;
			default:
				return 0;
				break;
		}
	}

	/**
	* Gets the expected ability attribute for a specific skill.
	* @param {string} skill - A target skill.
	* @return {string} The expected ability (str/dex/con/int/wis/cha).
	*/
	function getAbilityFromSkill(skill) {
		switch(skill) {
			case "athletics":
				return "str";
				break;
			case "acrobatics":
			case "sleight of hand":
			case "stealth":
				return "dex";
				break;
			case "arcana":
			case "history":
			case "investigation":
			case "nature":
			case "religion":
				return "int";
				break;
			case "animal handling":
			case "insight":
			case "medicine":
			case "survival":
			case "perception":
				return "wis";
				break;
			case "deception":
			case "intimidation":
			case "performance":
			case "persuasion":
				return "cha";
				break;
			default:
				return null;
				break;
		}
	}

	/**
	* Gets a monster's current skill modifier for a specific skill.
	* @param {monster} monster - A target monster.
	* @param {string} skill - A target skill.
	* @return {number} The skill modifier.
	*/
	function getSkillModifier(monster, skill) {
		let skills = monster.getSkills();
		let index = skills.findIndex(x => x.name == skill);
		if (index != -1) {
			return skills[index].modifier;
		} else {
			let ability = getAbilityFromSkill(skill);
			return getMonsterAbilityModifier(monster, ability);
		}
	}

	/**
	* Get a challenge based on the rating.
	* @param {string} challenge - The challenge rating.
	* @return {challenge} The challenge details.
	*/
 	function getChallenge(rating) {
		let index = data.challenges.findIndex(x => x.getRating() == rating);
		if (index == -1) {
			return new Challenge("—", 0, 0);
		} else {
			return data.challenges[index];
		}
	}

	/**
	* Parse some basic markdown options (bold/italic) and newlines in a given string.
	* @param {string} text - The target string.
	* @return {string} A parsed string.
	*/
	function parseMarkdown(text, monster) {
		let output = text;
		if (output != undefined || output != null) {
			output = output.replace(/\[.*?\]/g, function(token) {
				return parseShortcode(monster, token);
			});

			output = output.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, '<b>$1</b>');
			output = output.replace(/[\_]{1}([^\_]+)[\_]{1}/g, '<i>$1</i>');
			output = output.replace(/\r?\n/g, '<span class="line-break">&nbsp;</span>');
		}
		return output;
	}

	function parseShortcode(monster, token) {
		let output = token;

		try {

			// Parse quickstart monster markdown tags
			if (monster.getLevel() != "—") {
				output = output.replace(/\blevel\b/g, monster.getLevel());
				output = output.replace(/\battack-bonus\b/g, monster.getAttackBonus());

				if (monster.getAttackIsActive()) {
					output = output.replace(/(.*?)(\battack\b)(.*?)/g, "DC $1" + monster.getAttackBonus() + "$3");
				} else {
					output = output.replace(/(.*?)(\battack\b)(.*?)/g, "+$1" + monster.getAttackBonus() + "$3");
				}

				output = output.replace(/\bdamage\b/g, monster.getAttackDamage());
				output = output.replace(/\bdc-primary-bonus\b/g, monster.getDcPrimary());
				output = output.replace(/(.*?)(\bdc-primary\b)(.*?)/g, "DC $1" + monster.getDcPrimary() + "$3");
				output = output.replace(/\bdc-secondary-bonus\b/g, monster.getDcSecondary());
				output = output.replace(/(.*?)(\bdc-secondary\b)(.*?)/g, "DC $1" + monster.getDcSecondary() + "$3");
			}

			output = output.replace(/(.*?)(\bstr-save\b)(.*?)/g, "+$1" + monster.getSavingThrow("str").modifier + "$3");
			output = output.replace(/\bstr-mod\b/g, monster.getAbilityStr().modifier);
			output = output.replace(/\bstr-score\b/g, monster.getAbilityStr().score);
			output = output.replace(/(.*?)(\bdex-save\b)(.*?)/g, "+$1" + monster.getSavingThrow("dex").modifier + "$3");
			output = output.replace(/\bdex-mod\b/g, monster.getAbilityDex().modifier);
			output = output.replace(/\bdex-score\b/g, monster.getAbilityDex().score);
			output = output.replace(/(.*?)(\bcon-save\b)(.*?)/g, "+$1" + monster.getSavingThrow("con").modifier + "$3");
			output = output.replace(/\bcon-mod\b/g, monster.getAbilityCon().modifier);
			output = output.replace(/\bcon-score\b/g, monster.getAbilityCon().score);
			output = output.replace(/(.*?)(\bint-save\b)(.*?)/g, "+$1" + monster.getSavingThrow("int").modifier + "$3");
			output = output.replace(/\bint-mod\b/g, monster.getAbilityInt().modifier);
			output = output.replace(/\bint-score\b/g, monster.getAbilityInt().score);
			output = output.replace(/(.*?)(\bwis-save\b)(.*?)/g, "+$1" + monster.getSavingThrow("wis").modifier + "$3");
			output = output.replace(/\bwis-mod\b/g, monster.getAbilityWis().modifier);
			output = output.replace(/\bwis-score\b/g, monster.getAbilityWis().score);
			output = output.replace(/(.*?)(\bcha-save\b)(.*?)/g, "+$1" + monster.getSavingThrow("cha").modifier + "$3");
			output = output.replace(/\bcha-mod\b/g, monster.getAbilityCha().modifier);
			output = output.replace(/\bcha-score\b/g, monster.getAbilityCha().score);
			output = output.replace(/\bproficiency\b/g, monster.getChallengeProficiency());
			output = output.replace(/\bxp\b/g, monster.getChallengeXp());
			output = output.replace(/\bcr\b/g, monster.getChallengeRating());

			output = output.replace(/\bac\b/g, (monster.getAcValue() == "—" ? 0 : monster.getAcValue()));
			output = output.replace(/\bhp\b/g, (monster.getHpAverage() == "—" ? 0 : monster.getHpAverage()));

			output = output.replace(/\[(.*?)(, *?d(\d+))?\]/g, (token, t1, t2, t3) => numberToRandom(token, t1, t3));
			output = output.replace(/\+\-/g, "-");

			return output;
			// return "<span style='border-bottom: 1px dotted #00000066; margin: 0 0 -1px 0; border-radius: 0; cursor: pointer;' title='" + token.replace("'", "\'").replace(">", "\>") + "'>" + output + "</span>";
		} catch (e) {
			return token;
			// return "<span style='border-bottom: 1px dotted #b01b11; margin: 0 0 -1px 0; border-radius: 0; cursor: pointer;' title='Invalid shortcode'>" + token + "</span>";
		}
	}

	function numberToRandom(token, value, die) {
		let valueMath = math.evaluate(value);
		if (die != undefined) {
			let scale = (Number(die) + 1) / 2;
			let dice = Math.floor(valueMath / scale);
			let modifier = valueMath - Math.floor(dice * scale);

			if (dice > 0) {
				return valueMath + " (" + dice + "d" + die + ((modifier != 0) ? (" " + ((modifier > 0) ? "+ " : "− ") + Math.abs(modifier)) : "") + ")";
			} else {
				return valueMath;
			}
		} else {
			return valueMath;
		}
	}

	return {
		initialise: initialise,
		createMonster: createMonster,
		createVaultMonster: createVaultMonster
	}
})();

export default Frankenstein;
