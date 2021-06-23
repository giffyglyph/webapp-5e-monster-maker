import Component from './Component.js';

/**
 * A component for displaying an error (i.e. 404).
 */
class PanelError extends Component {

	/**
	 * Render the error panel.
	 */
	renderComponent() {
		$(this.el).html(Handlebars.templates["PanelError"](this.data));
	}
}

export default PanelError;
