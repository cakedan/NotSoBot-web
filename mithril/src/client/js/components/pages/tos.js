const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/tos',
			class: 'tos'
		});
	}

	init()
	{
		return new Promise((resolve, reject) => {
			if (this.app.cache.has('tos')) {
				resolve(this.app.cache.get('tos'));
			} else {
				m.request({
					method: 'get',
					url: '/api/tos'
				}).then((tos) => {
					this.app.cache.set('tos', tos);
					resolve(tos);
				}).catch(reject);
			}
		}).catch(console.error);
	}

	view()
	{
		const terms = this.app.cache.get('tos');


		const sections = terms.sections.map((section) => {
			const text = section.text.map((text) => {
				if (typeof text === 'string') {
					return m('span', text);
				} else {
					return m('ul', text.map((t) => m('li', t)));
				}
			});

			return m('div', {class: 'section'}, [
				m('h2', {class: 'title'}, section.title),
				text
			]);
		});

		return [
			m('h1', terms.title),
			m('span', {class: 'inner'}, terms.footer),
			m('div', {class: 'sections'}, sections)
		];
	}
}

module.exports = CustomPage;