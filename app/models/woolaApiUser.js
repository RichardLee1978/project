/**
 * Created by lirui on 15/10/26.
 */
var request = require('request');
var ioredis = require('ioredis');
var wechat = require('./wechat');
var woolaAuth = require('./woolaAuth');
var common = require('./common');
		common.TestEnvConfig();
var client = new ioredis({
	port:parseInt(process.env.REDISPORT,10),
	host:process.env.REDISHOST,
	db:parseInt(process.env.REDISDB,10)
});
function woolaApiUser(){}
/*
* @param id[string] : 微信用户的unionId
* @param activeNo[string] :活动id
* @param func[function] : 回调函数
* @return json
* */
woolaApiUser.prototype.GetUserById = function(id , activeNo , func){
	woolaAuth._GetClientToken(function(Token){
		request.get(
			process.env.APIHOST + 'backend/wechat/user?activityNo=' + activeNo +'&unionId=' + id,
			{
				'auth':{
					'bearer':Token.access_token
				}
			},
			function(err , res , body){
				if(err){
					console.log(err);
				}
				func(JSON.parse(body));
			}

		);
	});
}
/*
 * @param phone[string] : 微信用户的手机号码
 * @param activeNo[string] :活动id
 * @param func[function] : 回调函数
 * @return json
 * */
woolaApiUser.prototype.GetUserByPhone = function(phone , activeNo , func){
	woolaAuth._GetClientToken(function(Token){
		request.get(
			process.env.APIHOST + 'backend/wechat/user?activityNo=' + activeNo +'&phone=' + phone,
			{
				'auth':{
					'bearer':Token.access_token
				}
			},
			function(err , res , body){
				if(err){
					console.log(err);
				}
				func(JSON.parse(body));
			}

		);
	});
}
/*
 * @param form[object] : 新用户提交的表单
 * @param func[function] : 回调函数
 * @return json
 * */
woolaApiUser.prototype.RegisterUser = function(form,func){
	woolaAuth._GetClientToken(function(Token){
		request.post(
			process.env.APIHOST + 'backend/wechat/user',
			{
				'auth':{
					'bearer':Token.access_token
				},
				'form':form
			},
			function(err , res , body){
				if(err){
					console.log(err);
				}
				func(body);
			}
		);
	});
}
module.exports = new woolaApiUser();