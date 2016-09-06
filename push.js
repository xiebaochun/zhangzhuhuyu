require(`shelljs/global`);
exec('git add .');
if(exec('git commit -m "update"').code !==0){
	echo(`Error: Git commit source failed`);
    exit(1);
}
if (exec(`git push origin source`).code !== 0) {
	exec('git remote set-url origin https://xiebaochun:dandan520@github.com/xiebaochun/zhangzhuhuyu.git');
	echo(`Error: Git push source failed`);
	exit(1);
}
echo(`------------ source updated`);