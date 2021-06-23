import Blueprint from './classes/blueprint.js';
import Challenge from './classes/challenge.js';
import DEFAULT_RANKS from './consts/default_ranks.js';
import DEFAULT_ROLES from './consts/default_roles.js';
import DEFAULT_TRAITS from './consts/default_traits.js';

/**
 * A storage container for the site data.
 */
const Storage = (function() {

	let data = {
		laboratory: getDefaultLaboratory(),
		fragments: {
			challenges: getDefaultChallenges(),
			roles: getDefaultRoles(),
			ranks: getDefaultRanks(),
			traits: getDefaultTraits()
		},
		vault: {
			id: 0,
			monsters: getDefaultMonsters()
		},
		settings: getDefaultSettings()
	}

	/**
	 * Get the default laboratory details.
	 */
	function getDefaultLaboratory() {
		let blueprint = new Blueprint();
		blueprint.setSpeedNormal("30 ft.");
		blueprint.setLanguages([
			{
				name: "common",
				custom: null
			}
		]);
		blueprint.setTraits([
			{
				name: "(Striker) Savage Assault",
				detail: "Once per turn, add your level in extra damage to an attack."
			}, {
				name: "Shifty",
				detail: "You can _Disengage_ as a bonus action."
			}
		]);
		blueprint.setActions([
			{
				name: "Slash",
				detail: "_Melee Weapon Attack:_ [attack] vs AC. _Hit:_ [damage, d4] slashing damage."
			}, {
				name: "Knockback",
				detail: "_Melee Weapon Attack:_ [dc-primary] vs Strength. _Hit:_ the target is pushed up to 10 ft away."
			}
		]);
		return {
			blueprint: blueprint,
			display: {}
		};
	}

	/**
	 * Get the default monster challenges.
	 */
	function getDefaultChallenges() {
		return [
			new Challenge(0, 2, 10),
			new Challenge("1/8", 2, 25),
			new Challenge("1/4", 2, 50),
			new Challenge("1/2", 2, 100),
			new Challenge(1, 2, 200),
			new Challenge(2, 2, 450),
			new Challenge(3, 2, 700),
			new Challenge(4, 2, 1100),
			new Challenge(5, 2, 1800),
			new Challenge(6, 3, 2300),
			new Challenge(7, 3, 2900),
			new Challenge(8, 3, 3900),
			new Challenge(9, 3, 5000),
			new Challenge(10, 4, 5900),
			new Challenge(11, 4, 7200),
			new Challenge(12, 4, 8400),
			new Challenge(13, 5, 10000),
			new Challenge(14, 5, 11500),
			new Challenge(15, 5, 13000),
			new Challenge(16, 5, 15000),
			new Challenge(17, 6, 18000),
			new Challenge(18, 6, 20000),
			new Challenge(19, 6, 22000),
			new Challenge(20, 6, 25000),
			new Challenge(21, 7, 33000),
			new Challenge(22, 7, 41000),
			new Challenge(23, 7, 50000),
			new Challenge(24, 7, 62000),
			new Challenge(25, 8, 75000),
			new Challenge(26, 8, 90000),
			new Challenge(27, 8, 105000),
			new Challenge(28, 8, 120000),
			new Challenge(29, 9, 135000),
			new Challenge(30, 9, 155000)
		];
	}

	/**
	 * Get the default monster roles.
	 */
	function getDefaultRoles() {
		return DEFAULT_ROLES;
	}

	/**
	 * Get the default monster ranks.
	 */
	function getDefaultRanks() {
		return DEFAULT_RANKS;
	}

	/**
	 * Get the default monster traits.
	 */
	function getDefaultTraits() {
		return DEFAULT_TRAITS;
	}

	/**
	 * Get the default vaulted monsters.
	 */
	function getDefaultMonsters() {
		return [];
	}

	/**
	 * Get the default user settings.
	 */
	function getDefaultSettings() {
		return {
			theme: {
				monster: "diamond"
			},
			defence: "disabled"
		};
	}

	/**
	 * Load the storage details from localStorage, or use defaults if no data exists.
	 */
	function load() {
		let laboratory = localStorage.getItem("laboratory");
		data.laboratory = (laboratory == null) ? getDefaultLaboratory() : JSON.parse(laboratory);
		data.laboratory.blueprint = new Blueprint(data.laboratory.blueprint);

		let monsters = localStorage.getItem("monsters");
		data.vault.monsters = (monsters == null) ? getDefaultMonsters() : JSON.parse(monsters);
		data.vault.monsters.forEach(function(monster, index) {
			data.vault.monsters[index].blueprint = new Blueprint(data.vault.monsters[index].blueprint);
		});
		refreshVaultId();

		let settings = localStorage.getItem("settings");
		data.settings = (settings == null) ? getDefaultSettings() : JSON.parse(settings);
	}

	/**
	 * Clear stored data and wipe the localStorage bins.
	 */
	function clear() {
		data.laboratory = getDefaultLaboratory();
		data.vault.monsters = getDefaultMonsters();
		data.vault.id = 1;
		localStorage.clear();
	}

	/**
	 * Gets the laboratory blueprint.
	 */
	function getLaboratoryBlueprint() {
		return data.laboratory.blueprint;
	}

	/**
	 * Sets the laboratory blueprint and updates localStorage.
	 * @param {object} blueprint - The new laboratory blueprint.
	 */
	function setLaboratoryBlueprint(blueprint) {
		data.laboratory.blueprint = blueprint;
		localStorage.setItem("laboratory", JSON.stringify(data.laboratory));
		document.dispatchEvent(new CustomEvent("storage:blueprint:changed", { detail: null }));
	}

	/**
	 * Gets the laboratory display settings.
	 */
	function getLaboratoryDisplay() {
		return data.laboratory.display;
	}

	/**
	 * Sets the laboratory display settings and updates localStorage.
	 * @param {object} display - The laboratory display settings.
	 */
	function setLaboratoryDisplay(display) {
		data.laboratory.display = display;
		localStorage.setItem("laboratory", JSON.stringify(data.laboratory));
	}

	/**
	 * Gets the challenge fragments.
	 */
	function getChallenges() {
		return data.fragments.challenges;
	}

	/**
	 * Gets the role fragments.
	 */
	function getRoles() {
		return data.fragments.roles;
	}

	/**
	 * Gets the rank fragments.
	 */
	function getRanks() {
		return data.fragments.ranks;
	}

	/**
	 * Gets the trait fragments.
	 */
	function getTraits() {
		return data.fragments.traits;
	}

	/**
	 * Gets a specific trait fragment.
	 */
	function getTrait(id) {
		return data.fragments.traits.find(x => x.id == id);
	}

	/**
	 * Gets the vaulted monsters blueprints.
	 */
	function getMonsters() {
		return data.vault.monsters;
	}

	/**
	 * Sets the vaulted monster collection.
	 */
	function setMonsters(monsters) {
		data.vault.monsters = monsters;
		refreshVaultId();
		localStorage.setItem("monsters", JSON.stringify(data.vault.monsters));
	}

	/**
	 * Gets a monster entry from storage.
	 */
	function getMonster(id) {
		let index = data.vault.monsters.findIndex(x => x.id == id);
		return (index == -1) ? null : data.vault.monsters[index];
	}

	/**
	 * Deletes a monster entry from storage.
	 */
	function deleteMonster(id) {
		data.vault.monsters = data.vault.monsters.filter(x => x.id != id);
		localStorage.setItem("monsters", JSON.stringify(data.vault.monsters));
	}

	/**
	 * Saves a monster blueprint to the vault.
	 * @param {object} blueprint - The blueprint to save.
	 * @returns {number} The id of the new monster.
	 */
	function saveMonster(blueprint) {
		if (data.vault.monsters.findIndex(x => x.id == data.vault.id) != -1) {
			refreshVaultId();
		}
		let newId = data.vault.id;
		data.vault.id += 1;
		data.vault.monsters.push({
			id: newId,
			blueprint: blueprint,
			created: Date.now(),
			updated: Date.now()
		});
		localStorage.setItem("monsters", JSON.stringify(data.vault.monsters));
		return newId;
	}

	function refreshVaultId() {
		data.vault.id = (data.vault.monsters.length > 0) ? Math.max(...data.vault.monsters.map(x => x.id)) + 1 : 1;
	}

	/**
	 * Imports a collection of monster records to the vault.
	 * @param {collection} records - The monster records.
	 */
	function importMonsters(records) {
		refreshVaultId();
		records.forEach(function(record) {
			data.vault.monsters.push({
				id: data.vault.id,
				blueprint: new Blueprint(record.blueprint ? record.blueprint : record),
				created: record.created ? new Date(record.created) : new Date(),
				updated: record.updated ? new Date(record.updated) : new Date()
			});
			data.vault.id += 1;
		});
		localStorage.setItem("monsters", JSON.stringify(data.vault.monsters));
	}

	/**
	 * Imports one monster records to the vault.
	 * @param {object} record - The monster record.
	 */
	function importMonster(record) {
		refreshVaultId();
		data.vault.monsters.push({
			id: data.vault.id,
			blueprint: new Blueprint(record.blueprint ? record.blueprint : record),
			created: record.created ? new Date(record.created) : new Date(),
			updated: record.updated ? new Date(record.updated) : new Date()
		});
		data.vault.id += 1;
		localStorage.setItem("monsters", JSON.stringify(data.vault.monsters));
	}

	/**
	 * Updates an existing monster blueprint in the vault.
	 * @param {number} id - The index of the currenty monster.
	 * @param {object} blueprint - The new blueprint to save.
	 */
	function updateMonster(id, blueprint) {
		let index = data.vault.monsters.findIndex(x => x.id == id);
		data.vault.monsters[index].blueprint = blueprint;
		data.vault.monsters[index].updated = Date.now();
		localStorage.setItem("monsters", JSON.stringify(data.vault.monsters));
	}

	/**
	 * Gets the app settings.
	 */
	function getSettings() {
		return data.settings;
	}

	/**
	 * Sets the app settings.
	 */
	function setSettings(settings) {
		data.settings = settings;
		localStorage.setItem("settings", JSON.stringify(data.settings));
	}

	return {
		load: load,
		clear: clear,
		getDefaultLaboratory: getDefaultLaboratory,
		getLaboratoryBlueprint: getLaboratoryBlueprint,
		setLaboratoryBlueprint: setLaboratoryBlueprint,
		getLaboratoryDisplay: getLaboratoryDisplay,
		setLaboratoryDisplay: setLaboratoryDisplay,
		getChallenges: getChallenges,
		getRoles: getRoles,
		getRanks: getRanks,
		getTraits: getTraits,
		getTrait: getTrait,
		getMonsters: getMonsters,
		setMonsters: setMonsters,
		getMonster: getMonster,
		deleteMonster: deleteMonster,
		saveMonster: saveMonster,
		importMonsters: importMonsters,
		importMonster: importMonster,
		updateMonster: updateMonster,
		getSettings: getSettings,
		setSettings: setSettings
	}
})();

export default Storage;
