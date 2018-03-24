const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/auth/login'
		});
	}

	onmatch(args, requestedPath)
	{
		return new Promise((resolve, reject) => {
			if (this.app.authed) {
				reject('/panel');
			} else {
				if (this.app.pagedelay) {
					setTimeout(() => {
						resolve(this);
					}, this.app.pagedelay);
				} else {
					resolve(this);
				}
			}
		}).catch((path) => {
			return m.route.set(path);
		})
	}

	view()
	{
		return [m('p', m.route.get())];
	}
}

module.exports = CustomPage;