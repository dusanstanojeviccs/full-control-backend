module.exports = {
	err: function(key, value) {
		return {
			"detail": value,
			"source": {
				"pointer":"data/attributes/"+key
			}
		}
	}
}