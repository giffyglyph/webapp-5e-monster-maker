/**
 * A route (used for routing hashed urls).
 */
class Route {

	/**
	 * Creates a new route entity.
	 * @param {object} options - Route details, such as route/navigation/components.
	 */
	constructor(options) {
		this.url = options.url ? options.url : null;
		this.navigation = options.navigation ? options.navigation : null;
		this.component = options.component ? options.component : null;
		this.breadcrumbs = options.breadcrumbs ? options.breadcrumbs : null;
		this.keys = [];
		this.regex = pathToRegexp(this.url, this.keys, false, false);

		/**
		 * Creates a regex pattern based on a route string.
		 * Original code: http://projects.jga.me/routie/.
		 * @param {string} path - The desired route path.
		 * @param {array} keys - An array to extend with any route-specific parameter keys.
		 * @param {boolean} sensitive - True if the search is case sensitive.
		 * @param {boolean} strict - True if the search is strict.
		 * @returns {regexp} - A regex pattern to match the route string.
		 */
		function pathToRegexp(path, keys, sensitive, strict) {
			if (path instanceof RegExp) {
				return path;
			}
			if (path == null) {
				return new RegExp('');
			}
			if (path instanceof Array) {
				path = '(' + path.join('|') + ')';
			}
			path = path
				.concat(strict ? '' : '/?')
				.replace(/\/\(/g, '(?:/')
				.replace(/\+/g, '__plus__')
				.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
					keys.push({ name: key, optional: !! optional });
					slash = slash || '';
					return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
				})
				.replace(/([\/.])/g, '\\$1')
				.replace(/__plus__/g, '(.+)')
				.replace(/\*/g, '(.*)');
			return new RegExp('^' + path + '$', sensitive ? '' : 'i');
		};
	}
}

export default Route;
