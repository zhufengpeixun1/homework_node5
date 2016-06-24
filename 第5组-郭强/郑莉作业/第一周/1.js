var fs = require('fs');

/**
 * 异步创建文件夹的方法
 * @param path 需要创建的多级文件夹路径，如‘a/b/c/d’
 */
function mkdir(path) {
    var pathList = path.split('/');
    var len = pathList.length;
    if (len <= 0) {
        return false;
    }
    var index = 0;
    var p = pathList[index];
    ~function add(){
        if(index>=len) {
            return;
        }
        fs.exists(p, function (err) {
            if(err){
                p += "/" + pathList[++index];
                add();
            }else{
                fs.mkdir(p, function () {
                    p += "/" + pathList[++index];
                    add();
                })
            }
        });
    }();
}

/**
 * 删除指定目录下的所有文件及文件夹-异步
 * @param path 指定目录
 */
function rmAll(path) {
    var pathList = [];
    var count=0;
    ~function rm(aPath) {
        fs.readdir(aPath,function (err, files) {
            if(err){
                return;
            }
            files.forEach(function (item) {
                var p = aPath+"/"+item;
                var stat = fs.statSync(p);
                if(stat.isDirectory()){
                    fs.rmdir(p,function (err) {
                        if(err){
                            pathList.push(p);
                            rm(p);
                        }else{
                            //console.log(pathList);
                            pathList.reverse().forEach(function (item) {
                                var arr = [];
                                fs.rmdir(item,function (err) {
                                    if(err){
                                        arr.push(item);
                                        rm(item);
                                    }else{
                                        //console.log(arr);
                                        arr.reverse().forEach(function (p) {
                                            fs.rmdirSync(p);
                                        })
                                    }
                                });
                            })
                        }
                        console.log(++count);
                    });
                }else if(stat.isFile()){
                    fs.unlink(p,function (err) {
                        if(err) throw err;
                    });
                }
            });

        });

    }(path);
}
/*mkdir('a/b/c/d/e');
mkdir('a/b/cc/dd/ee');
mkdir('a/b/c/dd/ee');
mkdir('a/bb/ccc/ddd/eee');*/
rmAll('./a');

