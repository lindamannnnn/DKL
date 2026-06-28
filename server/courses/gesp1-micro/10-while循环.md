# 课程10：while 循环

> 🎯 目标：学会"不知道要循环几次"时用 while 循环！

---

## 故事：跑步

<!-- story -->
小明每天跑步：

> 只要还没跑够 1000 米，就继续跑。

他不知道要跑多少圈，只知道一个条件。这种循环用 `while` 最合适！
<!-- end-story -->

---

## 卡片：while 只要条件成立就继续

<!-- card type:teacher -->
🔄 `while` 循环的格式：

```cpp
while (条件) {
    // 重复做的事情
}
```

先判断条件，条件成立就执行一次，然后回来再判断。
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    int i = 1;
    while (i <= 5) {
        cout << i << " ";
        i++;   // 别忘了让 i 变化，否则会死循环
    }
    cout << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：while 先做什么？

<!-- checkpoint -->
<!-- quiz: choice -->
`while` 循环先判断条件，还是先执行循环体？
A. 先执行，后判断
B. 先判断，后执行
C. 只执行一次
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：while 和 for 的区别

<!-- card type:teacher -->
🆚 `for` 适合知道循环次数，`while` 适合知道停止条件。

- 数 1 到 100 → 用 `for`
- 输入 0 才停止 → 用 `while`
<!-- end-card -->

---

## 卡片：do-while 至少执行一次

<!-- card type:teacher -->
🔁 `do-while` 先执行一次，再判断条件。

```cpp
do {
    // 先执行一次
} while (条件);
```

> 💡 注意末尾有分号 `;`
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    int i = 1;
    do {
        cout << i << " ";
        i++;
    } while (i <= 5);
    cout << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：哪个至少执行一次？

<!-- checkpoint -->
<!-- quiz: choice -->
哪个循环至少执行一次？
A. `for`
B. `while`
C. `do-while`
<!-- answer: C -->
<!-- end-checkpoint -->

---

## 卡片：复合运算符让代码更短

<!-- card type:teacher -->
➕ 复合运算符是偷懒写法：

| 符号 | 等价于 |
|------|--------|
| `a += 5` | `a = a + 5` |
| `a -= 3` | `a = a - 3` |
| `a *= 2` | `a = a * 2` |
| `a /= 4` | `a = a / 4` |
| `a %= 10` | `a = a % 10` |

> 💡 功能一样，只是写得快一点。
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 10;
    a += 5;   // a = 15
    a -= 3;   // a = 12
    a *= 2;   // a = 24
    cout << a << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：+= 的意思

<!-- checkpoint -->
<!-- quiz: choice -->
`a += 3` 等价于？
A. `a = 3`
B. `a = a + 3`
C. `a = a - 3`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：小心死循环

<!-- card type:teacher -->
🛑 如果 `while` 的条件一直成立，循环就会永远跑下去，叫做**死循环**。

```cpp
int i = 1;
while (i <= 10) {
    cout << i << endl;
    // 如果忘了写 i++，就死循环了！
}
```
<!-- end-card -->

---

## 检查点：什么情况死循环？

<!-- checkpoint -->
<!-- quiz: choice -->
`while (i <= 10)` 中，如果 `i` 一直不增加，会？
A. 循环 10 次
B. 死循环
C. 编译错误
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 挑战 1：输入 0 才停止

<!-- card type:computer -->
🖥️ 不断输入整数，输入 0 时停止，并输出之前所有数的和。

> 💡 先读第一个数，看看是不是 0。不是 0 就进入循环，再读下一个。
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    int x;
    cin >> x;              // 先读第一个数
    while (x != 0) {       // 只要不是 0，就继续
        sum += x;          // 把这个数加起来
        cin >> x;          // 再读下一个数
    }
    cout << sum << endl;   // 输出总和
    return 0;
}
```
<!-- end-demo -->

---

## 挑战 2：用 while 拆数字

<!-- card type:computer -->
🖥️ 输入一个整数，用 while 循环从个位开始输出每一位。

> 比如输入 1234，输出 4 3 2 1。
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    while (n > 0) {
        cout << n % 10 << " ";
        n /= 10;   // 去掉个位
    }
    cout << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 小贴士：do-while 末尾有分号

<!-- hint -->
`do-while` 的 `while` 后面有分号：

```cpp
do {
    ...
} while (条件);
```

不要忘了这个分号！
<!-- end-hint -->

---

## 课后挑战


<!-- problem: e4fcb451-d675-475a-968f-a2c4dc7dd14b -->
<!-- problem: c55f917b-3edd-42dc-9e93-a3e779a0becd -->
<!-- problem: 32d739a1-8740-414a-b6e8-08c78fc885cf -->
<!-- problem: 33565252-696e-4759-a916-7f737d2da95e -->
<!-- problem: b6362f2f-29ac-43b2-a736-bc05b96ee6fd -->