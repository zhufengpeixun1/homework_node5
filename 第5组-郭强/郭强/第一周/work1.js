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


function delRoot(dir,cb){
	dir = path.resolve(dir);
	fs.readdir(dir,function(err,files){
		console.log(files);
		console.log(files.length);
		if(files.length > 0){
			files.forEach(function(file){
				file = path.join(dir,file)
				fs.stat(file,function(err,st){
					if(st.isDirectory()){
						delRoot(file)
					}else{
						fs.unlink(file);
					}
				})
			})
		}else{
			fs.rmdir(dir,function(){
				console.log(dir,'文件夹被删除了');
			})
		}
	})
}
delRoot('b')