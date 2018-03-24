const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/panel',
			auth: true
		});
	}

	view()
	{
		return [m('p', m.route.get())];
	}
}

module.exports = CustomPage;