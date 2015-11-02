/**
 * Created by lirui on 15/10/20.
 */
var Index = require('../models/index');
exports.lists = function (req, res, next) {
		res.render(
			'pages/index/lists.hbs',
			{
				title:'最新活动'
			}
		);
}
