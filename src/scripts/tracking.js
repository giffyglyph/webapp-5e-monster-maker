/**
 * Common tracking functions.
 */
const Tracking = (function(){

	function initialise() {
		window.dataLayer = window.dataLayer || [];
		gtag('js', new Date());
		gtag('config', 'UA-74105917-2');
	}

	function sendEvent(category, action) {
		gtag('event', action, {
			'event_category': 'gmm-' + category
		});
	}

	function gtag() {
		window.dataLayer.push(arguments);
	}

	return {
		initialise: initialise,
		sendEvent: sendEvent
	}
})();

export default Tracking;
