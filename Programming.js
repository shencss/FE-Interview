/*
setTimeout输出：每秒输出一个数字，输出玩0-4一秒后输出5
*/
//ES5
for(var i = 0; i < 5; i++) {
    (function(j) {
        setTimeout(function() {
           //console.log(new Date(), j);
        }, j * 1000);
    })(i);
}
setTimeout(function() {
    //console.log(new Date(), i);
}, i * 1000);
//ES6
const tasks = [];
const output = i => new Promise((resolve) => {
    setTimeout(() => {
        //console.log(new Date(), i);
        resolve();
    }, i * 1000);
});
for(let i = 0; i < 5; i++) {
    tasks.push(output(i));
}
Promise.all(tasks).then(() => {
    setTimeout(() => {
        console.log(new Date(), i);
    }, 1000);
});


/*
go函数:
go('T') ==> 'goT'
go()('T') ==> 'gooT'
go()()('T') ==> 'goooT'
*/
var go = (function() {
    var count = 1;
    return function () {
        if(arguments.length > 0) {
        var str = 'g';
        for(var i = 0; i < count; i++) {
            str += 'o';
        }
        console.log(str + arguments[0]);
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
var throttle = function(action, wait) {
    var last = 0;
    return function () {
        var now = new Date();
        if(now - last > wait) {
            action.apply(this, arguments);
            last = now;
        }
    }
}
/*
function fn() {
    console.log('fn');
}
var throttleFn = throttle(100, fn);
throttleFn();
throttleFn();
throttleFn();
*/

/*
debounce函数: 如果imediate为true则立即调用action，此后action在调用的wait秒后执行，期间action再次执行会刷新等待时间
*/
var debounce = function(action, wait, immediate) {
    var timer;
    return function() {
        var context = this;
        if(timer) clearTimeout(timer);

        if(immediate) {
            if(!timer) {
                action.apply(context, arguments);
            }
            //在第一次执行后timer便保存了一个计时器ID，wait时间后这个ID便被回收
            timer = setTimeout(function() {
                timer = null;
            }, wait);
        } else {
            timer = setTimeout(function() {
                action.apply(context, arguments);
            }, wait);
        }
    }
}
/*
function fn3() {
    console.log('fn3');
}
var debounceFn3 = debounce(fn3, 1000, true);
debounceFn3();
debounceFn3();
debounceFn3();
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
    var args = [];
    for(var i = 0, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    context.fn = this;
    var result =  eval('context.fn(' + args + ')');//可用拓展运算符替代
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
var myInstanceof = function(instance, constructor) {
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
function promiseAJAX(param) {
    return new Promise(function(resolve, reject) {
        var xhr;
        if(window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.open(param.type || 'GET', param.url, true);
        xhr.send(param.data || null);

        xhr.onreadystatechange = function() {
            if(this.readyState === 4 && this.status === 200) {
                resolve(JSON.parse(this.responseText));
            } else {
                reject(JSON.parse(this.responseText));
            }  
        }
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
var jsonp = function(url, callback, success) {
    var callbackName = callback + '_' + new Date().getTime();
    var script = document.createElement('script');
    script.src = ulr + '?callbakc=' + callbackName;
    window[callbackName] = function(data) {
        success && sucess(data);
    };
    body.appendChild(script);
}

/*
EventUtil工具类
*/
var EventUtil = {
    addHandler: function(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if(element.attach) {
            element.attach('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },

    removeHandler: function(element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if(element.detach) {
            element.detach('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    },

    getEvent: function(event) {
        return event ? event : window.event;
    },

    getTarget: function(event) {
        return event.target ? event.target : event.srcElement;
    },

    preventDefault: function(event) {
        if(event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    stopPropagation: function(event) {
        if(event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
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
class EventEmitter {
    constructor(max_event) {
        this.listeners = new Map();
        this.max_event = max_event || 10;
    }

    addListener(label, callback) {
        this.listeners.has(label) || this.listeners.set(label, []);
        this.listeners.get(label).push(callback);
    }

    removeListener(label, callback) {
        let listeners = this.listeners.get(label);
        let index;
        if(listeners && listeners.length) {
            index = listeners.reduce((i, listener, index) => {
                return (isFunction(listener) && listener === callback) ? i = index : i;
            }, -1);
        }
        if(index > -1) {
            listeners.splice(index, 1);
            this.listeners.set(label, listeners);
            return true;
        }

        return false;
    }

    emit(label, ...args) {
        let listener = this.listeners.get(label);
        if(listener && listener.length) {
            listener.forEach(listener => {
                listener(...args);
            });
            return false;
        }
        return true;
    }
}
class Observer {
    constructor(id, subject) {
        this.id = id;
        this.subject =subject;
    }
    on(label, callback) {
        this.subject.addListener(label, callback);
    }
}


/*
Promise实现
*/
function MyPromise(executor) {
    this.status = 'pending';

    try {
        executor(this.resolve.bind(this), this.reject.bind(this));
    } catch(error) {
        this.reject.call(this,error);
    }
}

MyPromise.prototype.resolve = function(value) {
    var self = this;
    if(this.status === 'pending') {
        this.status = 'resolved';
        this.data = value;
        //延迟resolve的执行
        setTimeout(function() {
            self.onResolvedCallback(self.data);
        });
    }
}
MyPromise.prototype.reject = function(reason) {
    var self = this;
    if(this.status === 'pending') {
        this.status = 'reject';
        this.data = reason;
        //延迟reject的执行
        setTimeout(function() {
            self.onRejectedCallback(self.data);
        });
    }
}
MyPromise.prototype.then = function(resolvedCallback, rejectedCallback) {
    var self = this;
    resolvedCallback = typeof resolvedCallback === 'function' ? resolvedCallback : function(value) {
        return value;
    }
    rejectedCallback = typeof rejectedCallback === 'function' ? rejectedCallback : function(reason) {
        throw reason;
    }
    return new MyPromise(function(nextResolvedCallback, nextRejectedCallback) {

        function onResolvedCallbackWrap() {
            var result = resolvedCallback(self.data);
            if(result) {
                if(result instanceof MyPromise) {
                    result.then(nextResolvedCallback, nextRejectedCallback);
                } else {
                    nextResolvedCallback(result);
                }
            }
        }
        function onRejectedCallbackWrap() {
            var result = rejectedCallback(self.data);
            if(result) {
                if(result instanceof MyPromise) {
                    result.then(nextResolvedCallback, nextRejectedCallback);
                } else {
                    nextRejectedCallback(result);            
                }
            }
        }
        
        self.onResolvedCallback = onResolvedCallbackWrap;
        self.onRejectedCallback = onRejectedCallbackWrap;
    
    });
}
MyPromise.prototype.catch = function(rejectedCallback) {
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
var checkfy = function(prototype) {
    for(key in prototype) {
        if(key.indexOf('post') === 0 && typeof prototype[key] === 'function') {
            var fn = prototype[key];
            prototype[key] = function() {
                if(prototype.check()) {
                    fn.apply(prototype, arguments);
                }
            }
        }
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
var flat = function(array) {
    var result = [];
    for(var i = 0, len = array.length; i < len; i++) {
        if(typeof array[i] === 'number') {
            result.push(array[i]);
        } else {
            result = result.concat(arguments.callee(array[i]));
        }
    }
    return result;
}
//console.log(flat([1, [2, [[3, 4], 5], 6]]));

/*
deepClone函数： 实现对象的深拷贝
*/
var deepClone = function(obj) {
    if(typeof obj !== 'object') return obj;
    var objClone = Array.isArray(obj) ? [] : {};
    if(obj && typeof obj === 'object') {
        for(key in obj) {
            if(obj.hasOwnProperty(key)) {
                if(obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = arguments.callee(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}
var obj = {
    number: 0,
    object: {number: 99}
}
/*
var objClone = deepClone(obj);
objClone.object.number = 100;
console.log(obj.object.number);
console.log(objClone.object.number);
*/

/*
containsRepeatingLtter函数：用正则表达式检测字符串是否包含重复的字符
*/
var containsRepeatingLtter = function(str) {
    return /([a-zA-Z])\1/.test(str);
}
//console.log(containsRepeatingLtter('adccd'));

/*
curry函数：函数的柯里化，将使用多个参数的函数转换成一系列使用一个参数的函数
*/
var curry = function(fn) {
    var len = fn.length;
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        args = args.concat(Array.prototype.slice.call(arguments));
        if(args.length < len) {
            return arguments.callee;
        } else {
            return fn.apply(this, args);
        }
    }
}
function fn4(a, b, c) {
    return a + b + c;
}
//console.log(curry(fn4)(1)(2)(3));

/*
设计模式
*/
// 1)单例模式：一个特定的类只有一个实例
var Singleton;
(function() {
    var instance;
    Singleton = function() {
        if(instance) {
            return instance;
        }
        instance = this;
        this.property = "property";
    }
})();
/*
var instance1 = new Singleton();
var instance2 = new Singleton();
console.log(instance1 === instance2);
*/

// 2)工厂模式：定义一个接口，该接口由子类决定实例化哪个类
function Dog() {
    this.name = 'Dog';
}
function Cat() {
    this.name = 'Cat';
}
function Factory() {};
Factory.prototype.getInstance = function(className) {
    switch(className) {
        case 'Dog':
            return new Dog();
        case 'Cat':
            return new Cat();
    }
}
/*
var factory = new Factory();
var dog = factory.getInstance('Dog');
var cat = factory.getInstance('Cat');
console.log(dog.name + ' ' + cat.name);
*/

// 3)代理模式：一个对象充当另一个对象的接口
function Person() {};
Person.prototype.sayName = function() {
    console.log('Person');
}
Person.prototype.sayAge = function() {
    console.log('Age');
}
function PersonProxy() {
    this.Person = new Person();
}
PersonProxy.prototype.callMethod = function(fnName) {
    this.Person[fnName]();
}
/*
var personProxy = new PersonProxy();
personProxy.callMethod('sayName');
personProxy.callMethod('sayAge');
*/

// 4)发布订阅模式：于一个主题/事件通道，希望接收通知的对象通过自定义事件订阅主题，被激活事件的对象通过发布主题事件的方式被通知
function Public() {
    this.handlers = {};
}
Public.prototype = {
    constructor: Public,

    on: function(eventType, handler) {
        if(!(eventType in this.handlers)) {
            this.handlers[eventType] = [];
        }
        this.handlers[eventType].push(handler);
        return this;
    },

    off: function(eventType, handler) {
        var eventHandlers = this.handlers[eventType];
        if(eventHandlers) {
            for(var i = 0, len = eventHandlers.length; i < len; i++) {
                if(eventHandlers[i] === handler) {
                    this.handlers.splice(i, 1);
                }
            }
        }
        return this;
    },

    emit: function(eventType) {
        var handlerArgs = Array.prototype.slice.call(arguments, 1);
        for(var i = 0, len = this.handlers[eventType].length; i< len; i++) {
            this.handlers[eventType][i].apply(this, handlerArgs);
        }
    }
}

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
function SuperType(name) {
    this.name = name;

    if(typeof this.sayName !== 'function') {
        SuperType.prototype.sayName = function() {
            console.log("I'm " + this.name + ".");
        }
    }
}
function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;

    if(typeof this.sayAge !== 'function') {
        SubType.prototype.sayAge = function() {
            console.log("I'm " + this.age  + " years old.");
        }
    }
}
//ES5
(function() {
    SubType.prototype = Object.create(SuperType.prototype);
    SubType.prototype.constructor = SubType;
})();
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
var myNew = function(fn) {
    var obj = Object.create(fn.prototype);
    var returnObj = fn.call(obj, Array.prototype.slice.call(arguments, 1));
    return returnObj === 'object' ? returnObj : obj;
}
/*
var subType2 = myNew(SubType, 'SubType2');
console.log(subType2 instanceof SubType);
subType2.sayName();
*/

/*
Obeject.create实现
*/
Object.prototype.myCreate = function(prototype) {
    var Fn = function() {};
    Fn.prototype = prototype;
    return new Fn();
}


/*
parseNum函数：将数字转化为千分位
*/
var parseNum = function(num) {
    var array = String(num).split('').reverse();
    var temp = [];
    for(var i = 0, len = array.length; i < len; i += 3) {
        temp.push(array.slice(i, i + 3).reverse().join(''));
    }
    return temp.reverse().join(',');
}
//console.log(parseNum(12345678));


/*
delegateEvent函数：事件代理的实现
*/
var delegateEvent = function(parentElement, selector, type, fn) {
    var matchSelector = function(element, selector) {
        if(selector.charAt(0) === '#') {
            return element.id === selector.slice(1);
        } else if(selector.charAt(0) === '.') {
            return (' ' + element.className + ' ').indexOf(selector.slice(1)) !== -1;
        }
        return element.tageName.toLowerCase() === selector.toLowerCase();
    }

    var handler = function(event) {
        var event = event || window.event;
        var target = event.target || event.srcElement;

        if(matchSelector(target, selector)) {
            if(fn) {
                fn.call(event.target);
            }
        }
    }
    if(parentElement.addEventListener) {
        parentElement.addEventListener(type, handler);
    } else {
        parentElement.attach('on' + type, handler);
    }
}
/*
var box = document.getElementById('box');
delegateEvent(box, 'a', 'click', function() {
    console.log(this.href);
});
*/


/*
quickSort函数：快速排序实现
*/
var quickSort = function(array) {
    if(array.length <= 1) {
        return array;
    }
    var centerIndex = Math.floor(array.length / 2);
    var center = array.splice(centerIndex, 1)[0];
    var left = [];
    var right = [];
    for(var i = 0, len = array.length; i < len; i++) {
        if(array[i] < center) {
            left.push(array[i]);
        } else {
            right.push(array[i]);
        }
    }
    return quickSort(left).concat([center], quickSort(right));
}
//console.log(quickSort([9,4,6,2,1,5,3,7,8]));


/*
AOP：面向切面编程，实现before和after函数
*/
Function.prototype.before = function(beforeFn) {
    var self = this;
    return function() {
        beforeFn.apply(this, arguments);
        self.apply(this, arguments);
    }
}
Function.prototype.after = function(afterFn) {
    var self = this;
    return function() {
        self.apply(this, arguments);
        afterFn.apply(this, arguments);
    }
}
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
var CodingMan = function(name) {
    function Man(name) {
        setTimeout(function() {
            console.log('Hi! This is ' + name + '!');
        });
    }

    Man.prototype.sleep = function(seconds) {
        var currTime = new Date();
        var delay = seconds * 1000;
        setTimeout(function() {
            while(new Date - currTime < delay) {} //阻塞异步线程
            console.log('Wake up after ' + seconds);
        });
        return this;
    }

    Man.prototype.eat = function(food) {
        setTimeout(function() {
            console.log('Eat '+ food);
        });
        return this;
    }

    Man.prototype.sleepFirst = function(seconds) {
        var currTime = new Date();
        var delay = seconds * 1000;
        while(new Date() - currTime < delay) {} //阻塞同步线程
        console.log('Wake up after ' + seconds);
        return this;
    }
    
    return new Man(name);
}
//CodingMan('Peter');
//CodingMan('Peter').sleep(3).eat('dinner');
//CodingMan('Peter').eat('dinner').eat('supper');
//CodingMan('Peter').sleepFirst(5).eat('supper');

/*
compose函数：函数组合串联
*/
var compose = function(fns) {
    return function(arg) {
        return fns.reduceRight(function(composed, fn) {
            return fn(composed);
        }, arg);
    }
}
/*
var fn1 = a => a + 1;
var fn2 = b => b + 2;
var fn3 = c => c + 3;
console.log(compose([fn1, fn2, fn3])(100));
*/

/*
isFirst函数：该值是否第一次出现
*/
var isFirst = (function() {
    var list = [];
    return function(value) {
        if(list.indexOf(value) === -1) {
            list.push(value);
            return true;
        }
        return false;
    }
})();
//console.log(isFirst(1));
//console.log(isFirst(2));
//console.log(isFirst(1));



/*
myTrim函数：实现字符串头尾去空字符
*/
var myTrim = function(str) {
    var reg = /^\s+|\s+$/g;
    return str.replace(reg, '');
}
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
function Foo() {}
Foo.prototype.a = 1;
var foo1 = new Foo();
var foo2 = new Foo();
console.log(foo1.a)
console.log(foo2.a)
foo1.__proto__.a = 2;
console.log(foo1.a)
console.log(foo2.a)
console.log(Foo.name)

console.log('a' instanceof String)
