/**
 * Created by lirui on 15/10/23.
 */
exports.IsWechatBoswer = function(req , res , next){
	var ua = req.useragent.source.toLowerCase();
	var Rex = /micromessenger/;
	if(Rex.test(ua)==false){
		res.redirect('/');
	}
	next();
	//return (/micromessenger/.test(ua)) ? true : false;
}