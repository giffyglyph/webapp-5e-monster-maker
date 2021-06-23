import Component from './Component.js';

/**
 * The main website application navigation bar component.
 */
class TheAppNavigation extends Component {

	/**
	 * Render the application navigation bar.
	 */
	renderComponent() {
		$(this.el).html(Handlebars.templates["TheAppNavigation"](this.data));
	}
}

export default TheAppNavigation;
