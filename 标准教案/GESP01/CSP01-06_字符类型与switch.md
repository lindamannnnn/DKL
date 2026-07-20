# CSP01-06 字符类型与switch

## 一、课程简介（5分钟）

**🎯 课程目标：**
1. 掌握 ASCII 编码体系，理解字符与整数之间的对应关系。
2. 熟练使用字符类型 `char`，掌握字符的判断与大小写转换。
3. 掌握 `switch` 多路分支结构，理解 `break` 的必要性。

**📚 核心知识点：**
1. ASCII 编码概念：字符与整数的映射关系（'A'=65，'a'=97，'0'=48）
2. 字符类型 `char`：定义、赋值、输入输出
3. 字符的算术运算（char 本质是小整数）
4. 字符范围判断（大写/小写/数字字符）
5. 大小写字母互转（`+32` / `-32`）
6. `switch` 结构与 `break`：语法、执行流程、default 子句

---

## 二、知识回顾（10分钟）

**👩‍🏫 教师引导：**

> "上节课我们学了多路分支，用 `if-else if` 一级一级判断。
>
> 但当选项特别多、又是固定值的时候，比如判断'1号菜'、'2号菜'、'3号菜'……
>
> 写一堆 `else if` 代码会又臭又长。C++ 给了我们一个更优雅的工具——`switch`！
>
> 不过在学 `switch` 之前，我们先来认识一个神秘的表格：ASCII 码！"

**互动复习：**

> **提问**：`'A'` 和 `"A"` 有什么区别？（单引号是字符，双引号是字符串）

---

## 三、新知讲解（45分钟）

### 1. 新知导入 🎬

> "计算机内部只认识数字，不认识文字。
>
> 那它是怎么显示字母'A'的呢？答案是：每个字符都有一个编号——这就是 ASCII 码！
>
> 就好比图书馆里每本书都有编号，你说'找65号'，管理员就知道你要取字母'A'。
>
> 这套全球统一的'字符电话簿'，是所有编程的基础！"

### 2. 知识点讲解

**🔴 知识点 1：ASCII 编码（必须记住的关键码值！）**

| 字符 | ASCII 码值 | 说明 |
|------|-----------|------|
| `'0'`～`'9'` | 48～57 | 数字字符（注意：不是数值 0，是字符 '0'！）|
| `'A'`～`'Z'` | 65～90 | 大写字母 |
| `'a'`～`'z'` | 97～122 | 小写字母（=大写 +32）|
| `' '`（空格）| 32 | |

```cpp
cout << (int)'A' << endl;   // 输出 65
cout << (char)65 << endl;   // 输出 A
cout << (int)'a' - (int)'A' << endl;  // 输出 32（大小写差值为32）
```

> **GESP 高频考点**：`'A'` 和 `65` 在运算中等价，`'a' - 'A' = 32`，`'0' + 3 = '3'`（字符 '3'，不是数字 3！）

---

**🔴 知识点 2：字符类型 `char`**

```cpp
char c = 'A';           // 用单引号！字符只能是单个字符
char digit = '5';       // 字符 '5'，不是整数 5
cout << c << endl;      // 输出 A
cout << (int)c << endl; // 输出 65（强转为整数可看 ASCII 码）
cin >> c;               // 可以读入一个字符
```

> **注意**：`char` 类型占 1 个字节（8位），存储范围 0～255。本质上是整数，可以直接参与加减运算。

---

**🔴 知识点 3：字符的算术运算**

```cpp
char c = 'A';
cout << c + 1 << endl;        // 输出 66（int 类型）
cout << (char)(c + 1) << endl; // 输出 B（char 类型，第26个字母）

// 遍历26个大写字母
for (char ch = 'A'; ch <= 'Z'; ch++) {
    cout << ch;
}
// 输出：ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

---

**🔴 知识点 4：字符范围判断**

```cpp
char c;
cin >> c;

// 判断是否是大写字母
if (c >= 'A' && c <= 'Z') cout << "大写字母";

// 判断是否是小写字母
if (c >= 'a' && c <= 'z') cout << "小写字母";

// 判断是否是数字字符
if (c >= '0' && c <= '9') cout << "数字字符";
```

> **关键**：比较字符大小，实质是比较它们的 ASCII 码值。

---

**🔴 知识点 5：大小写字母互转**

大写转小写：**加 32**；小写转大写：**减 32**：

```cpp
char c = 'G';
char lower = c + 32;          // 转小写：'g'
cout << (char)lower << endl;  // 输出 g

char d = 'n';
char upper = d - 32;          // 转大写：'N'
cout << (char)upper << endl;  // 输出 N
```

> **口诀**：大写变小写加 32，小写变大写减 32。记住 'a' - 'A' = 32 就够了！

---

**🔴 知识点 6：`switch` 结构与 `break`**

当 `if-else if` 判断的是一个变量等于哪个固定值时，用 `switch` 更清晰：

```cpp
switch (表达式) {
    case 常量1:
        // 执行语句1
        break;          // 必须加！否则"穿透"到下一个 case
    case 常量2:
        // 执行语句2
        break;
    default:            // 可选，相当于 else
        // 以上都不匹配时执行
        break;
}
```

**示例：根据星期数输出星期名**

```cpp
int day;
cin >> day;
switch (day) {
    case 1: cout << "Monday"; break;
    case 2: cout << "Tuesday"; break;
    case 3: cout << "Wednesday"; break;
    case 4: cout << "Thursday"; break;
    case 5: cout << "Friday"; break;
    case 6: cout << "Saturday"; break;
    case 7: cout << "Sunday"; break;
    default: cout << "Invalid"; break;
}
```

> **`break` 的作用**：跳出 `switch` 结构。如果省略 `break`，程序会"穿透"继续执行后续所有 case，直到遇到 `break` 或 `switch` 结束。这是 **GESP 考试的超高频考点**！

**穿透利用**（两个 case 执行同一段代码）：

```cpp
switch (month) {
    case 1: case 3: case 5: case 7:
    case 8: case 10: case 12:
        cout << 31; break;
    case 4: case 6: case 9: case 11:
        cout << 30; break;
    case 2:
        cout << 28; break;
}
```

### 3. GESP真题演练 ⚡

1. **（2024年09月一级）** 以下代码的输出是？
   ```cpp
   char c = 'A';
   cout << c + 1 << endl;
   ```
   A. `B`　　B. `65`　　C. `66`　　D. `'B'`
   > **解析**：`c + 1`，`char` 与 `int` 相加结果为 `int` 类型，输出整数 **66**。选 C。

2. **（2023年06月一级）** switch 语句中，如果某个 case 缺少 break，会发生什么？
   > **解析**：会发生**穿透**（fall-through），继续执行下一个 case 的代码，直到遇到 break 或 switch 结束。

3. **判断题**：`'A' + 'B'` 的结果类型是 `char`。（　　）
   > **解析**：**错误**。两个 `char` 相加，结果提升为 `int`（65 + 66 = 131）。答案是 **×**。

### 4. 进阶扩展

随机将字母大小写翻转（大写变小写，小写变大写，其他不变）：

```cpp
char c;
cin >> c;
if (c >= 'A' && c <= 'Z') {
    cout << (char)(c + 32);
} else if (c >= 'a' && c <= 'z') {
    cout << (char)(c - 32);
} else {
    cout << c;
}
```

---

## 四、课堂练习（45分钟）

**🎈 课堂练习（阶梯式进阶，老师巡班指导）**

---

### 练习 1：【ASCII 码查询】

输入一个字符，输出它对应的 ASCII 码值。

**输入样例：** `A`　　**输出样例：** `65`

**参考代码：**
```cpp
#include <iostream>
using namespace std;
int main() {
    char c;
    cin >> c;
    cout << (int)c << endl;
    return 0;
}
```

---

### 练习 2：【字符分类】

输入一个字符，判断它是大写字母、小写字母、数字字符，还是其他字符，分别输出 `Upper`、`Lower`、`Digit`、`Other`。

**输入样例：** `g`　　**输出样例：** `Lower`

**参考代码：**
```cpp
#include <iostream>
using namespace std;
int main() {
    char c;
    cin >> c;
    if (c >= 'A' && c <= 'Z') cout << "Upper" << endl;
    else if (c >= 'a' && c <= 'z') cout << "Lower" << endl;
    else if (c >= '0' && c <= '9') cout << "Digit" << endl;
    else cout << "Other" << endl;
    return 0;
}
```

---

### 练习 3：【大小写互转】

输入一个英文字母，将其大小写翻转后输出（大写→小写，小写→大写）。

**输入样例：** `G`　　**输出样例：** `g`

**参考代码：**
```cpp
#include <iostream>
using namespace std;
int main() {
    char c;
    cin >> c;
    if (c >= 'A' && c <= 'Z')
        cout << (char)(c + 32) << endl;
    else
        cout << (char)(c - 32) << endl;
    return 0;
}
```

---

### 练习 4：【switch 星期判断】

输入一个 1-7 的整数，用 switch 输出对应的英文星期名。输入其他数字输出 `Invalid`。

**输入样例：** `5`　　**输出样例：** `Friday`

**参考代码：**
```cpp
#include <iostream>
using namespace std;
int main() {
    int d;
    cin >> d;
    switch (d) {
        case 1: cout << "Monday"; break;
        case 2: cout << "Tuesday"; break;
        case 3: cout << "Wednesday"; break;
        case 4: cout << "Thursday"; break;
        case 5: cout << "Friday"; break;
        case 6: cout << "Saturday"; break;
        case 7: cout << "Sunday"; break;
        default: cout << "Invalid"; break;
    }
    cout << endl;
    return 0;
}
```

---

### 练习 5：【月份天数（switch 版）】

输入年份和月份，用 switch 输出该月天数（需考虑闰年的 2 月）。

**输入样例：** `2024 2`　　**输出样例：** `29`

**参考代码：**
```cpp
#include <iostream>
using namespace std;
int main() {
    int year, month;
    cin >> year >> month;
    int days;
    switch (month) {
        case 1: case 3: case 5: case 7:
        case 8: case 10: case 12:
            days = 31; break;
        case 4: case 6: case 9: case 11:
            days = 30; break;
        case 2:
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
                days = 29;
            else
                days = 28;
            break;
        default:
            days = -1; break;
    }
    cout << days << endl;
    return 0;
}
```

---

## 五、课堂总结（5分钟）

**🌟 内容收尾：**

> "今天我们解锁了字符世界的密码本——ASCII 码！
>
> 三个关键码值牢记：`'A'=65`，`'a'=97`，`'0'=48`，大小写差值固定是 **32**！
>
> `switch` 是多路判断的优雅写法，但千万记住：**每个 case 后面必须加 `break`**，不然就会穿透！
>
> 下节课，我们要让计算机学会不知疲倦地重复干活——for 循环登场！"

---

## 六、课后作业与拓展（10分钟）

**📝 课后作业（巩固练习，较简单）：**

---

### 作业 1：【数字字符转整数】

输入一个数字字符（'0'~'9'），输出它对应的整数值（如输入 `'5'`，输出 `5`）。

**参考代码：**
```cpp
#include <iostream>
using namespace std;
int main() {
    char c; cin >> c;
    cout << c - '0' << endl;  // '5' - '0' = 53 - 48 = 5
    return 0;
}
```

---

### 作业 2：【字母序号】

输入一个大写字母，输出它是字母表中第几个字母（A=1，B=2，…）。

**参考代码：**
```cpp
#include <iostream>
using namespace std;
int main() {
    char c; cin >> c;
    cout << c - 'A' + 1 << endl;
    return 0;
}
```

---

### 作业 3：【季节判断（switch）】

输入月份（1-12），用 switch 输出对应季节（春/夏/秋/冬，3-5春，6-8夏，9-11秋，12-2冬）。

**参考代码：**
```cpp
#include <iostream>
using namespace std;
int main() {
    int m; cin >> m;
    switch (m) {
        case 3: case 4: case 5: cout << "Spring"; break;
        case 6: case 7: case 8: cout << "Summer"; break;
        case 9: case 10: case 11: cout << "Autumn"; break;
        case 12: case 1: case 2: cout << "Winter"; break;
        default: cout << "Invalid"; break;
    }
    cout << endl;
    return 0;
}
```

---

**🔥 拓展习题（尖子生挑战，7 道）：**

---

### 拓展 1：【凯撒密码加密】

输入一行字母（小写），将每个字母向后移动 3 位（z 后接 a，即循环），输出密文。

> **提示**：`(c - 'a' + 3) % 26 + 'a'`

---

### 拓展 2：【ROT13 加密】

ROT13 是一种将字母向后移 13 位的加密方式，加密和解密用同一个函数。对输入的大小写字母进行 ROT13 变换，其他字符原样输出。

---

### 拓展 3：【字符统计】

输入一行字符串（以换行结束），统计其中大写字母、小写字母、数字字符各有多少个，分三行输出。

> **提示**：用 `getline(cin, s)` 读取一整行，再遍历每个字符判断。

---

### 拓展 4：【switch 穿透预测】

给出以下代码，不运行，预测其输出并解释：
```cpp
int x = 2;
switch (x) {
    case 1: cout << "one";
    case 2: cout << "two";
    case 3: cout << "three"; break;
    case 4: cout << "four";
}
```

---

### 拓展 5：【字母金字塔】

输入一个大写字母 N（A-E），输出从 A 到 N 的字母三角形，如输入 D：
```
A
AB
ABC
ABCD
```

---

### 拓展 6：【字符加密：移位密码】

输入一个字符 c 和偏移量 k（整数，可正可负），对字母进行移位，非字母原样输出。

---

### 拓展 7：【综合：switch + 字符】

输入一个字符，用 switch 判断：元音字母（aeiouAEIOU）输出 `vowel`，辅音字母输出 `consonant`，其他输出 `other`。
