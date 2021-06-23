/**
 * A quickstart container for automated monster details (ac/hp/damage/etc).
 */
class Quickstarter {

	constructor(level) {
		this.level = null;
		this.role = {
			id: null,
			ac: 0,
			savingThrows: 0,
			attack: 0,
			damage: 1,
			hp: 1,
			dc: 0,
			xp: 1
		};
		this.rank = {
			id: null,
			ac: 0,
			savingThrows: 0,
			attack: 0,
			damage: 1,
			hp: 1,
			dc: 0,
			xp: 1
		};
		this.proficiency = null;
		this.abilities = [];
		this.ac = null;
		this.savingThrows = [];
		this.attack = null;
		this.damage = null;
		this.hp = null;
		this.dc = null;
		this.skills = null;
		this.xp = null;
		this.perception = null;
		this.stealth = null;
		this.initiative = null;

		// Get calculated level details
		let proficiency = Math.floor((level + 3) / 4) + 1;
		let ability = Math.floor(level / 4) + 3;
		let player = {
			dpr: level > 0 ? Math.max((Math.ceil(level / 4) + (((level - 1) % 4) / 8)) * (4.5 + proficiency), 1) : 4 + level,
			hp: (level * (5 + Math.min(ability - 2, 5))) + 2
		};

		this.level = level;
		this.proficiency = proficiency;
		this.abilities = [
			ability,
			Math.floor(ability * 0.75),
			Math.floor(ability * 0.5),
			Math.floor(ability * 0.4),
			Math.floor(ability * 0.3),
			Math.floor((ability * 0.3) - 1)
		];
		this.ac = Math.ceil((ability + proficiency) * 0.8) + 10;
		this.savingThrows = [
			ability + proficiency,
			Math.floor((ability + proficiency) * 0.66),
			Math.floor((ability + proficiency) * 0.66),
			Math.floor(((ability + proficiency) * 0.33) - 0.75),
			Math.floor(((ability + proficiency) * 0.33) - 0.75),
			Math.floor(((ability + proficiency) * 0.33) - 0.75)
		];
		this.attack = (ability + proficiency - 2);
		this.damage = Math.max(Math.ceil(player.hp / 4), 1);
		this.hp = Math.max(Math.ceil(player.dpr * 4), 1);
		this.dc = (Math.floor(ability * 0.66)) + proficiency + 8;
		this.skillBonus = Math.floor(ability * 0.66);
		this.perception = null;
	}

	getLevel() {
		return this.level;
	}

	getRole() {
		return this.role;
	}

	setRole(role) {
		this.role = role;
	}

	getRank() {
		return this.rank;
	}

	setRank(rank) {
		this.rank = rank;
	}

	getProficiency() {
		return this.proficiency;
	}

	getAbility(index) {
		return this.abilities[index];
	}

	getAc() {
		return this.ac + this.role.ac + this.rank.ac;
	}

	getSavingThrow(index) {
		return this.savingThrows[index] + this.role.savingThrows + this.rank.savingThrows;
	}

	getAttack() {
		return this.attack + this.role.attack + this.rank.attack;
	}

	getDamage() {
		return Math.max(Math.ceil(this.damage * this.role.damage * this.rank.damage), 1);
	}

	getHp() {
		return Math.max(Math.ceil(this.hp * this.role.hp * this.rank.hp), 1);
	}

	getDcPrimary() {
		return this.dc + this.role.dc + this.rank.dc;
	}

	getDcSecondary() {
		return this.dc + this.role.dc + this.rank.dc - 3;
	}

	getPerception() {
		return this.skillBonus + (this.role.perception ? this.proficiency : 0) + this.rank.perception;
	}

	getStealth() {
		return this.skillBonus + (this.role.stealth ? this.proficiency : 0) + this.rank.stealth;
	}

	getInitiative() {
		return this.skillBonus + (this.role.initiative ? this.proficiency : 0) + this.rank.initiative;
	}

	getChallengeRating() {
		let cr = {
			"-3": ['0','0','0','0'],
			"-2": ['0','0','0','1/8'],
			"-1": ['0','0','1/8','1/4'],
			0: ['0','1/8','1/4','1/2'],
			1: ['1/8','1/4','1/2','1'],
			2: ['1/4','1/2','1','2'],
			3: ['1/2','1','2','3'],
			4: ['1/2','1','3','4'],
			5: ['1/2','2','3','5'],
			6: ['1/2','2','4','6'],
			7: ['1','3','4','7'],
			8: ['1','4','5','8'],
			9: ['1','4','6','9'],
			10: ['1','4','7','10'],
			11: ['2','5','7','11'],
			12: ['2','5','8','12'],
			13: ['2','6','9','13'],
			14: ['3','7','10','14'],
			15: ['3','7','10','15'],
			16: ['3','8','11','16'],
			17: ['4','8','12','17'],
			18: ['4','9','13','18'],
			19: ['4','10','14','19'],
			20: ['4','11','15','20'],
			21: ['5','12','16','21'],
			22: ['6','13','18','22'],
			23: ['7','15','20','23'],
			24: ['8','16','21','24'],
			25: ['9','17','21','25'],
			26: ['10','19','22','26'],
			27: ['10','20','23','27'],
			28: ['11','20','24','28'],
			29: ['12','21','24','29'],
			30: ['12','22','25','30']
		};
		if (this.level < -3 || this.level > 30) {
			return "—";
		} else {
			let rankIndex = ["minion", "standard", "elite", "solo"].indexOf(this.rank.id);
			return cr[this.level][(rankIndex == -1) ? 2 : rankIndex];
		}
	}

	getXp() {
		let xp = {
			"-3": 10,
			"-2": 25,
			"-1": 50,
			"0": 100,
			"1": 200,
			"2": 450,
			"3": 700,
			"4": 1100,
			"5": 1800,
			"6": 2300,
			"7": 2900,
			"8": 3900,
			"9": 5000,
			"10": 5900,
			"11": 7200,
			"12": 8400,
			"13": 10000,
			"14": 11500,
			"15": 13000,
			"16": 15000,
			"17": 18000,
			"18": 20000,
			"19": 22000,
			"20": 25000,
			"21": 33000,
			"22": 41000,
			"23": 50000,
			"24": 62000,
			"25": 75000,
			"26": 90000,
			"27": 105000,
			"28": 120000,
			"29": 135000,
			"30": 155000
		};
		if (this.level < -3 || this.level > 30) {
			return "—";
		} else {
			return Math.max(Math.floor(xp[this.level] * this.role.xp * this.rank.xp), 1);
		}
	}
}

export default Quickstarter;
