const m = require('mithril');

const Page = require('../../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/panel/logs',
			class: 'panel panel-logs',
			auth: true
		});

		this.navbar = this.app.pages['/panel'].page.navbar;
	}

	view()
	{
		return [
			m(this.navbar)
		];
	}
}

module.exports = CustomPage;