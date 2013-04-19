exports.getFields = function (fields) {
	if (!fields) {
		var fields = { __v: 0 }
		return fields;	
	} else {
		var s = fields.split(','),
			fields = {}; //default 
		for (var i = 0; i < s.length; i++) {
			var key = s[i];
			fields[key] = 1;
		}
		return fields;
	}
}

exports.getPagination = function (offset, limit) {
	var obj = {};
	obj.skip = offset || 0;
	obj.limit = limit || 20;
	return obj;
}