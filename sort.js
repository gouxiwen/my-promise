// js排序算法
let arr = [1,9,34,5,6,33,3,5,6,3]
// js引擎自带的方法
// arr.sort((a, b) => a - b)
// 交换-冒泡排序，最坏O(n^2)，最好O(n^2)
// function bubbleSort(arr) {
//     let len = arr.length;
//     for (let i = 0; i < len - 1; i++) {
//        for (let j = 0; j < len - i - 1; j++) {
//            if(arr[j] > arr[j+1]) {
//                [arr[j], arr[j+1]] = [arr[j+1],arr[j]]
//            }
           
//        }
        
//     }
//     return arr;
// }
// console.log(bubbleSort(arr))
// 交换-快速排序，最坏O(n^2)，最好O(n*log2(n))
// 第一种，选择一个基准值，将数组分成左右两部分，然后分别递归
// function quickSort(arr) {
//     let len = arr.length;
//     if(len < 2) return arr;
//     let flag = arr[0]
//     let left = []
//     let right = []
//     for (let i = 1; i < len; i++) {
//        if(arr[i] < flag) {
//            left.push(arr[i])
//        } else right.push(arr[i])
        
//     }
//     return [...quickSort(left), flag, ...quickSort(right)]
// }
// console.log(quickSort(arr))
// 第二种不用新数组来保存，直接在原数组上操作，内存占用比较少
// 第二种，选择一个基准，先从最后向前找到第一个比基准小的，交换，记录位置，然后从第一个向后找第一个比基准大的，交换位置，重复以上步骤，直到左右相遇
function quickSort(arr,left = 0,right = arr.length - 1){
    if(left < right) {
        let i = left,j = right;
        let x = arr[left] // 基准保存在x中
        while(i < j) {
            // 从右边开始找小于x的数
            while(i < j && arr[j] > x) {
                j--
            }
            if(i < j) {
                // 交换位置
                arr[i] = arr[j]
                i++
            }
            // 从左边开始找大于x的数
            while(i < j && arr[i] < x) {
                i++
            }
            if(i < j) {
                // 交换位置
                arr[j] = arr[i]
                j--
            }
        }
        // i和j重合时，基准数赋值给
        arr[i] = x
        // 对i左右两边对数组分别递归以上操作
        quickSort(arr, left, i -1) // i左边
        quickSort(arr, i + 1, right) // i右边
    }
    return arr;
}
console.log(quickSort(arr))
// 选择排序，最坏O(n^2)，最好O(n^2)
// function selectSort(arr) {
//     let len = arr.length;
//     for (let i = 0; i < len; i++) {
//         let min = i
//         for (let j = i + 1; j < len; j++) {
//             if(arr[j] < arr[min])
//             min = j
//         }
//         if(min !== i) {
//             [arr[i], arr[min]] = [arr[min], arr[i]]
//         }
//     }
//     return arr
// }
// console.log(selectSort(arr))
// 插入排序，最坏O(n^2)，最好O(n^2)，未排的数插入到已排的数里，默认第一个已排，i从1开始
// function insertSort(arr) {
//     let len = arr.length;
//     let preIndex, current
//     for (let i = 1; i < len; i++) {
//         preIndex = i - 1 // 排好序的数组的最后一个下标
//         current = arr[i] // 待排序数值
//         //让待排序的值与排序好的数组值进行比较
//         while(preIndex >= 0 && arr[preIndex] > current) {
//             arr[preIndex + 1] = arr[preIndex] // 如果比待排序数值大，则向后移动
//             preIndex--
//         }
//         arr[preIndex + 1] = current // 将待排序数值插入到条件停止的位置
//     }
//     return arr
// }
// console.log(insertSort(arr))
// 希尔排序，最坏O(n^2)，最好O(n)
// function ShellSort(arr) {
//     let len = arr.length;
//     let temp;
//     let gap = Math.floor(len/2)
//     while (gap >= 1) {  //当分组变成成1时则排序完成
//        for (let i = gap; i < len; i++) {  //按增量循环数组
//            temp = arr[i]; // 待排序数值
//             let j = i - gap
//            //增量大于零且前面的数组的值大于待排序数值则交换位置
//            for (; j >= 0 && arr[j] > temp; j -= gap) {
//                arr[j + gap] = arr[j]; // 如果比待排序数值大，则向后移动gap
//            }
//            arr[j + gap] = temp;
//        }
//        gap = Math.floor(gap/2); //递减增量
//     }
//     return arr;
// }
// function shellSort(arr) {
//     for(let gap = Math.floor(arr.length/2); gap > 0; gap = Math.floor(gap/2)) {
//       // 内层循环与插入排序的写法基本一致，只是每次移动的步长变为 gap
//       for(let i = gap; i < arr.length; i++) {
//         let j = i;
//         let temp = arr[j];
//         for(; j> 0; j -= gap) {
//           if(temp >= arr[j-gap]) {
//             break;
//           }
//           arr[j] = arr[j-gap];
//         }
//         arr[j] = temp;
//       }
//     }
//     return arr;
//   }
// console.log(ShellSort(arr))