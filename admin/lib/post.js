var fs = require('fs');
function getPostList(postPath){
	var postList = [];
	//console.log(postPath);
	render(postPath);

	function render(dir){
		var files = fs.readdirSync(dir);

		for(file in files){

			var file_name = files[file];

			if(fs.statSync(dir +'/'+ file_name).isDirectory()){
				render(dir +'/'+ file_name);
				// return false;
			}

			if(file_name.substr(file_name.length - 3) == '.md'){
				//console.log('File:' + file_name + 'found');
				var txt = fs.readFileSync(dir.replace('.','') +'/'+ file_name);	
				var text;	
				if(typeof txt != 'string'){
					text = txt.toString();
				}

				var info = text.split('===')[1];
				if(info){
					//console.log('>>>>>>>>' + typeof JSON.parse(info));
					var item = JSON.parse(info);
					postList.push({link:'./'+dir.replace('./src/','')+'/'+file_name.substr(0,file_name.length -3)+'.html',info:JSON.parse(info)});
				}
			}			
		}
	}
	return postList;
}

exports.getPostList = getPostList;
