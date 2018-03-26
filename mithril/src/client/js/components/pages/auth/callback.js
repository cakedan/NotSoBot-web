const m = require('mithril');

const Page = require('../../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/auth/callback'
		});
	}

	init(args, requestedPath)
	{
		return new Promise((resolve, reject) => {
			const token = args.token;

			this.app.rest.request({
				method: 'post',
				url: '/api/auth/login',
				data: {token}
			}).then(resolve).catch(reject);
		}).then(({token}) => {
			localStorage.setItem('token', JSON.stringify(token));
			this.app.rest.setToken(token);
			return this.app.auth();
		}).then(() => {
			return Promise.reject('/panel');
		}, (e) => {
			return Promise.reject('/auth/login');
		});
	}

	view(){}
}

module.exports = CustomPage;