const m = require('mithril');

const Page = require('../../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/phone/commands',
			class: 'phone-commands'
		});
	}

	init()
	{
		return new Promise((resolve, reject) => {
			if (this.app.cache.has('commands')) {
				resolve(this.app.cache.get('commands'));
			} else {
				m.request({
					method: 'get',
					url: '/api/bot/discord/commands'
				}).then((commands) => {
					this.app.cache.set('commands', commands);
					resolve(commands);
				}).catch(reject);
			}
		}).catch(console.error);
	}

	view()
	{
		const commands = this.app.cache.get('commands');

		return [
			m('div', commands.prefixes.map((prefix) => m('span', prefix))),
			m('div', commands.commands.map((command) => m('span', JSON.stringify(command))))
		];
	}
}

module.exports = CustomPage;