# 课程06：字符类型与 switch

> 🎯 课程时长：120 分钟 | 👦 适合年级：小学 4-6 年级 | 🏆 对应 GESP 一级

---

## 🌟 本课目标

完成这节课后，你可以做到：

1. ✅ 了解 ASCII 编码和 `char` 字符类型。
2. ✅ 能声明字符变量，进行字符输入输出。
3. ✅ 能判断字符类型，进行简单的字符转换。
4. ✅ 掌握 `switch` 分支结构和 `break` 的使用。

---

## 🎬 开场故事：密码锁

小明玩一个解谜游戏，门上有一个字母密码锁。

> 输入 `A`，门向左开。
> 输入 `B`，门向右开。
> 输入 `C`，门直接打开。

不同的字母对应不同的结果。这种多选一的情况，用 `switch` 特别方便！

---

## 🔤 知识点一：ASCII 编码与字符类型 char

### 什么是字符？

字符就是一个字母、数字或符号，比如 `'A'`、`'9'`、`'+'`。

在 C++ 中，字符用 `char` 类型表示，用**单引号**括起来。

```cpp
#include <iostream>
using namespace std;

int main() {
    char ch = 'A';
    cout << ch << endl;      // 输出 A
    cout << (int)ch << endl; // 输出 65，这是 A 的 ASCII 码
    return 0;
}
```
<!-- run -->

### ASCII 编码

计算机里所有字符都用数字表示，这就是 ASCII 编码。

常见 ASCII 码：

| 字符 | ASCII 码 |
|------|---------|
| `'0'` | 48 |
| `'9'` | 57 |
| `'A'` | 65 |
| `'Z'` | 90 |
| `'a'` | 97 |
| `'z'` | 122 |

> 小写字母比大写字母的 ASCII 码大 32。

---

## 🔍 知识点二：字符判断与转换

### 判断字符类型

```cpp
#include <iostream>
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
    } else {
        cout << "其他字符" << endl;
    }
    return 0;
}
```
<!-- run -->

### 大小写转换

大写字母转小写：ASCII 码加 32。

```cpp
#include <iostream>
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
<!-- run -->

---

## 🎛️ 知识点三：switch 结构与 break

### 什么时候用 switch？

当一个变量有多个固定取值，每个取值对应不同操作时，用 `switch` 比 `if-else if` 更清晰。

### switch 基本格式

```cpp
switch (变量) {
    case 值1:
        // 执行代码1
        break;
    case 值2:
        // 执行代码2
        break;
    default:
        // 都不匹配时执行
}
```

### 例子：密码锁

```cpp
#include <iostream>
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
<!-- run -->

### break 很重要！

每个 `case` 末尾一般要加 `break`，否则会"穿透"到下一个 `case`。

```cpp
#include <iostream>
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
<!-- run -->

---

## ✅ 课堂选择题（5 道）

<!-- quiz: choice -->
**题目 1**：在 C++ 中，字符常量 `'A'` 必须用哪种括号括起来？

A. 双引号 `"A"`
B. 单引号 `'A'`
C. 小括号 `(A)`
D. 中括号 `[A]`

<!-- answer: B -->

<!-- quiz: choice -->
**题目 2**：字符 `'A'` 的 ASCII 码是多少？

A. 97
B. 65
C. 48
D. 32

<!-- answer: B -->

<!-- quiz: choice -->
**题目 3**：大写字母转小写字母，ASCII 码需要？

A. 减 32
B. 加 32
C. 不变
D. 减 26

<!-- answer: B -->

<!-- quiz: choice -->
**题目 4**：`switch` 语句中，每个 `case` 末尾通常要加什么？

A. `continue`
B. `return`
C. `break`
D. `else`

<!-- answer: C -->

<!-- quiz: choice -->
**题目 5**：下面哪个字符是数字字符？

A. `'A'`
B. `'a'`
C. `'5'`
D. `'+'`

<!-- answer: C -->

---

## 📝 课堂操作题（5 道完整编程题）

<!-- problem: gesp1-06-01 -->
<!-- problem: gesp1-06-02 -->
<!-- problem: gesp1-06-03 -->
<!-- problem: gesp1-06-04 -->
<!-- problem: gesp1-06-05 -->

---

## 🏠 课后练习

### 复习思考题

1. `char` 类型和 `int` 类型有什么关系？
2. 怎样判断一个字符是不是小写字母？
3. `switch` 中的 `break` 有什么作用？

### 编程练习（2 道完整编程题）

1. 输入一个字符，如果是大写字母就转成小写输出，如果是小写字母就转成大写输出。
2. 输入一个数字字符（`'0'` ~ `'9'`），输出它对应的整数数值。

### 思考题

`switch` 和 `if-else if` 都能做多分支，什么时候用 `switch` 更好？

---

## 🤖 AI 学情分析说明

本课结束后，系统将根据学生的以下数据自动生成学习报告：

- 5 道选择题的正确率
- 5 道课堂操作题的提交情况和运行结果
- 课后练习的完成度

AI 报告将包含：

1. **知识点掌握度评分**：ASCII 编码、`char` 类型、字符判断、字符转换、`switch` 结构、`break`
2. **常见错误分析**：字符用双引号、忘记 `break` 导致穿透、ASCII 码计算错误、`switch` 条件用字符串等
3. **个性化复习建议**：针对薄弱环节的练习推荐
4. **下节课预习重点**：`for` 循环

老师可在教师后台查看全班学生的 AI 分析报告，快速了解整体学习情况。
