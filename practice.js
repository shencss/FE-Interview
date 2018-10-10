/*
setTimeout输出：每秒输出一个数字，输出玩0-4一秒后输出5
*/
//ES5
for(var i = 0; i < 5; i++) {
    (function(j){
        setTimeout(function() {
      //      console.log(j)
        }, j * 1000);
    })(i);
}
setTimeout(function() {
    //console.log(i);
}, i * 1000)
//ES6
const prs = [];
const output = i => {
    return new Promise(resolve => {
        setTimeout(() => {
           // console.log(i);
            resolve();
        }, i * 1000);
        
    }); 
}
for(var i = 0; i < 5; i++) {
    prs.push(output(i));
}
Promise.all(prs).then(() => {
    setTimeout(() => {
        //console.log(i);
    }, 1000)
});

/*
go函数:
go('T') ==> 'goT'
go()('T') ==> 'gooT'
go()()('T') ==> 'goooT'
*/
var go = (function() {
    var count = 1;
    return function() {
        if(arguments.length > 0) {
            var str = 'g';
            for(var i = 0; i < count; i++) {
                str += 'o';
            }
            console.log(str + arguments[0]);
            count = 1;
        } else {
            count++;
            return arguments.callee;
        }
    }
})();
/*
go('T');
go()('T');
go()()('T');
*/

/*
throttle函数：在两次执行的时间间隔超过wait后，action才可再次执行
*/
const throttle = (action, wait) => {
    let last = 0;
    return function() {
        let now = new Date();
        if(now - last > wait) {
            action.apply(this, arguments);
        }
    }
}
/*
const fn = str => console.log(str);
var throttleFn = throttle(fn, 100);
throttleFn('Fn');
throttleFn('Fn');
*/


/*
debounce函数: 如果imediate为true则立即调用action，此后action在调用的wait秒后执行，期间action再次执行会刷新等待时间
*/
var debounce = (action, wait, imediate) => {
    var timer;
    return function() {
        if(timer) clearTimeout(timer);
        if(imediate) {
            if(!timer) {
                action.apply(this, arguments);
                timer = setTimeout(() => {
                    timer = null;
                }, wait);
            }
        } else {
            var context = this, args = arguments;
            timer = setTimeout(function() {
                action.apply(context, args);
            }, wait);
        }
    }
}
/*
const fn = str => console.log(str);
var debounceFn = debounce(fn, 2000, true);
debounceFn('Fn');
debounceFn('Fn');
debounceFn('Fn');
*/


/*
Bind函数实现
*/
Function.prototype.myBind = function() {
    var self = this;
    var context = [].shift.call(arguments);
    var args = [].slice.call(arguments);
    return function() {
        return self.apply(context, args.concat([].slice.call(arguments)));
    }
}
/*
Call函数实现
*/
Function.prototype.myCall = function() {
    var context = [].shift.call(arguments);
    var args = [].slice.call(arguments);
    context.fn = this;
    var result = context.fn(...args);
    delete context.fn;
    return result;
}
/*
var myObject = {
    n: 'myObject'
}
function fn1(type, i) {
    console.log(type + ' ' + i + ' ' + this.n);
}
var fn2 = fn1.myBind(myObject, 'bind', 'my');
fn1.myCall(myObject, 'call', 'my');
fn2();
function add(a, b, c) {
    return a + b + c;
}
var add2 = add.myBind(undefined, 100);
console.log(add2(2, 3))
console.log(Boolean([]))
*/

/*
instanceof实现
*/
const myInstanceof = (instance, constructor) => {
    while(instance.__proto__ !== null) {
        if(instance.__proto__ === constructor.prototype) {
            return true;
        }
        instance = instance.__proto__;
    }
    return false;
}

/*
function Foo() {};
function Poo() {};
var foo = new Foo();
console.log(myInstanceof(foo, Foo));
console.log(myInstanceof(foo, Poo));
console.log(myInstanceof(foo, Object));
*/


/*
Promise + AJAX
*/
const promiseAJAX = param => {
    return new Promise((resovle, reject) => {
        var xhr;
        if(window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                resovle(JSON.parse(xhr.responseText));
            } else {
                reject(JSON.parse(xhr.responseText));
            }
        }
        xhr.open(param.type || 'GET', param.url, true);
        xhr.send(param.date || null);
    });
}
/* 
var myParam = {
    type: 'POST',
    url: '/index.html',
    data: 'data=1234'
}
var p = promiseAJAX(myParam);
p.then(function(data) {
    console.log(data);
})
*/

/*
JSONP封装
*/


/*
EventUtil工具类
*/
const EventUtil = {
    getEvent(event) {
        return event ? event : window.event;
    },
    getTarget(event) {
        return event.target ? event.target : event.srcElement;
    },
    addListener(element, type, callback) {
        if(element.addEventLisetner) {
            element.addEventLisetner(type, callback, false);
        } else if(element.attach) {
            element.attach('on' + type, callback);
        } else {
            element['on' + type] = callback;
        }
    },
    removeListener(element, type, callback) {
        if(element.removeEventLisetner) {
            element.removeEventLisetner(type, callback, false);
        } else if(element.detach) {
            element.detach('on' + type, callback);
        } else {
            element['on' + type] = null;
        }
    },
    stopPropagation(event) {
        if(event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    preventDefault(event) {
        if(event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
    
}
/*
var btn = document.getElementById('btn');
EventUtil.addListener(btn, 'click', function(event) {
    var event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);
    EventUtil.preventDefault(event);
    EventUtil.stopPropagation(event);
});
*/


/*
EventEmitter实现
*/



/*
Promise实现
*/
const MyPromise = (executor) => {
    this.status = 'pandding';
    try {
        executor(this.resolve.bind(this), this.reject.bind(this));
    } catch(error) {
        this.reject.call(this, error);
    }
}

MyPromise.prototype.resolve = value => {
    const self = this;
    if(this.status === 'pendding') {
        this.status = 'resolved';
        this.date = value;
        setTimeout(() => {
            self.onResolvedCallback(self.data);
        });
    }
}

MyPromise.prototype.reject = reason => {
    const self = this;
    if(this.status === 'pendding') {
        this.status = 'rejected';
        this.data = reason;
        setTimeout(() => {
            self.onRejectedCallback(self.data);
        });
    }
}

MyPromise.prototype.then = (resolvedCallback, rejectedCallback) => {
    const self = this;
    resolvedCallback = typeof resolvedCallback === 'function' ? resolvedCallback : function(value) {
        return value;
    }
    rejectedCallback = typeof rejectedCallback === 'function' ? rejectedCallback : function(reason) {
        throw reason;
    }

    return new MyPromise((nextResolve, nextRejecte) => {
        function resolvedCallbackWrap() {
            var result = resolvedCallback(self.data);
            if(result) {
                if(result instanceof MyPromise) {
                    result.then(nextResolve, nextRejecte);
                } else {
                    nextResolve(result);
                }
            }
        }

        function rejectedCallbackWrap() {
            var result = rejectedCallback(self.data);
            if(result) {
                if(result instanceof MyPromise) {
                    result.then(nextResolve, nextRejecte);
                } else {
                    nextRejecte(result);
                }
            }
        }

        self.onResolvedCallback = resolvedCallbackWrap;
        self.onRejectedCallback = rejectedCallbackWrap;
    });
}

MyPromise.prototype.catch = (rejectedCallback) => {
    return this.then(null, rejectedCallback);
}

/*
var p = new MyPromise(function(resolve, reject) {
    setTimeout(resolve,3000,'hello!');
});
p.then(function(data) {
    console.log(data);
    return 'hello new string!';
}).then(function(data) {
    console.log(data);
    return new MyPromise(function(resolve, reject) {
        reject('hello new promise!');
    });
}).catch(function(data) { 
    console.log(data);
 });
*/

 /*
 checkfy函数：如果原型对象中的check函数返回true则执行post函数
 */
function Page() {};
Page.prototype = {
    constructor: Page,
    postA: function() {
        console.log('A');
    },
    postB: function() {
        console.log('B');
    },
    check: function() {
        return Math.random() > 0.5;
    }
}

/*
var page = new Page();
page.postA();
checkfy(Page.prototype);
page.postB();
*/

/*
flat函数：返回扁平化后的数组
*/

//console.log(flat([1, [2, [[3, 4], 5], 6]]));

/*
deepClone函数： 实现对象的深拷贝
*/

/*
var objClone = deepClone(obj);
objClone.object.number = 100;
console.log(obj.object.number);
console.log(objClone.object.number);
*/

/*
containsRepeatingLtter函数：用正则表达式检测字符串是否包含重复的字符
*/

//console.log(containsRepeatingLtter('adccd'));

/*
curry函数：函数的柯里化，将使用多个参数的函数转换成一系列使用一个参数的函数
*/

function fn4(a, b, c) {
    return a + b + c;
}
//console.log(curry(fn4)(1)(2)(3));

/*
设计模式
*/
// 1)单例模式：一个特定的类只有一个实例

/*
var instance1 = new Singleton();
var instance2 = new Singleton();
console.log(instance1 === instance2);
*/

// 2)工厂模式：定义一个接口，该接口由子类决定实例化哪个类

/*
var factory = new Factory();
var dog = factory.getInstance('Dog');
var cat = factory.getInstance('Cat');
console.log(dog.name + ' ' + cat.name);
*/

// 3)代理模式：一个对象充当另一个对象的接口

/*
var personProxy = new PersonProxy();
personProxy.callMethod('sayName');
personProxy.callMethod('sayAge');
*/

// 4)发布订阅模式：于一个主题/事件通道，希望接收通知的对象通过自定义事件订阅主题，被激活事件的对象通过发布主题事件的方式被通知


// 5)装饰模式：不需要改变以后的接口，而给对象添加功能 ==> React中 connect(mapStateToProps)(MyComponent)
/*
var Publisher = new Public();
Publisher.on('test', function(data) {
    console.log(data);
});
Publisher.emit('test', 'test the publisher');
*/

/*
动态原型模式与寄生组合继承
*/

//ES5

//ES6 Object.setPropertyOf(SubType.prototype, SuperType.prototype)
/*
var superType = new SuperType('SuperType');
var subType = new SubType('SubType', 20);
superType.sayName();
subType.sayName();
subType.sayAge();
*/

/*
new关键字实现
*/

/*
var subType2 = myNew(SubType, 'SubType2');
console.log(subType2 instanceof SubType);
subType2.sayName();
*/

/*
Obeject.create实现
*/



/*
parseNum函数：将数字转化为千分位
*/

//console.log(parseNum(12345678));


/*
delegateEvent函数：事件代理的实现
*/

/*
var box = document.getElementById('box');
delegateEvent(box, 'a', 'click', function() {
    console.log(this.href);
});
*/


/*
quickSort函数：快速排序实现
*/

//console.log(quickSort([9,4,6,2,1,5,3,7,8]));


/*
AOP：面向切面编程，实现before和after函数
*/

/*
var fn5 = function(string) {
    console.log(string);
}
fn5('AOP');
fn5 = fn5.before(function() {
    console.log('===before===');
}).after(function() {
    console.log('===after===');
});
fn5('AOP');
*/

/*
CodingMan函数：
CodingMan('Peter') ==> 'Hi! This is Peter!'
CodingMan('Peter').eat('dinner') ==> 'Hi! This is Peter!' 'Eat dinner'
CodingMan('Peter').sleep(3).eat('dinner') ==>'Hi! This is Peter!' 3秒... 'Eat dinner'
CodingMan('Peter').sleepFirst(5).eat('supper') ==> 5秒后.. 'Hi! This is Peter!' 'Eat supper'
*/

//CodingMan('Peter');
//CodingMan('Peter').sleep(3).eat('dinner');
//CodingMan('Peter').eat('dinner').eat('supper');
//CodingMan('Peter').sleepFirst(5).eat('supper');

/*
compose函数：函数组合串联
*/

/*
var fn1 = a => a + 1;
var fn2 = b => b + 2;
var fn3 = c => c + 3;
console.log(compose([fn1, fn2, fn3])(100));
*/

/*
isFirst函数：该值是否第一次出现
*/

//console.log(isFirst(1));
//console.log(isFirst(2));
//console.log(isFirst(1));



/*
myTrim函数：实现字符串头尾去空字符
*/

//console.log(myTrim('  sds ad  '))

//console.log(['1', '2', '3'].map(parseInt));
//console.log(['1', '2', '3'].map(value => parseInt(value)));


/* 创建全空对象
var obj = {};
console.log( obj.__proto__, obj.toString())
var obj2 = Object.create(null);
console.log( obj2.__proto__, obj2.toString())
*/

/* 原型对象丢失
function Foo() {};
var foo = new Foo();
console.log(foo.constructor == Foo)
console.log(foo instanceof Foo)
Foo.prototype = {};
console.log(foo.constructor == Foo)
console.log(foo  instanceof Foo)
*/
