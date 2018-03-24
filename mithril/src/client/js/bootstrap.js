//lol this adds 38kb, no dropdown for me :D

const Dependencies = {
	jQuery: require('jquery'),
	Popper: require('popper.js')
};

Object.assign(window, {
	'jQuery': Dependencies.jQuery,
	'$': Dependencies.jQuery,
	'Popper': Dependencies.Popper
});

Dependencies.Bootstrap = {
	util: require('bootstrap/js/dist/util'),
	dropdown: require('bootstrap/js/dist/dropdown')
};

module.exports = Dependencies;