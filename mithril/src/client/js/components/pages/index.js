const pages = [];

const forEachPage = (page) => {
	if (Array.isArray(page)) {
		page.forEach(forEachPage);
	} else {
		pages.push(page);
	}
};

forEachPage([
	require('./error'),
	require('./home'),
	require('./commands'),
	require('./phone'),
	require('./tos'),
	require('./panel'),
	require('./auth')
]);

module.exports = pages;