var path = require('path');
var request = require('request');
var express = require('express');
var build = require('./build');

require(`shelljs/global`);

var app = express();

var bodyParser = require('body-parser');

app.use('/',express.static(path.resolve(__dirname ,'build')));


app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/admin/views')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var port = process.env.PORT || 3000;

var router = express.Router();

router.get('/',function(req, res){
	var post = require('./admin/lib/post');
	var news_list = post.getPostList(__dirname + '/src/posts');
	//console.log(news_list);
	res.render('index', { title: '新闻管理' , news_list:news_list});
});
router.get('/add/:postName',function(req, res){
	exec('node new ' + req.params.postName);
	console.log(req.params.postName);
	setTimeout(function(){
		build();
	},500);
	res.end('添加成功!');
	//res.render('add', { title: '添加新文章' });

});


app.use('/admin',router);

app.listen(port);

console.log("Api is running on " + port);