/**
 * Created by lirui on 15/10/27.
 */
var wechat = require('./wechat');
var woolaApiUser = require('./woolaApiUser');
//models -> phone
function User() {
}
User.prototype.GetInfoByCode = function (code, activitiesID, func) {
	wechat.SetAndCallUserInfo(code, function (wechatuser) {
		var id = wechatuser.unionId;
		woolaApiUser.GetUserById(id, activitiesID, function (userinfo) {
			func({
				wechat: wechatuser,
				info: userinfo
			})
		})
	});
}
User.prototype.GetInfoByPhone = function (phone ,activitiesID,func ) {
	woolaApiUser.GetUserByPhone(phone,activitiesID,function(userinfo){
		if(userinfo.user.id){
			func({status:true});
		}
		else{
			func({status:false});
		}
	});
}
module.exports = new User();
