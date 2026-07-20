# C++ ⼀级

2025 年 06 月

1 单选题（每题 2 分，共 30 分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr><tr><td>答案</td><td>C</td><td>A</td><td>D</td><td>D</td><td>C</td><td>B</td><td>D</td><td>C</td><td>A</td><td>B</td><td>A</td><td>C</td><td>D</td><td>C</td><td>B</td></tr></table>

第1题 2025年4月19日在北京举行了一场颇为瞩目的人形机器人半程马拉松赛。比赛期间，跑动着的机器人会利用身上安装的多个传感器所反馈的数据来调整姿态、保持平衡等，那么这类传感器类似于计算机的( )。A. 处理器B. 存储器C. 输入设备D. 输出设备

第2题 在某集成开发环境中调试下面代码段时尝试设置断点和检查局部变量，下面哪个说法是错误的（ ）。

1 int i,N = 0; // L12 cin >> N; // L23 for (i = 1; i < 9; i++)4 if (N % i == 0) break; // L35 if (i < 9)6 printf("N不能大于9\n"); // L4A. 断点不可以设在L1标记的代码行B. 执行暂停在L2标记的代码行时，可以检测i的值C. 执行暂停在L3标记的代码行时，可以修改i的值D. 执行有可能暂停在L4标记的代码行

第3题 对下列C++的代码，描述准确的是( )。1 int first = 10;2 printf("{%d}\n", First)A. 执行后输出10B. 执行后输出 {First}C. 执行后输出 "{First}"D. 编译报错，因为First应该是first

第4题 在C++中，下列可以做变量名的是( )。

A. X.cpp B. X-cpp C. X#cpp D. X\_cpp

第 5 题 C++表达式 14-3\*3%2 的值是( )。A. 0B. 11C. 13D. -67

第 6 题 下面的C++代码执行后，其输出是( )。1 int x = 10, y = 20;2 x = x + y;3 y = x - y;4 x = x - y;5 cout << x << ' ' << y;A. 10 20B. 20 10C. 10 10D. 20 20

第7题 定义整型变量 int a=16 ，则执行 ++a += 3 之后，a的值会是（ ）。A. 3B. 17C. 19D. 20

第8题 C++的 int 类型变量 X 的值为8，如果执行 cout << (++X)++; ，则输出和执行后 X 的值分别是（ ）。A. 8 9B. 9 9C. 9 10D. 编译错误，无法执行

第9题 下面C++代码执行后的输出是（ ）。1 int a,b;2 a = 3;3 b = 4;4 printf("a+b=%02d#a+b={a+b}", a+b, a+b);

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
A. $a + b = 07\# a + b = \{a + b\}$ B. $a + b = 7\# a + b = 7$ C. $a + b = 7\# a + b = \{a + b\}$ D. $a + b = 7\# a + b = 7$
</div>

第10题 下面的C++代码用于求M天后是星期几，两处横线处分别应填入的代码是（ ）。

```c
int N, M, D;
cout << "当前星期几？"; // 星期日是0
cin >> N;
cout << "求多少天后？"; // 输入正整数
cin >> M;

D = ____;
if (____)
    printf("%d天后是星期日", M);
else
    printf("%d天后是星期%d", M, D);
```

## A.

```txt
1 | (N + M) / 7
2 D == 0
```

## B.

```txt
1 | (N + M) % 7
2 | D == 0
```

C.

```txt
1 | (N + M) / 7
2 D <= 0
```

## D.

```txt
1 | (N + M) % 7
2 D = 0
```

第11题 下面C++代码执行后输出是（ ）。

```txt
int i;
for (i = 1; i < 11; i += 3){
    continue;
    if (i % 2 == 0)
    break;
    printf("%d#", i);
}
if (i >= 11)
    printf("END");
```

```asm
□ A.END
□ B.1#
□ C.1#4#END
```

```txt
D. 1#4#7#10#END
```

第12题 下面的C++代码用于求N的所有因数（即能将N整除的数），如输入12则将输出 12,6,4,3,2,1 。（ ）。

```c
int i, N;
cin >> N;
i = N;
while (____){
    if (N % i == 0)
    printf("%d," , i);
    i -= 1;
}
printf("1");
```

```txt
□ A. i -= 1
□ B. i == 1
□ C. i > 1
□ D. i >= 1
```

第13题 下面C++代码执行后输出的是（ ）。

```c
int Sum = 0;
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0)
    continue;
    if (i % 5 == 0)
    break;
    Sum += i;
}
cout << Sum;
```

```csv
□ A. 55
□ B. 15
□ C. 9
□ D. 4
```

第14题 试图编译并执行下面C++代码，下面描述正确的是（ ）。

```txt
1 float x;
2 x = 101;
3 x++;
4 cout << ++x;
```

```txt
□A.输出101  
□B.输出102  
□C.输出103  
□D.编译将报错，无法执行
```

第15题 以下C++代码可以找出百位、十位和个位满足特定条件的三位数，横线处应该填入的是（ ）

```txt
int count = 0;
for (int i = 100; i <= 999; i++) {
    int a = i / 100;

    int c = i % 10;
    if (a * a + b * b == c * c) {
    count++;
    }
}
```

```matlab
A. int b = (i / 10) / 10;
B. int b = (i / 10) % 10;
C. int b = (i % 10) / 10;
D. int b = (i % 10) % 10;
```

## 2 判断题（每题 2 分，共 20 分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr><tr><td>答案</td><td>√</td><td>×</td><td>√</td><td>×</td><td>×</td><td>×</td><td>×</td><td>×</td><td>√</td><td>×</td></tr></table>

第1题 人们现在参加很多闭卷考试时通常都不允许带智能手机、平板电脑等，此外很多种智能手表同样因为具有嵌入操作系统及通信等功能，所以也不允许随身携带。（ ）

第 2 题 如果N是C++的整型变量，值为5，则表达式 (N + !N) 的值为4。 ( )

第3题 在下面C++代码中，删除break语句对程序执行结果没有影响。( )

```txt
int i;
for (i = 0; i < 10; i++) {
    continue;
    cout << i << "#";
    break;
}
if (i >= 10)
    cout << "END";
```

第 4 题 删除下面C++代码中的continue后其输出是0#2#4#6#8#。（ ）

```txt
int i;
for (i = 0; i < 10; i++) {
    if (i % 2 == 0) {
    cout << i << "#";
    continue;
    }
}
if (i >= 10)
    cout << "END";
```

第 5 题 将下面C++代码中的 i < 100; i = i + 1 修改为 i < 200; i += i + 1 ，其输出与当前代码输出相同。（）

```txt
int cnt = 0;
for (int i = 0; i < 100; i = i + 1)
    cnt += 1;
cout << cnt;
```

第6题 交换下面C++代码中的 i += 2 和 cnt += 1 ，交换前后分别运行的两次输出相同。（ ）

```c
int i, cnt = 0;
cnt = 0;
while (i < 10){
    i += 2;
    cnt += 1;
}
cout << cnt;
```

第7题 下面的C++代码执行后将输出45。（ ）

```c
int cnt;
for (int i = 0; i < 10; i++)
    cnt += 1;
cout << cnt;
```

第 8 题 执行C++代码 cout << (12 + 12.12) 将报错，因为12是int类型，而12.12是float类型，不同类型不能直接运算。（ ）

第9题 在C++代码中，不可以将变量命名为false，因为false是C++语言的关键字。（ ）

第10题 X是C++的整型变量，则表达式 3 < X < 5 求值结果是4。( )

## 3 编程题（每题 25 分，共 50 分）

## 3.1 编程题 1

试题名称：假期阅读

时间限制：1.0s

内存限制：512.0 MB

## 3.1.1 题目描述

小A有一本厚厚的书。这本书总共有 页，小A一天中最多只能阅读完其中的 页。小A的假期总共有 天，他想知道在假期中最多能阅读完这本书的多少页。

## 3.1.2 输入格式

第一行，一个正整数 ，表示书的页数。

第二行，一个正整数 ，表示小A每天最多阅读的页数。

第三行，一个正整数 ，表示小A假期的天数。

## 3.1.3 输出格式

一行，一个整数，表示假期中所能阅读的最多页数。

3.1.4 样例

3.1.4.1 输入样例 1

```txt
18   
23   
32
```

## 3.1.4.2 输出样例 1

```txt
1 | 6
```

## 3.1.4.3 输入样例 2

## 3.1.4.4 输出样例 2

## 3.1.5 数据范围

对于所有测试点，保证 均不超过 。

## 3.1.6 参考程序

```cpp
#include <cstdio>
using namespace std;

int n, k, t;
int ans;

int main() {
    scanf("%d", &n);
    scanf("%d", &k);
    scanf("%d", &t);
    ans = k * t;
    if (n < ans)
    ans = n;
    printf("%d\n", ans);
    return 0;
}
```

## 3.2 编程题 2

试题名称：值日

时间限制：1.0s

内存限制：512.0 MB

## 3.2.1 题目描述

小杨和小红是值日生，负责打扫教室。小杨每 天值日一次，小红每 天值日一次。今天他们两个一起值日，请问至少多少天后，他们会再次同一天值日？

## 3.2.2 输入格式

第一行，一个正整数 ，表示小杨的值日周期；

第二行，一个正整数 ，表示小红的值日周期。

```txt
1 | 4
2 | 6
```

## 3.2.3 输出格式

一行，一个整数，表示至少多少天后他们会再次同一天值日。

## 3.2.4 样例

## 3.2.4.1 输入样例 1

## 3.2.4.2 输出样例 1

```txt
1 | 12
```

## 3.2.5 数据范围

对于所有测试点，保证 。

## 3.2.6 参考程序

```cpp
#include <cstdio>
#include <algorithm>
#include <iostream>
using namespace std;

int main() {
    int m, n;
    cin >> m >> n;
    for (int i = max(m, n); ; i++)
    if (i % m == 0 && i % n == 0) {
    cout << i << endl;
    break;
    }

    return 0;
}
```