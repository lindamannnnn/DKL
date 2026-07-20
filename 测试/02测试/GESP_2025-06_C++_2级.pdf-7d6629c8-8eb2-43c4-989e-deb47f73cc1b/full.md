# C++ 二级

2025年06月

1 单选题（每题2分，共30分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr><tr><td>答案</td><td>C</td><td>A</td><td>C</td><td>A</td><td>D</td><td>D</td><td>C</td><td>C</td><td>B</td><td>A</td><td>D</td><td>D</td><td>D</td><td>D</td><td>A</td></tr></table>

第1题 2025年4月19日在北京举行了一场颇为瞩目的人形机器人半程马拉松赛。比赛期间，跑动着的机器人会利用身上安装的多个传感器所反馈的数据来调整姿态、保持平衡等，那么这类传感器类似于计算机的( )。
□ A. 处理器
□ B. 存储器
□ C. 输入设备
□ D. 输出设备

第2题 小明购置的计算机使用一年后觉得内存不够用了，想购置一个容量更大的内存条，这时他需要的内存条是（）。  
□A.RAM  
□B.ROM  
□C.CACHE  
□D.EPROM

第 3 题 下面 C++ 代码执行后的输出是（）。

```javascript
int a=3;
float b = 3.5;
cout << (a *= b);
```

□A.3   
□B.3.5   
□C.10   
□D.11

第 4 题 下面 C++ 代码用于获得正整数的第 3 位数，如 1234 则输出 2。如果是一位数或两位数，则输出 0。横线处应填入的代码是()。

```csv
1 int N, remainder;
2 cout << "请输入正整数:";
3 cin >> N;
4 cout << ____;
□ A. N % 1000 / 100
□ B. N / 1000 % 100
□ C. N / 1000 / 100
□ D. N % 100 / 100
```

第 5 题 下面 C++ 代码执行，其输出是( )。

```txt
1 int a, b = (6, 28);
2 b == a;
3 a = b;
4 cout << a << ' ' << b;
□ A. 6 28
□ B. 6 6
□ C. 28 6
□ D. 28 28
```

第6题今天星期六，其后第N天星期几？如果是星期一到星期六输出形如：星期1、星期2等，星期天则输出星期天。下面的C++代码用于完成上述要求，横线处应填上的代码是( )。

```txt
int N, remainder;
cin >> N;
remainder = ____;
if(remainder == 0)
    printf("星期六后第%d天是星期天\n", N);
else
    printf("星期六后第%d天是星期%d\n", N, remainder);
```

第 7 题 下面的C++代码执行后其输出是()。

```txt
int i, Sum = 0;
for (i = 1; i < 10; i++) {
    Sum += i;
    if(i % 2) continue;
    if(i % 7) break;
}
cout << Sum;

A. 45
B. 28
```

```txt
□ C. 3
□ D. 0
```

第8题 下面 $\mathrm{C}++$ 代码执行后其输出是( )。

```matlab
int i, j;
for(i = 1; i < 12; i++)
    for(j = 1; j < i; j++)
    if(i * j % 2 == 1)
    break;
cout << i * j;
```

```txt
□ A. 110
□ B. 22
□ C. 12
□ D. 3
```

第 9 题 下面 C++ 代码执行后输出是()。

```txt
int i, cnt = 0;
for(i = -99; i < 100; i += 2)
cnt = 1 + cnt;
cout << cnt;
```

```csv
□ A. 101
□ B. 100
□ C. 99
□ D. 98
```

第 10 题 下面 C++ 代码执行后输出是（）。

```txt
int i;
for(i = 1; i < 10; i++) {
    if(i % 3 != 0) {
    printf("A#");
    continue;
    }
    else
    break;
    printf("0#");
}
if(i == 10) cout << "1";
```

```txt
□ A. A#A#
□ B. A#0#A#0
□ C. A#A#1
□ D. A#0#A#0#1
```

第 11 题 下面 C++ 代码执行后的输出是（）。

int i,j;
for(i = 0; i < 3; i++)
    for(j = 0; j < i; j++)
    printf("%d#%d-", i, j);
printf("END");
□ A. 0#0-1#0-2#0-2#1-END
□ B. 0#0-1#0-1#1-2#0-2#1-2#2-3#0-3#1-3#2-END
□ C. 0#0-1#0-1#1-2#0-2#1-2#2-END
□ D. 1#0-2#0-2#1-END

第 12 题 下面 C++ 代码执行后，将输出不能被 3 整除且除以 5 余数为 2 的数。下列选项不能实现的是（）。

第 13 题 下面 C++ 代码用于判断一个大于 0 的正整数是几位数，横线处应填入代码先后是（）。

```txt
int N, cnt;
cout << "请输入大于0的正整数：";
cin >> N;

cnt = 0;
while (____){
    cnt += 1;
    ____;
}
cout << cnt;
```

## □ A.

## □ B.

## □ C.

□ D.

```txt
1 | N > 0
2 | N /= 10
```

第 14 题 判断一个数是否为自守数。自守数的定义是如果一个数的平方其尾数与该数相同，则为自守数，如25的平方是625，其尾数是25，所以25是自守数。相关说法错误的是（）。

```txt
int N, N1, M1;
cout << "输入一个正整数：";
cin >> N;
N1 = N, M1 = N * N;

bool Flag = true;

while (N1 > 0){
    if (N1 % 10 != M1 % 10){
    Flag = false;
    break;
    }
    else{
    N1 = N1 / 10, M1 = M1 / 10;
    }
}

if (Flag == true)
    printf("%d的平方是%d, 是自守数", N, N * N);
else
    printf("%d的平方是%d, 不是自守数", N, N * N);

□ A. 如果Flag在循环中不被改为false，则说明该数是自守数
□ B. 代码 if (N1 % 10 != M1 % 10) 用于判断其个位数是否相等，如果不等，则表明不是自守数
□ C. 代码 N1 = N1 / 10, M1 = M1 / 10 将个位数去掉
□ D. 将 N1 > 0 改为 N > 0 效果相同
```

第 15 题 下面 C++ 代码实现输出如下图形，相关说法错误的是（）。

```c
请输入层数：10
0
12
345
6789
01234
567890
1234567
89012345
678901234
5678901234

int line_number, now_number;
int i,row;

cout << "请输入行数：";
cin >> line_number;
now_number = 0;

for (row = 1; row < line_number + 1; row++) { // L1
    for (i = 0; i < row; i++) { // L2
    cout << now_number;
    now_number += 1;
    if (now_number == 10) now_number = 0; // L3
```

```txt
13 }  
14 cout << endl;  
15 }
```

☐ A. 代码 now\_number = 0 移动到 L1 和 L2 标记的两行代码之间，效果维持不变

```txt
B. 代码 now_number += 1 修改为 now_number = 1 + now_number 效果维持不变
```

```txt
☐ C. 将代码 now_number == 10 调整为 now_number > 9 效果维持不变
```

```txt
D. 将最后一行的 cout << endl 修改为 cout << "\n"，效果维持不变
```

## 2 判断题（每题2分，共20分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr><tr><td>答案</td><td>√</td><td>√</td><td>×</td><td>√</td><td>×</td><td>×</td><td>×</td><td>×</td><td>×</td><td>√</td></tr></table>

第 1 题 人们现在参加很多闭卷考试时通常都不允许带智能手机、平板电脑等，此外很多种智能手表同样因为具有嵌入操作系统及通信等功能，所以也不允许随身携带。（）

第2题在 $\mathrm{C}++$ 代码中，假设N为正整数，则N/10舍弃个位数。如果N小于10，则其值为0，大于10则是舍弃个位数的数。（）

第3题 下列C++代码执行后，其输出为10 20，即 a == b 和 b == a 对 a 和 b 的值没有任何影响。（）

```txt
1 int a = 10, b = 20;
2 a == b;
3 b == a;
4 cout << (a, b);
```

第 4 题 a 和 b 分别是 C++ 的整型变量，如果表达式 max(a, b) == min(a, b) 的值为真，则说明 a 和 b 相等。（）

第 5 题 下面 C++ 代码编译时将报错，因为字符变量 a 被赋值了浮点值。（）

```javascript
1 char a = '1';
2 a = 45.6;
3 cout << a;
```

第6题 下面C++代码执行时如输入59.99，将输出及格两个汉字。（）

```txt
int score;
cout << "请输入学生成绩：";
cin >> score;
if (score < 60)
    cout << "不及格";
else
    cout << "及格";
```

第 7 题 在下面的 C++ 代码中，因为 continue 将被执行，因此不会有输出。（）

```txt
int i;
for (i = 1; i < 10; i++)
    if (i % 2 == 0)
    continue;
if(i == 10)
    cout << "END";
```

第8题 下面的 $\mathrm{C}++$ 代码执行后将输出15。（）

```txt
int Sum = 0;
for (int i = 0; i < 5; i++)
    Sum += i;
cout << Sum;
```

第9题 将下面C++代码中的 (int i = 5; i > 1; i--) 调整为 (int i = 1; i < 5; i++) 输出结果相同，因为5到1与1到5的求和相同。（）

```c
int tnt;
tnt = 0;
for (int i = 5; i > 1; i--)
    tnt += i;
cout << tnt;
    cout << endl;
```

第 10 题 为实现如下效果，即N行N列字符。当输入是奇数时，中间列为 \*，其他是-；当输入是偶数时，则中间两列是 \*，其他是-。字符阵列后的代码能实现其效果。（）

```c
int N;
cin >> N;

int i, j;
for (i = 0; i < N; i++) {
    for (j = 0; j < N; j++)
    if ((j == N / 2) || (j == (N - 1) / 2))
    cout << "*";
    else
    cout << "-";
    cout << endl;
}
```

## 3 编程题（每题 25 分，共 50 分）

## 3.1 编程题1

\- 试题名称：数三角形

\- 时间限制： $1.0 \mathrm{~s}$

\- 内存限制：512.0 MB

## 3.1.1 题目描述

直角三角形有两条直角边与一条斜边，设两条直角边的长度分别为 a, b，则直角三角形的面积为 $\frac{ab}{2}$ 。

请你计算当直角边长 $a, b$ 均取不超过 $n$ 的正整数时，有多少个不同的面积为整数的直角三角形。直角边长分别为 $a, b$ 和 $a', b'$ 的两个直角三角形相同，当且仅当 $a = a', b = b'$ 或者 $a = b', b = a'$ 。

```txt
1 | 5
```

## 3.1.2 输入格式

一行，一个整数 $n$ ，表示直角边长的最大值。

## 3.1.3 输出格式

输出一行，一个整数，表示不同的直角三角形数量。

## 3.1.4 样例

## 3.1.4.1 输入样例1

## 3.1.4.2 输出样例1

## 3.1.4.3 输入样例2

## 3.1.4.4 输出样例2

## 3.1.5 数据范围

对于所有测试点，保证 $1 \leq n \leq 1000$ 。

## 3.1.6 参考程序

```cpp
#include <iostream>
using namespace std;

int main()
{
    int n, a, b, cnt=0;
    cin >> n;
    for(a=1; a<=n; a++)
    {
    for(b=a; b<=n; b++)
    {
    if(a*b%2==0) cnt++;
    }
    }
    cout << cnt << endl;
    return 0;
}
```

## 3.2 编程题2

\- 试题名称：幂和数

\- 时间限制：1.0 s

\- 内存限制：512.0 MB

## 3.2.1 题目描述

对于正整数 $n$ ，如果 $n$ 可以表为两个2的次幂之和，即 $n = 2^{x} + 2^{y}$ （ $x, y$ 均为非负整数），那么称 $n$ 为幂和数。

给定正整数 $l, r$ ，请你求出满足 $l \leq n \leq r$ 的整数 $n$ 中有多少个幂和数。

## 3.2.2 输入格式

一行，两个正整数 l, r，含义如上。

## 3.2.3 输出格式

输出一行，一个整数，表示 l, r 之间幂和数的数量。

## 3.2.4 样例

## 3.2.4.1 输入样例1

```txt
1 | 2 8
```

## 3.2.4.2 输出样例1

```txt
1 | 6
```

## 3.2.4.3 输入样例2

```txt
1 | 10 100
```

## 3.2.4.4 输出样例2

```txt
1 | 20
```

## 3.2.5 数据范围

对于所有测试点，保证 $1 \leq l \leq r \leq 10^{4}$ 。

## 3.2.6 参考程序

```cpp
#include <iostream>
using namespace std;

int main()
{
    int l, r, a, b, n, cnt = 0;
    cin >> l >> r;

    a = 1;
    while(a <= r)
    {
    b = a;
    while(b <= r)
    {
    n = a + b;
    if(n >= 1 && n <= r) cnt++;
    b *= 2;
    }
    a *= 2;
    }
    cout << cnt << endl;
    return 0;
}
```