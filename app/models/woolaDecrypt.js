/**
 * Created by lirui on 15/10/26.
 */
var request = require('request');
var ioredis = require('ioredis');
var crypto = require('crypto');
var woolaAuth = require('./woolaAuth');
var common = require('./common');
		common.TestEnvConfig();
var client = new ioredis({
	port:parseInt(process.env.REDISPORT,10),
	host:process.env.REDISHOST,
	db:parseInt(process.env.REDISDB,10)
});
function woolaDecrypt(){}
woolaDecrypt.prototype.Decrypt = function(string,func){
	woolaAuth._GetClientSecret(function(Secret){
		var decipher = crypto.createDecipher('aes-128-ecb', Secret.client_secret);
		var dec = decipher.update(string, 'hex', 'utf8');
				dec += decipher.final('utf8');
		func(dec.split('|')[0]);
	});
}
module.exports = new woolaDecrypt();