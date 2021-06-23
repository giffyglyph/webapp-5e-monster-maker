import Component from './Component.js';
import BlueprintForm from './BlueprintForm.js';
import MonsterPreview from './MonsterPreview.js';
import Storage from '../storage.js';
import Blueprint from '../classes/blueprint.js';
import Monster from '../classes/monster.js';
import Frankenstein from '../frankenstein.js';
import Router from '../router.js';
import Helpers from '../helpers.js';
import Exporters from '../exporters.js';
import Files from '../files.js';
import Tracking from '../tracking.js';

/**
 * A component for viewing/editing a saved monster.
 */
class PanelMonster extends Component {

	/**
	 * Create a new laboratory and child blueprint/preview components.
	 * @param {object} options - Component details, such as element/data/children.
	 */
	constructor(options) {
		super(options);

		// Get blueprint and monster details
		let savedMonster = Storage.getMonster(options.data.id);
		if (savedMonster == null) {
			this.children["blueprint"] = null;
			this.children["preview"] = null;
			this.template = "PanelMonsterError";
		} else {
			this.template = "PanelMonster";
			let blueprint = savedMonster.blueprint;
			let monster = Frankenstein.createMonster(blueprint);

			this.children["blueprint"] = new BlueprintForm({
				el: ".blueprint-form",
				data: {
					blueprint: blueprint,
					display: Storage.getLaboratoryDisplay(),
					traits: Storage.getTraits().sort((a, b) => a.name.localeCompare(b.name))
				}
			});
			this.children["preview"] = new MonsterPreview({
				el: ".monster-preview",
				data: {
					monster: monster
				}
			});
		}
	}

	/**
	 * Render the laboratory.
	 */
	renderComponent() {
		$(this.el).html(Handlebars.templates[this.template](this.data));

		// Show any passthrough modals
		if (this.data.passthroughData != null && this.data.passthroughData.showModal != null) {
			$("#" + this.data.passthroughData.showModal).modal("show");
			this.data.passthroughData = null;
		}
	}

	/**
	 * Attach the laboratory listeners.
	 */
	attachListeners() {

		$(this.el).on("blueprint:changed", function(e) {
			let monster = Frankenstein.createMonster(this.children["blueprint"].data.blueprint);
			this.children["preview"].setMonster(monster);
		}.bind(this));

		$(this.el).on("display:changed", function(e) {
			Storage.setLaboratoryDisplay(this.children["blueprint"].data.display);
		}.bind(this));

		// Save the current blueprint to the vault
		$(this.el).on("click", ".btn-save", function() {
			Storage.updateMonster(this.data.id, this.children["blueprint"].data.blueprint);
			$(this.el + " " + "#modal-updated").modal("show");
			Tracking.sendEvent('monster', 'click-save');
		}.bind(this));

		// Delete this monster
		$(this.el).on("click", "#modal-delete .btn-confirm", function() {
			$("#modal-delete").one("hidden.bs.modal", function() {
				Storage.deleteMonster(this.data.id);
				Router.setUrl("/vault", { showModal: "modal-deleted-monster", oldId: this.data.id });
			}.bind(this));
			Tracking.sendEvent('monster', 'click-delete');
		}.bind(this));

		// Add another monster
		$(this.el).on("click", "#modal-new-monster .btn-add-another", function() {
			$("#modal-new-monster").one("hidden.bs.modal", function() {
				Router.setUrl("/laboratory");
			}.bind(this));
			Tracking.sendEvent('monster', 'click-add-another');
		}.bind(this));

		// Create a new monster with these same details
		$(this.el).on("click", ".btn-save-as-new", function() {
			let blueprint = Object.assign(this.children["blueprint"].data.blueprint);
			let id = Storage.saveMonster(blueprint);
			Router.setUrl("/vault/" + id, { showModal: "modal-new-monster"});
			Tracking.sendEvent('monster', 'click-save-as-new');
		}.bind(this));

		// Empty the vault by deleting all monsters
		$(this.el).on("click", ".btn-export-to-json", function() {
			this.exportMonster();
			Tracking.sendEvent('monster', 'click-export-json');
		}.bind(this));

		// Export the monster to an Improved Initiative json file
		$(this.el).on("click", ".btn-export-to-ii", function() {
			this.exportMonsterToII();
			Tracking.sendEvent('monster', 'click-export-ii');
		}.bind(this));

		// Save the monster to the clipboard
		$(this.el).on("click", ".btn-export-to-ii-clipboard", function() {
			this.exportMonsterToIIClipboard();
			Tracking.sendEvent('monster', 'click-export-ii-clipboard');
		}.bind(this));

		// Export the monster to an Improved Initiative json file
		$(this.el).on("click", ".btn-export-to-foundry", function() {
			this.exportMonsterToFoundry();
			Tracking.sendEvent('monster', 'click-export-foundry');
		}.bind(this));

		// Show the monster in GMBinder format
		$(this.el).on("click", ".btn-show-gmbinder", function() {
			this.showGMBinder();
			Tracking.sendEvent('monster', 'click-export-gmbinder');
		}.bind(this));

		// Import monsters into the vault
		$(this.el).on("click", ".btn-import-from-json", function() {
			$("#monster-import-file").click();
			Tracking.sendEvent('monster', 'click-import-json');
		}.bind(this));

		let panel = this;
		$(this.el + " " + "#monster-import-file").change(function() {
			if (this.files && this.files.length > 0) {
				Files.loadTextFile(this.files[0], function (e) {
					let contents = JSON.parse(e.target.result);
					if (contents["monster"]) {
						let blueprint = new Blueprint(contents["monster"].blueprint);
						panel.children["blueprint"].data.blueprint = blueprint;
						$(panel.el).trigger("blueprint:changed");
						panel.children["blueprint"].render();
						$([document.documentElement, document.body]).animate({
							scrollTop: $(".vault").offset().top - ($(".app-header").outerHeight() + 10)
						}, 400);
					} else {
						$("#modal-import-monster-failure").modal("show");
					}
				});
			}
			$("#monster-import-file").val("");
		});
	}

	/**
	 * Exports the monster to a json file.
	 */
	exportMonster() {
		let monster = Storage.getMonster(this.data.id);
		monster.blueprint = this.children["blueprint"].data.blueprint;
		delete monster.monster;
		let name = (monster.blueprint.getName() == null) ? "Monster" : monster.blueprint.getName();
		Files.saveJson(name, { monster: monster });
	}

	/**
	 * Exports the monster to an Improved Initative json file.
	 */
	exportMonsterToII() {
		let blueprint = this.children["blueprint"].data.blueprint;
		let name = (blueprint.getName() == null) ? "Monster" : blueprint.getName();
		let file = Exporters.blueprintToImprovedInitiative(blueprint);
		Files.saveJson(name + " (II)", file);
	}

	/**
	 * Exports the monster to an Improved Initative json file.
	 */
	exportMonsterToIIClipboard() {
		let blueprint = this.children["blueprint"].data.blueprint;
		let file = Exporters.blueprintToImprovedInitiative(blueprint);
		Files.saveToClipboard(JSON.stringify(file));
	}

	/**
	 * Exports the monster to a Foundry VTT json file.
	 */
	 exportMonsterToFoundry() {
		let blueprint = this.children["blueprint"].data.blueprint;
		let name = (blueprint.getName() == null) ? "Monster" : blueprint.getName();
		let file = Exporters.blueprintToFoundry(blueprint);
		Files.saveJson(name + " (Foundry)", file);
	}

	/**
	 * Exports the monster to the clipboard in GMBinder format.
	 */
	showGMBinder() {
		let blueprint = this.children["blueprint"].data.blueprint;
		let file = Exporters.blueprintToGMBinder(blueprint);
		$("#modal-gmbinder .modal-body").html(file);
		$("#modal-gmbinder").modal("show");
	}
}

export default PanelMonster;
