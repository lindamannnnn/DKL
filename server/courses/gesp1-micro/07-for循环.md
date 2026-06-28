# 课程07：for 循环

> 🎯 目标：让程序帮你重复做事情，不用一直抄同样的代码！

---

## 故事：数糖果

<!-- story -->
妈妈给小明一盒糖果：

> 你一颗一颗数，数完告诉我一共有多少颗。

小明数：1、2、3、4、5……

这种重复做的事情，交给 `for` 循环最合适！
<!-- end-story -->

---

## 卡片：for 循环有三个部分

<!-- card type:teacher -->
🔄 `for` 循环就像一个小机器人，知道从哪开始、到哪结束、每次走几步。

```cpp
for (从几开始; 继续条件; 每次变化) {
    // 重复做的事情
}
```

比如从 1 数到 5：
```cpp
for (int i = 1; i <= 5; i++) {
    cout << i << " ";
}
```
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：for 循环几次？

<!-- checkpoint -->
<!-- quiz: choice -->
`for (int i = 1; i <= 3; i++)` 会循环几次？
A. 1 次
B. 2 次
C. 3 次
<!-- answer: C -->
<!-- end-checkpoint -->

---

## 卡片：i++ 是让 i 加 1

<!-- card type:teacher -->
➕ `i++` 是 `i = i + 1` 的简写，意思是让 `i` 自己加 1。

同理 `i--` 是让 `i` 自己减 1。

```cpp
int i = 5;
i++;   // i 变成 6
i--;   // i 变回 5
```
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 3; i++) {
        cout << i << endl;
    }
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：i++ 是什么意思？

<!-- checkpoint -->
<!-- quiz: choice -->
`i++` 等价于？
A. `i = i - 1`
B. `i = i + 1`
C. `i = 0`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：倒着数也可以

<!-- card type:teacher -->
🔁 `for` 循环不仅能正着数，也能倒着数。

```cpp
for (int i = 5; i >= 1; i--) {
    cout << i << " ";
}
// 输出：5 4 3 2 1
```
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 5; i >= 1; i--) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：哪个循环倒着数？

<!-- checkpoint -->
<!-- quiz: choice -->
哪个循环会输出 `5 4 3 2 1`？
A. `for (int i = 1; i <= 5; i++)`
B. `for (int i = 5; i >= 1; i--)`
C. `for (int i = 5; i <= 1; i--)`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：局部变量住在 {} 里

<!-- card type:teacher -->
🏠 在 `{}` 里面定义的变量，只能在这个 `{}` 里面使用，叫做**局部变量**。

```cpp
for (int i = 1; i <= 3; i++) {
    int x = i;   // x 只能在大括号里用
}
// 在这里不能用 x
```

> 💡 循环变量 `i` 也是局部变量，只在循环里有效。
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 3; i++) {
        cout << i << " ";
    }
    // cout << i;   // 错误！i 在外面不能用
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：局部变量在哪用？

<!-- checkpoint -->
<!-- quiz: choice -->
局部变量定义在哪里？
A. 所有函数外面
B. 函数内部或 `{}` 内部
C. 程序最开头
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：循环里加判断

<!-- card type:teacher -->
🎯 循环和 `if` 可以一起用，挑出符合条件的数。

比如输出 1~10 中的偶数：
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) {
            cout << i << " ";
        }
    }
    cout << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：挑偶数

<!-- checkpoint -->
<!-- quiz: choice -->
`for (int i = 1; i <= 10; i++)` 配合 `if (i % 2 == 0)` 会输出什么？
A. 1 2 3 4 5 6 7 8 9 10
B. 2 4 6 8 10
C. 1 3 5 7 9
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：累加就像往桶里丢石头

<!-- card type:teacher -->
🪨 想算 1+2+3+...+100，可以准备一个"桶"，每次循环往里面丢一个数。

```cpp
int sum = 0;          // 空的桶
for (int i = 1; i <= 100; i++) {
    sum = sum + i;    // 把 i 丢进桶里
}
```
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i <= 100; i++) {
        sum = sum + i;
    }
    cout << sum << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：累加结果

<!-- checkpoint -->
<!-- quiz: choice -->
`sum = 0; for (int i = 1; i <= 3; i++) sum = sum + i;` 最后 `sum` 是多少？
A. 3
B. 6
C. 0
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 挑战 1：输出 3 的倍数

<!-- card type:computer -->
🖥️ 用 for 循环输出 1 到 20 中所有 3 的倍数。
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 20; i++) {
        if (i % 3 == 0) {
            cout << i << " ";
        }
    }
    cout << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 挑战 2：计算 1 加到 n

<!-- card type:computer -->
🖥️ 输入一个整数 n，计算 1+2+3+...+n 的和。
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum = sum + i;
    }
    cout << sum << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 小贴士：别在 for 后面加分号

<!-- hint -->
❌ 错误：
```cpp
for (int i = 1; i <= 5; i++); {
    cout << i << endl;
}
```

`for` 后面加了分号，循环体就是空的，`{}` 里的代码只会执行一次。
<!-- end-hint -->

---

## 课后挑战


<!-- problem: 6bad4c81-19e5-4faf-99c1-5bde52d48c2d -->
<!-- problem: f05395ad-7506-4906-96a8-01dc333433ee -->
<!-- problem: 09b06146-35d4-4055-b55a-4a17e3ce71fc -->
<!-- problem: 548e02e4-14ae-498a-8eb6-dea787f144c1 -->
<!-- problem: 5403a277-de8f-4d33-8fc3-bbd213ff60bd -->