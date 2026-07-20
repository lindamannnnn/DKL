# CSP03-06 string 使用1

## 一、课程简介（5分钟）

### 🎯 课程目标

1. 理解 `string` 与 `char` 数组的区别与联系
2. 掌握 `string` 的声明、初始化、输入输出和基本操作
3. 掌握字符串大小写转换的方法
4. 掌握 `string` 的搜索（`find`）、分割和替换操作

### 📚 核心知识点

- `string` 与 `char[]` 的区别（动态 vs 静态，操作方便性）
- `string` 的赋值（`=`）、拼接（`+`、`+=`）、比较（`==`、`<`、`>`）
- `string` 的长度：`s.size()` / `s.length()`
- 下标访问：`s[i]`
- 大小写转换：`tolower` / `toupper` 配合 `for` 循环
- 搜索：`s.find(sub)` 和 `s.find(sub, pos)`
- 替换：`s.replace(pos, len, newStr)`
- 分割：按字符或分隔符拆分字符串

---

## 二、知识回顾（10分钟）

### 👩‍🏫 教师引导

> 上节课我们用 `char` 数组处理字符串，虽然能用，但挺麻烦的——要手动管理 `\0`、require 头文件、还要防止越界……
>
> C++ 给我们提供了更好的工具：**`string` 类**！
>
> 用 `string`，可以直接用 `+` 拼接字符串，用 `==` 比较，不需要 `strcat` 和 `strcmp`，方便多了！
>
> 今天就来学习 `string` 的强大功能！

**互动复习：**

> - 用 char 数组，如何拼接 "hello" 和 " world"？（用 strcat）
> - 用 char 数组，如何判断两个字符串相等？（用 strcmp == 0）
> - 今天用 string，这些操作只需要 `+` 和 `==`！

---

## 三、新知讲解（45分钟）

### 1. 新知导入 🎬

> 想象一下，char 数组就像固定大小的盒子，放东西之前要提前想好放多大；
>
> 而 `string` 就像一个弹性袋子，想放多少放多少，自动扩容！
>
> 不仅如此，`string` 还内置了海量实用功能：查找、替换、截取……一个 `#include <string>` 搞定一切！

---

### 2. 知识点讲解

#### 2.1 string 与 char 数组的区别

| 特性 | `char a[]` | `string s` |
|------|-----------|-----------|
| 大小 | 定义时固定 | 动态可变 |
| 拼接 | `strcat(a, b)` | `a + b` |
| 比较 | `strcmp(a, b)` | `a == b`，`a < b` |
| 长度 | `strlen(a)` | `s.size()` / `s.length()` |
| 读含空格 | `cin.getline` | `getline(cin, s)` |

---

#### 2.2 string 的声明与初始化

```cpp
#include <string>   // 需要此头文件
using namespace std;

string s1;              // 空字符串
string s2 = "hello";   // 直接初始化
string s3 = s2;        // 拷贝初始化
string s4(5, 'a');     // "aaaaa"
```

---

#### 2.3 基本操作

**赋值与拼接：**

```cpp
string s = "hello";
s += " world";     // s = "hello world"
s = s + "!";       // s = "hello world!"
```

**比较：**

```cpp
string a = "apple", b = "banana";
if (a < b) cout << "apple comes first";  // 字典序比较
if (a == b) cout << "equal";
```

**长度：**

```cpp
string s = "hello";
cout << s.size();    // 5
cout << s.length();  // 5（两者等价）
```

**下标访问：**

```cpp
string s = "hello";
cout << s[0];    // 'h'
s[0] = 'H';     // s = "Hello"
```

**输入输出：**

```cpp
string s;
cin >> s;             // 读到空格停止
getline(cin, s);      // 读整行（含空格）
cout << s << endl;
```

---

#### 2.4 字符串大小写转换

`string` 没有直接的大小写转换函数，需要遍历每个字符：

```cpp
#include <cctype>
string s = "Hello World";

// 全转小写
for (int i = 0; i < s.size(); i++) {
    s[i] = tolower(s[i]);
}
// s = "hello world"

// 全转大写
for (char &c : s) {   // 范围 for 循环写法
    c = toupper(c);
}
// s = "HELLO WORLD"
```

---

#### 2.5 字符串搜索 find

`s.find(sub)` 返回子串 `sub` 第一次出现的起始下标，若不存在返回 `string::npos`（约等于 -1 的极大数）。

```cpp
string s = "hello world hello";
int pos = s.find("hello");    // pos = 0
int pos2 = s.find("hello", 1); // 从位置1开始找，pos2 = 12
int pos3 = s.find("xyz");     // 找不到，返回 string::npos

if (pos3 == string::npos) cout << "未找到";
```

**遍历找所有出现位置：**

```cpp
string s = "abcabcabc";
string sub = "bc";
int pos = 0;
while ((pos = s.find(sub, pos)) != string::npos) {
    cout << pos << " ";
    pos++;  // 继续往后找
}
// 输出：1 4 7
```

---

#### 2.6 字符串替换 replace

`s.replace(pos, len, newStr)` 从位置 `pos` 开始，替换 `len` 个字符为 `newStr`。

```cpp
string s = "hello world";
s.replace(6, 5, "C++");  // 从位置6删5个字符替换为"C++"
// s = "hello C++"
```

---

#### 2.7 简单字符串分割

C++ 的 `string` 没有内置 split 函数，常用方法：

**按空格分割（提取单词）：**

```cpp
string line = "hello world foo";
string word;
// 用 istringstream 分割
#include <sstream>
istringstream ss(line);
while (ss >> word) {
    cout << word << endl;
}
// 输出：hello / world / foo
```

**手动按字符分割：**

```cpp
string s = "a,b,c,d";
char delim = ',';
string cur = "";
for (int i = 0; i <= s.size(); i++) {
    if (i == s.size() || s[i] == delim) {
        cout << cur << endl;  // 输出当前段
        cur = "";
    } else {
        cur += s[i];
    }
}
```

---

### 3. GESP 真题演练 ⚡

**抢答题 1（选择题）：**

> 以下代码的输出是？
> ```cpp
> string s = "abcde";
> cout << s.find("cd");
> ```
>
> A. 0  B. 1  C. 2  D. 3
>
> **答案：C**  
> 解析："cd" 在 "abcde" 中从下标 2 开始，find 返回 2。

**判断题 2：**

> `string s = "hello"; s += " world";` 执行后，`s.size()` 返回 11。（ ）
>
> **答案：✓（正确）**  
> 解析："hello world" 有 11 个字符（含中间空格）。

**抢答题 3：**

> 以下代码中，如何判断字符串 s 中**不包含**子串 "abc"？
> ```cpp
> string s = "xyzdef";
> // 你的判断语句
> ```
>
> **答案：** `if (s.find("abc") == string::npos)`

---

### 4. 进阶扩展

**string 的常用操作备忘表：**

| 操作 | 代码示例 | 说明 |
|------|---------|------|
| 长度 | `s.size()` | 字符数 |
| 清空 | `s.clear()` | 清空字符串 |
| 是否为空 | `s.empty()` | 返回 bool |
| 截取子串 | `s.substr(pos, len)` | 下节课讲 |
| 插入 | `s.insert(pos, str)` | 在 pos 前插入 str |
| 删除 | `s.erase(pos, len)` | 删除 pos 起 len 个字符 |

**字符串与数字互转：**

```cpp
// 数字转字符串（C++11）
string s = to_string(123);   // s = "123"

// 字符串转数字
int n = stoi("456");          // n = 456
double d = stod("3.14");      // d = 3.14
```

---

## 四、课堂练习（45分钟）🎈

### 练习 1（基础）：字符串拼接

**题目描述：**

输入两个字符串，将它们拼接在一起输出。

**输入格式：**
- 两行各一个字符串（不含空格，长度 ≤ 100）

**输出格式：**
- 拼接后的字符串

**样例输入：**
```
hello
world
```

**样例输出：**
```
helloworld
```

**题解代码：**

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
```

---

### 练习 2（基础）：字符串全转小写

**题目描述：**

输入一行字符串，将其中所有大写字母转为小写，输出结果。

**输入格式：**
- 一行字符串（长度 ≤ 1000）

**输出格式：**
- 转换后的字符串

**样例输入：**
```
Hello World! 123
```

**样例输出：**
```
hello world! 123
```

**题解代码：**

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    for (int i = 0; i < s.size(); i++) s[i] = tolower(s[i]);
    cout << s << endl;
    return 0;
}
```

---

### 练习 3（综合）：查找子串位置

**题目描述：**

输入主字符串 s 和子串 t，找出 t 在 s 中第一次出现的位置（0-indexed）。若不存在输出 -1。

**输入格式：**
- 第一行主字符串 s（长度 ≤ 1000）
- 第二行子串 t（长度 ≤ 100）

**输出格式：**
- 第一次出现的下标，若不存在输出 -1

**样例输入：**
```
hello world hello
world
```

**样例输出：**
```
6
```

**题解代码：**

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, t;
    getline(cin, s);
    getline(cin, t);
    int pos = s.find(t);
    if (pos == string::npos) cout << -1 << endl;
    else cout << pos << endl;
    return 0;
}
```

---

### 练习 4（综合）：统计子串出现次数

**题目描述：**

输入主串 s 和模式串 t，统计 t 在 s 中出现的次数（允许重叠）。

**输入格式：**
- 第一行主串 s
- 第二行模式串 t

**输出格式：**
- 出现次数

**样例输入：**
```
aaaa
aa
```

**样例输出：**
```
3
```

**题解代码：**

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, t;
    cin >> s >> t;
    int cnt = 0, pos = 0;
    while ((pos = s.find(t, pos)) != string::npos) {
        cnt++;
        pos++;  // 允许重叠
    }
    cout << cnt << endl;
    return 0;
}
```

---

### 练习 5（进阶）：字符串替换所有子串

**题目描述：**

输入主串 s，以及旧子串 old 和新子串 newStr，将 s 中所有 old 替换为 newStr，输出结果。

**输入格式：**
- 第一行主串 s（长度 ≤ 1000）
- 第二行 old（长度 ≤ 50）
- 第三行 newStr（长度 ≤ 50）

**输出格式：**
- 替换后的字符串

**样例输入：**
```
hello world hello
hello
hi
```

**样例输出：**
```
hi world hi
```

**题解代码：**

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, old_s, new_s;
    getline(cin, s);
    getline(cin, old_s);
    getline(cin, new_s);
    int pos = 0;
    while ((pos = s.find(old_s, pos)) != string::npos) {
        s.replace(pos, old_s.size(), new_s);
        pos += new_s.size();  // 跳过新插入的内容，避免死循环
    }
    cout << s << endl;
    return 0;
}
```

---

## 五、课堂总结（5分钟）🌟

> 今天我们掌握了 C++ 的 `string` 类，这是处理字符串的强力工具！
>
> 核心操作速查：
> - 拼接：`s1 + s2` 或 `s1 += s2`
> - 比较：`s1 == s2`，`s1 < s2`（字典序）
> - 长度：`s.size()`
> - 搜索：`s.find(sub)`，找不到返回 `string::npos`
> - 替换：`s.replace(pos, len, newStr)`
> - 大小写转换：用循环 + `tolower`/`toupper`
>
> 下节课我们继续深入——提取子串、判断对称（回文），以及更复杂的字符串综合应用！

---

## 六、课后作业与拓展（10分钟）

### 📝 课后作业（3道）

#### 作业 1：判断两字符串是否相等（不区分大小写）

输入两个字符串，忽略大小写比较是否相等。相等输出 `YES`，否则 `NO`。

**样例输入：**
```
Hello
hello
```
**样例输出：** `YES`

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    for (char &c : a) c = tolower(c);
    for (char &c : b) c = tolower(c);
    cout << (a == b ? "YES" : "NO") << endl;
    return 0;
}
```

---

#### 作业 2：字符串中是否包含某子串

输入主串和子串，判断子串是否在主串中出现，是输出 `YES`，否则 `NO`。

**样例输入：**
```
helloworld
world
```
**样例输出：** `YES`

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, t;
    cin >> s >> t;
    cout << (s.find(t) != string::npos ? "YES" : "NO") << endl;
    return 0;
}
```

---

#### 作业 3：统计字符串中的空格数

输入一行字符串，统计其中空格的数量。

**样例输入：** `hello world how are you`
**样例输出：** `4`

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    int cnt = 0;
    for (char c : s) if (c == ' ') cnt++;
    cout << cnt << endl;
    return 0;
}
```

---

### 🔥 拓展习题（尖子生挑战，7道）

#### 挑战 1：字符串分割为单词列表
输入一行含空格的句子，输出每个单词（每个单词一行）。

**提示：** 用 `istringstream` 或手动遍历判断空格边界。

#### 挑战 2：首字母大写
将字符串中每个单词的首字母大写，其余字母小写。

**提示：** 遍历时遇到空格后的字母 `toupper`，其余 `tolower`。

#### 挑战 3：统计单词频率
输入多行单词，统计每个不同单词出现的次数，按出现次数从多到少排序输出（等同时按字典序）。

**提示：** 可使用 `map<string, int>`。

#### 挑战 4：替换所有目标字符
将字符串中所有大写字母替换为 `*`，输出结果。

**提示：** 遍历判断 `isupper`，替换为 `'*'`。

#### 挑战 5：最长公共前缀
给定多个字符串，找出它们的最长公共前缀。

**提示：** 以第一个字符串为基准，逐字符与其他字符串比较。

#### 挑战 6：字符串异位词判断
判断两个字符串是否是字母异位词（相同字母，不同顺序，忽略大小写）。

**提示：** 统计两个字符串各字母出现次数，比较计数数组是否相同。

#### 挑战 7：字符串的字典序最小旋转
将字符串左旋一位（把第一个字符移到末尾），重复 n 次，输出字典序最小的一种。

**提示：** 枚举所有旋转结果，用 string 比较找最小值。
