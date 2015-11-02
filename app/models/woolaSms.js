/**
 * Created by lirui on 15/10/26.
 */
var request = require('request');
var ioredis = require('ioredis');
var woolaAuth = require('./woolaAuth');
var woolaDecrypt = require('./woolaDecrypt');
var common = require('./common');
		common.TestEnvConfig();
var client = new ioredis({
	port:parseInt(process.env.REDISPORT,10),
	host:process.env.REDISHOST,
	db:parseInt(process.env.REDISDB,10)
});
function woolaSms(){}
//根据手机号获取短信
woolaSms.prototype.GetSms = function(phone,func){
	woolaAuth._GetClientToken(function(Token){
		request.post(
			process.env.APIHOST + 'v1/verification/wechat',
			{
				'auth':{
					'bearer':Token.access_token
				},
				'form':{
					'phone':phone
				}
			},
			function(err , res , body){
				woolaDecrypt.Decrypt(body.code,function(sms){
					func(sms);
				});
			}
		)
	});
}
module.exports = new woolaSms();