# 课程10：练习课：string 综合应用

> 🎯 目标：综合运用字符数组与 string 的全部本领，挑战 substr、find、replace 进阶题！

---

## 故事：字符串总决赛

<!-- story -->
小柯通过了字符训练营，来到字符串总决赛现场 🏟️

五道关卡摆在面前：倒车、剪刀、数数、旋转木马，还有最难的回文宝藏。

裁判说："把 06 到 09 课学的本领全用上，你就能捧起奖杯！"
<!-- end-story -->

## 本课练习要点

<!-- card type:teacher -->
🧑‍🏫 总决赛复习第 06~09 课的全部知识：
- 字符数组遍历：`s[i] != '\0'` 当停止信号
- string 基础：`+` 拼接、`==` 比较、`size()`、`getline`
- 查找：`find(t, pos)` 从 pos 继续找，找不到是 `string::npos`
- 替换：`replace(起点, 个数, 新内容)`，换完记得跳过新内容
- 剪刀：`substr(起点, 个数)`、只写起点就剪到尾
- 倒车：`reverse(s.begin(), s.end())`

比赛时要注意：
1. 题目说"第几个"是从 1 数，下标从 0 数，记得减 1
2. 判断回文先复制一份再倒车
3. 多个工具组合时，先想清楚步骤再写代码
<!-- end-card -->

## 挑战 1：倒车请注意

<!-- card type:computer -->
🖥️ 输入一行字符串（可能含空格），把它整个倒过来输出。

**输入样例：** `hi c++`

**输出样例：** `++c ih`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    reverse(s.begin(), s.end());
    cout << s << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- `getline` 读整行
- `reverse` 一键倒转字符串

**解题思路分步说明**

1. 题目含空格，用 `getline(cin, s)` 读整行。
2. `reverse(s.begin(), s.end())` 让整串倒车。
3. 直接输出 s。

**容易错的地方**

- 用 `cin >> s`，空格后的内容丢失
- reverse 漏写 `.end()`，只写两个参数才完整
- 手动挡也能做：从 `s.size() - 1` 倒着循环输出，但 reverse 更快

**关键代码解释**

```cpp
reverse(s.begin(), s.end());
```

- begin 是车头，end 是车尾
- 倒车器一拉，整串首尾对调
<!-- end-card -->

## 检查点：剪出哪段

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "2024-03-15";` 后，`s.substr(5, 2)` 的结果是？
A. `"24"`
B. `"-0"`
C. `"03"`
<!-- answer: C -->
<!-- end-checkpoint -->

## 挑战 2：剪出生日

<!-- card type:computer -->
🖥️ 输入一个形如 `2024-03-15` 的日期字符串，分三行依次输出年、月、日。

**输入样例：** `2024-03-15`

**输出样例：** 三行依次是 `2024`、`03`、`15`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string d;
    cin >> d;
    cout << d.substr(0, 4) << endl;  // 年
    cout << d.substr(5, 2) << endl;  // 月
    cout << d.substr(8, 2) << endl;  // 日
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- `substr(起点, 个数)` 精准剪子串
- 固定格式字符串的位置分析

**解题思路分步说明**

1. 先在纸上标出每个字符的下标：`2024-03-15` 的年占 0~3，月占 5~6，日占 8~9。
2. 年：`substr(0, 4)`；月：`substr(5, 2)`；日：`substr(8, 2)`。
3. 分三行输出。

**容易错的地方**

- 忘记两个 `-` 也占格子，月和日的起点写错
- 个数和起点写反：substr 先写起点，再写个数
- 建议做题前先画下标小尺子

**关键代码解释**

```cpp
d.substr(5, 2)
```

- 从下标 5（'0' 那个格子）开始
- 剪 2 个字符，正好得到月份 "03"
<!-- end-card -->

---

## 卡片：允许重叠计数

<!-- card type:teacher -->
🧑‍🏫 数子串出现次数，要分清两种数法 🔢

- **不重叠**：数完一次就跳到它尾巴后，接着找（如 `aaaa` 里数 `aa` 得 2 次）
- **允许重叠**：每次只往后挪 1 格，前一次的位置能和下一次共用（`aaaa` 里得 3 次）

题目说"允许重叠"，就用一格一格往前挪的慢办法！
<!-- end-card -->

---

## 检查点：数对了吗

<!-- checkpoint -->
<!-- quiz: choice -->
允许重叠地数，`"aaa"` 中 `"aa"` 出现了几次？
A. 1
B. 2
C. 3
<!-- answer: B -->
<!-- end-checkpoint -->

## 挑战 3：数出现次数

<!-- card type:computer -->
🖥️ 输入主串 s 和子串 t（都不含空格），统计 t 在 s 中出现了几次（允许重叠）。

**输入样例：** `aaaa` 换行 `aa`

**输出样例：** `3`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, t;
    cin >> s >> t;
    int cnt = 0, pos = 0;
    while ((pos = s.find(t, pos)) != string::npos) { cnt++; pos++; }
    cout << cnt << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- `find(t, pos)` 循环查找所有出现位置
- "允许重叠"的计数技巧

**解题思路分步说明**

1. 读入主串 s 和子串 t。
2. pos 从 0 开始反复 `find(t, pos)`。
3. 每找到一次 `cnt++`，然后 `pos++` 只前进 1 格。
4. 找不到时循环自动结束，输出 `cnt`。

**容易错的地方**

- 写成 `pos += t.size()`：这是"不重叠"的数法，`aaaa` 里数 `aa` 会得 2 而不是 3
- pos 不前进，死循环
- 循环条件忘记和 `string::npos` 比较

**关键代码解释**

```cpp
pos++;
```

- 只前进 1 格，下一次找到的位置可以和这次重叠
- `aaaa` 里的 `aa` 出现在 0、1、2 号位，共 3 次
<!-- end-card -->

## 检查点：转完是啥

<!-- checkpoint -->
<!-- quiz: choice -->
把 `"abcde"` 的前 2 个字符搬到末尾，结果是？
A. `"cdeab"`
B. `"eabcd"`
C. `"bcdea"`
<!-- answer: A -->
<!-- end-checkpoint -->

## 挑战 4：旋转木马

<!-- card type:computer -->
🖥️ 输入字符串 s 和整数 k，把 s 的前 k 个字符搬到末尾（向左旋转 k 位），输出结果。

**输入样例：** `abcde` 换行 `2`

**输出样例：** `cdeab`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; int k;
    cin >> s >> k;
    k %= s.size();
    cout << s.substr(k) + s.substr(0, k) << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- substr 两种用法配合：`substr(k)` 剪后半段、`substr(0, k)` 剪前半段
- 用 `+` 把两段重新拼接

**解题思路分步说明**

1. 读入 s 和 k。
2. `k %= s.size()`：转一整圈等于没转，先取余防越界。
3. 后半段 `s.substr(k)` 拼前半段 `s.substr(0, k)`。
4. 输出拼接结果。

**容易错的地方**

- 忘记 `k %= s.size()`：k 比长度还大时 substr 会出错
- 拼接顺序写反：是"后半段 + 前半段"
- 想手动逐个搬字符，用 substr 一行就能搞定

**关键代码解释**

```cpp
s.substr(k) + s.substr(0, k)
```

- `substr(k)`：从 k 号位剪到尾巴，是后半段
- `substr(0, k)`：从头剪 k 个，是被搬走的前半段
<!-- end-card -->

## 挑战 5：回文子串计数

<!-- card type:computer -->
🖥️ 输入一个字符串 s（不含空格），统计其中长度至少为 2 的回文子串有多少个。

**输入样例：** `aaa`

**输出样例：** `3`（两个 `aa` 加一个 `aaa`）
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; int n, cnt = 0; cin >> s; n = s.size();
    for (int i = 0; i < n; i++)
        for (int len = 2; i + len <= n; len++) {
            string sub = s.substr(i, len), rev = sub;
            reverse(rev.begin(), rev.end());
            if (sub == rev) cnt++;
        }
    cout << cnt << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- 双重循环枚举所有子串：起点 i + 长度 len
- substr 剪出来，复制倒车判断回文

**解题思路分步说明**

1. 外层循环枚举子串起点 `i`。
2. 内层循环枚举长度 `len`（从 2 开始，题目不要长度 1 的）。
3. `substr(i, len)` 剪出子串，复制一份倒车。
4. 正倒相同就是回文，`cnt++`。

**容易错的地方**

- 内层条件写成 `i + len < n`，漏掉剪到末尾的子串，应该是 `<=`
- 长度从 1 开始枚举，把单字符也算进去
- 忘记先复制再倒车，把子串本身弄反了

**关键代码解释**

```cpp
for (int len = 2; i + len <= n; len++)
```

- `i + len <= n` 保证子串不会剪出界
- len 从 2 起步，长度 1 的单字符不参与计数
<!-- end-card -->

## 小贴士

<!-- card type:tip -->
💡 substr 组合拳：`substr(k)` 剪到尾，`substr(0, k)` 剪开头，一拼就是旋转。

💡 枚举子串的标准套路：外层起点 i，内层长度 len，条件 `i + len <= n`。
<!-- end-card -->

## 课后挑战

<!-- card type:teacher -->
🧑‍🏫 下面是 5 道闯关题，点击题目编号开始挑战！

> 💪 全部通过就能获得本课徽章！
<!-- end-card -->

<!-- problem: 86be3151-5b16-4607-b044-b86fd006f53b -->
<!-- problem: c70aedc5-887a-4267-abd3-b2c2e4f7247f -->
<!-- problem: f34dbe2c-0c3f-4694-b9cf-286ad60d9020 -->
<!-- problem: 0ad8f4f7-8212-4645-bf9b-7809895e190b -->
<!-- problem: 55d1bfb8-9de0-4ec8-9e0d-79ae70c4fc93 -->
