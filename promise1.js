
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

module.exports = class MyPromise {
    constructor(executor) {
        this.status = PENDING
        this.value = null
        this.reason = null
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        let resolve = value => {
            this.status = FULFILLED
            this.value = value
            this.onFulfilledCallbacks.map(fn => fn())
        }
        let reject = reason => {
            this.status = REJECTED
            this.reason = reason
            this.onRejectedCallbacks.map(fn => fn())
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            
        }
    }

    then(onFulfilled, onRejected) {
        let self = this
        let promise = null
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}
        promise = new MyPromise((resolve, reject) => {
            if(this.status === PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
            }
            if(this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
            if(this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
        })
        return promise
        function resolvePromise(promise1, x, resolve, reject){
            let called = false
            if(x === promise1) {
                return reject(new TypeError('循环引用'))
            }
            if (x instanceof MyPromise) {
                if(called) return
                try {
                    x.then.call(x, (v) => {
                        resolvePromise(promise1, v, resolve, reject)
                        called = true
                    }, (err) => {
                        reject(err)
                        called = true
                    })
                } catch (error) {
                    reject(error)
                    called = true
                }
            } else {
                resolve(x)
            }
        }
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }

    static reject(err) {
        return new MyPromise((resolve, reject) => {
            reject(err)
        })
    }

    static resolve(val) {
        return new MyPromise((resolve, reject) => {
            resolve(val)
        })
    }

}