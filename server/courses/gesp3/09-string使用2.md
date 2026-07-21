# 课程09：string 使用2

> 🎯 目标：学会用 substr 精准剪出子串，用 reverse 倒转字符串，掌握回文判断的两种方法（双指针、逆序比较），还会 sort 字符排序和遍历拼接删字符。

---

## 故事：身份证的秘密

<!-- story -->
小柯拿到一串身份证号码：`110105200801012345` 🔍

老师说：里面藏着生日！第 7 到第 14 位就是出生年月日。

"这么长一串，怎么只剪出中间那一段呢？"

——剪刀手 **substr** 出场了！✂️
<!-- end-story -->

---

## 回顾

<!-- card type:teacher -->
🧑‍🏫 第 07 课我们学会了 string 的拼接、`size()` 求长度、`find` 查找、`replace` 替换。

今天再学两件新兵器：剪刀 `substr` 和倒车器 `reverse`！
<!-- end-card -->

---

## 卡片：substr 剪绳子

<!-- card type:teacher -->
🧑‍🏫 `s.substr(起点, 个数)`：从起点下标开始，剪出指定个数的一段 ✂️

起点从 0 开始数，剪出来的新串不会伤害原来的绳子。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s = "hello world";
    cout << s.substr(0, 5) << endl;  // hello
    cout << s.substr(6, 5) << endl;  // world
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：剪出哪一段

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "abcdef";` 后，`s.substr(2, 3)` 的结果是？
A. `"bcd"`
B. `"cde"`
C. `"def"`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：剪到绳子尾

<!-- card type:teacher -->
🧑‍🏫 只写起点、不写个数，就从起点一直剪到绳子尾巴：`s.substr(起点)`

⚠️ 起点不能超出绳子长度，否则程序会"咔嚓"断掉报错！
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string id = "110105200801012345";
    cout << id.substr(6, 8) << endl;  // 20080101 生日
    cout << id.substr(14) << endl;    // 2345 剪到尾
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：再剪一次

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "helloworld";` 后，`s.substr(5)` 的结果是？
A. `"hello"`
B. `"world"`
C. `"oworld"`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：reverse 倒车

<!-- card type:teacher -->
🧑‍🏫 `reverse(s.begin(), s.end())` 让字符串整串倒车，首尾对调 🚗

`begin()` 是车头，`end()` 是车尾，倒车器夹在中间一拉就翻过来了。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s = "hello";
    reverse(s.begin(), s.end());
    cout << s << endl;   // olleh
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：倒车后是啥

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "abc"; reverse(s.begin(), s.end());` 后，s 的内容是？
A. `"abc"`
B. `"cba"`
C. `"bac"`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：回文判断

<!-- card type:teacher -->
🧑‍🏫 正着读和倒着读一模一样的串叫**回文**，比如 "level"、"racecar" 🪞

判断方法：复制一份倒车，再和原串比一比，相同就是回文！
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s = "racecar", rev = s;
    reverse(rev.begin(), rev.end());
    if (s == rev) cout << "是回文";
    else cout << "不是回文";
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：哪个是回文

<!-- checkpoint -->
<!-- quiz: choice -->
下列哪个字符串正着读和倒着读一样（是回文）？
A. `"level"`
B. `"hello"`
C. `"world"`
<!-- answer: A -->
<!-- end-checkpoint -->

---

## 卡片：双指针回文

<!-- card type:teacher -->
🧑‍🏫 判断回文还有一招更快的方法——**双指针**，不用复制、不用倒车 👈👉

左指针 `l` 站最左边（0 号位），右指针 `r` 站最右边（`s.size()-1` 号位），两人向中间夹逼，每走一步比对一次：

- 不一样 → 肯定不是回文，马上收工，后面的都不用比了！
- 一样 → 左指针右移、右指针左移，继续比

循环条件 `l < r`：两个指针碰头或擦肩而过，就说明全部比完了。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s = "racecar";
    int l = 0, r = s.size() - 1;
    bool ok = true;
    while (l < r) { if (s[l] != s[r]) { ok = false; break; } l++; r--; }
    cout << (ok ? "YES" : "NO") << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：指针碰头没

<!-- checkpoint -->
<!-- quiz: choice -->
双指针判断回文时，while 循环继续比对的条件是？
A. `l < r`
B. `l > r`
C. `l == r`
<!-- answer: A -->
<!-- end-checkpoint -->

---

## 卡片：sort 排排坐

<!-- card type:teacher -->
🧑‍🏫 想给字符串里的字符按字典序排队？用 `sort(s.begin(), s.end())` 🎵

`s.begin()` 是队伍最前面的起点，`s.end()` 是一直走到尾巴的终点——sort 从起点走到终点，把字符按 a→z 从小到大排整齐！
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s = "hello";
    sort(s.begin(), s.end());
    cout << s << endl;   // ehllo
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：排序后是啥

<!-- checkpoint -->
<!-- quiz: choice -->
执行 `string s = "cab"; sort(s.begin(), s.end());` 后，s 的内容是？
A. `"cab"`
B. `"abc"`
C. `"bac"`
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 卡片：删掉指定字符

<!-- card type:teacher -->
🧑‍🏫 想删掉字符串里所有不想要的字符？用**遍历拼接法** 🧹

准备一个新空串，一个字符一个字符看：不是要删的，就 `+=` 拼到新串上；是要删的，直接跳过。看完一圈，新串就是删干净的结果！
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s = "a1b2c3", ans = "";
    for (char c : s)
        if (!isdigit(c)) ans += c;   // 数字跳过不拼
    cout << ans << endl;   // abc
    return 0;
}
```
<!-- end-demo -->

---

## 检查点：拼接留下谁

<!-- checkpoint -->
<!-- quiz: choice -->
用遍历拼接法删除指定字符时，遇到要删的字符应该怎么做？
A. 拼到新串上
B. 直接跳过
C. 停止循环
<!-- answer: B -->
<!-- end-checkpoint -->

---

## 挑战 1：截取一段

<!-- card type:computer -->
🖥️ 输入字符串 s 和两个整数 l、r（从 1 开始数），输出 s 的第 l 到第 r 个字符。

**输入样例：** `helloworld` 换行 `2 6`

**输出样例：** `ellow`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int l, r;
    cin >> s >> l >> r;
    cout << s.substr(l - 1, r - l + 1) << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- `substr(起点, 个数)` 提取子串
- 题目的"第几个"（从 1 数）和下标（从 0 数）的换算

**解题思路分步说明**

1. 读入字符串 s 和整数 l、r。
2. 第 l 个字符的下标是 `l - 1`，这就是起点。
3. 从 l 到 r 一共有 `r - l + 1` 个字符，这就是个数。
4. `s.substr(l - 1, r - l + 1)` 剪出来直接输出。

**容易错的地方**

- 起点忘记减 1：题目从 1 数，电脑从 0 数
- 个数算成 `r - l`，少了一个字符
- 没有先想清楚再动手，建议拿样例 `2 6` 比划一下

**关键代码解释**

```cpp
s.substr(l - 1, r - l + 1)
```

- `l - 1`：把"第 l 个"翻译成下标
- `r - l + 1`：数一数 l 到 r 一共几个字符
<!-- end-card -->

---

## 挑战 2：回文判断器

<!-- card type:computer -->
🖥️ 输入一个不含空格的字符串，忽略大小写判断它是不是回文，是输出 `YES`，否输出 `NO`。

**输入样例：** `Racecar`

**输出样例：** `YES`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    for (int i = 0; i < s.size(); i++) s[i] = tolower(s[i]);
    string rev = s;
    reverse(rev.begin(), rev.end());
    cout << (s == rev ? "YES" : "NO") << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- card type:teacher -->
**这道题考察什么知识点**

- 先统一大小写，再判断回文
- 复制 + 倒车 + 比较的回文判断法

**解题思路分步说明**

1. 读入字符串 s。
2. for 循环把每个字符都 `tolower` 变成小写，忽略大小写差异。
3. 复制一份 `rev`，用 `reverse` 倒车。
4. 比较 `s == rev`，相同输出 YES，不同输出 NO。

**容易错的地方**

- 忘记先统一大小写："Racecar" 直接判断会输出 NO
- 把原串 s 倒车了，后面没得比——一定要先复制一份
- `reverse` 要写 `rev.begin()` 和 `rev.end()` 两个参数

**关键代码解释**

```cpp
string rev = s;
reverse(rev.begin(), rev.end());
```

- 先复印一张一模一样的纸
- 倒车只倒复印件，原串保持不动用来比较
<!-- end-card -->

---

## 小贴士

<!-- card type:tip -->
💡 substr 起点是下标（从 0 数），题目说"第几个"时记得减 1。

💡 判断回文先复制再倒车，别把原串弄乱了。
<!-- end-card -->

---

## 课后挑战

<!-- card type:teacher -->
🧑‍🏫 下面是 5 道闯关题，点击题目编号开始挑战！

> 💪 全部通过就能获得本课徽章！
<!-- end-card -->

<!-- problem: 6134d2a0-9d73-42b4-8d44-c73e9c463f05 -->
<!-- problem: 656eb4c6-42d5-43dd-805d-5df187bd59b4 -->
<!-- problem: 2753cfba-ff69-4136-a0c5-1fefe872ada0 -->
<!-- problem: f34dbe2c-0c3f-4694-b9cf-286ad60d9020 -->
<!-- problem: 5a991fc2-fd0c-4858-823b-7e9da9f36702 -->
