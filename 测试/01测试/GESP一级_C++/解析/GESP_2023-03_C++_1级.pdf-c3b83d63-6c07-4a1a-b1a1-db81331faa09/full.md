GESP C++一级试卷

（满分：100 分 考试时间：90 分钟）

学校：

姓名：

<table><tr><td>题目</td><td>一</td><td>二</td><td>三</td><td>总分</td></tr><tr><td>得分</td><td></td><td></td><td></td><td></td></tr></table>

## 一、单选题（每题2 分，共 30分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr><tr><td>答案</td><td>B</td><td>A</td><td>A</td><td>C</td><td>B</td><td>D</td><td>D</td><td>A</td><td>A</td><td>D</td><td>B</td><td>C</td><td>D</td><td>B</td><td>C</td></tr></table>

1. 以下不属于计算机输入设备的有（ ）。A．键盘B．音箱C．鼠标D．传感器

2. 计算机系统中存储的基本单位用 B来表示，它代表的是（ ）。A. ByteB. BlockC. BulkD. Bit

3. 常量 7.0的数据类型是（）。

A. double B. float C. void D. int

4. 下列关于 C++语言的叙述，不正确的是（）。A. 变量定义时可以不初始化B. 变量被赋值之后的类型不变C. 变量没有定义也能够使用D. 变量名必须是合法的标识符

5. 以下不可以作为 C++标识符的是（）。A. x321B. 0x321C. x321\_D. \_x321

6. 以下哪个不是 C++语言的关键字？A. intB. forC. doD. cout

7. 如果 a、b和c都是 int类型的变量，下列哪个语句不符合C++语法？A. $\mathrm { ~ c ~ } = \mathrm { ~ a ~ } + \mathrm { ~ b ~ } ;$

B. c += a + b; C. c = a = b; D. c = a ++ b;

8. 如果用两个 int 类型的变量a和b分别表达长方形的长和宽，则下列哪个表达式不能用来计算长方形的周长？A. a + b \* 2B. 2 \* a + 2 \* bC. a + b + a + bD. b + a \* 2 + b

9. 表达式((3 == 0) + 'A' + 1 + 3.0)的结果类型为（）。A. doubleB. intC. charD. bool

10. 如果 a为int类型的变量，且 a的值为 6，则执行a \*= 3;之后，a的值会是（）。A. 3B. 6C. 9D. 18

11. 如果 a和b均为 int类型的变量，下列表达式不能正确判断“a等于 0且b等于0”的是（）

A. (a == 0) && (b == 0) B. (a == b == 0) C. (!a) && (!b) D. (a == 0) + (b == 0) == 2

12. 如果 a为int类型的变量，下列哪个表达式可以正确求出满足“大于等于a且是4 的倍数”的整数中最小的？A. a \* 4B. a / 4 \* 4C. (a + 3) / 4 \* 4D. a - a % 4 + 4

13. 在下列代码的横线处填写（），可以使得输出是“20 10”。

```cpp
#include <iostream>
using namespace std;
int main() {
    int a = 10, b = 20;
    a = ____; // 在此处填入代码
    b = a / 100;
    a = a % 100;
    cout << a << " " << b << endl;
    return 0;
}
A. a + b
B. (a + b) * 100
C. b * 100 + a
D. a * 100 + b
```

14. 在下列代码的横线处填写（），可以使得输出是“1248”。

```cpp
1 #include <iostream>
2 using namespace std;
3 int main() {
4    for (int i = 1; i <= 8; ____) // 在此处填入代码
5    cout << i;
6    return 0;
7 }
A. i++
B. i *= 2
C. i += 2
D. i * 2
```

15. 执行以下 C++语言程序后，输出结果是（）。

```asm
#include <iostream>
using namespace std;
int main() {
    int sum = 0;
    for (int i = 1; i <= 20; i++)
    if (i % 3 == 0 || i % 5 == 0)
    sum += i;
    cout << sum << endl;
    return 0;
}
A. 210
B. 113
C. 98
D. 15
```

## 二、判断题（每题2 分，共 20分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr><tr><td>答案</td><td>√</td><td>×</td><td>×</td><td>√</td><td>×</td><td>×</td><td>×</td><td>×</td><td>√</td><td>√</td></tr></table>

1. 在Windows 系统中通过键盘完成对选定文本移动的按键组合是先 Ctrl+X，移动到目标位置后按 Ctrl+V。

2. 程序员用 C、C++、Python、Scratch 等编写的程序能在 CPU 上直接执行。

3. 在C++语言中，注释不宜写得过多，否则会使得程序运行速度变慢。

4. 在C++语言中，标识符中可以有数字，但不能以数字开头。

5. '3'是一个 int 类型常量。

6. if语句中的条件表达式的结果必须为bool 类型。

7. for 语句的循环体至少会执行一次。

8. 如果 a为int类型的变量，则赋值语句a = a + 3;是错误的，因为这条语句会导致 a无意义。

9. 如果 a 为 int 类型的变量，则表达式(a / 4 == 2)和表达式(a >= 8 && a<= 11)的结果总是相同的。

10. 表达式(3.5 \* 2)的计算结果为 7.0，且结果类型为 double。

## 三、编程题（每题25 分，共50分）

<table><tr><td>题号</td><td>1</td><td>2</td></tr><tr><td>答案</td><td></td><td></td></tr></table>

## 1. 每月天数

## 【问题描述】

小明刚刚学习了每月有多少天，以及如何判断平年和闰年，想到可以使用编程方法求出给定的月份有多少天。你能做到吗？

## 【输入描述】

输入一行，包含两个整数，分别表示一个日期的年、月。

## 【输出描述】

```txt
输出一行，包含一个整数，表示输入月份有多少天。
【样例输入 1】
2022 1
【样例输出 1】
31
【样例输入 2】
2020 2
【样例输出 2】
29
```

## 【参考程序】

```cpp
#include <iostream>
using namespace std;
int main() {
    int y = 0, m = 0;
    cin >> y >> m;
    bool leap = false; // 判断闰年
    if (y % 400 == 0)
    leap = true;
    if (y % 4 == 0 && y % 100 != 0)
    leap = true;
    if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12)
    cout << 31 << endl; // 大月
    else if (m == 4 || m == 6 || m == 9 || m == 11)
    cout << 30 << endl; // 小月
    else if (leap)
    cout << 29 << endl; // 闰年2月
    else
    cout << 28 << endl; // 平年2月
    return 0;
}
```

## 2. 长方形面积

## 【问题描述】

小明刚刚学习了如何计算长方形面积。他发现，如果一个长方形的长和宽都是整数，它的面积一定也是整数。现在，小明想知道如果给定长方形的面积，有多少种可能的长方形，满足长和宽都是整数？

如果两个长方形的长相等、宽也相等，则认为是同一种长方形。约定长方形的长大于等于宽。正方形是长方形的特例，即长方形的长和宽可以相等。

## 【输入描述】

输入一行，包含一个整数??，表示长方形的面积。约定2 ≤ ?? ≤ 1000。

【输出描述】

输出一行，包含一个整数??，表示有??种可能的长方形。

【样例输入 1】

4

【样例输出 1】

2

【样例解释1】

2种长方形面积为 4，它们的长宽分别为2×2、4×1。

【样例输入2】

6

【样例输出 2】

2

【样例解释2】

2种长方形面积为 6，它们的长宽分别为3×2、6×1。

【参考程序】

```cpp
#include <iostream>
using namespace std;
int main() {
    int area = 0, cnt = 0;
    cin >> area;
    for (int w = 1; w * w <= area; w++) {
```