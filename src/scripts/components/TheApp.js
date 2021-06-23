import Component from './Component.js';
import Router from '../router.js';
import Storage from '../storage.js';
import TheAppNavigation from './TheAppNavigation.js';
import TheAppBreadcrumbs from './TheAppBreadcrumbs.js';
import Tracking from '../tracking.js';

/**
 * The main website application component.
 */
class TheApp extends Component {

	/**
	 * Create a new application and child navigation/breadcrumb components.
	 * @param {object} options - Component details, such as element/data/children.
	 */
	constructor(options) {
		super(options);

		this.children["navigation"] = new TheAppNavigation({
			el: "#router-navigation",
			data: {}
		});
		this.children["breadcrumbs"] = new TheAppBreadcrumbs({
			el: "#router-breadcrumbs",
			data: {}
		});
		this.children["main"] = null;
	}

	/**
	 * Render the application frame.
	 */
	renderComponent() {
		$(this.el).html(Handlebars.templates["TheApp"](this.data));
	}

	/**
	 * Attach the application listeners.
	 */
	attachListeners() {

		// Listen for any route changes and update the app components.
		document.addEventListener("route:changed", this.onRouteChange.bind(this));

		// Settings: Show wipe data warning
		$(this.el + " .btn-wipe-data").click(function() {
			$(this).closest(".setting").addClass("confirm");
		});

		// Settings: Cancel wipe data
		$(this.el + " .btn-wipe-data-cancel").click(function() {
			$(this).closest(".setting").removeClass("confirm");
		});

		// Settings: Confirm wipe data
		$(this.el + " .btn-wipe-data-confirm").click(function() {
			$(this).closest(".setting").removeClass("confirm");
			Storage.clear();
			$(this).closest(".setting").addClass("confirmed");
			Router.setUrl('/laboratory');
			Tracking.sendEvent('app-header', 'click-wipe-data');
		});

		// Settings: Restore all settings when modal is closed
		$(this.el + " #modal-settings").on('hidden.bs.modal', function() {
			$("#modal-settings .setting").removeClass("confirm confirmed");
		});

		// Settings: Restore all settings when modal is closed
		$(this.el + " #modal-settings").on('show.bs.modal', function() {
			let settings = Storage.getSettings();
			$(".settings-theme").val(settings.theme.monster);
			$(".settings-defence").val(settings.defence);
		});

		$(this.el + " .app-header [data-type='reddit']").click(function() {
			Tracking.sendEvent('app-header', 'click-reddit');
		});

		$(this.el + " .app-header [data-type='twitter']").click(function() {
			Tracking.sendEvent('app-header', 'click-twitter');
		});

		$(this.el + " .app-header [data-type='patreon']").click(function() {
			Tracking.sendEvent('app-header', 'click-patreon');
		});

		$(this.el + " .app-header [data-type='facebook']").click(function() {
			Tracking.sendEvent('app-header', 'click-facebook');
		});

		$(this.el + " .app-header [data-type='about']").click(function() {
			Tracking.sendEvent('app-header', 'click-about');
		});

		$(this.el + " .app-footer [data-type='reddit']").click(function() {
			Tracking.sendEvent('app-footer', 'click-reddit');
		});

		$(this.el + " .app-footer [data-type='twitter']").click(function() {
			Tracking.sendEvent('app-footer', 'click-twitter');
		});

		$(this.el + " .app-footer [data-type='patreon']").click(function() {
			Tracking.sendEvent('app-footer', 'click-patreon');
		});

		$(this.el + " .app-footer [data-type='facebook']").click(function() {
			Tracking.sendEvent('app-footer', 'click-facebook');
		});

		$(this.el + " .app-footer [data-type='darker-dungeons']").click(function() {
			Tracking.sendEvent('app-footer', 'click-darker-dungeons');
		});

		$(this.el + " .app-footer [data-type='monster-maker']").click(function() {
			Tracking.sendEvent('app-footer', 'click-monster-maker');
		});

		$(this.el + " #modal-settings .btn-save").click(function() {
			let settings = Storage.getSettings();
			settings.theme.monster = $("#modal-settings .settings-theme").val();
			settings.defence = $("#modal-settings .settings-defence").val();
			Storage.setSettings(settings);
			// Trigger a change in any open monster profiles to rerender the template.
			$("select[name='display.theme']").trigger("change");
		});
	}

	onRouteChange(event) {
		let route = event.detail.route;
		let data = event.detail.data;

		// Update navigation
		this.children["navigation"].data = {
			laboratory: (route.navigation == "laboratory"),
			vault: (route.navigation == "vault")
		}
		this.children["navigation"].render();

		// Update breadcrumbs
		let breadcrumbs = [];
		route.breadcrumbs.forEach(function(breadcrumb) {
			let text = breadcrumb.text;
			let url = breadcrumb.url;
			Object.keys(data).forEach(function(key) {
				text = text.replace(":" + key, data[key]);
				url = url.replace(":" + key, data[key]);
			});
			breadcrumbs.push({
				text: text,
				url: url
			});
		});
		this.children["breadcrumbs"].data = {
			breadcrumbs: breadcrumbs,
			hidden: breadcrumbs.length == 0
		}
		this.children["breadcrumbs"].render();

		// Render the main component
		if (route.component) {
			if (this.children["main"] != null) {
				this.children["main"].clearComponent();
			}
			this.children["main"] = new route.component({
				el: "#router-body",
				data: data
			});
			this.children["main"].render();
		} else {
			$("#router-body").unbind();
			$("#router-body").html();
		}
	}
}

export default TheApp;
