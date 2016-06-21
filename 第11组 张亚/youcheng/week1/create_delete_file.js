var fs = require('fs');

//异步创建文件夹
function mkdirs_async(path, callback) {
    setTimeout(function () {
        var pathAry = path.split("/");
        for (var i = 0; i < pathAry.length; i++) {
            if (fs.exists(pathAry.slice(0, i + 1).join('/'))) {
                continue;
            }
            fs.mkdir(pathAry.slice(0, i + 1).join('/'), callback)
        }
    }, 0)
}

mkdirs_async('e/a/b/c', function (err) {
    console.log(err);
});


//异步删除指定目录下的所有文件/文件夹
/**
 * 移除 url 下的所有文件和文件夹(不包含url当前文件夹);
 * @param url:[string]要删除的文件夹 url
 * @param cb:[function]直接结束的回调函数,只有一个参数err,记录错误信息;
 */
function rmAll(url, cb) {
    var dirAry = [];
    var err = null;
    ~function query(url) {
        console.log("now url:", url);
        fs.readdir(url, function (err1, data) {
            if (err1) {
                err = err1;
                cb(err);
            }
            if (data.length === 0) {
                return;
            }
            data.forEach(function (item) {
                var curUrl = url + '/' + item;
                fs.stat(curUrl, function (err2, stats) {
                    if (err2) {
                        err = err2;
                        cb(err);
                    }
                    if (stats.isFile()) {
                        fs.unlink(curUrl, function (err3) {
                            if (err3) {
                                err = err3;
                                cb(err);
                            }
                        })
                    } else if (stats.isDirectory()) {
                        //把每次循环到的非空文件夹保存到数组中
                        dirAry.unshift(curUrl);
                        query(curUrl);
                    }
                })
            })
        });
    }(url);

    setTimeout(function () {
        dirAry.forEach(function (item) {
            //一次性删除所有文件夹
            fs.rmdir(item, function (err4) {
                err = err4;
                cb(err);
            })
        });
    }, 500)
}

rmAll('./e/', function (err) {
    console.log(err);
});