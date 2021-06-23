/**
 * An abstract component.
 */
class Component {

	/**
	 * Create a new component.
	 * Will also unbind any listeners from the core element.
	 * @param {object} options - Component details, such as element/data/children.
	 */
	constructor(options) {
		this.component = this;
		this.el = options.el ? options.el : null;
		this.data = options.data ? options.data : {};
		this.children = options.children ? options.children : {};
	}

	/**
	 * Render the component and all related children.
	 * Will also unbind any listeners from the core element.
	 */
	render() {
		this.component.clear(); // Clear listeners and general data
		this.component.renderComponent(); // Call the child render function
		Object.keys(this.children).forEach(function(key) {
			if (this.children[key] != null) {
				this.children[key].render();
			}
		}.bind(this));
		this.component.attachListeners(); // Call the child listener function
	}

	clear() {
		$(this.el).off(); // Unbind any existing events
		this.component.clearComponent(); // Call the child clear function
	}

	/**
	 * Render the component. This is override by inheriting classes.
	 */
	renderComponent() {
		// To be overriden by child component
	}

	/**
	 * Create component-specific listeners. This is to be override by inheriting classes.
	 */
	attachListeners() {
		// To be overriden by child component
	}

	/**
	 * Create component-specific listeners. This is to be override by inheriting classes.
	 */
	clearComponent() {
		// To be overriden by child component
	}
}

export default Component;
