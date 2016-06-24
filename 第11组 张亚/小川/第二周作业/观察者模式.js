//有发射，有绑定
//一个观察者 对应多个事件 一对多
//一个事件名 对应一个事件池
function Event(){
    this._events={};
}
Event.prototype.on=function(eventName,callback){
    if(this._events[eventName]){
        this._events[eventName].push(callback);
    }else{
        this._events[eventName]=[callback];
    }
};

Event.prototype.once  = function (eventName,callback) {
    if(this._events[eventName+'once']){
        this._events[eventName+'once'].push(callback);
    }else{
        this._events[eventName+'once']=[callback];
    };
};

Event.prototype.off=function(eventName,callback){
    var arr=this._events[eventName];
    if(arr){
        this._events[eventName]=arr.filter(function(item){
            return item!=callback;//为true表示留下，为false表示过滤掉
        })
    }
};


Event.prototype.emit=function(eventName){
    //取出除了名字外的所有参数
    var args=Array.prototype.slice.call(arguments,1);
    var _this=this;
    var arr=this._events[eventName];
    var arrOnce=this._events[eventName+'once'];
    if(arr){
        arr.forEach(function(item){
            item.apply(_this,args);
        });
    }
    if(arrOnce){
        arrOnce.forEach(function(item){
            item.apply(_this,args);
        });
        this._events[eventName+'once']=[];
    }
};
var e=new Event();
function hungry(n){
    console.log('我饿了'+n);
}
function eat(n){
    console.log('我要吃饭'+n);
}
//用once绑定方法，发射多次只执行一次
e.once('hungry',hungry);
e.once('hungry',eat);
//e.on('hungry',hungry);
//e.on('hungry',eat);
/*e.on('hungry',hungry);
e.on('hungry',hungry);
e.on('hungry',eat);*/
e.emit('hungry','~~~~');
e.emit('hungry','~~~~');
e.emit('hungry','~~~~');
e.emit('hungry','~~~~');
e.emit('hungry','~~~~');

