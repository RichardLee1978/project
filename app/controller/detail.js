/**
 * Created by lirui on 15/10/26.
 */

exports.ShowDetailPage = function(req , res , next){
	var id = req.query.id;
	//if(id){
		res.render('pages/activities/detail.hbs');
	//}
	//else{
		//res.status(404).send("<h1 style=\"text-align: center\"> Missing parameter id!</h1>");
	//}
}
