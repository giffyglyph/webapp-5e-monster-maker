/**
 * A monster profile.
 * Monsters are rendered to the screen and interacted with.
 */
class Monster {

	constructor() {
		this.vid = null;
		this.method = null;
		this.description = {
			name: null,
			size: null,
			type: null,
			alignment: null,
			level: null,
			role: null,
			rank: null,
			players: null
		};
		this.tags = [];
		this.display = {
			theme: null,
			image: {
				url: null,
				position: null
			}
		};
		this.ac = {
			value: null,
			type: null
		};
		this.hp = {
			average: null,
			roll: null
		};
		this.speeds = [];
		this.abilities = {
			str: null,
			dex: null,
			con: null,
			int: null,
			wis: null,
			cha: null
		};
		this.savingThrows = [];
		this.skills = [];
		this.vulnerabilities = [];
		this.resistances = [];
		this.immunities = [];
		this.conditions = [];
		this.senses = [];
		this.languages = [];
		this.challenge = {
			rating: null,
			proficiency: null,
			xp: null,
		};
		this.traits = [];
		this.actions = [];
		this.reactions = [];
		this.paragonActions = null;
		this.legendaryActionsPerRound = null;
		this.legendaryActions = [];
		this.lairActionsInitiative = null;
		this.lairActions = [];
		this.notes = [];
		this.initiative = null;
		this.attack = {
			bonus: null,
			damage: null,
			isActive: false,
			isActiveSmaller: false
		};
		this.dc = {
			primary: null,
			secondary: null
		};
		this.isQuickstart = false;
	}

	getVid() {
		return this.vid;
	}

	setVid(vid) {
		this.vid = vid;
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

	setLevel(level) {
		this.description.level = level;
	}

	getRole() {
		return this.description.role;
	}

	setRole(role) {
		this.description.role = role;
	}

	getRank() {
		return this.description.rank;
	}

	setRank(rank) {
		this.description.rank = rank;
	}

	getPlayers() {
		return this.description.players;
	}

	setPlayers(players) {
		this.description.players = players;
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

	setDisplayTheme(theme) {
		this.display.theme = theme;
	}

	getDisplayColumns() {
		return this.display.columns;
	}

	setDisplayColumns(columns) {
		this.display.columns = columns;
	}

	getImageUrl() {
		return this.display.image.url;
	}

	setImageUrl(url) {
		this.display.image.url = url;
	}

	getImagePosition() {
		return this.display.image.position;
	}

	setImagePosition(position) {
		this.display.image.position = position;
	}

	getAcValue() {
		return this.ac.value;
	}

	setAcValue(acValue) {
		this.ac.value = acValue;
	}

	getAcType() {
		return this.ac.type;
	}

	setAcType(acType) {
		this.ac.type = acType;
	}

	getHpAverage() {
		return this.hp.average;
	}

	setHpAverage(hpAverage) {
		this.hp.average = hpAverage;
	}

	getHpRoll() {
		return this.hp.roll;
	}

	setHpRoll(hpRoll) {
		this.hp.roll = hpRoll;
	}

	getSpeeds() {
		return this.speeds;
	}

	setSpeeds(speeds) {
		this.speeds = speeds;
	}

	getAbilityStr() {
		return this.abilities.str;
	}

	setAbilityStr(str) {
		this.abilities.str = str;
	}

	getAbilityDex() {
		return this.abilities.dex;
	}

	setAbilityDex(dex) {
		this.abilities.dex = dex;
	}

	getAbilityCon() {
		return this.abilities.con;
	}

	setAbilityCon(con) {
		this.abilities.con = con;
	}

	getAbilityInt() {
		return this.abilities.int;
	}

	setAbilityInt(int) {
		this.abilities.int = int;
	}

	getAbilityWis() {
		return this.abilities.wis;
	}

	setAbilityWis(wis) {
		this.abilities.wis = wis;
	}

	getAbilityCha() {
		return this.abilities.cha;
	}

	setAbilityCha(cha) {
		this.abilities.cha = cha;
	}

	getSavingThrows() {
		return this.savingThrows;
	}

	setSavingThrows(savingThrows) {
		this.savingThrows = savingThrows;
	}

	getSavingThrow(ability) {
		let savingThrow = this.savingThrows.filter(x => x.ability == ability)[0];
		if (savingThrow == undefined) {
			savingThrow = {
				ability: ability,
				modifier: this.abilities[ability].modifier
			};
		}
		return savingThrow;
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

	getSenses() {
		return this.senses;
	}

	setSenses(senses) {
		this.senses = senses;
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

	setChallengeRating(rating) {
		this.challenge.rating = rating;
	}

	getChallengeProficiency() {
		return this.challenge.proficiency;
	}

	setChallengeProficiency(proficiency) {
		this.challenge.proficiency = proficiency;
	}

	getChallengeXp() {
		return this.challenge.xp;
	}

	setChallengeXp(xp) {
		this.challenge.xp = xp;
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

	getParagonActions() {
		return this.paragonActions;
	}

	setParagonActions(amount) {
		this.paragonActions = amount;
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

	setLairActionsInitiative(lairActionsInitiative) {
		this.lairActionsInitiative = lairActionsInitiative;
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

	setNotes(notes) {
		this.notes = notes;
	}

	getInitiative() {
		return this.initiative;
	}

	setInitiative(initiative) {
		this.initiative = initiative;
	}

	getAttackBonus() {
		return this.attack.bonus;
	}

	setAttackBonus(bonus) {
		this.attack.bonus = bonus;
	}

	getAttackDamage() {
		return this.attack.damage;
	}

	setAttackDamage(damage) {
		this.attack.damage = damage;
	}

	getAttackIsActive() {
		return this.attack.isActive;
	}

	setAttackIsActive(isActive) {
		this.attack.isActive = isActive;
	}

	getAttackIsActiveSmaller() {
		return this.attack.isActiveSmaller;
	}

	setAttackIsActiveSmaller(isActiveSmaller) {
		this.attack.isActiveSmaller = isActiveSmaller;
	}

	getDcPrimary() {
		return this.dc.primary;
	}

	setDcPrimary(primary) {
		this.dc.primary = primary;
	}

	getDcSecondary() {
		return this.dc.secondary;
	}

	setDcSecondary(secondary) {
		this.dc.secondary = secondary;
	}

	getIsQuickstart() {
		return this.dc.secondary;
	}

	setIsQuickstart(isQuickstart) {
		this.isQuickstart = isQuickstart;
	}
}

export default Monster;
