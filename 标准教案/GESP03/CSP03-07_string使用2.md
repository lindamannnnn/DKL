# CSP03-07 string 使用2

## 一、课程简介（5分钟）

### 🎯 课程目标

1. 掌握 `string` 的子串提取（`substr`）操作
2. 掌握字符串回文、对称的判断方法
3. 综合运用 `string` 的各种操作解决复杂字符串问题

### 📚 核心知识点

- `s.substr(pos, len)`：提取从 pos 开始长度为 len 的子串
- `s.substr(pos)`：提取从 pos 到末尾的子串
- 字符串对称（回文）的判断方法：双指针、逆序比较
- string 综合应用：字符串处理的整体思路

---

## 二、知识回顾（10分钟）

### 👩‍🏫 教师引导

> 上节课我们学了 string 的基础：拼接、搜索、替换、大小写转换。
>
> 今天继续进阶——学习如何"切割"字符串（提取子串），以及一个经典问题：**回文判断**！
>
> 最后，我们用综合题来验证这两节课学到的所有 string 技能！

**互动复习：**

> - `s.find("abc")` 找不到时返回什么？（`string::npos`）
> - 如何把字符串 `s` 全部转成大写？（for 循环 + toupper）

---

## 三、新知讲解（45分钟）

### 1. 新知导入 🎬

> 假设你有一个身份证号码字符串："110105199001234567"
>
> 你想从中提取出生年月日（第7到第14位），怎么做？
>
> 用 `s.substr(6, 8)` 就能一次搞定！（下标从0开始，第7位就是下标6）
>
> 这就是 `substr` 的魔力——精准"切割"字符串的任意一段！

---

### 2. 知识点讲解

#### 2.1 提取子串 substr

```cpp
string s = "hello world";

// 格式1：s.substr(pos, len) — 从 pos 开始，截取 len 个字符
string sub1 = s.substr(0, 5);   // "hello"
string sub2 = s.substr(6, 5);   // "world"

// 格式2：s.substr(pos) — 从 pos 开始截到末尾
string sub3 = s.substr(6);      // "world"
```

**常见应用：**

```cpp
string date = "2024-03-15";
string year  = date.substr(0, 4);   // "2024"
string month = date.substr(5, 2);   // "03"
string day   = date.substr(8, 2);   // "15"
```

> ⚠️ 注意：`pos` 超出字符串长度会报错！使用前要确认 `pos < s.size()`。

---

#### 2.2 字符串对称（回文）判断

**方法一：双指针（推荐）**

```cpp
string s = "racecar";
int l = 0, r = s.size() - 1;
bool isOk = true;
while (l < r) {
    if (s[l] != s[r]) { isOk = false; break; }
    l++; r--;
}
cout << (isOk ? "YES" : "NO") << endl;
```

**方法二：逆序字符串比较**

```cpp
string s = "racecar";
string rev = s;
reverse(rev.begin(), rev.end());  // 需要 #include <algorithm>
cout << (s == rev ? "YES" : "NO") << endl;
```

> `reverse(s.begin(), s.end())` 可以直接将 string 原地逆序！

---

#### 2.3 在 string 中使用 begin/end 迭代器

`string` 支持 C++ 标准库算法，可以使用迭代器范围：

```cpp
#include <algorithm>
string s = "hello";
reverse(s.begin(), s.end());   // s = "olleh"
sort(s.begin(), s.end());      // s = "ehllo"（排序字符）
```

---

#### 2.4 字符串综合操作技巧

**删除字符串中所有指定字符：**

```cpp
string s = "a1b2c3";
string result = "";
for (char c : s) {
    if (!isdigit(c)) result += c;  // 只保留非数字
}
// result = "abc"
```

**字符串反转每个单词：**

```cpp
string line = "hello world";
// 分割 → 反转每个单词 → 重新拼接
```

---

### 3. GESP 真题演练 ⚡

**抢答题 1（选择题）：**

> `string s = "abcdef"; cout << s.substr(2, 3);` 的输出是？
>
> A. "abc"  B. "bcd"  C. "cde"  D. "def"
>
> **答案：C**  
> 解析：从下标 2（字符 'c'）开始，截取 3 个字符："cde"。

**判断题 2：**

> 判断回文串，可以将字符串逆序后与原字符串比较，相同则是回文。（ ）
>
> **答案：✓（正确）**

**抢答题 3：**

> `string s = "programming"; s.substr(0, 4)` 的结果是？
>
> **答案：** `"prog"`

---

### 4. 进阶扩展

**最长回文子串（暴力枚举，O(n²)）：**

```cpp
string s = "babad";
int maxLen = 1;
string ans = s.substr(0, 1);

for (int i = 0; i < s.size(); i++) {
    for (int len = 1; i + len <= s.size(); len++) {
        string sub = s.substr(i, len);
        string rev = sub;
        reverse(rev.begin(), rev.end());
        if (sub == rev && len > maxLen) {
            maxLen = len;
            ans = sub;
        }
    }
}
cout << ans << endl;  // "bab" 或 "aba"
```

> 📌 黑板推演：
> 枚举所有起始位置 i 和长度 len，提取子串，判断是否回文。时间复杂度 O(n²)，对 n≤1000 的字符串完全足够。

---

## 四、课堂练习（45分钟）🎈

### 练习 1（基础）：提取子串

**题目描述：**

输入字符串 s 和两个整数 l、r（1-indexed），输出 s 的第 l 到第 r 个字符（含边界）。

**输入格式：**
- 第一行字符串 s（不含空格）
- 第二行两整数 l r

**输出格式：**
- 提取的子串

**样例输入：**
```
helloworld
2 6
```

**样例输出：**
```
ellow
```

**题解代码：**

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int l, r;
    cin >> l >> r;
    cout << s.substr(l - 1, r - l + 1) << endl;
    return 0;
}
```

---

### 练习 2（基础）：判断回文串

**题目描述：**

输入一个字符串，判断它是否是回文串（忽略大小写）。

**输入格式：**
- 一行字符串（不含空格，长度 ≤ 1000）

**输出格式：**
- `YES` 或 `NO`

**样例输入：**
```
Racecar
```

**样例输出：**
```
YES
```

**题解代码：**

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;
int main() {
    string s;
    cin >> s;
    for (char &c : s) c = tolower(c);
    string rev = s;
    reverse(rev.begin(), rev.end());
    cout << (s == rev ? "YES" : "NO") << endl;
    return 0;
}
```

---

### 练习 3（综合）：统计某子串出现次数（不重叠）

**题目描述：**

输入主串 s 和子串 t，统计 t 在 s 中**不重叠**出现的次数。

**输入格式：**
- 第一行主串 s
- 第二行子串 t

**输出格式：**
- 出现次数

**样例输入：**
```
ababab
ab
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
        pos += t.size();  // 不重叠：跳过本次匹配
    }
    cout << cnt << endl;
    return 0;
}
```

---

### 练习 4（综合）：翻转字符串中的单词

**题目描述：**

输入一行句子，将其中每个单词内部的字符翻转（单词顺序不变），输出结果。

**输入格式：**
- 一行句子（单词间用单个空格分隔，长度 ≤ 200）

**输出格式：**
- 每个单词翻转后的句子

**样例输入：**
```
hello world
```

**样例输出：**
```
olleh dlrow
```

**题解代码：**

```cpp
#include <iostream>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;
int main() {
    string line;
    getline(cin, line);
    istringstream ss(line);
    string word;
    bool first = true;
    while (ss >> word) {
        reverse(word.begin(), word.end());
        if (!first) cout << " ";
        cout << word;
        first = false;
    }
    cout << endl;
    return 0;
}
```

---

### 练习 5（进阶）：最长回文子串

**题目描述：**

给定一个字符串 s（只含小写字母），求其中最长的回文子串。如有多个长度相同的，输出字典序最小的。

**输入格式：**
- 一行字符串 s（长度 ≤ 500）

**输出格式：**
- 最长回文子串

**样例输入：**
```
babad
```

**样例输出：**
```
aba
```

**题解代码：**

```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.size();
    int maxLen = 0;
    string ans = "";
    for (int i = 0; i < n; i++) {
        for (int len = 1; i + len <= n; len++) {
            string sub = s.substr(i, len);
            string rev = sub;
            reverse(rev.begin(), rev.end());
            if (sub == rev) {
                if (len > maxLen || (len == maxLen && sub < ans)) {
                    maxLen = len;
                    ans = sub;
                }
            }
        }
    }
    cout << ans << endl;
    return 0;
}
```

---

## 五、课堂总结（5分钟）🌟

> 今天完成了 string 的进阶学习！
>
> 核心技能：
> - `s.substr(pos, len)`：精准提取子串
> - `reverse(s.begin(), s.end())`：原地逆序
> - 回文判断：双指针或逆序比较
>
> 这两节课加起来，string 的重要操作已经全部掌握！
>
> 下节课开始进入全新主题：**算法篇**——从"枚举算法"开始，学习信息学竞赛的思维方法！

---

## 六、课后作业与拓展（10分钟）

### 📝 课后作业（3道）

#### 作业 1：提取域名

输入一个 URL，提取其中的域名（在 "://" 之后到 "/" 或末尾之前）。

**样例输入：** `https://www.example.com/page`
**样例输出：** `www.example.com`

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string url;
    cin >> url;
    int start = url.find("://") + 3;
    int end = url.find("/", start);
    if (end == (int)string::npos) end = url.size();
    cout << url.substr(start, end - start) << endl;
    return 0;
}
```

---

#### 作业 2：字符串旋转

输入字符串 s 和整数 k，将 s 向左旋转 k 位（前 k 字符移到末尾）。

**样例输入：**
```
abcde
2
```
**样例输出：** `cdeab`

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s; int k;
    cin >> s >> k;
    k %= s.size();
    cout << s.substr(k) + s.substr(0, k) << endl;
    return 0;
}
```

---

#### 作业 3：统计回文子串个数

输入字符串 s，统计其中长度 ≥ 2 的回文子串的数量。

**样例输入：** `aaa`
**样例输出：** `3`（"aa"×2 + "aaa"×1）

```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    string s; cin >> s;
    int n = s.size(), cnt = 0;
    for (int i = 0; i < n; i++) {
        for (int len = 2; i + len <= n; len++) {
            string sub = s.substr(i, len);
            string rev = sub;
            reverse(rev.begin(), rev.end());
            if (sub == rev) cnt++;
        }
    }
    cout << cnt << endl;
    return 0;
}
```

---

### 🔥 拓展习题（尖子生挑战，7道）

#### 挑战 1：最短回文（添加字母）
在字符串末尾最少添加多少个字符，使整个字符串成为回文？
**提示：** 从最长回文前缀入手（KMP或暴力）。

#### 挑战 2：字符串的所有子串
输出字符串 s 的所有子串（去重，按长度从小到大、字典序排列）。
**提示：** 枚举所有起始位置和长度，加入 set 自动去重排序。

#### 挑战 3：最长公共子串
给定两个字符串，找出它们的最长公共子串的长度。
**提示：** 枚举 s1 的每个子串，用 find 检查是否在 s2 中存在。

#### 挑战 4：字符串压缩
输入字符串，判断能否用一个更短的字符串重复多次得到，如果能输出最短的那个，否则输出原字符串。
**提示：** 枚举长度为 1~n/2 的前缀，检查 s 是否由该前缀重复构成。

#### 挑战 5：字符串分组
输入 n 个字符串，将互为字母异位词的字符串分在一组，输出每组。
**提示：** 将每个字符串排序后得到"签名"，用 map/sort 分组。

#### 挑战 6：最长不含重复字符的子串
给定字符串，找最长的不包含重复字符的子串的长度。
**提示：** 滑动窗口，用 cnt[] 记录窗口内字符个数，窗口右边界右移，出现重复则左边界右移。

#### 挑战 7：字符串解码
输入格式 `k[encoded_string]`，输出 encoded_string 重复 k 次的结果（可嵌套，如 `2[a3[b]]` = "abbbabbb"）。
**提示：** 用栈模拟括号匹配，遇到 `]` 时弹出并重复。
