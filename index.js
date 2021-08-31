const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
// 第一版，基础版
// module.exports =  class MyPromise {
//     constructor(executor) {
//         this.state = PENDING; // PENDING只使用一次
//         this.value = null;
//         this.reason = null;

//         // 定义resolve函数
//         const resolve = value => {
//             if(this.state === PENDING) {
//                 this.state = FULFILLED;
//                 this.value = value;
//             }
//         }

//         // 定义reject函数
//         const reject = reason => {
//             if(this.state === PENDING) {
//                 this.state = REJECTED;
//                 this.reason = reason;
//             }
//         }

//         // 立即执行传入的执行器函数executor
//         try {
//             executor(resolve, reject)
//         } catch (error) {
//             reject(error)
//         }
//     }

//     // then函数
//     then(onFulfilled, onRejected) {
//         if (this.state === FULFILLED) {
//             onFulfilled(this.value)
//         }

//         if (this.state === REJECTED) {
//             onRejected(this.reason)
//         }
//     }
// }
// 第二版，解决异步resolve/reject
// module.exports =  class MyPromise {
//     constructor(executor) {
//         this.state = PENDING; // PENDING只使用一次
//         this.value = null;
//         this.reason = null;

//         // 存放成功/失败回调的函数，解决异步问题，因为then函数是同步执行的，而resolve/reject是需要异步执行的
//         this.onFulfilledCallbacks = [];
//         this.onRejectedCallbacks = [];
//         // 定义resolve函数
//         const resolve = value => {
//             if(this.state === PENDING) {
//                 this.state = FULFILLED;
//                 this.value = value;
//                 this.onFulfilledCallbacks.map(fn => fn())
//             }
//         }

//         // 定义reject函数
//         const reject = reason => {
//             if(this.state === PENDING) {
//                 this.state = REJECTED;
//                 this.reason = reason;
//                 this.onRejectedCallbacks.map(fn => fn())
//             }
//         }

//         // 立即执行传入的执行器函数executor
//         try {
//             executor(resolve, reject)
//         } catch (error) {
//             reject(error)
//         }
//     }

//     // then函数
//     then(onFulfilled, onRejected) {
//         if (this.state === FULFILLED) {
//             onFulfilled(this.value)
//         }

//         if (this.state === REJECTED) {
//             onRejected(this.reason)
//         }

//         // 状态是pending说明resolve/reject还没有执行，异步
//         if (this.state === PENDING) {
//             this.onFulfilledCallbacks.push(() => {
//                 onFulfilled(this.value)
//             })
//             this.onRejectedCallbacks.push(() => {
//                 onRejected(this.reason)
//             })
//         }
//     }
// }
// 第三版，解决链式调用和then中不传参的问题，链式调用就是返回一个promise实例，不传参就是给个默认参数
module.exports =  class MyPromise {
    constructor(executor) {
        this.state = PENDING; // PENDING只使用一次
        this.value = null;
        this.reason = null;

        // 存放成功/失败回调的函数，解决异步问题，因为then函数是同步执行的，而resolve/reject是需要异步执行的
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        // 定义resolve函数
        const resolve = value => {
            if(this.state === PENDING) {
                this.state = FULFILLED;
                this.value = value;
                this.onFulfilledCallbacks.map(fn => fn())
            }
        }

        // 定义reject函数
        const reject = reason => {
            if(this.state === PENDING) {
                this.state = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.map(fn => fn())
            }
        }

        // 立即执行传入的执行器函数executor
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    // then函数
    then(onFulfilled, onRejected) {
        let self = this;
        let promise2 = null;
        // 解决不传参或者参数不是function
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        // 如果传了onRejected参数就执行onRejected，如果没有传就需要抛出错误实现错误/异常穿透
        // 如果有onRejected且有返回值，则返回值会被后面then的resolve捕获，因为后续的resolvePromise方法会按照正常情况传递返回值
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
        // 包一层setTimeout就是模拟微任务队列，下一轮执行
        promise2 = new MyPromise((resolve, reject) => {
            // 状态是pending说明resolve/reject还没有执行，异步
            if (this.state === PENDING) {
                // console.log('then pending')
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            console.log('then resovle1 return', x, typeof x)
                            self.resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            console.log('then reject1 return', x, typeof x)
                            self.resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
            }
            if (this.state === FULFILLED) {
                // console.log('then fulfilled')
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        console.log('then resolve2 return', x, typeof x)
                        self.resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
    
            if (this.state === REJECTED) {
                // console.log('then rejected')
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        console.log('then reject2 return', x, typeof x)
                        self.resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
        })

        return promise2;

    }

    // 解决then里面返回了任何值（包括promise）的情况，通过递归调用取到最后返回的不是promise对象为止
    resolvePromise(promise2, x, resolve, reject) {
        console.log('resolvePromise', x)
        let self = this;
        let called = false;
        // 防止循环引用，自己等待自己
        if (promise2 === x) {
            return reject(new TypeError('循环引用'))
        }
        // if (x !== null && (Object.prototype.toString.call(x) === '[object Object]' || Object.prototype.toString.call(x) === '[object Function]')) {
            // x是对象或者函数
        if(x instanceof MyPromise){ // 优化判断
            // 自己实现的MyPromise返回的是一个对象
            try {
                if (called) return;
                x.then.call(x, (v) => {
                    // 例如 return Promise.resolve()
                    // 再次递归调用resolvePromise处理返回值，直到x不是promise
                    self.resolvePromise(promise2, v, resolve, reject)
                    // 别人的Promise的then方法可能设置了getter等，使用called防止多次调用then方法
                    called = true;
                },(v) => {
                    // 例如 return Promise.reject()
                    // 不论返回什么都走reject，即使是promise
                    reject(v)
                    // 别人的Promise的then方法可能设置了getter等，使用called防止多次调用then方法
                    called = true;
                })
            } catch (error) {
                console.log('promise reject', error)
                if (called) return;
                called = true;
                reject(error);
            }
        } else {
            // 普通值，直接resolve给后面的then调用
            resolve(x);
        }
    }

    // catch函数，调用then传reject
    catch(onRejected) {
        return this.then(null, onRejected)
    }

    // 都会执行fn
    finally(fn) {
        return this.then(value => {
            fn();
            return value;
        }, err => {
            fn();
            throw err;
        })
    }

    // 几个静态方法，实际上都是通过返回实例来实现的

    // resolve方法
    static resolve(val) {
        return new MyPromise((resolve, reject) => {
            resolve(val)
        })
    }

    //reject方法
    static reject(val) {
        return new MyPromise((resolve, reject) => {
            reject(val)
        })
    }

    // all方法
    static all(promiseArr) {
        return new MyPromise((resolve, reject) => {
            let result = [];
    
            promiseArr.forEach((promise, index) => {
                promise.then((value) => {
                    result[index] = value;
    
                    if (result.length === promiseArr.length) {
                        resolve(result);
                    }
                }, reject);
            });
        });
    }

    // race方法
    static race(promiseArr) {
        return new MyPromise((resolve, reject) => {
            promiseArr.forEach(promise => {
                promise.then((value) => {
                    resolve(value);
                }, reject);
            });
        });
    }

    // deferred方法，Promise上的语法糖，为了防止嵌套，方便调用
    // 坏处 错误处理不方便
    static deferred() {
        let dfd = {};
        dfd.promies = new MyPromise((resolve, reject) => {
            dfd.resolve = resolve;
            dfd.rfeject = reject;
        });
        return dfd;
    }

    // 用法eg：
    // let fs = require('fs')
    // function read(){
    //   let defer = MyPromise.defer()
    //   fs.readFile('./1.txt','utf8',(err,data)=>{
    //     if(err)defer.reject(err)
    //     defer.resolve(data)
    //   })
    //   return defer.Promise
    // }

}
