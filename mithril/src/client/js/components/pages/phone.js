const m = require('mithril');

const Page = require('../page');
const Utils = require('../../utils');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/phone',
			class: 'phone'
		});

		this.path = '/phone';
	}

	view(vnode)
	{
		return m('div', {class: 'head text-center'}, [
			m('div', {class: 'btn-group'}, [
				m('a', {href: '/phone/rates', class: 'btn', oncreate: m.route.link, onupdate: m.route.link}, 'Rates'),
				m('a', {href: '/phone/commands', class: 'btn', oncreate: m.route.link, onupdate: m.route.link}, 'Commands')
			])
		]);
	}
}

module.exports = CustomPage;