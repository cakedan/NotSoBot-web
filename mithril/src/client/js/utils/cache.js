class Cache extends Map
{
	constructor(lasts=0)
	{
		super();

		this.lasts = lasts;
	}

	delete(id)
	{
		if (!this.has(id)) {return;}

		const item = super.get(id);
		if (item.expire) {clearTimeout(item.expire);}
		return super.delete(id);
	}

	get(id)
    {
		return (super.has(id)) ? super.get(id).value : null;
    }

    set(id, value, lasts)
    {
		if (lasts === undefined) {lasts = this.lasts;}

		super.set(id, {
            value,
            expire: (lasts) ? setTimeout(() => {
				this.delete(id);
			}, lasts * 1000) : null
		});
    }
}

module.exports = Cache;