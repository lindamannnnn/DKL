# 课程14：while 循环

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
#include <bits/stdc++.h>
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
🔄 `do-while` 和 `while` 很像，但它是**先执行，后判断**。

```cpp
do {
    // 循环体
} while (条件);
```

也就是说，不管条件成不成立，循环体至少会执行一次。

```cpp
int i = 1;
do {
    cout << i << " ";
    i++;
} while (i <= 5);
// 输出：1 2 3 4 5
```

> 💡 `do-while` 最后有个分号 `;`，别忘了！
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    do {
        cout << "请输入一个正数：";
        cin >> n;
    } while (n <= 0);
    cout << "你输入的是：" << n << endl;
    return 0;
}
```
<!-- end-demo -->

---

### 卡片：do-while 什么时候用？

<!-- card type:teacher -->
`do-while` 适合"至少要先做一遍"的事情：

```
比如输入密码：
    先让用户输入一次
    如果不对，再让他重新输入
    直到输入正确为止
```

如果你用普通 `while`，要先在循环外写一次输入，再在循环里写一次输入，比较啰嗦。`do-while` 把这两步合在一起。

> 💡 对 GESP1 来说，`do-while` 不是必须掌握的。只要能看懂、会写最简单的形式就够了，比赛时大多数题目用 `while` 或 `for` 都能解决。
<!-- end-card -->

---

### 检查点：do-while 的特点

<!-- checkpoint -->
<!-- quiz: choice -->
`do-while` 循环至少执行几次？
A. 0 次
B. 1 次
C. 由条件决定
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 报错也不慌：while 条件别写错

<!-- card type:tip -->
💡 `while` 后面的条件为真时，循环才继续。

如果条件一开始就是假，循环一次都不会执行。

```cpp
int i = 11;
while (i <= 10) {   // 11 <= 10 是假，循环不执行
    cout << i << endl;
}
```
<!-- end-card -->

<!-- demo -->
```cpp
int i = 1;
while (i <= 5) {    // ✅ 条件为真，进入循环
    cout << i << endl;
    i++;
}
```
<!-- end-demo -->

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
#include <bits/stdc++.h>
using namespace std;

int main() {
    int sum = 0;
    int x;
    cin >> x;              // 先读第一个数
    while (x != 0) {       // 只要不是 0，就继续
        sum = sum + x;     // 把这个数加起来
        cin >> x;          // 再读下一个数
    }
    cout << sum << endl;   // 输出总和
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
📋 **评讲逻辑**

- **考察知识点**：`while` 循环、先读再判断、累加求和。
- **解题思路**：
  1. 先读入第一个整数 `x`；
  2. 用 `while (x != 0)` 判断是否继续；
  3. 在循环里把 `x` 加到 `sum`，再读入下一个 `x`；
  4. 当读到 0 时条件不成立，循环结束，输出总和。
- **容易错的地方**：
  - 循环条件写成 `while (x == 0)`，导致一次也不执行；
  - `sum` 没有初始化为 0；
  - `cin >> x` 的位置放错，导致把 0 也加进总和。
- **关键代码解释**：
  ```cpp
  int sum = 0;
  int x;
  cin >> x;                   // 先读第一个数
  while (x != 0) {            // 不是 0 就继续
      sum = sum + x;          // 累加当前数
      cin >> x;               // 再读下一个数
  }
  ```
<!-- end-card -->

---

## 挑战 2：用 while 拆数字

<!-- card type:computer -->
🖥️ 输入一个整数，用 while 循环从个位开始输出每一位。

> 比如输入 1234，输出 4 3 2 1。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    while (n > 0) {
        cout << n % 10 << " ";
        n = n / 10;   // 去掉个位
    }
    cout << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
📋 **评讲逻辑**

- **考察知识点**：`while` 循环、`%10` 取个位、`/10` 去掉个位。
- **解题思路**：
  1. 读入整数 `n`；
  2. 当 `n > 0` 时循环；
  3. 每次输出 `n % 10`（当前个位）；
  4. 然后用 `n = n / 10` 去掉个位，准备下一次。
- **容易错的地方**：
  - 忘记写 `n = n / 10`，导致 `while` 死循环；
  - 误以为输出顺序要正序，实际上题目要求从个位开始输出；
  - 输入为 0 时不会进入循环，需要特别处理。
- **关键代码解释**：
  ```cpp
  while (n > 0) {
      cout << n % 10 << " ";  // 输出当前个位
      n = n / 10;             // 去掉个位
  }
  ```
<!-- end-card -->

---

## 卡片：复合赋值运算符

<!-- card type:teacher -->
➕ 有一些写法可以让代码更短：

| 简写 | 等价于 | 含义 |
|------|--------|------|
| `a += b` | `a = a + b` | a 加上 b |
| `a -= b` | `a = a - b` | a 减去 b |
| `a *= b` | `a = a * b` | a 乘以 b |
| `a /= b` | `a = a / b` | a 除以 b |
| `a %= b` | `a = a % b` | a 取余 b |

```cpp
int sum = 0;
sum += 5;   // 等价于 sum = sum + 5;
```

> 💡 初学时，把完整写法 `sum = sum + x` 写清楚更好。等熟练了，再用 `sum += x`。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int a = 10;
    a += 5;   // a 变成 15
    a -= 3;   // a 变成 12
    a *= 2;   // a 变成 24
    cout << a << endl;
    return 0;
}
```
<!-- end-demo -->

---

### 检查点：+= 是什么意思

<!-- checkpoint -->
<!-- quiz: choice -->
`sum += x;` 等价于？
A. `sum = x`
B. `sum = sum + x`
C. `sum = sum - x`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 小贴士：别忘了让变量变化

<!-- hint -->
`while` 循环里，一定要记得让条件里的变量变化，否则会死循环。

```cpp
int i = 1;
while (i <= 5) {
    cout << i << endl;
    i++;   // ✅ 不能忘
}
```
<!-- end-hint -->

---
---

## 课后挑战

<!-- card type:teacher -->
🧑‍🏫 下面是 5 道闯关题，点击题目编号开始挑战！

> 💪 全部通过就能获得本课徽章！
<!-- end-card -->

<!-- problem: 4665fd67-dff3-4d21-b411-6583d03a1d2c -->
<!-- problem: 657c8676-4f79-4333-96c7-fbbed07adfa6 -->
<!-- problem: 88cef891-a2cb-40ea-88e8-b9e537c736ce -->
<!-- problem: f78663be-77a1-46c6-9f54-c354e060f961 -->
<!-- problem: 65e61b23-c1f2-4857-a5f6-5a54155cc44a -->
