var fs = require('fs');
var path = require('path');
var htmlToText = require('html-to-text');
require(`shelljs/global`);
//buildByRemarkable();
var isDev = true;

module.exports = build;

var _blogDirectory = '';
//build();

function build(_isDev){
	if(typeof _isDev != 'undefined'){
		isDev = _isDev;
	}
	if(!isDev){
		_blogDirectory = '/news';
	}
	buildByRemarkable();
}

function buildByRemarkable(){
	var Remarkable = require('remarkable');
	var hljs       = require('highlight.js') // https://highlightjs.org/
	var md = new Remarkable('full',{
		html:true,
		highlight: function (str, lang) {
	    if (lang && hljs.getLanguage(lang)) {
	      try {
	        return hljs.highlight(lang, str).value;
	      } catch (err) {}
	    }
	 
	    try {
	      return hljs.highlightAuto(str).value;
	    } catch (err) {}
	 
	    return ''; // use external default escaping 
	  }
	});

	var postList = [];

	render('./src/posts');

	buildIndex(postList);
	buildNews(postList);

	

	function render(dir){
		var files = fs.readdirSync(dir);

		for(file in files){

			var file_name = files[file];

			if(fs.statSync(dir +'/'+ file_name).isDirectory()){
				render(dir +'/'+ file_name);
				// return false;
			}

			if(file_name.substr(file_name.length - 3) == '.md'){
				console.log('File:' + file_name + 'found');

				var txt = fs.readFileSync(__dirname + dir.replace('.','') +'/'+ file_name);	
				var text;	
				if(typeof txt != 'string'){
					text = txt.toString();
				}

				var info = text.split('===')[1];
				

				//info = JSON.parse(info);
				var title = info?JSON.parse(info).title:'';
				var article =  md.render(txt.toString().replace(info,'').replace(/======/,''));

				if(info){
					//console.log('>>>>>>>>' + typeof JSON.parse(info));
					var item = JSON.parse(info);
					var desc;
					var article_string = htmlToText.fromString(article);
					if(article_string.length > 100){
						desc = htmlToText.fromString(article).substr(0,100) + '...';
					}else{
						desc = article_string;
					}
					postList.push({link:'./'+dir.replace('./src/','')+'/'+file_name.substr(0,file_name.length -3)+'.html',desc:desc ,info:JSON.parse(info)});
				}

				var html = layout(article, JSON.parse(info));
				var publishPostPath = './build/'+dir.replace('./src/','');
				if(!fs.existsSync(publishPostPath)){
					mkdirsSync(publishPostPath);
				}
				fs.writeFileSync(
					publishPostPath+'/'+file_name.substr(0,file_name.length -3)+'.html',html);
				console.log('file html write success!');
			}			
		}
	}
	function layout(mdHtml,info) {
		var layoutHtml = fs.readFileSync(__dirname +'/build/news_detail.html');
		//console.log('>>>>>>>>>>>'+_blogDirectory);
		layoutHtml = layoutHtml.toString();

		layoutHtml = layoutHtml.replace('{$title}',info.title||'');
		layoutHtml = layoutHtml.replace('{$createtime}',info.createtime||'');
		//console.log(layoutHtml);
		var html = layoutHtml.replace('{$markdown}',mdHtml);
		html = html.replace(/{\$blogDirectory}/g,_blogDirectory);
		return html;
	}

	function buildIndex(postList){
		var postListHtml = '';
		var news_length = postList.length <= 6 ? postList.length : 6;
		postList.reverse();
		for(var index = 0;index < news_length;index++){
			//postListHtml += '<li><a href="'+postList[index].link+'">'+(postList[index].info.title||'No title')+'</a></li>';

			postListHtml += '<li class="color-999">'+
								'<a class="color-666" href="'+postList[index].link+'">'+(postList[index].info.title||'No title')+'</a>'+
								'<span class="create-date fr color-999">'+postList[index].info.createtime.replace(/\d{4}-/,'').replace(/-/g,'/')+'</span>'+
							'</li>'
		}
		var layoutHtml = fs.readFileSync(__dirname +'/build/index.html');
		layoutHtml = layoutHtml.toString();
		var html = layoutHtml.replace('{$news_list}',postListHtml);

		fs.writeFileSync(
			'./build/index.html',html);
		console.log('file index html write success!');
	}
	function buildNews(postList){
		var postListHtml = '';
		//postList.reverse();
		for(var index = 0;index<postList.length;index++){
			//postListHtml += '<li><a href="'+postList[index].link+'">'+(postList[index].info.title||'No title')+'</a></li>';

			postListHtml += '<li class="news-item">'+
								'<a href="'+postList[index].link+'">'+
									'<div class="news-item-header">'+
										'<span class="news-name f20">'+(postList[index].info.title||'No title')+'</span>'+
										'<span class="fr color-999">'+postList[index].info.createtime+'</span>'+
									'</div>'+
									'<p class="desc">'+postList[index].desc+'</p>'+
								'</a>'+
							'</li>';
		}
		var layoutHtml = fs.readFileSync(__dirname +'/build/news.html');
		layoutHtml = layoutHtml.toString();
		var html = layoutHtml.replace('{$news_list}',postListHtml);

		fs.writeFileSync(
			'./build/news.html',html);
		console.log('file news html write success!');
	}
}

//数组去重
function uniqueArray(array){
	if(!array){
		return [];
	}
	var length = array.length,result=[], temp = {};
	for(var i = 0; i < length; i++){
		if(!temp[array[i]]){
			result.push(array[i]);
			temp[array[i]] = true;
		}
	}
	return result;
}
//创建多层文件夹 同步
function mkdirsSync(dirpath, mode) { 
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split('\/').forEach(function(dirname) {

            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
            //console.log(pathtmp);
        });
        //console.log(dirpath.split('\/'));
    }
    return true; 
}



