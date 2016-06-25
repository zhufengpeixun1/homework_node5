var fs = require('fs');

//异步-递归-创建文件夹

var mkdirs = function(path, callback){
	var dirs = path.slice(1).split("/");
	var i = 0;
    console.log(dirs);
	var mk = function(err){
		i += 1;
		if(i > dirs.length){
			callback(err);
			return;
		}
		fs.mkdir(dirs.slice(0, i).join('/'), function(err){
			mk(err);
		});
	};
	mk();
};

mkdirs('/a', function(err){
	console.log(err);
});

//异步-递归-删除文件

var deleteAll = function(path){
    fs.readdir(path,function(err,files){
        files.forEach(function(file){
            var thefile = (path+"/"+file);
            fs.stat(thefile,function(err,s){
                if(s.isFile()){
                    fs.unlink(thefile,function(){});
                }else if(s.isDirectory){
                    deleteAll(path+"/"+file);
                }
            });
        });

        if(files.length==0){
            fs.rmdirSync(path+'/'+files);
        }
    });
}

deleteAll("./a");


