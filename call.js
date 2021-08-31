Function.prototype.myCall = function (context, ...arg) {
    context.fn = this
    let res = context.fn(...arg)
    delete context.fn
    return res
}

let testObj = {
    name: 'test'
}

let obj = {
    name: 'zhangsan',
    fn(age) {
        return this.name + age
    }
}

console.log(obj.fn.myCall(testObj, 1))