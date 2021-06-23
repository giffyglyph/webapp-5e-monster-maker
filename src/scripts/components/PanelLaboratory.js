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
 * A component for the main laboratory.
 */
class PanelLaboratory extends Component {

	/**
	 * Create a new laboratory and child blueprint/preview components.
	 * @param {object} options - Component details, such as element/data/children.
	 */
	constructor(options) {
		super(options);

		// Get blueprint and monster details
		let blueprint = Storage.getLaboratoryBlueprint();
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

	/**
	 * Render the laboratory.
	 */
	renderComponent() {
		$(this.el).html(Handlebars.templates["PanelLaboratory"](this.data));
	}

	/**
	 * Attach the laboratory listeners.
	 */
	attachListeners() {

		$(this.el).on("blueprint:changed", function(e) {
			Storage.setLaboratoryBlueprint(this.children["blueprint"].data.blueprint);
			let monster = Frankenstein.createMonster(Storage.getLaboratoryBlueprint());
			this.children["preview"].setMonster(monster);
		}.bind(this));

		$(this.el).on("display:changed", function(e) {
			Storage.setLaboratoryDisplay(this.children["blueprint"].data.display);
		}.bind(this));

		// Reset the laboratory
		$(this.el).on("click", "#modal-laboratory-reset .btn-confirm", function() {
			$("#modal-laboratory-reset").one("hidden.bs.modal", function() {
				let laboratory = Storage.getDefaultLaboratory();
				Storage.setLaboratoryBlueprint(laboratory.blueprint);
				Storage.setLaboratoryDisplay(laboratory.display);
				this.children["blueprint"].setBlueprintAndDisplay(
					Storage.getLaboratoryBlueprint(),
					Storage.getLaboratoryDisplay()
				);
				this.children["preview"].setMonster(Frankenstein.createMonster(Storage.getLaboratoryBlueprint()));
				$([document.documentElement, document.body]).animate({
					scrollTop: $(".laboratory").offset().top - ($(".app-header").outerHeight() + 10)
				}, 400);
			}.bind(this));
			Tracking.sendEvent('laboratory', 'click-reset');
		}.bind(this));

		// Reset the laboratory
		$(this.el).on("click", "#modal-laboratory-clear .btn-confirm", function() {
			$("#modal-laboratory-clear").one("hidden.bs.modal", function() {
				let blueprint = Storage.getLaboratoryBlueprint();
				blueprint.setTraits([]);
				blueprint.setActions([]);
				blueprint.setReactions([]);
				blueprint.setLegendaryActions([]);
				blueprint.setLairActions([]);
				Storage.setLaboratoryBlueprint(blueprint);
				this.children["blueprint"].setBlueprintAndDisplay(
					Storage.getLaboratoryBlueprint(),
					Storage.getLaboratoryDisplay()
				);
				this.children["preview"].setMonster(Frankenstein.createMonster(Storage.getLaboratoryBlueprint()));
				$([document.documentElement, document.body]).animate({
					scrollTop: $(".laboratory").offset().top - ($(".app-header").outerHeight() + 10)
				}, 400);
			}.bind(this));
			Tracking.sendEvent('laboratory', 'click-clear');
		}.bind(this));

		// Save the current blueprint to the vault
		$(this.el).on("click", ".btn-save", function() {
			let id = Storage.saveMonster(Storage.getLaboratoryBlueprint());
			let laboratory = Storage.getDefaultLaboratory();
			Storage.setLaboratoryBlueprint(laboratory.blueprint);
			Storage.setLaboratoryDisplay(laboratory.display);
			Router.setUrl("/vault/" + id, { showModal: "modal-new-monster" });
			Tracking.sendEvent('laboratory', 'click-save');
		}.bind(this));

		// Empty the vault by deleting all monsters
		$(this.el).on("click", ".btn-export-to-json", function() {
			this.exportBlueprint();
			Tracking.sendEvent('laboratory', 'click-export-json');
		}.bind(this));

		// Export the monster to an Improved Initiative json file
		$(this.el).on("click", ".btn-export-to-ii", function() {
			this.exportMonsterToII();
			Tracking.sendEvent('laboratory', 'click-export-ii');
		}.bind(this));

		// Save the monster to the clipboard in II format
		$(this.el).on("click", ".btn-export-to-ii-clipboard", function() {
			this.exportMonsterToIIClipboard();
			Tracking.sendEvent('laboratory', 'click-export-ii-clipboard');
		}.bind(this));

		// Save the monster to the clipboard in II format
		$(this.el).on("click", ".btn-export-to-foundry", function() {
			this.exportMonsterToFoundry();
			Tracking.sendEvent('laboratory', 'click-export-foundry');
		}.bind(this));

		// Show the monster in GMBinder format
		$(this.el).on("click", ".btn-show-gmbinder", function() {
			this.showGMBinder();
			Tracking.sendEvent('laboratory', 'click-show-gmbinder');
		}.bind(this));

		// Import monsters into the vault
		$(this.el).on("click", ".btn-import-from-json", function() {
			$("#laboratory-import-file").click();
			Tracking.sendEvent('laboratory', 'click-import-json');
		}.bind(this));

		let panel = this;
		$(this.el + " " + "#laboratory-import-file").change(function() {
			if (this.files && this.files.length > 0) {
				Files.loadTextFile(this.files[0], function (e) {
					let contents = JSON.parse(e.target.result);
					if (contents["blueprint"]) {
						Storage.setLaboratoryBlueprint(new Blueprint(contents["blueprint"]));
						panel.children["blueprint"].data.blueprint = Storage.getLaboratoryBlueprint();
						$(panel.el).trigger("blueprint:changed");
						panel.children["blueprint"].render();
						$([document.documentElement, document.body]).animate({
							scrollTop: $(".laboratory").offset().top - ($(".app-header").outerHeight() + 10)
						}, 400);
					} else {
						$("#modal-import-blueprint-failure").modal("show");
					}
				});
			}
			$("#laboratory-import-file").val("");
		});
	}

	/**
	 * Exports the monster vault to a json file.
	 */
	exportBlueprint() {
		let blueprint = Storage.getLaboratoryBlueprint();
		let name = (blueprint.getName() == null) ? "Monster" : blueprint.getName();
		Files.saveJson(name + " (blueprint)", { blueprint: blueprint });
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
	 * Exports the monster to the clipboard in Improved Initative format.
	 */
	exportMonsterToIIClipboard() {
		let blueprint = this.children["blueprint"].data.blueprint;
		let file = Exporters.blueprintToImprovedInitiative(blueprint);
		Files.saveToClipboard(JSON.stringify(file));
	}

	/**
	 * Exports the monster to an Improved Initative json file.
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

export default PanelLaboratory;
