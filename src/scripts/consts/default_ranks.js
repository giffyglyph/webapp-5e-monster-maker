/**
 * Default monster ranks.
 */
const DEFAULT_RANKS = {
	minion: {
		id: "minion",
		ac: -2,
		hp: 0.2,
		attack: -2,
		damage: 0.75,
		savingThrows: -2,
		dc: -2,
		perception: -2,
		stealth: -2,
		initiative: -2,
		xp: 0.0625
	},
	standard: {
		id: "standard",
		ac: 0,
		hp: 1,
		attack: 0,
		damage: 1,
		savingThrows: 0,
		dc: 0,
		perception: 0,
		stealth: 0,
		initiative: 0,
		xp: 0.25
	},
	elite: {
		id: "elite",
		ac: 2,
		hp: 2,
		attack: 2,
		damage: 1.1,
		savingThrows: 2,
		dc: 2,
		perception: 2,
		stealth: 2,
		initiative: 2,
		xp: 0.5
	},
	solo: {
		id: "solo",
		ac: 2,
		hp: 4,
		attack: 2,
		damage: 1.2,
		savingThrows: 2,
		dc: 2,
		perception: 4,
		stealth: 2,
		initiative: 4,
		xp: 1
	}
};

export default DEFAULT_RANKS;
