/**
 * Created by lirui on 15/10/27.
 */
exports.ShowSmsPage = function (req, res, next) {
	var phone = req.query.phone;
	res.render('pages/activities/sms.hbs');
}

//用户提交短信验证码
exports.GetSms = function (req, res, next) {
	var phone = req.query.phone;
}