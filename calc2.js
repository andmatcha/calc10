const answerBox = document.getElementById('answerBox');　//答えの表示部分の要素
let answerLength;

//input欄をクリア
function clearForm() {
    document.getElementById('inputA').value = '';
    document.getElementById('inputB').value = '';
    document.getElementById('inputC').value = '';
    document.getElementById('inputD').value = '';
}

//式の数を数える
function count() {
    //式が入るpタグのうち、空でないものを数える
    const countArr = [];
    document.querySelectorAll('.js_text').forEach((value) => {
        if (value.innerText !== '') {
            countArr.push(value);
        }
    })
    answerLength = countArr.length;
}

//答えとなる式を表示
function showFormula(array, process1, process2, process3) {
    const symbolArray = ['+', '-', '×', '÷']; //表示する用の演算子
    let text;
    //必要に応じて()をつける
    if ((process1 === 0 || process1 === 1) && (process2 === 2 || process2 === 3)) {
        text = `(${array[0] + symbolArray[process1] + array[1]})${symbolArray[process2] + array[2] + symbolArray[process3] + array[3]}`;
    } else if ((process2 === 0 || process2 === 1) && (process3 === 2 || process3 === 3)) {
        text = `(${array[0] + symbolArray[process1] + array[1] + symbolArray[process2] + array[2]})${symbolArray[process3] + array[3]}`;
    } else {
        text = `${array[0] + symbolArray[process1] + array[1] + symbolArray[process2] + array[2] + symbolArray[process3] + array[3]}`;
    }
    //重複する式を省く
    const answerTexts = document.querySelectorAll('.js_text');
    answerTexts.forEach((answerText) => {
        if (answerText.innerText === text) {
            text = '';
        }
    });
    //式をHTMLに出力
    answerBox.insertAdjacentHTML('beforeend', `<p class="js_text">${text}</p>`);
}

//2数の四則演算
function operate(x, y) {
    const resultArray = [];
    resultArray.push(x + y);
    resultArray.push(x - y);
    resultArray.push(x * y);
    if (x !== 0 && y !== 0) {
        resultArray.push(x / y);
    }
    return resultArray;
}

//配列の要素の順列を全て出力
//コピペここから
const permutation = (array) => {
    let result = [];
    if (array.length === 1) {
        result.push(array);
        return result;
    }
    for (let i = 0; i < array.length; i++) {
        const firstElem = array.slice(i, i + 1);
        const restElem = [
            ...array.slice(0, i),
            ...array.slice(i + 1),
        ];
        let innerPermutations = permutation(restElem);
        for (let j = 0; j < innerPermutations.length; j++) {
            result.push([...firstElem, ...innerPermutations[j]]);
        }
    }
    return result;
};
//コピペここまで

//計算するボタンをクリックした時に実行
function clickFn() {
    //答えの表示部分をクリア
    answerBox.innerText = '';
    //4数を取得
    let a = document.getElementById('inputA').value - 0;
    let b = document.getElementById('inputB').value - 0;
    let c = document.getElementById('inputC').value - 0;
    let d = document.getElementById('inputD').value - 0;
    //4数の配列
    const numArray = [a, b, c, d];
    //配列の全ての並べ替えについて繰り返し
    permutation(numArray).forEach((numArray) => {
        //1回目の四則演算について繰り返し
        operate(numArray[0], numArray[1]).forEach((result1, resultIndex1) => {
            //2回目の四則演算について繰り返し
            operate(result1, numArray[2]).forEach((result2, resultIndex2) => {
                //3回目の四則演算について繰り返し
                operate(result2, numArray[3]).forEach((result3, resultIndex3) => {
                    //計算結果が10になる場合のみ式を表示させる関数を実行
                    const answer = result3;
                    if (answer === 10) {
                        showFormula(numArray, resultIndex1, resultIndex2, resultIndex3);
                    }
                });
            });
        });
    });
    //入力値、式の数を出力
    count();
    answerBox.insertAdjacentHTML('afterbegin', `<p>a=${a}, b=${b}, c=${c}, d=${d} のとき、答えが10となる式は以下の${answerLength}個あります。</p>`);
    clearForm();
}