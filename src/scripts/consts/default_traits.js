/**
 * Default monster traits.
 */
const DEFAULT_TRAITS = [
	{
		id: 0,
		role: "controller",
		name: "Knockback",
		description: "Halve your attack damage to knock the target back up to 15ft."
	},
	{
		id: 1,
		role: "controller",
		name: "Distraction",
		description: "Halve your attack damage to grant advantage to the next attack roll made against the target."
	},
	{
		id: 2,
		role: "controller",
		name: "Get Into Position",
		description: "Halve your attack damage to allow an ally to spend their reaction and move up to half their speed (without provoking opportunity attacks from the target)."
	},
	{
		id: 3,
		role: "controller",
		name: "Sidestep",
		description: "Halve your attack damage to move yourself and your target 5ft in any direction."
	},
	{
		id: 4,
		role: "controller",
		name: "Crippling Strike",
		description: "Halve your attack damage to reduce your target’s speed to 0ft until the start of your next turn."
	},
	{
		id: 5,
		role: "defender",
		name: "Heavy Defence",
		description: "Your defence is impenetrable. Gain +2 AC."
	},
	{
		id: 6,
		role: "defender",
		name: "Got Your Back",
		description: "When standing next to an ally or attacking target, you can spend your reaction to redirect the attack onto yourself."
	},
	{
		id: 7,
		role: "defender",
		name: "You Can’t Leave",
		description: "Targets always provoke opportunity attacks, even if they take the Disengage action before leaving your reach. In addition, when you hit with an opportunity attack, the target’s speed becomes 0 for the rest of the turn."
	},
	{
		id: 8,
		role: "defender",
		name: "Get Behind Me",
		description: "Allies within 5ft of you count as being in three-quarters cover."
	},
	{
		id: 9,
		role: "defender",
		name: "Don’t Look Away",
		description: "When you attack a target, you can mark them. A marked target has -2 to any attack roll that doesn’t include you. You can have one active mark at a time, and marks don’t stack."
	},
	{
		id: 10,
		role: "lurker",
		name: "Hide in Plain Sight",
		description: "You can attempt to hide when behind even light cover."
	},
	{
		id: 11,
		role: "lurker",
		name: "Backstab",
		description: "If you have advantage on your attack, add your level in extra damage."
	},
	{
		id: 12,
		role: "lurker",
		name: "Cunning Action",
		description: "You can Dash, Disengage, or Hide as a bonus action."
	},
	{
		id: 13,
		role: "lurker",
		name: "Camoflague",
		description: "When you are hidden, enemies cannot spot you with passive perception and they have disadvantage when making active checks to find you."
	},
	{
		id: 14,
		role: "lurker",
		name: "Guerilla",
		description: "When you make an attack while hidden, you don’t reveal yourself and can remain in hiding."
	},
	{
		id: 15,
		role: "sniper",
		name: "Hold Still",
		description: "You have advantage on attack rolls when your target moved less than 10ft during their last turn."
	},
	{
		id: 16,
		role: "sniper",
		name: "I Can See You",
		description: "Your ranged attacks ignore half and three-quarters cover."
	},
	{
		id: 17,
		role: "sniper",
		name: "Next Time",
		description: "If you miss a target, you have advantage on your next attack against that same target."
	},
	{
		id: 18,
		role: "sniper",
		name: "Scattershot",
		description: "When you make a successful attack, you can deal damage equal to your level to everyone within 5ft of your target (once per round)."
	},
	{
		id: 19,
		role: "sniper",
		name: "Ricochet",
		description: "If your attack misses, you can spend your reaction to make another attack against a different target of your choice within 15ft of the original target."
	},
	{
		id: 20,
		role: "striker",
		name: "Cleave",
		description: "You can attack two adjacent targets that are within reach, dealing full damage to each."
	},
	{
		id: 21,
		role: "striker",
		name: "Bloodfury",
		description: "When you are bloodied, you become enraged; -2 AC and +2 attack."
	},
	{
		id: 22,
		role: "striker",
		name: "Savage Assault",
		description: "Once per turn, add your level in extra damage to an attack."
	},
	{
		id: 23,
		role: "striker",
		name: "Press the Attack",
		description: "You have advantage on attack rolls against bloodied targets (under 50% hit points)."
	},
	{
		id: 24,
		role: "striker",
		name: "Revenge",
		description: "Deal bonus damage equal to your level against anyone that hurt you in the previous round."
	},
	{
		id: 25,
		role: "scout",
		name: "You Can’t Hide",
		description: "You have advantage when trying to detect hidden enemies. Any enemy that you can see is also visible to your allies."
	},
	{
		id: 26,
		role: "scout",
		name: "Light-footed",
		description: "You can Disengage or Dash as a bonus action. When an enemy moves adjacent to you, you can spend your reaction to move away up to half your speed."
	},
	{
		id: 27,
		role: "scout",
		name: "Explorer",
		description: "You can climb and move across difficult terrain without any movement penalty."
	},
	{
		id: 28,
		role: "scout",
		name: "Pincer Movement",
		description: "When an ally moves adjacent to an enemy, you can spend your reaction to move up to your speed towards that same enemy."
	},
	{
		id: 29,
		role: "scout",
		name: "Hard to Hit",
		description: "When you are standing and unrestained, attacks against you have disadvantage unless you are adjacent to two or more enemies."
	},
	{
		id: 30,
		role: "supporter",
		name: "Guidance",
		description: "Allies within 10ft of you have advantage on their attacks rolls."
	},
	{
		id: 31,
		role: "supporter",
		name: "Protection",
		description: "Allies within 10ft of you gain +2 AC."
	},
	{
		id: 32,
		role: "supporter",
		name: "Ferocity",
		description: "Allies within 10ft of you gain a bonus to damage equal to your level."
	},
	{
		id: 33,
		role: "supporter",
		name: "Rallying Cry",
		description: "Halve your attack damage to remove a condition from an ally."
	},
	{
		id: 34,
		role: "supporter",
		name: "Commander",
		description: "Instead of making an attack roll, you can command an ally to make an attack against a target of your choice (once per round)."
	},
	{
		id: 35,
		role: null,
		name: "Adhesive",
		description: "You adhere to anything you touch. Any huge or smaller creature adhered to you is also grappled, and ability checks made to escape your grapple have disadvantage."
	},
	{
		id: 36,
		role: null,
		name: "Aggressive",
		description: "As a bonus action, you can move up to your speed towards an enemy you can see."
	},
	{
		id: 37,
		role: null,
		name: "Alarm",
		description: "When you take damage, all other monsters of the same breed within 240 ft are aware of your pain."
	},
	{
		id: 38,
		role: null,
		name: "Alien Mind",
		description: "You have advantage on Wisdom saving throws."
	},
	{
		id: 39,
		role: null,
		name: "Amorphous",
		description: "You can move through a space as narrow as 1 inch wide without squeezing."
	},
	{
		id: 40,
		role: null,
		name: "Arcane Protection",
		description: "You are resistant to all magical damage."
	},
	{
		id: 41,
		role: null,
		name: "Aura: Antimagic",
		description: "Any creature within 10ft of you has disadvantage when casting magical spells."
	},
	{
		id: 42,
		role: null,
		name: "Aura: Damaging",
		description: "The space around you is dangerous. Creatures take damage equal to your level when they enter your aura or start their turn within it."
	},
	{
		id: 43,
		role: null,
		name: "Aura: Disruptive",
		description: "All enemies within 10 ft of you have disadvantage on saving throws."
	},
	{
		id: 44,
		role: null,
		name: "Aura: Entangle",
		description: "The ground in a 10 ft radius around you is difficult terrain. Each creature that starts its turn in that area must succeed on a Strength saving throw or have its speed reduced to 0 until the start of its next turn."
	},
	{
		id: 45,
		role: null,
		name: "Aura: Stench",
		description: "The air is putrid around you. Creatures within 10ft of you have disadvantage on attack rolls, unless they also have the <i>Stench</i> trait."
	},
	{
		id: 46,
		role: null,
		name: "Barbed Hide",
		description: "At the start of your turn, deal piercing damage equal to your level to any creature that is grappling you."
	},
	{
		id: 47,
		role: null,
		name: "Blood Frenzy",
		description: "You have advantage on melee attack rolls against any creature that doesn’t have all its hit points."
	},
	{
		id: 48,
		role: null,
		name: "Charger",
		description: "If you moved more than 20ft in a straight line towards your target, make your melee attack roll with advantage. On a hit, you knock your target prone in addition to any other effect."
	},
	{
		id: 49,
		role: null,
		name: "Constrict",
		description: "At the start of your turn, deal bludgeoning damage equal to your level to any creature that you are grappling."
	},
	{
		id: 50,
		role: null,
		name: "Corrosive Body",
		description: "Any creature that touches you or makes a melee attack against you takes damage equal to your level. Any weapon that hits you takes a permanent and cumulative −1 penalty to damage rolls—the weapon is destroyed if the penalty reaches −5."
	},
	{
		id: 51,
		role: null,
		name: "Critical Defence",
		description: "Critical hits made against you count as normal hits unless you are already bloodied."
	},
	{
		id: 52,
		role: null,
		name: "Critical Fury",
		description: "Your attacks score a critical hit on a roll of 19-20."
	},
	{
		id: 53,
		role: null,
		name: "Damage Absorption",
		description: "Whenever you would take damage of a specific type, you instead regain that many hit points."
	},
	{
		id: 54,
		role: null,
		name: "Damage Transfer",
		description: "When you take damage from an attack, you can transfer half of the damage to another creature within 5 ft of you."
	},
	{
		id: 55,
		role: null,
		name: "Dangerous Body",
		description: "Any enemy that touches you or hits you with a melee attack while within 5 ft of you takes damage equal to your level."
	},
	{
		id: 56,
		role: null,
		name: "Disintegration",
		description: "When you die, your body distintegrates into dust. You leave behind your weapons and anything else you are carrying."
	},
	{
		id: 57,
		role: null,
		name: "Dragonbreath",
		description: "You can breathe dragonfire as an attack, or use it to light small fires."
	},
	{
		id: 58,
		role: null,
		name: "Earth Glide",
		description: "You can burrow through nonmagical, unworked earth and stone. While doing so, you don’t disturb the material you move through."
	},
	{
		id: 59,
		role: null,
		name: "Escape",
		description: "When you would be reduced to 0 hit points outside of your lair, you instead escape and flee to your lair. You remain there, paralysed and resting, until you recover at least 50% of your hit points."
	},
	{
		id: 60,
		role: null,
		name: "Explosive",
		description: "When you fall to 0 hit points, your body explodes and deals damage to everyone within 5ft. You can begin detonation on your turn with a bonus action; you explode at the start of your next turn."
	},
	{
		id: 61,
		role: null,
		name: "False Appearance",
		description: "When you remain motionless, you are indistinguishable from a piece of the local landscape."
	},
	{
		id: 62,
		role: null,
		name: "Fey Mind",
		description: "You have advantage on saving throws against being charmed, and magic can’t put you to sleep."
	},
	{
		id: 63,
		role: null,
		name: "Flight",
		description: "You can fly your speed. While flying, you must move your entire movement speed or land—unless you can also hover. Launching into flight provokes opportunity attacks, even if you <i>Disengage</i>."
	},
	{
		id: 64,
		role: null,
		name: "Flyby",
		description: "You don’t provoke an opportunity attack when you fly out of an enemy’s reach."
	},
	{
		id: 65,
		role: null,
		name: "Freedom of Movement",
		description: "You ignore difficult terrain, and magical effects can’t reduce your speed or cause it to be restrained. You can spend 5 ft of movement to escape from nonmagical restraints or being grappled."
	},
	{
		id: 66,
		role: null,
		name: "Grappler",
		description: "You have advantage on attack rolls against any target you have grappled. In addition, when grappling a target, any damage you take from an attack is split 50/50 with your victim."
	},
	{
		id: 67,
		role: null,
		name: "Hover",
		description: "You can hover in one spot in the air for 6 second before you need to move."
	},
	{
		id: 68,
		role: null,
		name: "Immortal",
		description: "You cannot be killed unless you are reduced to 0 hit points by a specific type of attack. Any other form of attack will reduce you to 1 hit point instead."
	},
	{
		id: 69,
		role: null,
		name: "Immutable Form",
		description: "You are immune to any spell or effect that would alter your form."
	},
	{
		id: 70,
		role: null,
		name: "Impenetrable",
		description: "You are resistant to all non-magical damage."
	},
	{
		id: 71,
		role: null,
		name: "Incorporeal",
		description: "You can pass through any solid non-magical matter and cannot be hit by any non-magical weapon or attack."
	},
	{
		id: 72,
		role: null,
		name: "Indominable",
		description: "You are immune to any effects that would alter your mind or will."
	},
	{
		id: 73,
		role: null,
		name: "Inscrutable",
		description: "You are immune to any effect that would sense your emotions or read your thoughts, as well as any divination spell that you refuse. Wisdom (Insight) checks made to ascertain your intentions or sincerity have disadvantage."
	},
	{
		id: 74,
		role: null,
		name: "Invisible",
		description: "You cannot be seen."
	},
	{
		id: 75,
		role: null,
		name: "Life Eater",
		description: "When you deal damage that reduces a creature to 0 hit points, that creature cannot be revived by any means short of a wish spell."
	},
	{
		id: 76,
		role: null,
		name: "Magic Resistance",
		description: "You have advantage on saving throws against spells and other magical effects."
	},
	{
		id: 77,
		role: null,
		name: "Magic Weapons",
		description: "Your weapon attacks are magical."
	},
	{
		id: 78,
		role: null,
		name: "Martial Advantage",
		description: "Once per turn you may deal extra damage equal to your level when you hit a target within 5ft of your allies."
	},
	{
		id: 79,
		role: null,
		name: "Parry",
		description: "You can spend your reaction to gain +3 AC against one melee attack that you can see."
	},
	{
		id: 80,
		role: null,
		name: "Rampage",
		description: "When you reduce a target to 0 hit points with a melee attack on your turn, you can spend a bonus action to move up to half your speed and attack a different target."
	},
	{
		id: 81,
		role: null,
		name: "Reckless",
		description: "At the start of your turn, you can gain advantage on all melee attacks you make for that turn. However, all attacks against you gain advantage until the start of your next turn."
	},
	{
		id: 82,
		role: null,
		name: "Redirect",
		description: "When you are within 5ft of an ally, you can redirect any single attack made against you to your ally instead."
	},
	{
		id: 83,
		role: null,
		name: "Regeneration",
		description: "You regain hit points at the start of your turn equal to your maximum hit points / 10. This regeneration stops for 1 turn if you are hit by a specific damage type (fire/acid/lightning/etc) or you are reduced to 0 hit points."
	},
	{
		id: 84,
		role: null,
		name: "Relentless",
		description: "The first time you fall to 0 hit points after a long rest, you are instead reduced to 1 hit point."
	},
	{
		id: 85,
		role: null,
		name: "Seige Monster",
		description: "You deal double damage to objects and structures."
	},
	{
		id: 86,
		role: null,
		name: "Shadow Stealth",
		description: "While in dim light or darkness, you can take the Hide action as a bonus action."
	},
	{
		id: 87,
		role: null,
		name: "Shifty",
		description: "You can <i>Disengage</i> as a bonus action."
	},
	{
		id: 88,
		role: null,
		name: "Slippery",
		description: "You have advantage on ability checks and saving throws made to escape a grapple."
	},
	{
		id: 89,
		role: null,
		name: "Spider Climb",
		description: "You can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
	},
	{
		id: 90,
		role: null,
		name: "Split",
		description: "When you are bloodied, you split into two smaller copies. Each new copy has hit points equal to half of your remaining hit points, and acts independantly."
	},
	{
		id: 91,
		role: null,
		name: "Sure-footed",
		description: "You have advantage on Strength and Dexterity saving throws made against effects that would knock you prone."
	},
	{
		id: 92,
		role: null,
		name: "Swarm",
		description: "You can occupy another creature’s space and vice versa. You gain advantage on attacks against any creature that shares your space."
	},
	{
		id: 93,
		role: null,
		name: "Teamwork",
		description: "You have advantage on attack rolls when your target is within 5ft of an unrestrained ally."
	},
	{
		id: 94,
		role: null,
		name: "Uncanny Senses",
		description: "Unless you are incapacitated, you cannot be surprised."
	},
	{
		id: 95,
		role: null,
		name: "Undying Fortitude",
		description: "If damage reduces you to 0 hit points, make a Consititution saving throw with a DC of 5 + the damage taken. On a success, you drop to 1 hit point instead."
	},
	{
		id: 96,
		role: null,
		name: "Wakeful",
		description: "You are never caught sleeping."
	},
	{
		id: 97,
		role: null,
		name: "War Magic",
		description: "When you use your action to cast a spell, you can make one weapon attack as a bonus action."
	}
];

export default DEFAULT_TRAITS;
