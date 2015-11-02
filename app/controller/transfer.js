/**
 * Created by lirui on 15/10/27.
 */
var common = require('../models/common');
		common.TestEnvConfig();
exports.ToWechat = function(req , res , next){
	var id = req.query.id;
	var REDIRECT_URI = encodeURIComponent(process.env.WECHATTRANSFER+'activities/phone?id='+id);
	//请求微信认证oauth,之后会重定向到REDIRECT_URI指定的页面，附上code参数
	res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?'
	+ 'appid='+ process.env.WECHATAPPID
	+ '&redirect_uri='+ REDIRECT_URI
	+ '&response_type=code'
	+ '&scope=snsapi_userinfo'
	+ '&state=STATE#wechat_redirect');
}