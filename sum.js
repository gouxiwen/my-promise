// 实现一个sum函数，可以链式调用，最后返回所有参数的和
// 如：sum(1,3)(4) 输出7
// 知识点：1.无限柯里化，2.重写toString方法，3.Array.reduce方法
function sum() {
    let arg1 = Array.from(arguments)
    let fn = function () {
        let arg2 = [].slice.call(arguments)
        return sum.apply(null, [...arg1, ...arg2])
    }
    fn.toString = function () {
        return arg1.reduce((value, item) => {
            return value + item
        })
    }

    return fn
}

console.log(sum(1,3)(4))