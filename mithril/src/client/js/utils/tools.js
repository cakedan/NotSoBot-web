module.exports = {
	number: {
		format: function(number) {
			return (number || '').toLowerCase()
				.replace(/[a-c]/g, '2')
				.replace(/[d-f]/g, '3')
				.replace(/[g-i]/g, '4')
				.replace(/[j-l]/g, '5')
				.replace(/[m-o]/g, '6')
				.replace(/[p-s]/g, '7')
				.replace(/[t-v]/g, '8')
				.replace(/[w-z]/g, '9')
				.replace(/[^0-9+]/g, '');
		}
	}
};