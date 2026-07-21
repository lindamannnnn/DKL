# 课程08：练习课：字符数组与 string 入门

> 🎯 目标：复习字符数组和 string 入门知识，把统计、转换、查找、替换练成条件反射！

---

## 故事：字符训练营

<!-- story -->
小柯来到字符串训练营，营门口立着五座闯关塔 🗼

前两座塔要用字符数组的本领：统计、变身；后三座塔要用 string 的魔法：拼接、查找、替换。

五座塔全部点亮，就能获得"字符小达人"称号！
<!-- end-story -->

## 本课练习要点

<!-- card type:teacher -->
🧑‍🏫 这节课不学新语法，复习第 06、07 课的核心知识：
- 字符数组：`char a[] = "mike"`，结尾有小旗子 `'\0'`
- 遍历：`for (int i = 0; s[i] != '\0'; i++)`
- 字符工具：`isupper`、`islower`、`isdigit`、`tolower`、`toupper`
- string 本领：`+` 拼接、`==` 与 `<` 比较、`size()` 求长度
- 查找替换：`find` 找不到返回 `string::npos`，`replace(起点, 个数, 新内容)`

练习时要注意：
1. 读整行用 `getline`，只读一个单词才用 `cin >>`
2. 替换后要跳过新换上的内容，防止死循环
3. 字符数组记得多留格子装 `\0`
<!-- end-card -->

## 挑战 1：数大写字母

<!-- card type:computer -->
🖥️ 输入一行字符串（可能含空格），统计其中大写字母的个数。

**输入样例：** `HeLLo World 123`

**输出样例：** `4`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
char s[1005];
int main() {
    cin.getline(s, 1005);
    int cnt = 0;
    for (int i = 0; s[i] != '\0'; i++)
        if (isupper(s[i])) cnt++;
    cout << cnt << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- `cin.getline` 读一整行
- 遍历字符数组，用 `isupper` 判断大写字母并计数

**解题思路分步说明**

1. 用 `cin.getline(s, 1005)` 读入整行。
2. 计数器 `cnt` 从 0 开始。
3. 逐格检查，是大写字母就 `cnt++`。
4. 看到 `'\0'` 停止，输出 `cnt`。

**容易错的地方**

- 用 `cin >> s`，空格后的内容丢失
- 计数器忘记初始化为 0
- 循环写成 `i < 1005`，数进垃圾字符

**关键代码解释**

```cpp
for (int i = 0; s[i] != '\0'; i++)
```

- 从 0 号格出发，一格一格往后看
- 碰到结束小旗子 `'\0'` 立刻停下
<!-- end-card -->

## 挑战 2：大小写互换

<!-- card type:computer -->
🖥️ 输入一行字符串，把大写字母变小写、小写字母变大写，其他字符不变，输出结果。

**输入样例：** `Hello World!`

**输出样例：** `hELLO wORLD!`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
char s[1005];
int main() {
    cin.getline(s, 1005);
    for (int i = 0; s[i] != '\0'; i++) {
        if (isupper(s[i])) s[i] = tolower(s[i]);
        else if (islower(s[i])) s[i] = toupper(s[i]);
    }
    cout << s << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- `isupper` / `islower` 判断身份，`tolower` / `toupper` 变身
- 边遍历边修改字符数组

**解题思路分步说明**

1. 读入整行字符串。
2. 逐格判断：大写就 `tolower` 变小写，小写就 `toupper` 变大写。
3. 数字、符号、空格两种都不是，保持原样。
4. 遍历完直接 `cout << s` 输出整个数组。

**容易错的地方**

- 把 `else if` 写成单独的 `if`，逻辑虽对但多做无用判断
- 忘记处理"其他字符不变"——其实不处理就是对的做法
- 直接用 ASCII 加减 32，容易写错，用现成函数更稳

**关键代码解释**

```cpp
if (isupper(s[i])) s[i] = tolower(s[i]);
```

- 先问身份：是大写吗？
- 是就施变身魔法，把变小写的结果放回原来的格子
<!-- end-card -->

## 检查点：读一整行

<!-- checkpoint -->
<!-- quiz: choice -->
已有 `char s[100];`，要把含空格的一整行读进 s，应该写哪句？
A. `cin >> s`
B. `cin.getline(s, 100)`
C. `cin >> s[0]`
<!-- answer: B -->
<!-- end-checkpoint -->

## 挑战 3：拼接与比较

<!-- card type:computer -->
🖥️ 输入两个不含空格的字符串 a 和 b，第一行输出它们拼接的结果，第二行输出字典序较小的那个。

**输入样例：** `banana apple`

**输出样例：** 第一行 `bananaapple`，第二行 `apple`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    cout << a + b << endl;
    if (a < b) cout << a << endl;
    else cout << b << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- string 用 `+` 拼接
- string 用 `<` 直接比字典序

**解题思路分步说明**

1. 读入两个字符串 a、b。
2. `a + b` 就是拼接结果，直接输出。
3. 用 `a < b` 比较：a 小输出 a，否则输出 b。

**容易错的地方**

- 还在用 `strcat`、`strcmp`，string 根本不需要
- 以为 `a < b` 比的是长度，其实比的是字典序
- 输出顺序写反：先拼接结果，后较小者

**关键代码解释**

```cpp
if (a < b) cout << a << endl;
```

- string 的 `<` 会自动逐字符比 ASCII 码
- 和查词典一样，"apple" 排在 "banana" 前面
<!-- end-card -->

## 检查点：找不到咋办

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "hello";` 后，`s.find("xyz")` 会返回什么？
A. 0
B. -1
C. `string::npos`
<!-- answer: C -->
<!-- end-checkpoint -->

## 挑战 4：找所有位置

<!-- card type:computer -->
🖥️ 输入主串 s 和子串 t（都不含空格），输出 t 在 s 中所有出现位置的下标（空格隔开，允许重叠）；一次都没出现就输出 -1。

**输入样例：** `abcabc` 换行 `bc`

**输出样例：** `1 4`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, t;
    cin >> s >> t;
    int pos = 0; bool found = false;
    while ((pos = s.find(t, pos)) != string::npos) {
        cout << pos << " "; found = true; pos++;
    }
    if (!found) cout << -1;
    cout << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- `s.find(t, pos)` 从指定位置继续找
- 循环找出所有出现位置

**解题思路分步说明**

1. 读入主串 s 和子串 t。
2. pos 从 0 开始，反复调用 `s.find(t, pos)`。
3. 每找到一次就输出下标，然后 `pos++` 继续找（允许重叠）。
4. 循环结束如果一次都没找到，输出 -1。

**容易错的地方**

- 找到后忘记 `pos++`，在下一次找到同一个位置，死循环！
- 忘记输出 -1 的情况
- 用 `found` 小旗记录是否找到过，这个细节容易漏

**关键代码解释**

```cpp
pos++;
```

- 只前进 1 格，所以像 "aaa" 里找 "aa" 能数出 2 次
- 这就是"允许重叠"的数法
<!-- end-card -->

## 检查点：换完是啥

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "abcde"; s.replace(1, 3, "XY");` 后，s 的内容是？
A. `"aXYe"`
B. `"XYde"`
C. `"aXYde"`
<!-- answer: A -->
<!-- end-checkpoint -->

## 挑战 5：替换所有子串

<!-- card type:computer -->
🖥️ 输入主串 s、旧子串、新子串（各占一行），把 s 中所有旧子串替换成新子串后输出。

**输入样例：** `abcabc` 换行 `bc` 换行 `XY`

**输出样例：** `aXYaXY`
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

- find 和 replace 的黄金搭档
- 替换后正确移动 pos 的技巧

**解题思路分步说明**

1. 三行输入分别读入 s、o、n。
2. pos 从 0 开始找旧子串 o。
3. 找到就 `replace(pos, o.size(), n)` 原地换新。
4. `pos += n.size()` 跳过新内容，继续找，直到找不到。

**容易错的地方**

- `pos += n.size()` 写成 `pos++`：新内容里如果又含旧子串会出问题
- 新旧子串长度不同也没关系，replace 会自动伸缩
- 忘记 while 循环，只替换了第一处

**关键代码解释**

```cpp
s.replace(pos, o.size(), n);
```

- 从 pos 开始，把 o 那么长的一段换成 n
- 换长换短都可以，string 袋子自动变大变小
<!-- end-card -->

## 小贴士

<!-- card type:tip -->
💡 find 循环三件套：找到就处理、`pos` 正确前进、找不到（`string::npos`）就停。

💡 读题先想输入方式：含空格用 `getline`，纯单词用 `cin >>`。
<!-- end-card -->

## 课后挑战

<!-- card type:teacher -->
🧑‍🏫 下面是 5 道闯关题，点击题目编号开始挑战！

> 💪 全部通过就能获得本课徽章！
<!-- end-card -->

<!-- problem: efcfa902-e9fe-4c12-9c18-46dddace4cd8 -->
<!-- problem: baf351cc-6d9a-4c9c-9bc5-639c3fde735b -->
<!-- problem: ffa9a8b3-0a05-44c0-ae65-e3f711b83874 -->
<!-- problem: f8bf2c36-9e4d-458c-aff4-d4c040b5cf6d -->
<!-- problem: 3e86e1f5-14a4-4c26-8378-ed8703d5f40b -->
