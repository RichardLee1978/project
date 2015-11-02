/**
 * Created by lirui on 15/10/27.
 */
var User = require('../models/user');
var woolaSms = require('../models/woolaSms');
var max = 3600000 * 24 * 31;
exports.ShowPhonePage = function (req, res, next) {
	var code = req.query.code;
	var activitiesID = req.query.id;
	//var openid = req.cookies.openid;
	if (code && activitiesID) {
		User.GetInfoByCode(code, function (user) {
			//用户已关注
			if (user.wechat.subscribe == 1) {
				//用户未绑定手机号
				if (!user.info.id) {
					res.cookie('openid', user.wechat.openid, {
						maxAge: max,
						httpOnly: true,
						express: new Date(Date.now + max)
					});
					res.render('pages/activities/phone.hbs');
				}
				//用户已绑定手机号
				else {
					res.cookie('openid', user.wechat.openid, {
						maxAge: max,
						httpOnly: true,
						express: new Date(Date.now + max)
					});
					res.redirect('/activities/apply/'+'?id=' + activitiesID);
				}
			}
			//用户未关注
			else {
				//跳转至页面
			}

		});
	}
	else {
		res.status(404).send("<h1 style=\"text-align: center\"> Missing parameter code!</h1>");
	}
}
//用户手机号提交
exports.GetPhone = function (req, res, next) {
	var activitiesID = req.body.id,phone = req.body.phone;
	if(phone && activitiesID && req.body.vcode && req.session.vcode == req.body.vcode){
		User.GetInfoByPhone(phone,activitiesID ,function(status){
			if(status==true){
				res.redirect('/login?phone='+phone+'&id='+activitiesID);
			}
			else{
				//res.redirect('pages/activities/phone.hbs');
				woolaSms.GetSms(phone,function(sms){

				})
			}
		});
	}
	else{
		res.status(404).send("<h1 style=\"text-align: center\"> Missing parameter phone or id!</h1>");
	}
}