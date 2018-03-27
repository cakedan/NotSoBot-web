String.prototype.toTitleCase = function() {
	return this.split(' ').map((word) => {
		return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
	}).join(' ');
};

module.exports = {
	Cache: require('./cache'),
	Constants: require('./constants'),
	Permissions: require('./permissions'),
	Tools: require('./tools')
};