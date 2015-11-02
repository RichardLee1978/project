var express = require('express');
var path = require('path');
var http = require('http');
var common = require('./app/models/common');
		common.TestEnvConfig();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var compression = require('compression');
var useragent = require('express-useragent');//useragent 中间件
var routes = require('./app/routes/index');
var port = process.env.PORT || '4600';
var app = express();
//启用页面及静态资源压缩配置
app.use(compression(
	{
		level: 9
	}
));
//启用客户端浏览器判断
app.use(useragent.express());
// 配置视图位置
app.set('views', path.join(process.cwd(), './app/views'));
// 配置handlebars
app.engine('.hbs', hbs({
	defaultLayout: process.cwd()+'/app/views/layouts/main',
	extname: '.hbs',
	helpers: {
		section: function (name, options) {
			if (!this._sections) {
				this._sections = {};
			}
			this._sections[name] = options.fn(this);
			return null;
		},
		equal: function (value, target, options) {
			if (value === target) {
				return options.fn(this);
			}
			else {
				return options.inverse(this);
			}
		}
	}
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/*配置session*/
app.use(session({
	// 夹在cookie中发回的sessionid名
	name: 'SESSION_ID',
	// 用它来对session cookie签名，防止篡改，自己随便填写的字符串
	secret: 'w2nc123ush3uhe428h32g4i7',
	// 强制保存session至redis，防止内存泄漏
	store: new RedisStore({
		host: process.env.REDISHOST,
		port: process.env.REDISPORT,
		db: +process.env.REDISDB
	}),
	saveUninitialized: false,
	resave: false,
	cookie:{
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: 3600000 * 24 * 31
	}
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}
app.set('port', port);
var server = http.createServer(app);
server.on('error',onError);
server.listen(port);
console.log('woola app start on port :'+port);
module.exports = app;
