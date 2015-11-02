var express = require('express');
var router = express.Router();
var Index = require('../controller/index');
var Imgcode = require('../controller/imgcode');
var Detail = require('../controller/detail');
var Phone = require('../controller/phone');
var Apply = require('../controller/apply');
var Sms = require('../controller/sms');
var Transfer = require('../controller/transfer');
var Filters = require('../filters/filters')
/* GET home page. */
router.get('/activities', Index.lists);
router.get('/codeimg', Imgcode._captchpng);
router.get('/transfer-to-wechat',Transfer.ToWechat);
router.get('/activities/detail',Detail.ShowDetailPage);
router.get('/activities/phone',Filters.IsWechatBoswer,Phone.ShowPhonePage);
router.post('/activities/phone',Filters.IsWechatBoswer,Phone.GetPhone);
router.get('/activities/sms',Filters.IsWechatBoswer,Sms.ShowSmsPage);
router.get('/activities/apply',Filters.IsWechatBoswer,Apply.ShowApply);

module.exports = router;
