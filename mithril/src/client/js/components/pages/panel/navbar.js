const m = require('mithril');

const Utils = require('../../../utils');

console.log(Utils);

const name = 'Panel';
const nav = [
	{position: 'left', path: '/panel/products', name: 'Products'},
	{position: 'right', path: '/panel/users', name: 'Users', permissions: ['OWNER', 'SUPERADMIN']},
	{position: 'right', path: '/panel/calls', name: 'Calls'},
	{position: 'right', path: '/panel/purchases', name: 'Purchases'},
	{position: 'right', path: '/panel/logs', name: 'Logs'},
	{position: 'right', path: '/panel/settings', name: 'Settings'}
];

class Navbar
{
	constructor(app)
	{
		this.app = app;

		this.buttons = {
			left: [],
			right: []
		};

		nav.forEach((page) => {
			const buttons = this.buttons[page.position];

			let component;
			if (page.type === undefined || page.type === 'button') {
				component = {
					app: this.app,
					page,
					view() {
						const user = this.app.cache.get('users.me');

						if (this.page.permissions && !Utils.Permissions.checkSome(user.permissions, this.page.permissions)) {
							return;
						}
						const current = m.route.get();
		
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

						return m('a', attributes, [
							(page.icon) ? m('i', {class: `fa fa-${page.icon}`}) : null,
							page.name
						]);
					}
				};
			}

			buttons.push(component);
		});
	}

	view(vnode)
	{
		return m('nav', {
			class: 'navbar navbar-expand-lg navbar-expand-md navbar-dark navbar-custom'
		}, [
			m('a[href=/panel]', {oncreate: m.route.link, class:'navbar-brand'}, name),
			m('ul', {class: 'navbar-nav mr-auto d-none d-md-flex d-lg-flex'}, this.buttons.left.map((c) => m(c))),
			m('ul', {class: 'navbar-nav ml-auto d-none d-md-flex d-lg-flex'}, this.buttons.right.map((c) => m(c)))
		]);
	}
}

module.exports = Navbar;