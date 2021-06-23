/**
 * Default monster roles.
 */
const DEFAULT_ROLES = {
	controller: {
		id: "controller",
		ac: -2,
		hp: 1,
		attack: 0,
		damage: 1,
		savingThrows: -1,
		dc: 0,
		xp: 1,
		perception: false,
		stealth: false,
		initiative: true
	},
	defender: {
		id: "defender",
		ac: 2,
		hp: 1,
		attack: 0,
		damage: 1,
		savingThrows: 1,
		dc: 0,
		xp: 1,
		perception: true,
		stealth: false,
		initiative: false
	},
	lurker: {
		id: "lurker",
		ac: -4,
		hp: 0.5,
		attack: 2,
		damage: 1.5,
		savingThrows: -2,
		dc: 2,
		xp: 1,
		perception: true,
		stealth: true,
		initiative: false
	},
	sniper: {
		id: "sniper",
		ac: 0,
		hp: 0.75,
		attack: 0,
		damage: 1.25,
		savingThrows: 0,
		dc: 0,
		xp: 1,
		perception: false,
		stealth: true,
		initiative: false
	},
	striker: {
		id: "striker",
		ac: -4,
		hp: 1.25,
		attack: 2,
		damage: 1.25,
		savingThrows: -2,
		dc: 2,
		xp: 1,
		perception: false,
		stealth: false,
		initiative: false
	},
	scout: {
		id: "scout",
		ac: -2,
		hp: 1,
		attack: 0,
		damage: 0.75,
		savingThrows: -1,
		dc: 0,
		xp: 1,
		perception: true,
		stealth: true,
		initiative: true
	},
	supporter: {
		id: "supporter",
		ac: -2,
		hp: 0.75,
		attack: 0,
		damage: 0.75,
		savingThrows: -1,
		dc: 0,
		xp: 1,
		perception: false,
		stealth: false,
		initiative: true
	}
};

export default DEFAULT_ROLES;
