/* 引入待用模块 */
var fs = require("fs");
var http = require("http");
var url = require("url");
var path = require("path");
var mime = require("mime");
var querystring = require("querystring");
var DB_JSON = './json.json';
/* 创建服务器并监听端口 */
http.createServer(function(request,response){
    /* 获取基础数据 */
    var urlObj = url.parse(request.url,true);//url对象
    var pathname = urlObj.pathname;//url路径
    var query = urlObj.query;//查询字符串对象
    var method = request.method;
    /* 设置默认路径,如果客户端没有发起任何请求,则将路径设置为index.html */
    //pathname = pathname+(pathname.endsWith("/")?"index.html":"");
    request.setEncoding("utf-8");
    if(pathname == "/json"){//请求数据
        switch (method){
            case "GET":
                /* 客户端请求数据 */
                fs.readFile(DB_JSON,"utf8",function(error,data){
                    if(error){
                        response.statusCode = 500;/* 服务器端错误 */
                        response.end(JSON.stringify({code: 'error', data: err}));
                    }else{
                        /* 给客户端返回json头 */
                        response.writeHead(200, {
                            'Content-Type': 'application/json;charset=utf-8'
                        });
                        response.end(JSON.stringify({code: 'ok', data: JSON.parse(data)}));
                    };
                });
                break;
            case "POST":
                var r="";
                request.on("data",function (data) {
                    r+=data;
                });
                request.on("end",function () {
                    /* 数据判断:客户端只传一个name就是新增,只传一个id就是删除,既传id又传name就是修改 */
                    var user=JSON.parse(r);

                    fs.readFile(DB_JSON,"utf8",function(error,data){
                        var users=JSON.parse(data);
                        user.id=users[users.length-1].id+1;
                        users.push(user);
                        fs.writeFile(DB_JSON,JSON.stringify(users),function(){
                            response.writeHead(200, {
                                'Content-Type': 'application/json;charset=utf-8'
                            });
                            response.end(JSON.stringify({
                                code:'ok',
                                data:user
                            }));
                        });
                    })
                });
                break;
            case "DELETE":
                request.on("data",function (data) {
                    var id=JSON.parse(data).id;
                    fs.readFile(DB_JSON,'utf8',function (err,data) {
                        if(err){
                            /* 读取文件失败 */
                            console.log("删除时读取文件失败");
                        }else{
                            var data=JSON.parse(data);
                            data.forEach(function(item,index){
                                if(item.id==id){
                                    data.splice(index,1);
                                    return data;
                                }
                            });
                            fs.writeFile(DB_JSON,JSON.stringify(data),function (err) {
                                if(err){
                                    console.log("啊哟,删除失败了");
                                }else{
                                    response.end(JSON.stringify({
                                        code:"OK",
                                        data:{}
                                    }));
                                }
                            })
                        }
                    });

                });
                break;
        }

    }else if(pathname=="/favicon.ico"){//图标
        response.statusCode="404";
        response.end();
    }else{//默认打开网页,没有发送请求
        var filename = "."+pathname;
        if(pathname=="/"){//"/"没有办法调用createReadStream方法,所以单独判断
            filename = "index.html";
            response.setHeader('Content-Type', mime.lookup(filename));
            fs.createReadStream(filename).pipe(response);
        }else{
            fs.exists(filename,function(exists){
                if(exists){
                    response.setHeader("Content-Type",mime.lookup(pathname)+";charset=utf8");
                    fs.createReadStream(filename).pipe(response);
                }else{
                    response.statusCode = 404;
                    response.end('Not Found');
                }
            })
        };
    }

}).listen(6868);

function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}