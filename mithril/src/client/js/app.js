const m = require('mithril');

const Components = {
	Navbar: require('./components/navbar'),
	Pages: require('./components/pages')
};

const Utils = require('./utils');

class App
{
	constructor(prefix)
	{
		m.route.prefix(prefix || '');

		this.pagedelay = 100;
		this.cache = new Utils.Cache(3600);

		this.navbar = new Components.Navbar(this);
		this.pages = {}
		Components.Pages.forEach((Page) => {
			const page = new Page(this);
			this.pages[page.path] = {
				onmatch: page.onmatch.bind(page),
				render: page.render.bind(page)
			};
		});

		console.log(this.pages);
	}

	get authed()
	{
		return false;
	}

	start()
	{
		m.route(document.getElementById('app'), '/error/404', this.pages);
	}
}

(() => {
	const app = new App();
	app.start();
})();