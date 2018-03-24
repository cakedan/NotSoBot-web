const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/auth/logout'
		});
	}

	view()
	{
		return [m('p', m.route.get())];
	}
}

module.exports = CustomPage;