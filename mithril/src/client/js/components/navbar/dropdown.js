'use strict';

const m = require('mithril');

class Dropdown
{
	constructor(name, children)
	{
		this.name = name;
		this.children = children || [];

		this.show = false;
	}

	onclick()
	{
		this.show = !this.show;
	}

	view()
	{
		const current = m.route.get();

		const classes = ['nav-link', 'dropdown-toggle'];
		const items = this.children.map((child) => {
			if (current.startsWith(child.path)) {classes.push('active');}

			return m('a', {
				href: child.path,
				oncreate: m.route.link,
				onupdate: m.route.link,
				class: 'dropdown-item'
			}, child.name);
		});

		return m('li', {class: 'nav-item dropdown'}, [
			m('span', {
				class: classes.join(' '),
				onclick: this.onclick.bind(this)
			}, this.name),
			m('div', {
				class: ['dropdown-menu', (this.show) ? 'show' : null].filter((v) => v).join(' ')
			}, items)
		]);
	}
}

module.exports = Dropdown;