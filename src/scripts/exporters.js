import Frankenstein from './frankenstein.js';
import Helpers from './helpers.js';

/**
 * Data exporters and converters.
 */
const Exporters = (function(){

	function blueprintToImprovedInitiative(blueprint) {
		let monster = Frankenstein.createMonster(blueprint);
		return {
			Source: "Giffyglyph's Monster Maker",
			Type: monster.getType(),
			HP: {
				Value: monster.getHpAverage(),
				Notes: monster.getHpRoll() == null ? "" : monster.getHpRoll()
			},
			AC: {
				Value: monster.getAcValue(),
				Notes: monster.getAcType() == null ? "" : monster.getAcType()
			},
			InitiativeModifier: 0,
			InitiativeAdvantage: false,
			Speed: monster.getSpeeds().filter(x => x.value != "—").map(function(x) {
				return x.type + " " + x.value;
			}),
			Abilities: {
				Str: monster.getAbilityStr().score,
				Dex: monster.getAbilityDex().score,
				Con: monster.getAbilityCon().score,
				Int: monster.getAbilityInt().score,
				Wis: monster.getAbilityWis().score,
				Cha: monster.getAbilityCha().score
			},
			DamageVulnerabilities: monster.getVulnerabilities(),
			DamageResistances: monster.getResistances(),
			DamageImmunities: monster.getImmunities(),
			ConditionImmunities: monster.getConditions(),
			Saves: monster.getSavingThrows().map(function(x) {
				return {
					Name: x.ability,
					Modifier: x.modifier
				}
			}),
			Skills: monster.getSkills().map(function(x) {
				return {
					Name: x.name,
					Modifier: x.modifier
				}
			}),
			Senses: monster.getSenses().filter(x => x.type != "passive Perception").map(function(x) {
				return x.type + " " + x.value;
			}),
			Languages: monster.getLanguages().filter(x => x != "—"),
			Challenge: monster.getChallengeRating(),
			Traits: monster.getTraits().map(function(x) {
				return {
					Name: x.name,
					Content: x.detail,
					Usage: ""
				}
			}),
			Actions: monster.getActions().map(function(x) {
				return {
					Name: x.name,
					Content: x.detail,
					Usage: ""
				}
			}),
			Reactions: monster.getReactions().map(function(x) {
				return {
					Name: x.name,
					Content: x.detail,
					Usage: ""
				}
			}),
			LegendaryActions: monster.getLegendaryActions().map(function(x) {
				return {
					Name: x.name,
					Content: x.detail,
					Usage: ""
				}
			}),
			Description: "",
			Player: "",
			Version: "2.5.1",
			ImageURL: monster.getImageUrl() == null ? "" : monster.getImageUrl()
		};
	}

	function blueprintToFoundry(blueprint) {
		let monster = Frankenstein.createMonster(blueprint);
		console.log(monster);
		console.log({
			name: monster.getName(),
			type: "npc",
			data: {
				abilities: {
					str: {
						value: monster.getAbilityStr().score,
						proficient: 0
					},
					dex: {
						value: monster.getAbilityDex().score,
						proficient: 0
					},
					con: {
						value: monster.getAbilityCon().score,
						proficient: 0
					},
					int: {
						value: monster.getAbilityInt().score,
						proficient: 0
					},
					wis: {
						value: monster.getAbilityWis().score,
						proficient: 0
					},
					cha: {
						value: monster.getAbilityCha().score,
						proficient: 0
					}
				},
				attributes: {
					ac: {
					  value: monster.getAcValue()
					},
					hp: {
					  value: monster.getHpAverage(),
					  min: 0,
					  max: monster.getHpAverage(),
					  temp: 0,
					  tempmax: 0,
					  formula: ""
					},
					init: {
					  value: monster.getInitiative(),
					  bonus: 0
					},
					movement: {
					  burrow: getOptionalValue(monster.getSpeeds().find(x => x.type == "burrow")),
					  climb: getOptionalValue(monster.getSpeeds().find(x => x.type == "climb")),
					  fly: getOptionalValue(monster.getSpeeds().find(x => x.type == "fly")),
					  swim: getOptionalValue(monster.getSpeeds().find(x => x.type == "swim")),
					  walk: getOptionalValue(monster.getSpeeds().find(x => x.type == "normal")),
					  units: "ft",
					  hover: false
					},
					senses: {
					  darkvision: getOptionalValue(monster.getSenses().find(x => x.type == "darkvision")),
					  blindsight: getOptionalValue(monster.getSenses().find(x => x.type == "blindsight")),
					  tremorsense: getOptionalValue(monster.getSenses().find(x => x.type == "tremorsense")),
					  truesight: getOptionalValue(monster.getSenses().find(x => x.type == "truesight")),
					  units: "ft",
					  special: ""
					}
				},
				details: {
					biography: {
					  value: monster.getNotes().join(" "),
					  public: ""
					},
					alignment: monster.getAlignment(),
					race: "",
					type: monster.getType(),
					environment: "",
					cr: monster.getChallengeRating(),
					spellLevel: 0,
					xp: {
					  value: monster.getChallengeXp()
					},
					source: ""
				},
				traits: {
					size: getFoundrySizeCode(monster.getSize()),
					di: {
					  value: monster.getImmunities(),
					  custom: ""
					},
					dr: {
					  value: monster.getResistances(),
					  custom: ""
					},
					dv: {
					  value: monster.getVulnerabilities(),
					  custom: ""
					},
					ci: {
					  value: monster.getConditions(),
					  custom: ""
					},
					languages: {
					  value: monster.getLanguages(),
					  custom: ""
					}
				  },
			}
		});
		return {};

		function getOptionalValue(optional) {
			if (optional) {
				return optional.value
			} else {
				return 0;
			}
		}

		function getFoundrySizeCode(size) {
			switch (size) {
				case "tiny":
					return "tiny";
				case "small":
					return "sm";
				case "medium":
					return "md";
				case "large":
					return "lg";
				case "huge":
					return "huge";
				case "gargantuan":
					return "grg";
				default:
					return size;
			}
		}
	}

	function blueprintToGMBinder(blueprint) {
		let monster = Frankenstein.createMonster(blueprint);
		return Handlebars.templates["MonsterGMBinder"](monster);
	}

	return {
		blueprintToImprovedInitiative: blueprintToImprovedInitiative,
		blueprintToFoundry: blueprintToFoundry,
		blueprintToGMBinder: blueprintToGMBinder
	}
})();

export default Exporters;
