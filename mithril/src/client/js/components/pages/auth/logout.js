const m = require('mithril');

const Page = require('../../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/auth/logout',
			auth: true
		});
	}

	init()
	{
		return Promise.resolve().then(() => {
			return this.app.rest.request({
				method: 'get',
				url: '/api/auth/logout',
				useAuth: true
			});
		}).catch(console.error).finally(() => {
			if (localStorage.token) {
				localStorage.removeItem('token');
			}
			this.app.rest.setToken(null);
			this.app.cache.delete('users.me');
			return Promise.reject('/');
		})
	}

	view()
	{
		return [m('p', m.route.get())];
	}
}

module.exports = CustomPage;