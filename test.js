// import MyPromise from './index';
const MyPromise = require('./index')

const mp = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功')
    }, 1000);
})
const mp1 = new MyPromise((resolve, reject) => {
    reject('失败')
})
const mp2 = new MyPromise((resolve, reject) => {
    resolve()
})

// mp.then(suc => {
//     console.log(suc)
// }, err => {
//     console.error(err)
// })
// mp1.then(suc => {
//     console.log(suc)
// }, err => {
//     console.error(err)
//     return '123'
// }).then(res => {
//     console.log(res)
// })

mp2.then(() => {
    return MyPromise.reject('错误')
})
.then(res => {
    console.log('then', res) // 这里不执行
})
.catch(err => {
    console.log('catch', err)
})