import Component from './Component.js';
import Helpers from '../helpers.js';
import Files from '../files.js';
import Tracking from '../tracking.js';

/**
 * A component for a blueprint viewer/editor.
 */
class MonsterPreview extends Component {

	/**
	 * Render the monster preview.
	 */
	renderComponent() {
		let data = {
			monster: this.data.monster,
			display: this.getMonsterPreviewDisplayOptions(this.data.monster)
		};
		$(this.el).html(Handlebars.templates["MonsterPreview"](data));
	}

	/**
	 * Attach the preview listeners.
	 */
	attachListeners() {

		// Create a downloadable png monster image
		$(this.el).on("click", ".btn-png", function() {
			html2canvas(document.querySelector(".monster"), {
				useCORS: true,
				allowTaint: false,
				scale: 1,
				windowWidth: 1200,
				backgroundColor: null,
				onclone: function(clonedDoc) {
					$(clonedDoc).find(".monster").css("font-size", "25px");
				}
			}).then(function(canvas) {
				Files.savePng(this.data.monster.getName(), canvas.toDataURL());
			}.bind(this));
			Tracking.sendEvent('monster-preview', 'click-png');
		}.bind(this));

		$(this.el).on("click", ".btn-columns", function() {
			let columns = $("select[name='display.columns']").val();
			$("select[name='display.columns']").val(columns == 1 ? 2 : 1);
			$("select[name='display.columns']").trigger("change");
		});
	}

	/**
	 * Get the display settings for a monster.
	 * @param {object} monster - The target monster.
	 * @returns {object} - A list of display options.
	 */
	getMonsterPreviewDisplayOptions(monster) {
		let options = {
			imageBanner: monster.getImageUrl() != null && monster.getImagePosition() == "banner",
			imageInline: monster.getImageUrl() != null && monster.getImagePosition() == "inline",
			headerTitle: monster.getName() != null,
			headerDescription: monster.getSize() != null || monster.getType() != null || monster.getTags().length > 0 || monster.getAlignment() != null,
			armorClass: monster.getAcValue() != null || monster.getAcType() != null,
			hitPoints: monster.getHpAverage() != null || monster.getHpRoll() != null,
			speeds: monster.getSpeeds().length > 0,
			savingThrows: monster.getSavingThrows().length > 0,
			skills: monster.getSkills().length > 0,
			senses: monster.getSenses().length > 0,
			languages: monster.getLanguages().length > 0,
			resistances: monster.getResistances().length > 0,
			vulnerabilities: monster.getVulnerabilities().length > 0,
			immunities: monster.getImmunities().length > 0,
			conditions: monster.getConditions().length > 0,
			challenge: monster.getChallengeRating() != null || monster.getChallengeXp() != null,
			traits: monster.getTraits().length > 0,
			actions: monster.getActions().length > 0,
			reactions: monster.getReactions().length > 0,
			paragonActions: monster.getMethod() == "quickstart" && monster.getParagonActions() != null && monster.getParagonActions() > 0,
			legendaryActions: monster.getLegendaryActions().length > 0 || (monster.getLegendaryActionsPerRound() != 0 && monster.getLegendaryActionsPerRound() != null),
			legendaryActionsPerRound: monster.getLegendaryActionsPerRound() != 0,
			lairActions: monster.getLairActions().length > 0 || (monster.getLairActionsInitiative() != 0 && monster.getLairActionsInitiative() != null),
			lairActionsInitiative: monster.getLairActionsInitiative() != 0,
			notes: monster.getNotes() != 0,
			quickstart: monster.getMethod() == "quickstart",
			downloadPng: true
		}

		// Set major section options
		options.header = options.headerTitle || options.headerDescription;
		options.defences = options.armorClass || options.hitPoints;
		options.stats = options.savingThrows || options.skills || options.senses || options.languages || options.challenge || options.resistances || options.vulnerabilities || options.immunities || options.conditions;

		return options;
	}

	/**
	 * Set the monster details and re-render the component.
	 * @param {object} monster - The monster to preview.
	 */
	setMonster(monster) {
		this.data.monster = monster;
		this.render();
	}
}

export default MonsterPreview;
