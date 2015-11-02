/**
 * Created by lirui on 15/10/23.
 */

exports.TestEnvConfig = function(){
	if(require('fs').existsSync(process.cwd() + '/.env')){
		require('dotenv').load();
	}
	if (!process.env.REDISPORT || !process.env.REDISHOST || !process.env.REDISDB || !process.env.APIHOST) {
		console.log('no redis config or api host');
		process.exit(1);
	}
	else if(!process.env.WECHATAPPID || !process.env.WECHATSECRET || !process.env.WECHATTRANSFER){
		console.log('no wechat appid or secret or wechat transfer!');
		process.exit(1);
	}
}

exports.GetClientIp= function(req){
	var ipAddress;
	var forwardedIpsStr = req.header('x-forwarded-for');
	if (forwardedIpsStr) {
		var forwardedIps = forwardedIpsStr.split(',');
		ipAddress = forwardedIps[0];
	}
	if (!ipAddress) {
		ipAddress = req.connection.remoteAddress;
	}
	ipAddress = ipAddress.replace(/:|f/g,'');
	if(ipAddress=="1"){
		ipAddress='127.0.0.1';
	}
	return ipAddress;
}