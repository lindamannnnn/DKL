# 课程07：string 使用1

> 🎯 目标：认识更好用的 string，会用 `+` 拼接、`==` 比较、size 求长度、find 查找、replace 替换。

---

## 故事：弹性魔法袋

<!-- story -->
小柯用字符数组存名字，总要先算好格子数，还得小心 `\0` 小旗子，麻烦极了 😩

这天老师送给他一个**弹性魔法袋**：想装多少字母就装多少，袋子会自己变大变小！

这个魔法袋的名字叫 **string** 🎒
<!-- end-story -->

---

## 回顾

<!-- card type:teacher -->
🧑‍🏫 上一课我们用字符数组存文字：`char a[] = "mike"`，拼接要 `strcat`，比较要 `strcmp`。

今天换成 string，这些麻烦事全都不用管啦！
<!-- end-card -->

---

## 卡片：string 来啦

<!-- card type:teacher -->
🧑‍🏫 string 就像弹性袋子：不用提前说装多少，自动变大变小 ✨

拼接直接用 `+`，比较直接用 `==`、`<`，再也不用手动管 `\0`！
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string a = "apple", b = "banana";
    cout << a + b << endl;       // applebanana
    if (a < b) cout << "a 排前面";  // 会输出这句
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：拼起来是啥

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "ab"; s += "cd";` 后，s 的内容是？
A. `"ab"`
B. `"cd"`
C. `"abcd"`
<!-- answer: C -->
<!-- end-checkpoint -->

---

## 卡片：读出整行

<!-- card type:teacher -->
🧑‍🏫 三个常用本领：

- `getline(cin, s)`：读一整行（含空格）；`cin >> s` 只读一个单词
- `s.size()`：有几个字符
- `s[i]`：看第 i 号格的字符，下标从 0 开始
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    getline(cin, s);          // 输入 hi c++
    cout << s.size() << endl; // 6
    cout << s[0] << endl;     // h
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：长度是几

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "hi c++";` 后，`s.size()` 的结果是？
A. 5
B. 6
C. 4
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：find 找一找

<!-- card type:teacher -->
🧑‍🏫 `s.find("abc")` 帮你找 "abc" 第一次出现的下标 🔍

找不到时会返回一个特殊记号 `string::npos`，意思是"查无此串"。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s = "hello world";
    cout << s.find("world") << endl;   // 6
    if (s.find("xyz") == string::npos)
        cout << "没找到 xyz" << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：找到哪儿

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "abcde";` 后，`s.find("cd")` 返回的下标是？
A. 1
B. 2
C. 3
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：replace 替换

<!-- card type:teacher -->
🧑‍🏫 `s.replace(起点, 个数, "新内容")`：从起点开始，把指定个数的字符换成新内容 🔧

新内容可以更长也可以更短，袋子会自动伸缩！
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s = "hello world";
    s.replace(6, 5, "C++");   // 6 号位起换 5 个
    cout << s << endl;         // hello C++
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：换成什么

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "hello world"; s.replace(0, 5, "hi");` 后，s 的内容是？
A. `"hi world"`
B. `"hihello world"`
C. `"hello hi"`
<!-- answer: A -->
<!-- end-checkpoint -->

---

## 卡片：大小写变身

<!-- card type:teacher -->
🧑‍🏫 string 没有一键变身按钮，要用 for 循环逐格施展 `tolower` / `toupper` 魔法 ✨
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s = "Hello World";
    for (int i = 0; i < s.size(); i++)
        s[i] = tolower(s[i]);
    cout << s << endl;   // hello world
    return 0;
}
```
<!-- end-demo -->

---

## 挑战 1：找子串位置

<!-- card type:computer -->
🖥️ 输入主字符串 s 和子串 t，输出 t 在 s 中第一次出现的下标（从 0 开始数）；找不到输出 -1。

**输入样例：** 第一行 `hello world`，第二行 `world`

**输出样例：** `6`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
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
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- `s.find(t)` 查找子串第一次出现的位置
- 用 `string::npos` 判断"没找到"

**解题思路分步说明**

1. 用 `getline` 分别读入主串 s 和子串 t。
2. `s.find(t)` 得到第一次出现的下标，存入 `pos`。
3. 如果 `pos` 等于 `string::npos`，输出 -1；否则输出 `pos`。

**容易错的地方**

- 忘记处理"找不到"的情况，直接把 npos 输出去
- 下标从 0 开始数，"world" 在 6 号位而不是 7 号位
- 用 `cin >> s` 读主串，空格后的内容会丢

**关键代码解释**

```cpp
if (pos == string::npos) cout << -1 << endl;
```

- `string::npos` 是 find 找不到时返回的特殊记号
- 和它比较，就知道这次查找有没有成功
<!-- end-card -->

---

## 挑战 2：替换所有子串

<!-- card type:computer -->
🖥️ 输入主串 s、旧子串、新子串（各占一行），把 s 里所有旧子串都换成新子串后输出。

**输入样例：** `hello world hello` 换行 `hello` 换行 `hi`

**输出样例：** `hi world hi`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, o, n;
    getline(cin, s); getline(cin, o); getline(cin, n);
    int pos = 0;
    while ((pos = s.find(o, pos)) != string::npos) {
        s.replace(pos, o.size(), n);
        pos += n.size();
    }
    cout << s << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- `s.find(o, pos)`：从 pos 位置开始继续找
- find + replace 配合，循环替换所有出现的地方

**解题思路分步说明**

1. 三行输入都用 `getline` 读进来。
2. 从 pos = 0 开始找旧子串 o。
3. 找到就在原地 `replace` 换成新子串 n。
4. pos 跳过刚换好的新内容，继续往后找，直到找不到为止。

**容易错的地方**

- 替换后 pos 不往前走，会在原地反复替换，死循环！
- 写成 `pos++` 也不对：换新内容后应从 `pos + n.size()` 继续，跳过新插入的部分
- 忘记 `s.find(o, pos)` 的第二个参数，每次都从头找

**关键代码解释**

```cpp
pos += n.size();
```

- 刚换上的新内容不用再检查，直接跳过
- 这样既能换干净，又不会陷入死循环
<!-- end-card -->

---

## 小贴士

<!-- card type:tip -->
💡 判断找不到：`s.find(t) == string::npos`，npos 是"查无此串"的特殊记号。

💡 替换循环里记得让 pos 跳过新换上的内容，否则会陷入死循环。
<!-- end-card -->

---

## 课后挑战

<!-- card type:teacher -->
🧑‍🏫 下面是 5 道闯关题，点击题目编号开始挑战！

> 💪 全部通过就能获得本课徽章！
<!-- end-card -->

<!-- problem: a030b86e-80cd-403e-901b-1a7672b3c71e -->
<!-- problem: 38cf6255-06d1-4815-91dc-664622e93047 -->
<!-- problem: 3e108b63-c729-4b14-aeb5-c7c742b89596 -->
<!-- problem: 1a248e7b-8653-4c6e-b22b-8edf3f1c9652 -->
<!-- problem: e2261f27-fb75-4f70-b7b0-fab28364f6a9 -->
