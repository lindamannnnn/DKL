# 课程09：字符类型与 switch

> 🎯 目标：学会处理字母和符号，还有 switch 多选一！

---

## 第1关：字符是什么

<!-- story -->
小明玩解谜游戏，门上有一个字母密码锁。

> 输入 `A`，门向左开。
> 输入 `B`，门向右开。
> 输入 `C`，门直接打开。

不同字母对应不同结果。这种多选一的情况，`switch` 特别方便！
<!-- end-story -->

---

### 卡片：char 装一个字符

<!-- card type:teacher -->
🔤 `char` 是一种盒子，里面只能装**一个字符**。

字符要用**单引号** `' '` 括起来，不能用双引号。

```cpp
char ch = 'A';   // 正确
char ch2 = "A";  // 错误！双引号是用来装一句话的
```
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    char ch = 'A';
    cout << ch << endl;   // 输出 A
    return 0;
}
```
<!-- end-demo -->

---

### 卡片：单引号 vs 双引号

<!-- card type:teacher -->
📌 一张图分清：

| 写法 | 含义 | 例子 |
|------|------|------|
| `'A'` | 一个字符 | 可以装进 `char` |
| `"A"` | 一句话（字符串）| 不能装进 `char` |
| `A` | 变量名 | 如果没用 `char A;` 声明过，会报错 |
| `'5'` | 字符 5 | 不是数字 5！ |

> 💡 口诀：**一个字符用单引，一句话用双引。**
<!-- end-card -->

---

### 卡片：每个字符都有一个编号（ASCII）

<!-- card type:teacher -->
🔢 电脑不认识字母，它只认识数字。所以人们给每个字符编了一个号码，这张表叫 **ASCII**，就像一本"字符电话本"。

| 字符 | ASCII 编号 | 记法小口诀 |
|------|-----------|------------|
| `'0'` ~ `'9'` | 48 ~ 57 | 数字字符从 48 开始 |
| `'A'` ~ `'Z'` | 65 ~ 90 | 大写 A 是 65 |
| `'a'` ~ `'z'` | 97 ~ 122 | 小写 a 是 97 |

```cpp
cout << (int)'A' << endl;   // 把字符转成编号 → 输出 65
cout << (char)65 << endl;   // 把编号转成字符 → 输出 A
```

> 💡 `(int)'A'` 的意思是把字符 `'A'` 当成数字看，就看到它的编号 65。`(char)65` 相反，把数字 65 当成字符看，就看到 `'A'`。
<!-- end-card -->

---

### 检查点：A 的编号是多少？

<!-- checkpoint -->
<!-- quiz: choice -->
`'A'` 对应的 ASCII 编号是多少？
A. 97
B. 65
C. 48
<!-- answer: B -->
<!-- end-checkpoint -->

---

### 检查点：单引号还是双引号？

<!-- checkpoint -->
<!-- quiz: choice -->
声明字符变量，正确的是？
A. `char ch = "A";`
B. `char ch = 'A';`
C. `char ch = A;`
<!-- answer: B -->
<!-- end-checkpoint -->

---

### 🏅 第1关通关奖励

<!-- card type:teacher -->
🎉 你知道字符怎么表示了！

记住：**一个字符用单引号 `' '`。**
<!-- end-card -->

---

## 第2关：字符也会排队

### 卡片：字符可以比大小

<!-- card type:teacher -->
🔢 在 C++ 里，字符可以像数字一样比较大小。

- `'A'` 到 `'Z'` 是大写字母
- `'a'` 到 `'z'` 是小写字母
- `'0'` 到 `'9'` 是数字字符

> 💡 不用记具体数字，只要记住范围：大写、小写、数字是连在一起的。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    char ch = 'A';
    if (ch >= 'A' && ch <= 'Z') {
        cout << "大写字母" << endl;
    }
    return 0;
}
```
<!-- end-demo -->

---

### 卡片：判断字符类型

<!-- card type:teacher -->
🔍 用字符范围判断类型：

- `'A'` ~ `'Z'`：大写字母
- `'a'` ~ `'z'`：小写字母
- `'0'` ~ `'9'`：数字
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    char ch;
    cin >> ch;
    if (ch >= 'A' && ch <= 'Z') {
        cout << "大写字母" << endl;
    } else if (ch >= 'a' && ch <= 'z') {
        cout << "小写字母" << endl;
    } else if (ch >= '0' && ch <= '9') {
        cout << "数字" << endl;
    }
    return 0;
}
```
<!-- end-demo -->

---

### 检查点：哪个是大写字母？

<!-- checkpoint -->
<!-- quiz: choice -->
下面哪个是大写字母？
A. `'a'`
B. `'Z'`
C. `'5'`
<!-- answer: B -->
<!-- end-checkpoint -->

---

### 检查点：哪个是数字字符？

<!-- checkpoint -->
<!-- quiz: choice -->
下面哪个是数字字符？
A. `'A'`
B. `'5'`
C. `'+'`
<!-- answer: B -->
<!-- end-checkpoint -->

---

### 🏅 第2关通关奖励

<!-- card type:teacher -->
🎉 你会判断字符类型了！

- 大写：`'A'` ~ `'Z'`
- 小写：`'a'` ~ `'z'`
- 数字：`'0'` ~ `'9'`

休息一下，准备学习大小写转换！
<!-- end-card -->

---

### 过渡页：为什么加 32？

<!-- card type:teacher -->
🧐 大写 `'A'` 的 ASCII 编号是 65，小写 `'a'` 的编号是 97。

```
97 - 65 = 32
```

所以：
- 大写转小写 = 给编号 **加 32**
- 小写转大写 = 给编号 **减 32**

> 💡 不用背所有编号，只要记住 `'A'=65`、`'a'=97`，差值 32 就够了。
<!-- end-card -->

---

## 第3关：大小写转换

### 卡片：加 32 变小写

<!-- card type:teacher -->
🔄 大写字母转小写，字符加 32；小写转大写，减 32。

```cpp
char ch = 'A';
ch = ch + 32;   // 变成 'a'
```

> 💡 为什么加 32？因为电脑给每个字符都编了号，大写 'A' 和小写 'a' 的编号正好差 32。不用背，查表就行！
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    char ch;
    cin >> ch;
    if (ch >= 'A' && ch <= 'Z') {
        ch = ch + 32;   // 大写转小写
    }
    cout << ch << endl;
    return 0;
}
```
<!-- end-demo -->

---

### 检查点：大写转小写

<!-- checkpoint -->
<!-- quiz: choice -->
`'A'` 转成小写，要做什么？
A. 加 32
B. 减 32
C. 不变
<!-- answer: A -->
<!-- end-checkpoint -->

---

## 挑战 1：字母转换

<!-- card type:computer -->
🖥️ 输入一个字母，如果是大写就转成小写，如果是小写就转成大写。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    char ch;
    cin >> ch;
    if (ch >= 'A' && ch <= 'Z') {
        ch = ch + 32;   // 大写转小写
    } else if (ch >= 'a' && ch <= 'z') {
        ch = ch - 32;   // 小写转大写
    }
    cout << ch << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
🧑‍🏫 评讲逻辑：

- **考察知识点**：字符类型 `char`、字符范围判断、大小写转换（ASCII 差值 32）。
- **解题思路**：
  1. 读入一个字符 ch。
  2. 判断 ch 是否在大写范围 `'A'`~`'Z'`，是则加 32 转小写。
  3. 否则判断是否在小写范围 `'a'`~`'z'`，是则减 32 转大写。
  4. 输出转换后的字符。
- **容易错的地方**：
  - 字符常量没加单引号，写成 `ch >= A && ch <= Z`。
  - 把 `ch = ch + 32` 写成 `ch + 32`，没有保存结果。
  - 大小写转换方向搞反。
- **关键代码解释**：
  - `ch >= 'A' && ch <= 'Z'`：判断大写字母的范围。
  - `ch = ch + 32`：大写转小写，给 ASCII 编号加 32。
  - `ch = ch - 32`：小写转大写，给 ASCII 编号减 32。
<!-- end-card -->

---

### 🏅 第3关通关奖励

<!-- card type:teacher -->
🎉 你会大小写转换了！

口诀：
> **大写转小写，加 32；小写转大写，减 32。**

接下来学习 switch，让多选一更简单！
<!-- end-card -->

---

### 过渡页：从 if-else if 到 switch

<!-- card type:teacher -->
🚦 判断字符类型时，我们用的是范围（比如 `'A'` 到 `'Z'`），所以用 `if` 很方便。

但如果一个变量只有几个固定值，比如密码锁只有 `A`、`B`、`C`，用 `switch` 就像按开关，一格一格选，更清晰。

| 场景 | 推荐写法 |
|------|----------|
| 判断范围（如大写字母） | `if` |
| 固定几个值（如 A/B/C） | `switch` |

> 💡 口诀：**固定值，用 switch；有范围，用 if。**
<!-- end-card -->

---

## 第4关：switch 多选一

### 卡片：switch 长什么样

<!-- card type:teacher -->
🎛️ 当一个变量有多个固定取值时，用 `switch` 比 `if-else if` 更清晰。

```cpp
switch (变量) {
    case 'A':
        // 执行 A 对应的代码
        break;
    case 'B':
        // 执行 B 对应的代码
        break;
    default:
        // 都不匹配时执行
}
```

- `switch`：根据括号里的变量选择走哪条路
- `case`：每一种可能的值
- `break`：走到这里就停下
- `default`：上面都不匹配时执行
<!-- end-card -->

---

### 卡片：密码锁示例

<!-- card type:teacher -->
🚪 用 switch 重写密码锁：

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    char key;
    cin >> key;
    switch (key) {
        case 'A':
            cout << "门向左开" << endl;
            break;
        case 'B':
            cout << "门向右开" << endl;
            break;
        case 'C':
            cout << "门直接打开" << endl;
            break;
        default:
            cout << "密码错误" << endl;
    }
    return 0;
}
```
<!-- end-demo -->

> 💡 switch 只能判断"等于某个值"，不能判断范围（比如大于、小于）。
<!-- end-card -->

---

### 卡片：break 很重要

<!-- card type:teacher -->
✋ 每个 `case` 末尾一般要加 `break`，意思是"到这里就停下"。

如果不加 `break`，程序会继续执行下一个 `case`，这叫做"穿透"。

> 💡 口诀：**每个 case 写完 break，不然程序会乱穿。**
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n = 1;
    switch (n) {
        case 1:
            cout << "一" << endl;
            break;      // 没有 break 会继续执行 case 2
        case 2:
            cout << "二" << endl;
            break;
    }
    return 0;
}
```
<!-- end-demo -->

---

### 报错也不慌：switch 里别漏 break

<!-- card type:tip -->
💡 如果 switch 里某个 case 后面忘了写 `break`，程序会"穿透"到下一个 case 继续执行。

> 如果你发现输出了多个结果，检查一下有没有漏 `break`！
<!-- end-card -->

---

### 检查点：switch 里加什么？

<!-- checkpoint -->
<!-- quiz: choice -->
`switch` 的每个 `case` 末尾通常要加什么？
A. `return`
B. `break`
C. `else`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 挑战 2：数字密码锁

<!-- card type:computer -->
🖥️ 输入一个数字 1~3，输出对应的奖励：

> 1 → 金币  
> 2 → 宝石  
> 3 → 药水  
> 其他 → 没有奖励
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    switch (n) {
        case 1:
            cout << "金币" << endl;
            break;
        case 2:
            cout << "宝石" << endl;
            break;
        case 3:
            cout << "药水" << endl;
            break;
        default:
            cout << "没有奖励" << endl;
    }
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
🧑‍🏫 评讲逻辑：

- **考察知识点**：`switch` 多分支结构、`case`、`break`、`default` 的用法。
- **解题思路**：
  1. 读入一个整数 n。
  2. 用 `switch (n)` 根据 n 的值选择对应分支。
  3. 每个 case 输出对应奖励后加 `break`。
  4. 输入其他数字时，走 `default` 输出“没有奖励”。
- **容易错的地方**：
  - 忘记写 `break`，导致程序“穿透”到下一个 case。
  - `case` 后面跟的是整数，不是字符串。
  - 把 `default` 写成 `case default`。
- **关键代码解释**：
  - `switch (n)`：根据 n 的值选择分支。
  - `case 1:`：当 n 等于 1 时执行这里。
  - `break;`：跳出 switch，不再继续执行后面的 case。
  - `default:`：所有 case 都不匹配时执行。
<!-- end-card -->

---

### 小贴士：字符和数字不一样

<!-- hint -->
`'5'` 是字符，它在电脑里的编号是 53（不用背，知道它和数字 5 不一样就行）。

`5` 是整数，值就是 5。

它们不一样！不要搞混。
<!-- end-hint -->

---

### 🏅 第4关通关奖励

<!-- card type:teacher -->
🎉 你学会 switch 多选一了！

这节课你学会了：
- `char` 装单个字符，用单引号
- 字符可以比大小、判断类型
- 大小写转换：大写转小写加 32
- `switch` 适合多选一，每个 case 别忘了 `break`

准备迎接课后挑战！
<!-- end-card -->

---
---

## 课后挑战

<!-- card type:teacher -->
🧑‍🏫 下面是 5 道闯关题，点击题目编号开始挑战！

> 💪 全部通过就能获得本课徽章！
<!-- end-card -->

<!-- problem: 7f6be558-f0ff-4aed-90bd-a0d9434e5d73 -->
<!-- problem: 98fd9b72-e975-4fb4-8a57-25a07ea300e2 -->
<!-- problem: 3be93c78-6fbf-4af5-bc7f-76daa78e811a -->
<!-- problem: 9bfca591-b747-40b8-8d9c-96caf4bac555 -->
<!-- problem: 4b9758f5-f018-4e65-b028-31b12561fad2 -->
