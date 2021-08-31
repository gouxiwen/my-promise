// 手写实现instanceof

function myinstanceof(left, right) {
    let leftValue = left.__proto__
    let rightValue = right.prototype
    while(true) {
        if(leftValue === null) {
            return false
        } else if(leftValue === rightValue) {
            return true
        } else {
            leftValue = leftValue.__proto__
        }
    }
}

console.log(myinstanceof([], Array))
console.log([] instanceof Array)