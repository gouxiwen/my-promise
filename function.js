var a = 1

// 这种写法会变量提升
function a() {

}
a = function() {

}

console.log(a)