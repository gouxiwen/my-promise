// 利用apply实现bind
Function.prototype.myBind = function (context) {
    let self = this;
    return function() {
        console.log('aaa', arguments)
           let arg = Array.prototype.slice.call(arguments)
        // let arg = [].slice.call(arguments)
        //    let arg = Array.from(arguments).slice(0)
        console.log('bbb', arg)
        return self.apply(context, arg)
    }
}
function test(age) {
    return this.name + ':' + age
}

let bindFun = test.myBind({name: 'sam'})
console.log(bindFun(18))