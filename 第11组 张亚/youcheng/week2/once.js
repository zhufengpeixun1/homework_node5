
function Event() {
    this._events = {};

}

Event.prototype.on = function(eventName, callback) {
    //有的话直接放到数组里没有的话创建
    if (this._events[eventName]) {
        this._events[eventName].push(callback);
    } else {
        //一个事件名称 对应多个callback
        this._events[eventName] = [callback];
    }
    var ary = this._events[eventName];
};
Event.prototype.once = function(eventName, callback) {
    if (this._events["once_" + eventName]) {
        this._events["once_" + eventName].push(callback);
    } else {
        //一个事件名称 对应多个callback
        this._events["once_" + eventName] = [callback];
    }
};
Event.prototype.off = function(eventName, callback) {
    var arr = this._events[eventName];
    if (arr) {
        this._events[eventName] = arr.filter(function(item) {
            return item != callback;
        });
    }
};
Event.prototype.emit = function(eventName) {

    //取出除了名字外的所有参数
    var args = Array.prototype.slice.call(arguments, 1);
    //取出所有callback
    var that = this;

    var arr = this._events[eventName];
    var arrOnce = this._events["once_" + eventName];

    if (arr) {
        arr.forEach(function(item) {
            item.apply(that, args);
        });
    } else if (arrOnce) {
        arrOnce.forEach(function(item) {
            item.apply(that, args);
            arrOnce.splice(arrOnce.indexOf(item), 1);
        });
    }
};
// on off emit
var e = new Event();

function eat(who) {
    console.log('我饿了' + who);
}

function sleep() {
    console.log("sleep");
}

e.once('我饿了', eat);
e.on('sleepy', sleep);
//发射多次 但是只执行一次
e.emit('我饿了', '你');
e.emit('我饿了', '你');
e.emit('我饿了', '你');
e.emit('我饿了', '你');




