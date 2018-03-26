const m = require('mithril');

const Page = require('../../page');
const Utils = require('../../../utils');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/phone/rates',
			class: 'phone-rates'
		});

		this.company = Utils.Constants.PhoneCompanies.TWILIO;

		this.lookup = {
			unformattedNumber: null,
			number: null,
			info: null
		};
	}

	changeCompany(company, event)
	{
		this.company = company;
	}

	changeLookup(event)
	{
		this.lookup.unformattedNumber = event.srcElement.value;

		if (event.type === 'keyup' && event.key === 'Enter') {
			this.getLookup(event);
		} else {
			this.lookup.number = Utils.Tools.number.format(this.lookup.unformattedNumber) || null;
		}
	}

	getLookup(event, redraw=true)
	{
		if (!this.lookup.number) {
			this.lookup.data = null;
			return;
		}

		if (this.lookup.data && this.lookup.data.from === this.lookup.number) {
			return;
		}

		return new Promise((resolve, reject) => {
			const key = `lookup.rates.${this.lookup.number}`; //maybe make it so different numbers but are similar will use the same thing

			if (this.app.cache.has(key)) {
				resolve(this.app.cache.get(key));
			} else {
				this.app.rest.request({
					method: 'get',
					url: `/api/phone/rates/${this.lookup.number}`
				}).then((lookup) => {
					this.app.cache.set(key, lookup);
					resolve(lookup);
				}).catch(reject);
			}
		}).then((lookup) => {
			lookup.from = this.lookup.number;
			this.lookup.data = lookup;
			if (redraw) {
				m.redraw();
			}
		}).catch(console.error);
	}

	init(args, requestedPath)
	{
		return new Promise((resolve, reject) => {
			if (this.app.cache.has('countries')) {
				resolve(this.app.cache.get('countries'));
			} else {
				this.app.rest.request({
					method: 'get',
					url: '/api/phone/countries'
				}).then((countries) => {
					this.app.cache.set('countries', countries);
					resolve(countries);
				}).catch(reject);
			}
		}).then((countries) => {
			if (this.app.cache.has('rates')) {
				return Promise.resolve();
			} else {
				return this.app.rest.request({
					method: 'get',
					url: '/api/phone/rates'
				}).then((rates) => {
					rates.forEach((rate) => {
						rate.country = (countries.find((c) => c.code === rate.code) || {}).name;
					});
					this.app.cache.set('rates', rates);
				});
			}
		}).then(() => {
			this.lookup.unformattedNumber = args.number || '';
			this.lookup.number = Utils.Tools.number.format(this.lookup.unformattedNumber) || null;
			if (!this.lookup.number) {
				return Promise.resolve();
			} else {
				return this.getLookup({}, false);
			}
		}).catch(console.error);
	}

	view(vnode)
	{
		const head = [
			m('h1', 'Rates'),
			m('p', '$1 = 1000 credits, Prices are shown as credits per minute.'),
			m('p', 'US and CA numbers will default to twilio prices, any others will use nexmo prices.'),
			m('p', 'Spoofing will use twilio prices with an additional 20 credits per minute.'),
			m('div', {class: 'btn-group', role: 'group'}, Object.keys(Utils.Constants.PhoneCompanies).map((key) => {
				const company = Utils.Constants.PhoneCompanies[key];
				return m('button', {
					type: 'button',
					class: ['btn', (this.company === company) ? 'active' : null].filter((v)=>v).join(' '),
					onclick: this.changeCompany.bind(this, company)
				}, key.toTitleCase());
			})),
			m('div', {class: 'input-group'}, [
				m('input', {
					class: 'form-control search-bar',
					type: 'search',
					placeholder: '+1 (541) 754-3010',
					input: this.changeLookup.bind(this),
					onkeyup: this.changeLookup.bind(this),
					onpaste: this.changeLookup.bind(this),
					value: this.lookup.unformattedNumber
				}),
				m('div', {class: 'input-group-append'}, [
					m('button', {class: 'btn', onclick: this.getLookup.bind(this)}, 'Lookup')
				])
			])
		];


		if (this.lookup.data) {
			const number = [];
			const rates = [];

			if (!this.lookup.data.valid || this.lookup.data.blacklisted) {
				if (this.lookup.data.blacklisted) {
					const code = this.lookup.data.info.country_code;

					number.push(m('span', {class: `flag64 flag-${code.toLowerCase()}`})),
					number.push(m('h2', {class: 'info'}, [
						m('div', {class: 'head'}, this.lookup.data.info.national_format),
						m('div', {class: 'country'}, ((this.app.cache.get('countries') || []).find((c) => c.code === code) || {}).name),
						m('div', {class: 'country-code'}, code)
					]));
				} else {
					number.push(m('h2', {class: 'info'}, [
						m('div', {class: 'head'}, this.lookup.data.from)
					]));
				}

				rates.push(m('span', (this.lookup.data.blacklisted) ? 'Blacklisted Number' : 'Invalid Number'));
			} else {
				const code = this.lookup.data.info.country_code;

				number.push(m('span', {class: `flag64 flag-${code.toLowerCase()}`})),
				number.push(m('div', {class: 'info'}, [
					m('span', {class: 'head'}, this.lookup.data.info.national_format),
					m('span', {class: 'country'}, ((this.app.cache.get('countries') || []).find((c) => c.code === code) || {}).name),
					m('span', {class: 'country-code'}, code)
				]));

				this.lookup.data.prices.forEach((rate) => {
					const company = Object.keys(Utils.Constants.PhoneCompanies).find((key) => {
						return Utils.Constants.PhoneCompanies[key] === rate.company;
					}) || '';
					rates.push(m('span', `${company.toTitleCase()} price: ${rate.price_call_outgoing.toLocaleString()} credits per minute`));
				});

				const spoof = this.lookup.data.prices.find((rate) => rate.company === Utils.Constants.PhoneCompanies.TWILIO);
				if (spoof) {
					rates.push(m('span', `Spoof price: ${(spoof.price_call_outgoing + 20).toLocaleString()} credits per minute`));
				}
			}

			head.push(m('div', {class: 'number-lookup'}, [
				m('div', {class: 'number'}, number),
				m('div', {class: 'rates'}, rates)
			]));
		}

		let rates = this.app.cache.get('rates').filter((rate) => {
			return rate.company === this.company && rate.price_call_outgoing;
		}).sort((x, y) => {
			return x.country.localeCompare(y.country);
		});

		rates.forEach((rate, i) => {
			if (!['US', 'CA', 'GB'].includes(rate.code)) {return;}
			rates.unshift(rates.splice(i, 1) && rate);
		});

		rates = rates.map((rate) => {
			return m('div', {class: 'rate'}, [
				m('span', {class: `flag64 flag-${rate.code.toLowerCase()}`}),
				m('div', {class: 'info'}, [
					m('span', {class: 'head'}, `+${rate.prefix} (${rate.code})`),
					m('span', {class: 'country'}, rate.country)
				]),
				m('div', {class: 'price'}, `${rate.price_call_outgoing.toLocaleString()} credits per minute`)
			]);
		});

		return [
			m('div', {class: 'head text-center'}, head),
			m('div', {class: 'rates'}, rates)
		];
	}
}

module.exports = CustomPage;