import Route from './classes/route.js';
import PanelLaboratory from './components/PanelLaboratory.js';
import PanelVault from './components/PanelVault.js';
import PanelMonster from './components/PanelMonster.js';
import PanelError from './components/PanelError.js';

/**
 * A router (used for routing hashed urls).
 */
const Router = (function() {

	let routes = [
		new Route({
			url: "/",
			navigation: "laboratory",
			component: PanelLaboratory,
			breadcrumbs: [
				{
					text: "Laboratory",
					url: "/laboratory"
				}
			]
		}),
		new Route({
			url: "/laboratory",
			navigation: "laboratory",
			component: PanelLaboratory,
			breadcrumbs: [
				{
					text: "Laboratory",
					url: "/laboratory"
				}
			]
		}),
		new Route({
			url: "/vault",
			navigation: "vault",
			component: PanelVault,
			breadcrumbs: [
				{
					text: "Vault",
					url: "/vault"
				}
			]
		}),
		new Route({
			url: "/vault/:id",
			navigation: "vault",
			component: PanelMonster,
			breadcrumbs: [
				{
					text: "Vault",
					url: "/vault"
				}, {
					text: "Monster :id",
					url: "/vault/:id"
				}
			]
		})
	];
	let passthroughData = null;

	/**
	 * Set listeners to track changes in the window location hash.
	 */
	function initialise() {
		window.addEventListener("hashchange", routeWindowLocationHash);
		routeWindowLocationHash();
	}

	/**
	 * Gets the new route for the current window location hash and renders it.
	 */
	function routeWindowLocationHash() {
		let hash = window.location.hash ? window.location.hash.substring(1) : "/";
		let route = getRoute(hash);
		let data = getRouteHashData(route, hash);
		data.passthroughData = passthroughData;
		passthroughData = null;
		window.scrollTo(0, 0);
		document.dispatchEvent(
			new CustomEvent("route:changed", {
				detail: {
					route: route,
					data: data
				}
			})
		);
	}

	/**
	 * Gets the applicable route for a target hash.
	 * @param {string} hash - The target hash url.
	 * @returns {object} A route and associated data.
	 */
	function getRoute(hash) {
		let route = routes.filter(x => x.regex.exec(hash))[0];
		return route ? route : new Route({
			url: hash,
			navigation: "",
			component: PanelError,
			breadcrumbs: []
		});
	}

	/**
	 * Gets any data parameters for a target route and hash.
	 * @param {object} route - The target route.
	 * @param {string} hash - A hash to parse for values.
	 * @returns {object} A map of key/value pairs.
	 */
	function getRouteHashData(route, hash) {
		let data = {};
		let matches = route.regex.exec(hash);
		route.keys.forEach(function(key, index) {
			data[key.name] = matches[index + 1];
		})
		return data;
	}

	/**
	 * Refresh the current page.
	 */
	function refreshCurrentPage() {
		routeWindowLocationHash();
	}

	/**
	 * Set the current url.
	 * @param {string} url - The target url.
	 */
	function setUrl(url, data) {
		passthroughData = data;
		if (window.location.hash == "#" + url) {
			routeWindowLocationHash();
		} else {
			window.location.hash = url;
		}
	}

	return {
		initialise: initialise,
		refreshCurrentPage: refreshCurrentPage,
		setUrl: setUrl
	}
})();

export default Router;
