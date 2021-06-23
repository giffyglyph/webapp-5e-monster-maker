import Tracking from './tracking.js';
import Helpers from './helpers.js';
import Storage from './storage.js';
import Router from './router.js';
import TheApp from './components/TheApp.js';
import Frankenstein from './frankenstein.js';

const MonsterMaker = (function(){

	function initialise() {

		// Initalise helpers and load stored data
		Tracking.initialise();
		Helpers.initialise();
		Storage.load();
		Frankenstein.initialise(
			Storage.getChallenges(),
			Storage.getRoles(),
			Storage.getRanks()
		);

		// Create main app and render it
		let app = new TheApp({
			el: "#app"
		});
		app.render();

		// Initialise url router
		Router.initialise({});
	}

	return {
		initialise: initialise
	}
})();

export default MonsterMaker;
