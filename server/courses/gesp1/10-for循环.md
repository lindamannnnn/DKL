# 课程10：for 循环

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
#include <bits/stdc++.h>
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
#include <bits/stdc++.h>
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

## 卡片：++ 放在前面和后面有区别

<!-- card type:teacher -->
➕ `i++` 和 `++i` 都能让 `i` 加 1，但和别人一起用时，顺序不一样：

- `i++`：先把 `i` 原来的值拿出来用，再让 `i` 加 1（**先用后加**）
- `++i`：先让 `i` 加 1，再把新的值拿出来用（**先加后用**）

```cpp
int a = 5;
cout << a++ << endl;   // 输出 5，然后 a 变成 6
cout << ++a << endl;   // a 先变成 7，然后输出 7
```

> 💡 初学阶段，单独写 `i++` 或 `++i` 都可以。如果和 `cout` 写在一行，要注意顺序。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int a = 5;
    cout << "a++ = " << a++ << endl;   // 输出 5
    cout << "a   = " << a << endl;     // 输出 6
    cout << "++a = " << ++a << endl;   // 输出 7
    return 0;
}
```
<!-- end-demo -->

---

### 检查点：++ 在前还是在后

<!-- checkpoint -->
<!-- quiz: choice -->
```cpp
int x = 10;
cout << x++ << " " << ++x;
```
输出什么？
A. 10 11
B. 10 12
C. 11 12
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
#include <bits/stdc++.h>
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

## 报错也不慌：for 循环里别漏分号

<!-- card type:tip -->
💡 `for` 循环后面如果多写了分号，循环体就空了！

```cpp
for (int i = 1; i <= 5; i++); {   // ❌ 分号让循环体为空
    cout << i << endl;
}
```

> 正确写法：for 后面直接跟大括号，不要加分号。
<!-- end-card -->

<!-- demo -->
```cpp
for (int i = 1; i <= 5; i++) {    // ✅ 没有分号
    cout << i << endl;
}
```
<!-- end-demo -->

---

## 卡片：变量住在哪里很重要

<!-- card type:teacher -->
🏠 变量住的位置不一样，初始值也不一样：

- **局部变量**：住在大括号 `{}` 里面，比如 `for` 循环里的 `i`。如果不初始化，里面的值是随机的。
- **全局变量**：住在所有函数外面，默认初始化为 0。

```cpp
int g = 0;   // 全局变量，默认是 0

int main() {
    int a;   // 局部变量，未初始化时值不确定
    return 0;
}
```

> 💡 小学比赛里，养成**创建变量时立刻初始化**的习惯，就能避免大部分问题。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int globalNum;   // 全局变量，自动变成 0

int main() {
    int localNum = 0;   // 局部变量，自己初始化
    cout << globalNum << " " << localNum << endl;
    return 0;
}
```
<!-- end-demo -->

---

### 检查点：全局变量默认值

<!-- checkpoint -->
<!-- quiz: choice -->
没有初始化的全局变量，默认值通常是？
A. 随机数
B. 0
C. 1
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
#include <bits/stdc++.h>
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

以 `1+2+3` 为例，变量是这样变化的：

| 循环次数 | i 的值 | sum 变化前 | sum 变化后 |
|---------|--------|-----------|-----------|
| 第 1 次 | 1 | 0 | 0 + 1 = 1 |
| 第 2 次 | 2 | 1 | 1 + 2 = 3 |
| 第 3 次 | 3 | 3 | 3 + 3 = 6 |

> 💡 `sum = sum + i` 不是数学里的等式，意思是"把原来的 sum 加上 i，再存回 sum"。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
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
#include <bits/stdc++.h>
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

<!-- card type:teacher -->
🧑‍🏫 评讲逻辑：

- **考察知识点**：`for` 循环的基本结构、循环中结合 `if` 进行条件筛选。
- **解题思路**：
  1. 用 `for` 循环让 i 从 1 走到 20。
  2. 每次判断 `i % 3 == 0`，成立就输出 i。
  3. 所有数判断完后输出换行。
- **容易错的地方**：
  - 在 `for` 后面多加分号，导致循环体为空。
  - 判断条件写成 `i / 3 == 0`（这是除法，不是取余）。
  - 忘记最后输出 `endl` 或换行。
- **关键代码解释**：
  - `for (int i = 1; i <= 20; i++)`：i 从 1 开始，每次加 1，直到 20。
  - `if (i % 3 == 0)`：判断 i 能否被 3 整除。
  - `cout << i << " "`：输出 i，并在后面加一个空格。
<!-- end-card -->

---

## 挑战 2：计算 1 加到 n

<!-- card type:computer -->
🖥️ 输入一个整数 n，计算 1+2+3+...+n 的和。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
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

<!-- card type:teacher -->
🧑‍🏫 评讲逻辑：

- **考察知识点**：`for` 循环累加、累加器变量 `sum` 的初始化为 0。
- **解题思路**：
  1. 读入整数 n。
  2. 定义累加器 `sum = 0`。
  3. 用 `for` 循环让 i 从 1 走到 n，每次把 i 加到 sum 中。
  4. 循环结束后输出 sum。
- **容易错的地方**：
  - `sum` 没有初始化为 0，导致结果随机或错误。
  - 循环条件写成 `i < n`，少加了一次 n。
  - 把 `sum = sum + i` 写成 `sum + i`，没有保存累加结果。
- **关键代码解释**：
  - `int sum = 0;`：累加器，一开始是空的桶。
  - `sum = sum + i;`：把当前 i 的值倒进桶里。
  - `i <= n`：确保 n 本身也被加进去。
<!-- end-card -->

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

## 卡片：枚举法——从 1 试到 n

<!-- card type:teacher -->
🔍 遇到“有多少种可能”“是不是完全立方数”“有哪些因数”这类题，如果一下子想不到公式，就用**枚举法**：

> 从 1 开始，一个一个试，看哪些数符合条件。

比如“给定面积，有多少种整数长宽”：
- 让 `i` 从 1 试到面积；
- 如果 `面积 % i == 0`，说明 `i` 是一个可能的宽；
- 统计有多少个这样的 `i`。

```cpp
int count = 0;
for (int i = 1; i <= area; i++) {
    if (area % i == 0) {
        count++;
    }
}
```

> 💡 枚举法是 GESP1 真题里非常常用的技巧，一定要会！
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int area;
    cin >> area;
    int count = 0;
    for (int i = 1; i <= area; i++) {
        if (area % i == 0) {
            count++;   // i 是一个合法的宽
        }
    }
    cout << count << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 卡片：平方和也可以循环累加

<!-- card type:teacher -->
🏗️ 金字塔需要 `1×1 + 2×2 + 3×3 + ... + n×n` 块石头。

这就是**平方和**，用循环一行一行算：

```cpp
int sum = 0;
for (int i = 1; i <= n; i++) {
    sum = sum + i * i;
}
```

> 💡 不用背公式，会循环累加就能做。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, sum = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        sum += i * i;
    }
    cout << sum << endl;
    return 0;
}
```
<!-- end-demo -->

---
---

## 课后挑战

<!-- card type:teacher -->
🧑‍🏫 下面是 5 道闯关题，点击题目编号开始挑战！

> 💪 全部通过就能获得本课徽章！
<!-- end-card -->

<!-- problem: f05395ad-7506-4906-96a8-01dc333433ee -->
<!-- problem: 31db772c-c871-45ef-a5ae-e7bf04cdd9d2 -->
<!-- problem: 45dcba5f-f0d7-4060-b838-55e2947f9785 -->
<!-- problem: 6bad4c81-19e5-4faf-99c1-5bde52d48c2d -->
<!-- problem: 3f8449a7-0c87-48fe-b97c-eb5e827dcb44 -->
