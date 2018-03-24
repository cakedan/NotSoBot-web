const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/commands',
			class: 'commands'
		});
	}

	init()
	{
		return new Promise((resolve, reject) => {
			if (this.app.cache.has('notsobot.commands')) {
				resolve();
			} else {
				fetch('https://api.github.com/gists/2d9efaadf18b288b84be05f2af0c1fd2', {
					method: 'get'
				}).then((r) => r.json()).then((data) => {
					return fetch('https://gistfy.facepunch.org/github/gist/2d9efaadf18b288b84be05f2af0c1fd2?lang=lua&style=monokai_sublime&type=html', {
						method: 'post',
						headers: {'content-type': 'application/json'},
						body: JSON.stringify(data)
					});
				}).then((r) => r.text()).then((body) => {
					this.app.cache.set('notsobot.commands', body);
					console.log('done');
				}).then(resolve).catch(reject);
			}
		});
	}

	view()
	{
		return m.trust(this.app.cache.get('notsobot.commands'));
	}
}

module.exports = CustomPage;