/**
 * Created by lirui on 15/10/26.
 */
var request = require('request');
var ioredis = require('ioredis');
var common = require('./common');
		common.TestEnvConfig();
var client = new ioredis({
	port:parseInt(process.env.REDISPORT,10),
	host:process.env.REDISHOST,
	db:parseInt(process.env.REDISDB,10)
});
function woolaAuth(){}
//公开获取ClientToken方法,直接调用
woolaAuth.prototype._GetClientToken = function(func){
	var _this = this;
	client.pipeline()
		.get('ClientSecret')
		.exec(function(err , reply){
			if(reply[0][1]==null){
				var param = {
					"type": "wechat",
					"deviceName": "woola backend website",
					"deviceIdentify": "570FF0A0-AB85-11E4-8BCE-97D5206B21E8",
					"version": "0.1",
					"redirectURI": "http://letsdo.sports",
					"deviceVersion": "homewebsite",
					"deviceOsVersion": "1.0"
				}
				request.post(
					process.env.APIHOST + 'oauth/client',
					{ form: param },
					function(err,res,secret) {
						client.set('ClientSecret',secret);
						_this.GetClientToken(JSON.parse(secret),func);
					}
				);
			}
			else{
				_this.GetClientToken(JSON.parse(reply[0][1]),func);
			}
		});
}
//公开获取ClientSecret方法,直接调用
woolaAuth.prototype._GetClientSecret = function(func){
	client.pipeline()
		.get('ClientSecret')
		.exec(function(err , reply){
			if(reply[0][1]==null){
				var param = {
					"type": "wechat",
					"deviceName": "woola backend website",
					"deviceIdentify": "570FF0A0-AB85-11E4-8BCE-97D5206B21E8",
					"version": "0.1",
					"redirectURI": "http://letsdo.sports",
					"deviceVersion": "homewebsite",
					"deviceOsVersion": "1.0"
				}
				request.post(
					process.env.APIHOST + 'oauth/client',
					{ form: param },
					function(err,res,secret) {
						client.set('ClientSecret',secret);
						func(JSON.parse(secret));
					}
				);
			}
			else{
				func(JSON.parse(reply[0][1]));
			}
		});
}
//私有方法，不能直接调用
woolaAuth.prototype.GetClientToken = function(secret,func){
	client.pipeline()
		.get('ClientToken')
		.exec(function(err , reply){
			if(reply[0][1]==null){
				request.post(
					process.env.APIHOST + 'oauth/token',
					{
						'auth': {
							'user': secret.client_id,
							'pass': secret.client_secret,
							'sendImmediately': false
						},
						'form': {
							"client_id": secret.client_id,
							"client_secret": secret.client_secret,
							"grant_type": "client_credentials",
							"scope": "wechatclientresource"
						}
					},
					function(err , res , token){
						client.set('ClientToken',token);
						func(JSON.parse(token));
					}
				);
			}
			else{
				func(JSON.parse(reply[0][1]));
			}
		})
}
module.exports = new woolaAuth();