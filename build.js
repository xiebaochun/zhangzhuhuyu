var fs = require('fs');
var path = require('path');
require(`shelljs/global`);

module.exports = build;

function build(){
	exec('cp -r ./src/css ./dest');
	exec('cp -r ./src/js ./dest');
	exec('cp -r ./src/favicon.ico ./dest');
	exec('cp -r ./src/img ./dest');
	compile('./src/tpl');
}



function compile(dir){
	var files = fs.readdirSync(dir);
	//console.log(files);
	for(var file in files){
		var fileName = files[file];
		//console.log(fileName);
		if(fs.statSync(dir +'/'+ fileName).isDirectory()){
				compile(dir +'/'+ fileName);
				// return false;
		}
		if(fileName.substr(fileName.length-5) == '.html'){
			var str = fs.readFileSync(__dirname + '/src/tpl/' + fileName).toString();
			var html = parseHtml(str);	
			//console.log(str);
			var buildPath = './dest/'+dir.replace('./src/tpl','');
			if(!fs.existsSync(buildPath)){
				mkdirsSync(buildPath);
			}
			fs.writeFileSync(buildPath + '/'+fileName,html);
		}
	}
}

function parseHtml(str){
	var tags = str.match(/<%- include\('.+'\) %>/ig);
	var templates = [];
	//tags is a array of the tag console.log(tags);
	for(var tag in tags){
		//templates.push(getTemplateHtml(tags[tag]));
		str = str.replace(tags[tag],getTemplateHtml(tags[tag]));
	}
	return str;
	//console.log(templates);
}

function getTemplateHtml(tag){
	var path = (tag.replace(/(<%- include\(')|('\) %>)/g,'')).trim();
	return fs.readFileSync(__dirname + '/src/' + path + '.html').toString();
	//console.log(path);
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
