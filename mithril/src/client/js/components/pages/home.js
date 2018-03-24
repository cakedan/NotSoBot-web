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
			m('img', {src: '/assets/img/logo.png', style: 'height: 128px; width: 128px;'}),
			m('h1', 'oof'),
			m('span', {class: 'small-text'}, 'coolest bot on discord'),
			m('div', {class: 'btn-group'}, [
				m('a', {href: '/invite', class: 'btn'}, 'Invite'),
				m('a', {href: '/discord', class: 'btn'}, 'Discord')
			])
		]);
	}
}

module.exports = CustomPage;