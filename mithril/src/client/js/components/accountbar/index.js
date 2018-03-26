const m = require('mithril');

class AccountBar
{
	constructor(app)
	{
		this.app = app;
	}

	avatar(connection)
	{
		if (connection.avatar_hash) {
			const filetype = (connection.avatar_hash.startsWith('a_')) ? 'gif' : 'png';
			return `https://cdn.discordapp.com/avatars/${connection.discord_id}/${connection.avatar_hash}.${filetype}`;
		} else {
			return `https://cdn.discordapp.com/embed/avatars/${connection.discriminator % 5}.png`;
		}
	}

	view()
	{
		if (!this.app.authed) {return;}

		const account = this.app.cache.get('users.me');
		const connection = account.connections[0].data;
		connection.discriminator = ('0000' + connection.discriminator).slice(-4);

		const avatar = this.avatar(connection);

		return m('div', {class: 'account-bar'}, [
			m('div', {class: 'info'}, [
				m('span', {class: 'avatar', style: `background-image: url('${avatar}');`}),
				m('div', {class: 'identifier'}, [
					m('span', {class: 'username'}, connection.username),
					m('span', {class: 'discriminator'}, `#${connection.discriminator}`)
				])
			]),
			m('div', {class: 'credits'}, [
				m('i'),
				m('span', account.credits.toLocaleString())
			]),
			m('span', {class: 'caret'})
		]);
	}
}

module.exports = AccountBar;