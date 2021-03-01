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

mp.then(suc => {
    console.log(suc)
}, err => {
    console.error(err)
})
mp1.then(suc => {
    console.log(suc)
}, err => {
    console.error(err)
    return '123'
}).then(res => {
    console.log(res)
})