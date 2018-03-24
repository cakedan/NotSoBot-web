const m = require('mithril');

const nav = [
	{position: 'left', path: '/commands', name: 'Commands'},
	//{position: 'left', path: '/phone', name: 'Phone', icon: 'phone'},
	//{position: 'left', path: '/tos', name: 'Terms of Service', icon: 'check-circle'},
	{position: 'left', path: '/invite', name: 'Invite', link: true},
	{position: 'left', path: '/discord', name: 'Discord', link: true},
	//{position: 'right', path: '/panel', name: 'Panel', authed: true},
	//{position: 'right', path: '/auth/login', name: 'Login', authed: false},
	//{position: 'right', path: '/auth/logout', name: 'Logout', authed: true}
];

class Navbar
{
	constructor(app)
	{
		this.app = app;
	}

	view(vnode)
	{
		const current = m.route.get();

		const buttons = {
			left: [],
			right: []
		};

		nav.forEach((page) => {
			if (page.authed !== undefined) {
				if (page.authed && !this.app.authed) {return;}
				if (!page.authed && this.app.authed) {return;}
			}

			const attributes = {
				href: page.path,
				class: ['nav-link', (current.startsWith(page.path)) ? 'active' : null]
			};

			if (!page.link) {
				Object.assign(attributes, {
					oncreate: m.route.link,
					onupdate: m.route.link
				});
			} else {
				attributes.class.push('link');
			}

			attributes.class = attributes.class.filter((v)=>v).join(' ');

			const body = [page.name];
			if (page.icon) {body.unshift(m('i', {class: `fa fa-${page.icon}`}));}
			buttons[page.position].push(m('a', attributes, body));
		});

		return m('nav', {
			class: 'navbar navbar-expand-lg navbar-expand-md navbar-dark'
		}, [
			m('a[href=/]', {oncreate: m.route.link, class:'navbar-brand'}, 'NotSoBot'),
			m('ul', {class: 'navbar-nav navbar-right d-none d-md-flex d-lg-flex'}, buttons.left),
			m('ul', {class: 'navbar-nav ml-auto d-none d-md-flex d-lg-flex'}, buttons.right)
		]);
	}
}

module.exports = Navbar;