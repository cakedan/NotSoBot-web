const m = require('mithril');

const Page = require('../../page');
const Navbar = require('./navbar');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/panel',
			class: 'panel',
			auth: true
		});

		this.navbar = new Navbar(this.app);
	}

	view()
	{
		return [
			m(this.navbar),
			m('div', {class: 'head text-center'}, [
				m('span', 'some stat stuff here')
			])
		];
	}
}

module.exports = CustomPage;