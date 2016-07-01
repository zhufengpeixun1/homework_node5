/**
 * Created by lee on 2016/6/30.
 */
var http = require('http');
var fs = require('fs');
var url = require('url');
var mine = require('mime');

http.createServer(function(req,res){
    var urlObj =  url.parse(req.url,true);
    var pathname = urlObj.pathname;
    res.setHeader("Access-Control-Allow-Origin","http://localhost:63342");
    if(pathname=='/ajaxJson.json'){
          fs.createReadStream('ajaxJson.json').pipe(res);
    }else if(pathname=='/ajax'){
        //res.setHeader('Content-type',mine.lookup(pathname)+';charset=utf8');
        var obj=urlObj.query;
        if(obj&&obj.id==1){
            addJsons(obj,res);
        }else if(obj.id==2){
            removeJsons(obj,res);
        }else if(obj.id==3){
            lookJsons(obj,res);
        }


    }else if(pathname=='/'){
         res.setHeader('Content-type','text/html;charset=utf8');
        //var data=urlObj.query;
            var str=fs.readFileSync("ajaxJson.json").toString();
            var a=JSON.parse(str);
            //data.id=a.length+1;
            var str=JSON.stringify(a);
            fs.writeFileSync("ajaxJson.json",str);
        dirJson(a,res);

}else if(pathname=='/favicon.ico'){

 }else if(pathname =='/jsonp'){
        res.end(urlObj.query.callback+"({name:1})")

    }else{
        if(fs.existsSync('.'+pathname)){

            res.setHeader('Content-type',mine.lookup(pathname)+';charset=utf8');
            fs.createReadStream('.'+pathname).pipe(res);
        }else{

            res.statusCode = '404';
            res.end();
        }
    }
}).listen(8998);

function addJsons(obj,res){
    var strData=fs.readFileSync("ajaxJson.json").toString();
    var data=JSON.parse(strData);
    //obj.id=data.length+1;
    //delete obj.id;
    //data.push(obj);
    strData=JSON.stringify(data);
   // delete strData.id;
    fs.writeFileSync("ajaxJson.json",strData);
    res.end(JSON.stringify(obj));
}

function removeJsons(obj,res){
    var strData=fs.readFileSync("ajaxJson.json").toString();
    var data=JSON.parse(strData);
    var objData =[];
    //for(var i=0;i<data.length;i++){
    //    obj[i]=data[i]
    for(var cur in data){
        if(cur != obj.removeid){
            objData.push(data[cur]) ;
        }
    }

    var str = JSON.stringify(objData);
    objData.unshift(obj);
    var ws = fs.createWriteStream('./ajaxJson.json',{flags:'w'});
    ws.end(str);
   res.end(JSON.stringify(objData));
}

function lookJsons(obj,res){

}
function dirJson(a,res){
    var strHTML=fs.readFileSync("ajax.html").toString();
    var reg=/(<tbody +id="json">)[\W\w]*?(<\/tbody>)/i;
    str=""
    for (var i = 0; i < a.length; i++) {
        var cur = a[i];
        var oTr = "<tr>";
        var oTd = "";
        for (var key in cur) {

            oTd += "<td>";//document.createElement("td");
           // console.log(cur[key]);
            oTd += key === "sex" ? (cur[key] === 0 ? "男" : "女") : (key === "radioed"? '<input type="radio" name="radioed" >':cur[key]);

            oTd +="</td>";

        }
        oTr += oTd+'</tr>';
        str +=oTr;
    }

    res.end(strHTML.replace(reg,"$1"+str+"$2"));

}