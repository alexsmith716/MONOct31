var ktpaId;
var _JSESSIONID;
var _ktpaCookieID;
var ktpaEmail;
var KL = {
	init: function() {
		LE.init(LEKey);
		KL.getCookiesInfo();
		if (_ktpaCookieID == undefined) {
			ktpaId = _JSESSIONID + Math.floor(Math.random() * 10000000000);
			KL.setCookies("_KTPAID", ktpaId);
		} else {
			ktpaId = _ktpaCookieID;
		}
		KL.info("pageLoad", ktpaId);


	},

	info: function(event, msg) {
		LE.info({
			"id": ktpaId,
			"event": event,
			"email": ktpaEmail,
			"page": location.pathname.split('/').pop(),
			"message": msg
		});
	},

	error: function(event, msg) {
		LE.error({
			"id": ktpaId,
			"event": event,
			"email": ktpaEmail,
			"page": location.pathname.split('/').pop(),
			"message": msg
		});
	},

	debug: function(event, msg) {
		LE.debug({
			"id": ktpaId,
			"event": event,
			"email": ktpaEmail,
			"page": location.pathname.split('/').pop(),
			"message": msg
		});
	},

	warn: function(event, msg) {
		LE.warn({
			"id": ktpaId,
			"event": event,
			"email": ktpaEmail,
			"page": location.pathname.split('/').pop(),
			"message": msg
		});
	},

	//Get all the cookies info
	getCookiesInfo: function() {
		var allcookies = document.cookie;
		// Get all the cookies pairs in an array
		cookiearray = allcookies.split(';');

		// Now take key value pair out of this array
		for (var i = 0; i < cookiearray.length; i++) {
			name = cookiearray[i].split('=')[0];
			value = cookiearray[i].split('=')[1];
			//get cookie name '_KTPA'
			if (name.trim() === "_KTPA") {
				ktpaEmail = value.split('||')[0];
			}
			//get cookie name '_KTPAID'
			if (name.trim() === "_KTPAID") {
				_ktpaCookieID = value;
			}
			//get cookie name 'JSESSIONID'
			if (name.trim() === "JSESSIONID") {
				_JSESSIONID = value;
			}
		}
	},

	//Drop cookies with name and value with 1 day expire date
	setCookies: function(cname, cvalue) {
		var d = new Date();
		d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}
};