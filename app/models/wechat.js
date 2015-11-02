/**
 * Created by lirui on 15/10/23.
 */
var request = require('request');
var ioredis = require('ioredis');
var OAuth = require('wechat-oauth');
var WechatAPI = require('wechat-api');
var extend = require('node.extend');
var common = require('./common');
		common.TestEnvConfig();
var client = new ioredis({
	port:parseInt(process.env.REDISPORT,10),
	host:process.env.REDISHOST,
	db:parseInt(process.env.REDISDB,10)
});
var wechat_oauth = new OAuth(process.env.WECHATAPPID,process.env.WECHATSECRET,function (openid, callback) {
	client.pipeline()
		.get(openid)
		.exec(function(err , reply){
			if(err){
				return callback(err);
			}
			else if(reply[0][1]==null){
				return callback(err);
			}
			else{
				callback(null, JSON.parse(reply[0][1]));
			}
		});
},function (openid, token, callback) {
	client.set(openid,JSON.stringify(token),'EX',7200);
	callback(null,true);
});
var wechat_api = new WechatAPI(process.env.WECHATAPPID,process.env.WECHATSECRET,function(callback){
	client.pipeline()
		.get('wechat_token')
		.exec(function(err,reply){
			if(err){
				return callback(err);
			}
			if(reply[0][1]==null){
				return callback(err);
			}
			else{
				callback(null, JSON.parse(reply[0][1]));
			}
		});
},function(token,callback){
	client.set('wechat_token',JSON.stringify(token),'EX',7200);
	callback(null,true);
});
var wechat_jsapi = wechat_api.registerTicketHandle(function(type, callback){
	client.pipeline()
		.get('wechat_ticketToken')
		.exec(function(err,reply){
			if(err){
				return callback(err);
			}
			if(reply[0][1]==null){
				return callback(err);
			}
			else{
				callback(null, JSON.parse(reply[0][1]));
			}
		});
},function(type, _ticketToken, callback){
	client.set('wechat_ticketToken',JSON.stringify(_ticketToken),'EX',7200);
	callback(null,true);
});

function WechatInfo(){}
//根据动态url生成签名后的wxconfig对象
WechatInfo.prototype.GetWxparam = function(url){
	return {
		debug: false,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'],
		url: process.env.WECHATTRANSFER +url
	}
}
//根据code 得到用户的微信token，存储至redis
WechatInfo.prototype.SetAndCallUserInfo = function(code,func) {
	var _this = this;
	wechat_oauth.getAccessToken(code,function(err,token){
		if(err){
			//console.log(err);
			func(err);
		}
		else{
			//存储用户的访问凭据设置2小时过期
			client.set(token.data.openid,JSON.stringify(token.data),'EX',7200);
			_this.GetUserExpertInfo(token.data,func);
		}
	});

}
//获取自己微信账号公开token
WechatInfo.prototype.GetWechatToken = function(func){

	client.pipeline()
		.get('wechat_token')
		.exec(function(err , reply){
			if(reply[0][1]!=null){

				func(JSON.parse(reply[0][1].replace(/\s+/g,'')));
			}
			else{
				wechat_api.getAccessToken(function(err,data){
					client.set('wechat_token',JSON.stringify(data),'EX',7200);
					func(data);
				})
			}
		})

}
//获取用户微信信息(unid机制)
WechatInfo.prototype.GetUserExpertInfo = function(token,func){
	var _this = this;
	_this.GetWechatToken(function(wechattoken){
		wechat_api.getUser({openid: token.openid, lang: 'zh_CN'},function(err,user){
			if(err){console.log(err)}
			var _all = extend(token,user);
			func(_all);
		})
	});

}
//根据openid作为唯一键值，获取用户微信信息(获取用户关注情况)，不缓存用户信息
WechatInfo.prototype.GetUserWechatInfo = function(access,func) {
	var _this = this;
	//如果提供了openid字段
	if(access.id){
		client.pipeline()
			.get(access.id)
			.exec(function(err,result){
				if(err){
					func(err);
				}
				//如果用户的wechat token过期
				var user_wechat_access = result[0][1];
				if(user_wechat_access == null){
					_this.SetAndCallUserInfo(access.code,func);
				}
				//如果没有过期
				else{
					var access_ = JSON.parse(user_wechat_access);
					_this.GetUserExpertInfo(access_,func);
				}
			})
	}
	//没有提供openid字段
	else{
		_this.SetAndCallUserInfo(access.code,func);
	}
}

WechatInfo.prototype.GetWechatJsConfig = function(url,func){
	var _this = this;
	wechat_api.getJsConfig(_this.GetWxparam(url),function(err,result){
		if(err){
			func(err);
		}
		else{
			func(result);
		}
	});
}
module.exports = new WechatInfo();