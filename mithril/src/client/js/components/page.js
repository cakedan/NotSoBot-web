const m = require('mithril');

class Page
{
	constructor(app, options)
	{
		this.app = app;

		options = options || {};

		this.auth = options.auth || false;
		this.class = ['page', options.class || null].filter((v)=>v).join(' ');

		this.path = options.path;

		if (this.path in this.app.pages) {
			throw new Error(`Path already taken: ${this.path}`);
		}
	}

	onmatch(args, requestedPath)
	{
		return Promise.resolve().then(() => {
			if (!this.auth || this.app.authed) {
				return this.init && this.init(args, requestedPath);
			}

			if (localStorage.token) {localStorage.removeItem('token');}

			return Promise.reject('/auth/login');
		}).then(() => {
			return new Promise((resolve) => {
				if (this.app.pagedelay) {
					setTimeout(() => {
						resolve(this);
					}, this.app.pagedelay);
				} else {
					resolve(this);
				}
			});
		}).catch((path) => {
			return m.route.set(path);
		});
	}

	render(vnode)
	{
		return [m(this.app.navbar), m('div', {class: this.class}, vnode)];
	}
}

module.exports = Page;