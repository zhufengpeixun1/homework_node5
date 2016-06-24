/**
 * Created by acer on 2016/6/20.
 */
//创建
function mkdirs(path) {
    var fs = require('fs');
    var pathArr = path.split('/');
    function creatdire() {
        var pathString = '';
        pathArr.forEach(function (item, index) {
            pathString += index == 0 ? item : '/' + item;
            if (!fs.existsSync(pathString)) {
                fs.mkdir(pathString, function () {
                    if (!fs.existsSync(pathString)) {
                        creatdire();
                    }
                });
            }
        });
    }
    creatdire();
}

//mkdirs('a/b/c/d/e/f/g/h');

//移除
function reset(path){
    var fs = require('fs');
    function mulReset(pathname){
        fs.readdir(pathname,function(err,data){
            if(data.length==0)return;
            if(err){
                console.log(err.message);
            }else {
                data.forEach(function(item){
                    fs.stat(pathname+'/'+item,function(err,status){
                        if(err){
                            console.log(err.message);
                        }
                        if(status.isDirectory()){
                            fs.rmdir(pathname+'/'+item,function(err){
                                if(err) {
                                    mulReset(pathname + '/' + item);
                                }else{
                                    if(fs.readdirSync(pathname).length==0){
                                        mulReset(path);
                                    }
                                }
                            });
                        }else{
                            fs.unlink(pathname+'/'+item);
                        }
                    });
                });
            }
        });
    }
    mulReset(path);
}
reset('a');
