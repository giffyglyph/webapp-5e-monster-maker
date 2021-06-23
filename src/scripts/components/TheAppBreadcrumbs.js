import Component from './Component.js';

/**
 * The main website application breadcrumb component.
 */
class TheAppBreadcrumbs extends Component {

	/**
	 * Render the application breadcrumb bar.
	 */
	renderComponent() {
		$(this.el).html(Handlebars.templates["TheAppBreadcrumbs"](this.data));
	}
}

export default TheAppBreadcrumbs;
