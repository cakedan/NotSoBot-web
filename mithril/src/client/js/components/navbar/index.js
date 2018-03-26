'use strict';

const m = require('mithril');

const Dropdown = require('./dropdown');

const name = 'NotSoBot';
const nav = [
	{position: 'left', path: '/commands', name: 'Commands'},
	{position: 'left', type: 'dropdown', name: 'Phone', icon: 'phone', paths: [
		{path: '/phone/rates', name: 'Rates'},
		{path: '/phone/commands', name: 'Commands'}
	]},
	{position: 'left', path: '/tos', name: 'Terms of Service', icon: 'check-circle'},
	{position: 'left', path: '/invite', name: 'Invite', link: true},
	{position: 'left', path: '/discord', name: 'Discord', link: true},
	{position: 'right', path: '/panel', name: 'Panel', authed: true},
	{position: 'right', path: '/auth/login', name: 'Login', authed: false},
	{position: 'right', path: '/auth/logout', name: 'Logout', authed: true}
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
					view() {
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
			} else if (page.type === 'dropdown') {
				component = new Dropdown(page.name, page.paths);
			}

			buttons.push({
				app: this.app,
				authRequired: page.authed,
				component,
				view() {
					if (this.authRequired !== undefined) {
						if (this.authRequired && !this.app.authed) {return;}
						if (!this.authRequired && this.app.authed) {return;}
					}
					return m(this.component);
				}
			});
		});
	}

	view(vnode)
	{
		return m('nav', {
			class: 'navbar navbar-expand-lg navbar-expand-md navbar-dark'
		}, [
			m('a[href=/]', {oncreate: m.route.link, class:'navbar-brand'}, [
				m('img', {src: '/assets/img/logo.png', width: '30', height: '30', alt: 'cool bot logo'}),
				name
			]),
			m('ul', {class: 'navbar-nav mr-auto d-none d-md-flex d-lg-flex'}, this.buttons.left.map((c) => m(c))),
			m('ul', {class: 'navbar-nav ml-auto d-none d-md-flex d-lg-flex'}, this.buttons.right.map((c) => m(c)))
		]);
	}
}

module.exports = Navbar;