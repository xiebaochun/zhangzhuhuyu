var fs = require('fs');

var argv = process.argv;
if(!argv[2]){
	console.log('Please enter the post name');
}
var postName = argv[2];
var cates = argv[3] || '';
var date = new Date();
var postRoot = __dirname+'/src/posts/';

var yearDir = postRoot + date.getFullYear();
var monthDir = yearDir +'/'+ (Array(2).join(0)+(date.getMonth()+1)).slice(-2);
var dateDir = monthDir + '/' + (Array(2).join(0)+date.getDate()).slice(-2);
if(!fs.existsSync(postRoot)){
	fs.mkdirSync(postRoot);
	console.log('mkdir postRoot dir success!');
}
if(!fs.existsSync(yearDir)){
	fs.mkdirSync(yearDir);
	console.log('mkdir year dir success!');
}
if(!fs.existsSync(monthDir)){
	fs.mkdirSync(monthDir);
	console.log('mkdir month dir success!');
}
if(!fs.existsSync(dateDir)){
	fs.mkdirSync(dateDir);
	console.log('mkdir date dir success!');
}

var initPostText = '===\n\
{\n\
    "title":"'+postName+'",\n\
    "author":"xiebaochun",\n\
    "categories":["'+cates+'"],\n\
    "tags":[""],\n\
    "createtime":"'+date.toLocaleDateString()+'"\n\
}\n\
===\n\
...正文开始\n\
';

fs.writeFileSync(dateDir+ '/' + postName.replace(/ /g,'_')+'.md',initPostText);
console.log('init post seccess!');
//var postName = 

//var files = fs.readdirSync(postRoot);
//console.log(fs.statSync(postRoot+ files[0]).isDirectory());