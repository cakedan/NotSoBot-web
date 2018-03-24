const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/',
			class: 'home'
		});
	}

	view()
	{
		return m('div', {class: 'head text-center'}, [
			m('img', {src: '/assets/img/logo.png'}),
			m('h1', 'Make phone calls on Discord!'),
			m('span', {class: 'small-text'}, 'NotSoFoundation?'),
			m('div', {class: 'btn-group'}, [
				m('a', {href: '/invite', class: 'btn'}, 'Invite'),
				m('a', {href: '/discord', class: 'btn'}, 'Discord')
			])
		]);
	}
}

module.exports = CustomPage;