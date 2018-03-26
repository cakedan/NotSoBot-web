const m = require('mithril');

const Page = require('../../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/auth/login',
			class: 'auth-login'
		});
	}

	view()
	{
		return m('div', {class: 'head'}, [
			m('a', {href: '/api/bot/discord/oauth2', class: 'btn'}, [
				m('span', {class: 'logo discord'})
			])
		]);
	}
}

module.exports = CustomPage;