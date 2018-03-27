module.exports = {
	OWNER: 1 << 1,
	SUPERADMIN: 1 << 2,
	ADMIN: 1 << 3,
	SPOOF_NUMBER_MOD: 1 << 4,
	SPOOF_NUMBER: 1 << 5,

	BOT_ADMIN: 1 << 10,
	BOT_WEBHOOK: 1 << 11,

	check: function(permission, perm) {
		perm = this[perm];
		return ((permission & perm) == perm);
	},
	checkSome: function(permission, perms) {
		return perms.some((perm) => this.check(permission, perm));
	}
};