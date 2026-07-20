# 课程14：练习课：GESP2 综合大闯关

> 🎯 目标：复习 GESP2 第 01~12 课全部知识点，把学过的本领串成一条超级通关链！

---

## 故事：综合大闯关

<!-- story -->
豆豆来到 GESP2 训练营的终极广场，广场上立着五座闯关塔。

第一座塔藏着数学函数的魔法，第二座塔要调用自己写的函数，第三座塔是数字拆解的谜题，第四座塔布满了循环与判断的机关，第五座塔则是一座需要用循环画出的神秘图形。

只有五座塔全部通过，才能成为真正的二级小程序员！🏆
<!-- end-story -->

## 本课练习要点

<!-- card type:teacher -->
🧑‍🏫 这节课我们不学新语法，重点复习 GESP2 第 01~12 课的核心知识：
- 数学函数：`abs`、`sqrt`、`max`、`min`、`round`、`rand`、`srand`
- 自定义函数：定义、调用、声明、形参/实参、值传递、作用域
- 数据类型转换：ASCII 码、强制转换、隐式转换
- 多层分支：`if` 嵌套、`switch` 嵌套、悬空 `else`
- 多层循环：嵌套 `for`、数位处理
- 图形打印：斜边、对称、复杂图形拆解
- 存储与网络：Cache / RAM / ROM、LAN / MAN / WAN、TCP/IP 四层、IP 地址

练习时要注意：
1. 审题：看清输入、输出、保留小数和特殊边界
2. 函数调用前要先定义，或提前声明；注意返回值类型
3. 字符和整数运算时 C++ 会当成整数算，输出前记得转回 `char`
4. `else` 总是和最近的未配对 `if` 匹配，不确定就加大括号 `{}`
5. 图形题先画样例，把每行的空格数和字符数标清楚再写循环
6. 存储题记住：RAM 断电丢失，ROM 断电保留；网络分类 LAN 局域、MAN 城域、WAN 广域
<!-- end-card -->

## 挑战 1：最大最小差

<!-- card type:computer -->
🖥️ 输入三个整数 a、b、c，输出最大值与最小值的差。

**输入样例：** `4 9 2`

**输出样例：** `7`
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
    int a, b, c;
    cin >> a >> b >> c;
    int mx = max(a, max(b, c));  // 最大值
    int mn = min(a, min(b, c));  // 最小值
    cout << mx - mn << endl;
    return 0;
}
```
<!-- end-demo -->

## 挑战 2：函数判断闰年

<!-- card type:computer -->
🖥️ 定义函数 `bool isLeap(int year)`，判断年份 year 是否为闰年。

闰年规则：能被 4 整除但不能被 100 整除，或者能被 400 整除。

在 `main` 中输入一个年份，输出 `YES` 或 `NO`。

**输入样例：** `2024`

**输出样例：** `YES`
<!-- end-card -->

<!-- card type:teacher -->
🧑‍🏫 闰年规则比较长，建议先用多行 `if-else` 写清楚，熟练后再合并成一行。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

bool isLeap(int year)
{   // 判断闰年（多行写法，好理解）
    if (year % 400 == 0)
        return true;
    if (year % 100 == 0)
        return false;
    if (year % 4 == 0)
        return true;
    return false;
}

int main()
{
    int year;
    cin >> year;
    if (isLeap(year))
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
    return 0;
}
```
<!-- end-demo -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

bool isLeap(int year)
{   // 判断闰年（合并写法，更短）
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

int main()
{
    int year;
    cin >> year;
    cout << (isLeap(year) ? "YES" : "NO") << endl;
    return 0;
}
```
<!-- end-demo -->

## 挑战 3：数字拆解

<!-- card type:computer -->
🖥️ 输入一个正整数 n（100 ≤ n ≤ 9999），分别输出它的每一位数字。

依次输出千位、百位、十位、个位，没有的位输出 0，每个数字占一行。

**输入样例：** `1234`

**输出样例：**
```
1
2
3
4
```
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n;
    cin >> n;
    cout << n / 1000 << endl;     // 千位
    cout << n / 100 % 10 << endl; // 百位
    cout << n / 10 % 10 << endl;  // 十位
    cout << n % 10 << endl;       // 个位
    return 0;
}
```
<!-- end-demo -->

## 挑战 4：自定义函数求素数

<!-- card type:computer -->
🖥️ 定义函数 `bool isPrime(int n)`，判断 n 是否为素数。

输入整数 L 和 R（2 ≤ L ≤ R ≤ 1000），输出 L 到 R 范围内所有素数，每个素数占一行。

**输入样例：** `10 20`
**输出样例：**
```
11
13
17
19
```
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

bool isPrime(int n)
{   // 判断素数
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)   // 试到 i*i 超过 n 就够了（和 GESP1 学的写法一样）
        if (n % i == 0) return false;
    return true;
}

int main()
{
    int L, R;
    cin >> L >> R;
    for (int i = L; i <= R; i++)
        if (isPrime(i)) cout << i << endl;
    return 0;
}
```
<!-- end-demo -->

## 挑战 5：蝴蝶图案

<!-- card type:computer -->
🖥️ 输入正整数 n，打印蝴蝶图案。第 i 行有 i 个 `*`，中间 `2*(n-i)` 个空格，再 i 个 `*`。

**输入样例：** `4`
**输出样例：**
```
*      *
**    **
***  ***
********
```
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

void stars(int k)
{   // 打印 k 个星号
    for (int j = 1; j <= k; j++) cout << "*";
}

int main()
{
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        stars(i);
        for (int j = 1; j <= 2*(n-i); j++) cout << " ";
        stars(i);
        cout << endl;
    }
    return 0;
}
```
<!-- end-demo -->

## 小贴士

<!-- card type:tip -->
💡 综合练习常见坑提醒：
- `max(a, max(b, c))` 可以比较三个数，不需要 `max({a, b, c})`。
- 自定义函数写在 `main` 后面时，前面要加声明；写在前面则可以直接调用。
- 形参的改变不会影响到 `main` 里的实参，这叫“值传递”。
- 取数位常用：`n % 10` 取个位，`n / 10` 去掉个位，`n / 10 % 10` 取十位。
- 图形题的关键是找规律：每行 = 空格 + 字符 + （可能的中空）+ 字符。
- 计算机网络口诀：LAN 局域、MAN 城域、WAN 广域；TCP/IP 四层口诀：应传网接。
<!-- end-card -->

## 课后挑战

<!-- problem: 40b4f463-bae4-4672-b3ee-e54d1e810df7 -->
<!-- problem: 06374b3c-5f51-4bab-9e7a-9a35ab0a846e -->
<!-- problem: 14c8cde3-d903-4b66-9e4b-e80b8d205982 -->
<!-- problem: 2ec27c21-627a-4560-8828-049a1ebd8895 -->
<!-- problem: 37e9e951-c3f0-4c58-81bb-c35ea8757f1c -->
