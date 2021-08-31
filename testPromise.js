const MyPromise = require('./promise1')

const p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(123)
    }, 1000);
})

const p2 = new MyPromise((resolve, reject) => {
    reject('错误')
})

p1.then((res) => {
    console.log(res)
    return MyPromise.resolve(234)
    // return '123'
    // return {}
    return MyPromise.reject('err')
}).then(res => {
    console.log(res)
}).catch(err => {
    console.error('catch', err)
})

// p2.then((res) => {
//     console.log(res)
// }, (err) => {
//     console.error(err)
// })