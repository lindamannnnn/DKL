## GESP C++一级认证试卷

（满分：100 分 考试时间：90 分钟）

学校：

姓名：

<table><tr><td>题目</td><td>一</td><td>二</td><td>三</td><td>总分</td></tr><tr><td>得分</td><td></td><td></td><td></td><td></td></tr></table>

## 一、单选题（每题 2 分，共 30 分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr><tr><td>答案</td><td>A</td><td>C</td><td>C</td><td>D</td><td>A</td><td>D</td><td>D</td><td>C</td><td>C</td><td>B</td><td>B</td><td>A</td><td>C</td><td>B</td><td>D</td></tr></table>

1. 以下不属于计算机输出设备的有（ ）。A. 麦克风B. 音箱C. 打印机D. 显示器

2. ChatGPT 是OpenAI研发的聊天机器人程序，它能通过理解和学习人类的语言来进行对话，还能根据聊天的上下文进行互动，完成很多工作。请你猜猜看，下面任务中，ChatGPT不能完成的是（ ）。A. 改邮件B. 编剧本C. 擦地板D. 写代码

3. 常量'3'的数据类型是（ ）。A. doubleB. floatC. charD. int

4. 下列关于C++语言变量的叙述，正确的是（ ）。A. 变量可以没有定义B. 对一个没有定义的变量赋值，相当于定义了一个新变量C. 执行赋值语句后，变量的类型可能会变化D. 执行赋值语句后，变量的值可能不会变化

5. 以下可以作为C++标识符的是（ ）。A. number\_of\_Chinese\_people\_in\_millionsB. 360AntiVirusC. Man&WomanD. break

6. 以下哪个不是C++语言的关键字？（ ）A. doubleB. elseC. whileD. endl

7. 如果a、b 和c 都是int 类型的变量，下列哪个语句不符合 C++语法？（ ） A. a = (b == c); B. b = 5.5; C. c = a + b + c; D. a + c = b + c;

8. 如果用一个int 类型的变量a 表达正方形的边长，则下列哪个表达式不能用来计算正方形的面积？（ ）A. a \* aB. 1 \* a \* aC. a ^ 2D. a \* 2 \* a / 2

9. 表达式(4 \* (11 + 12) / 4)的计算结果为（ ）。A. 47B. 20C. 23D. 56

10. 如果a 为int 类型的变量，且a 的值为6，则执行a %= 4;之后，a 的值会是（ ）。A. 1B. 2C. 3D. 4

11. 如果 a 和 b 均为 int 类型的变量，下列表达式能正确判断“a 等于 0 且 b等于0”的是（ ）。A. (a == b == 0)B. !(a || b)C. (a + b == 0)D. (a == 0) + (b == 0)

12. 如果a 和b 为int 类型的变量，且值分别为7 和2，则下列哪个表达式的计算结果不是3.5？（ ）A. 0.0 + a / bB. (a + 0.0) / bC. (0.0 + a) / bD. a / (0.0 + b)

13. 在下列代码的横线处填写（ ），使得输出是“20 10”。

```cpp
#include <iostream>
using namespace std;
int main() {
    int a = 10, b = 20;
    a = ____; // 在此处填入代码
    b = a + b;
    a = b - a;
    cout << a << " " << b << endl;
    return 0;
}
A. a + b
B. b
C. a - b
D. b - a
```

14. 在下列代码的横线处填写（ ），可以使得输出是“147”。

```cpp
#include <iostream>
using namespace std;
int main() {
    for (int i = 1; i <= 8; i++)
    if (____) // 在此处填入代码
    cout << i;
    return 0;
}
A. i % 2 == 1
B. i % 3 == 1
C. i = i + 3
D. i + 3
```

15. 执行以下C++语言程序后，输出结果是（ ）。

```cpp
#include <iostream>
using namespace std;
int main() {
    int sum;
    for (int i = 1; i <= 20; i++)
    if (i % 3 == 0 || i % 5 == 0)
    sum += i;
    cout << sum << endl;
    return 0;
}
A. 63
B. 98
C. 113
D. 无法确定
```

## 二、判断题（每题 2 分，共 20 分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr><tr><td>答案</td><td>√</td><td>√</td><td>×</td><td>×</td><td>√</td><td>√</td><td>√</td><td>×</td><td>×</td><td>√</td></tr></table>

1. 计算机硬件主要包括运算器、控制器、存储器、输入设备和输出设备。

2. 诞生于 1958 年的103 机是中国第一台通用数字电子计算机，比 1946年在美国诞生的第一台通用电子计算机 ENIAC晚了十多年。

3. 在C++语言中，计算结果必须存储在变量中才能输出。

4. 在C++语言中，标识符的命名不能完全由数字组成，至少有一个字母就可以。

5. 10 是一个int 类型常量。

6. if 语句可以没有else 子句。

7. do ... while 语句的循环体至少会执行一次。

8. 如果a 和b 为int 类型的变量，则表达式a = b 可以判断a 和b 是否相等。

9. 如果 a 为 int 类型的变量，则表达式(a % 4 == 2)可以判断 a 的值是否为偶数。

10. 表达式(37 / 4)的计算结果为9，且结果类型为int。

## 三、编程题（每题 25 分，共 50 分）

<table><tr><td>题号</td><td>1</td><td>2</td></tr><tr><td>答案</td><td></td><td></td></tr></table>

## 1. 时间规划

## 【问题描述】

小明在为自己规划学习时间。现在他想知道两个时刻之间有多少分钟，你能通过编程帮他做到吗？

## 【输入描述】

输入4行，第一行为开始时刻的小时，第二行为开始时刻的分钟，第三行为结束时刻的小时，第四行为结束时刻的分钟。

输入保证两个时刻是同一天，开始时刻一定在结束时刻之前。时刻使用 24小时制，即小时在0到23之间，分钟在0到59之间。

## 【输出描述】

输出一行，包含一个整数，从开始时刻到结束时刻之间有多少分钟。

【样例输入1】

<table><tr><td>9</td></tr><tr><td>5</td></tr><tr><td>9</td></tr><tr><td>6</td></tr></table>

## 【样例输出1】

```txt
1
```

## 【样例输入2】

```csv
9
5
10
0
```

【样例输出2】

```txt
55
```

## 【参考程序】

```cpp
#include <iostream>
using namespace std;
int main() {
    int h1 = 0, m1 = 0, h2 = 0, m2 = 0;
    cin >> h1 >> m1;
    cin >> h2 >> m2;
    cout << (h2 - h1) * 60 + (m2 - m1) << endl;
    return 0;
}
```

## 2. 累计相加

## 【问题描述】

输入一个正整数 ，求形如： $1 + ( 1 + 2 ) + ( 1 + 2 + 3 ) + ( 1 + 2 + 3 + 4 ) +$ ……(1+2+3+4+5+……n)的累计相加。

## 【输入描述】

输入一个正整数。约定<sub>1 ≤ ? ≤ 100</sub>。

## 【输出描述】

输出累计相加的结果。

## 【样例输入1】

```txt
10
```

```txt
20
```

【样例输出1】

【样例输入2】

【样例输出2】

【样例输入3】

【样例输出3】

```txt
220
```

## 【参考程序】

```cpp
#include <iostream>
using namespace std;
int main() {
    int n = 0;
    cin >> n;
    int sum = 0;
    for (int i = 1; i <= n; i++)
    sum += (i + 1) * i / 2;
    cout << sum << endl;
    return 0;
}
```