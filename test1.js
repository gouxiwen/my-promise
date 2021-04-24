// 从多维数组中找出number类型的个数
let mutilArr = ['1', 1, NaN, [2, null, [3, true, 5]], 4, 'N']
function get(arr) {
    let count = 0;
    arr.forEach(element => {
        if (typeof element === 'number') {
            count += 1;
        } else if (Array.isArray(element)) {
            count += get(element)
        }
    });
    return count;
}

console.log(get(mutilArr))