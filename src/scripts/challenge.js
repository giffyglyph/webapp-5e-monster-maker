/**
 * Challenge class used to hold monster rating/proficiency/xp values.
 */
class Challenge {

	constructor(rating, proficiency, xp) {
		this.rating = rating;
		this.proficiency = proficiency;
		this.xp = xp;
	}

	getRating() {
		return this.rating;
	}

	getProficiency() {
		return this.proficiency;
	}

	getXp() {
		return this.xp;
	}
}

export default Challenge;
