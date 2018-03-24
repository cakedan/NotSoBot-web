const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/auth/callback'
		});
	}

	view()
	{
		return [m('p', m.route.get())];
	}
}

module.exports = CustomPage;