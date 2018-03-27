const m = require('mithril');

const Page = require('../../page');
const Navbar = require('./navbar');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/panel/calls',
			class: 'panel',
			auth: true
		});
		
		this.navbar = this.app.pages['/panel'].page.navbar;
	}

	view()
	{
		return [
			m(this.navbar),
			m('div', {class: 'head text-center'}, [
				m('span', 'some calls here')
			])
		];
	}
}

module.exports = CustomPage;