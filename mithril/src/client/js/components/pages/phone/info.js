const m = require('mithril');

const Page = require('../../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/phone/info',
			class: 'phone-info'
		});
	}

	view()
	{
		return m('div', {class: 'head text-center'}, [
			m('span', 'some information here')
		]);
	}
}

module.exports = CustomPage;