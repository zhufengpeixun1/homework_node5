/**
 * Created by Administrator on 2016/6/20.
 */

//1  异步创建

function mkdir(path) {
    var arr=path.split('/');
    var i=0;
    var cur=arr.slice(0,i+1);
    var fn=function(){
        fs.mkdir(cur.join('/'),function () {
            i++;
            cur=arr.slice(0,i+1);
            if(i<arr.length)
                fn();
        })};
    fn();
}
//mkdir('b/c/d');



//2 循环删除

var i=0;
function fn(path) {
    if(fs.existsSync(path)){
        var arr=fs.readdirSync(path);
        // if(arr){
        arr.forEach(function (item){
            var cur=path+'/'+item;
            //console.log(cur+";cur");
            var stat=fs.statSync(cur);
            if(stat.isFile()){
                //console.log(cur+";file");
                fs.unlinkSync(cur);
            }
            if(stat.isDirectory()){
                // console.log(path+";dir");
                fn(cur);
            }
        });
        fs.rmdirSync(path);
        /*console.log(path+";"+(++i));*/
    }
    //}

}
fn('./b');
//fs.rmdirSync("./b/c/d");