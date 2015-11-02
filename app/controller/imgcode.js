/**
 * Created by lirui on 15/10/26.
 */
var captchapng = require('captchapng');
exports._captchpng = function (req, res, next) {
	var nums = parseInt(Math.random() * 9000 + 10000);
	var p = new captchapng(80, 40, nums); // width,height,numeric captcha
	p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
	p.color(132, 132, 132, 255); // Second color: paint (red, green, blue, alpha)
	var img = p.getBase64();
	var imgbase64 = new Buffer(img, 'base64');

	req.session.cookie.expires = new Date(Date.now() + 60000);
	req.session.cookie.maxAge = 60000;
	req.session.vcode = nums;
	req.session.save();
	res.set('Content-Type', 'image/png');
	res.send(imgbase64);
}
