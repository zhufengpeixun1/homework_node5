// 作业1. 异步创建文件夹

function mkdirs(dir,cb){
	var dirs = dir.split("/")
	var error = mks(dirs);
	if(error && typeof cb == 'function'){
		cb(error);
	}
}

function mks(dirs){
	var error = null;
	var curPath = __dirname;
	dirs.forEach(function(cur){
		curPath = path.join(curPath,'/',cur)
		console.log(curPath);
		fs.existsSync(curPath) ? null:fs.mkdir(curPath,function(err){
			error = err;
		})
		
	})
	return error;
}
mkdirs("a/b/dd/tc",function(err){
	console.log(err);
})
*/

// 作业2 遍历删除目录下的文件和目录

function delRoot(dir){
	dir = path.resolve(dir); // 获取当前绝对路径
	var arr = [];// 设置一个数组保存 树干
	fs.readdir(dir,function(err,files){
		if(err)return;
		if(files.length > 0){
			arr.unshift(dir); // 保存树干
			files.forEach(function(file){ // 处理 树梢
				file = path.join(dir,file)
				fs.stat(file,function(err,st){
					if(err)return;
					if(st.isDirectory()){
						delRoot(file)
					}else{
						fs.unlink(file,function(){
							//console.log('删除成功');
						});
					}
				})
			})
		}else{
			fs.rmdir(dir,function(){
				//console.log(dir,'文件夹被删除了');
			})
		}
		// 处理 树干
		if(arr.length > 0){
			arr.forEach(function(item){
				delRoot(item);
			})
		}
	})
}
delRoot('b')