const m = require('mithril');

const Page = require('../../page');
const Utils = require('../../../utils');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/panel/products',
			class: 'panel',
			auth: true
		});

		this.company = Utils.Constants.StoreCompanies.SELLY;
		this.gateway = null;
		this.product = '@all';
		this.amount = '9.99';

		this.showProduct = false;

		this.subclass = 'panel-products'
		this.navbar = this.app.pages['/panel'].page.navbar;
	}

	changeAmount(event)
	{
		if (event.key.startsWith('Arrow')) {return true;}
		if (isNaN(parseInt(event.key)) && event.key !== 'Delete' && event.key !== 'Backspace') {return false;}

		const position = event.srcElement.selectionStart;
		let caretPosition = position;
		switch(event.key)
		{
			case 'Delete':
				this.amount = this.amount.slice(0, position) + this.amount.slice(position + 1);
				caretPosition = position + 1;
				break;
			case 'Backspace':
				this.amount = this.amount.slice(0, position - 1) + this.amount.slice(position);
				caretPosition = position - 1;
				break;
			default: this.amount += event.key;
		}
		this.amount = this.amount.replace('.', '');
		this.amount = this.amount.slice(0, this.amount.length - 2) + '.' + this.amount.slice(this.amount.length - 2);
		this.amount = parseFloat(this.amount).toFixed(2);

		//set caret position lol
		m.redraw();
	}
	
	changeShowProduct(showType, event)
	{
		if (!showType) {
			this.product = '@all';
		} else {
			this.product = null;
		}

		this.showProduct = showType;
	}

	changeGateway(gateway, event)
	{
		if (!Object.keys(Utils.Constants.StoreGateways).some((g) => gateway === g)) {return;}
		this.gateway = gateway;
	}

	changeProduct(pid, event)
	{
		this.product = pid;
	}

	purchase(event)
	{
		const company = Object.keys(Utils.Constants.StoreCompanies).find((key) => {
			return this.company === Utils.Constants.StoreCompanies[key];
		});

		return new Promise((resolve, reject) => {
			const data = {gateway: this.gateway};
			if (this.product === '@all') {
				data.amount = parseFloat(this.amount);
			}
			this.app.rest.request({
				method: 'post',
				url: `/api/store/${company}/products/${this.product}`,
				data,
				useAuth: true
			}).then(({url}) => {
				window.location.href = url;
			}).catch(reject);
		});
	}

	init()
	{
		return new Promise((resolve, reject) => {
			this.app.rest.request({
				method: 'get',
				url: '/api/store/@all/products',
				useAuth: true
			}).then((products) => {
				this.app.cache.set('store.products', products);
				resolve();
			}).catch(reject);
		});
	}

	view()
	{
		const ready = ((this.company !== undefined) && this.gateway && (this.product));
		const validAmount = (this.product !== '@all' || (2.49 <= this.amount && this.amount <= 50));

		const products = [];

		if (this.showProduct) {
			this.app.cache.get('store.products').sort((x, y) => x < y).map((product) => {
				return m('div', {
					class: ['product', (this.product === product.id) ? 'active' : null].filter((v) => v).join(' '),
					onclick: this.changeProduct.bind(this, product.id)
				}, [
					m('div', {class: 'credits'}, [
						m('span', {class: 'total'}, `${(product.credits + product.extra).toLocaleString()} credits`),
						(product.extra) ? m('span', {class: 'extra'}, `+${(product.extra).toLocaleString()} extra credits`) : null
					]),
					m('div', {class: 'price'}, [
						m('h2', `$${product.amount}`)
					])
				]);
			}).forEach((p) => products.push(p));
		} else {
			const fee = (this.gateway === 'PAYPAL') ? 0.30 : 0;

			products.push(m('div', {class: 'custom-product'}, [
				m('div', {
					class: ['amount', (!validAmount) ? 'error' : null].filter((v) => v).join(' ')
				}, [
					m('span', {class: 'icon'}, '$'),
					m('input', {
						style: `width: ${this.amount.length * 30}px;`,
						onkeydown: this.changeAmount.bind(this),
						value: this.amount
					})
				]),
				m('div', {class: 'info'}, [
					(fee) ? m('span', {class: 'fee'}, `Fee: +$${fee.toFixed(2)}`) : null,
					m('span', `Total: $${(parseFloat(this.amount) + fee).toFixed(2)}`),
					m('span', `Credits: ${(parseFloat(this.amount) * 1000).toLocaleString()}`)
				])
			]));
		}

		return [
			m(this.navbar),
			m('div', {class: this.subclass}, [
				m('div', {class: 'head'}, [
					m('h2', 'Purchase Credits!'),
					m('span', 'Minimum payment is $2.49.'),
					m('span', 'Maximum payment is $50.'),
					m('span', 'Bot is currently in Beta.')
				]),
				m('div', {class: 'gateways'}, Object.keys(Utils.Constants.StoreGateways).map((gateway) => {
					return m('span', {
						class: ['btn', 'gateway', (this.gateway === gateway) ? 'active' : null].filter((v) => v).join(' '),
						onclick: this.changeGateway.bind(this, gateway)
					}, [
						m('i', {class: gateway.toLowerCase().replace('_', '-')}),
						Utils.Constants.StoreGateways[gateway]
					]);
				})),
				/*m('div', {class: 'purchase-types'}, [
					m('button', {
						class: ['btn', (!this.showProduct) ? 'active' : null].filter((v) => v).join(' '),
						onclick: this.changeShowProduct.bind(this, false),
						type: 'button'
					}, 'Custom'),
					m('button', {
						class: ['btn', (this.showProduct) ? 'active' : null].filter((v) => v).join(' '),
						onclick: this.changeShowProduct.bind(this, true),
						type: 'button'
					}, 'Products')
				]),*/
				m('div', {class: 'products'}, products),
				m('button', {
					class: ['btn', 'purchase', (!ready || !validAmount) ? 'disabled' : null].filter((v) => v).join(' '),
					type: 'button',
					onclick: (ready) ? this.purchase.bind(this) : null
				}, 'Purchase')
			])
		];
	}
}

module.exports = CustomPage;