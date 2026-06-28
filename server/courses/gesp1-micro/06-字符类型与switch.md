# 课程06：字符类型与 switch

> 🎯 目标：学会处理字母和符号，还有 switch 多选一！

---

## 故事：密码锁

<!-- story -->
小明玩解谜游戏，门上有一个字母密码锁。

> 输入 `A`，门向左开。
> 输入 `B`，门向右开。
> 输入 `C`，门直接打开。

不同字母对应不同结果。这种多选一的情况，`switch` 特别方便！
<!-- end-story -->

---

## 卡片：char 装一个字符

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
#include <iostream>
using namespace std;

int main() {
    char ch = 'A';
    cout << ch << endl;   // 输出 A
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：单引号还是双引号？

<!-- checkpoint -->
<!-- quiz: choice -->
声明字符变量，正确的是？
A. `char ch = "A";`
B. `char ch = 'A';`
C. `char ch = A;`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：每个字符都有数字编号

<!-- card type:teacher -->
🔢 计算机里每个字符都对应一个数字，叫做 ASCII 码。

常见字符的编号：
- `'0'` ~ `'9'`：48 ~ 57
- `'A'` ~ `'Z'`：65 ~ 90
- `'a'` ~ `'z'`：97 ~ 122

> 💡 小写字母比大写字母大 32。
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
using namespace std;

int main() {
    char ch = 'A';
    cout << ch << endl;        // A
    cout << (int)ch << endl;   // 65
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：A 的编号

<!-- checkpoint -->
<!-- quiz: choice -->
字符 `'A'` 的 ASCII 码是多少？
A. 97
B. 65
C. 48
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：判断字符类型

<!-- card type:teacher -->
🔍 可以用 ASCII 码范围判断字符类型：

- `'A'` ~ `'Z'`：大写字母
- `'a'` ~ `'z'`：小写字母
- `'0'` ~ `'9'`：数字
<!-- end-card -->

<!-- demo -->
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
    }
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：哪个是数字字符？

<!-- checkpoint -->
<!-- quiz: choice -->
下面哪个是数字字符？
A. `'A'`
B. `'5'`
C. `'+'`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：大小写转换

<!-- card type:teacher -->
🔄 大写字母转小写，ASCII 码加 32；小写转大写，减 32。

```cpp
char ch = 'A';
ch = ch + 32;   // 变成 'a'
```
<!-- end-card -->

<!-- demo -->
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
<!-- end-demo -->

---

## 检查点：大写转小写

<!-- checkpoint -->
<!-- quiz: choice -->
`'A'` 转成小写，ASCII 码要？
A. 加 32
B. 减 32
C. 不变
<!-- answer: A -->
<!-- end-checkpoint -->

---

## 卡片：switch 多选一

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
<!-- end-card -->

<!-- demo -->
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
<!-- end-demo -->

---

## 卡片：break 很重要

<!-- card type:teacher -->
✋ 每个 `case` 末尾一般要加 `break`，意思是"到这里就停下"。

如果不加 `break`，程序会继续执行下一个 `case`，这叫做"穿透"。
<!-- end-card -->

<!-- demo -->
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
<!-- end-demo -->

---

## 检查点：switch 里加什么？

<!-- checkpoint -->
<!-- quiz: choice -->
`switch` 的每个 `case` 末尾通常要加什么？
A. `return`
B. `break`
C. `else`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 挑战 1：字母转换

<!-- card type:computer -->
🖥️ 输入一个字母，如果是大写就转成小写，如果是小写就转成大写。
<!-- end-card -->

<!-- demo -->
```cpp
#include <iostream>
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
#include <iostream>
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

---

## 小贴士：字符和数字不一样

<!-- hint -->
`'5'` 是字符，它的 ASCII 码是 53。

`5` 是整数，值就是 5。

它们不一样！不要搞混。
<!-- end-hint -->

---

## 课后挑战


<!-- problem: 7f6be558-f0ff-4aed-90bd-a0d9434e5d73 -->
<!-- problem: 98fd9b72-e975-4fb4-8a57-25a07ea300e2 -->
<!-- problem: 4b9758f5-f018-4e65-b028-31b12561fad2 -->
<!-- problem: 09eed972-5334-48c5-b137-1ee33b45c0bc -->
<!-- problem: 3be93c78-6fbf-4af5-bc7f-76daa78e811a -->