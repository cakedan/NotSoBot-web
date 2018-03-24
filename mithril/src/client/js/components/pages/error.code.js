const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/error/:code:'
		});
	}

	view()
	{
		return [m('p', m.route.get()), m('p', m.route.param('code'))];
	}
}

module.exports = CustomPage;