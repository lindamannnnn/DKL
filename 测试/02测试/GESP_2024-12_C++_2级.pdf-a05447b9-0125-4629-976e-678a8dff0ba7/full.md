# C++ 二级

2024年12月

1 单选题（每题2分，共30分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr><tr><td>答案</td><td>C</td><td>A</td><td>D</td><td>B</td><td>D</td><td>B</td><td>C</td><td>C</td><td>D</td><td>A</td><td>A</td><td>D</td><td>B</td><td>D</td><td>C</td></tr></table>

第1题 2024年10月8日，诺贝尔物理学奖“意外地”颁给了两位计算机科学家约翰·霍普菲尔德（John J. Hopfield）和杰弗里·辛顿（Geoffrey E. Hinton）。这两位科学家的主要研究方向是（）。  
□A.天体物理  
□B.流体力学  
□C.人工智能  
□D.量子理论

第2题 计算机系统中存储的基本单位用B来表示，它代表的是（），比如某个照片大小为3MB。
□ A. Byte
□ B. Block
□ C. Bulk
□ D. Bit

第3题 C++语句 cout << (3 + 3 % 3 \* 2 - 1) 执行后输出的值是（）。  
□ A. -1  
□ B. 4  
□ C. 56  
□ D. 2

第 4 题 下面 C++ 代码执行后其输出是( )。

1 for (int i=0; i<10; i++)
2 printf("%d",i);

□A.123456789  
□B.0123456789  
□C.12345678910

D. 012345678910

第 5 题 下面 C++ 代码的相关说法中，正确的是()。

```txt
int tint;
for (int i=0; i<10; i++)
    tint += i;
cout << tint;
```

□ A. 上述代码执行后其输出相当于求1-10的和（包含10）
□ B. 上述代码执行后其输出相当于求1-10的和（不包含10）
□ C. 上述代码执行后其输出相当于求0-10的和（不包含10）
□ D. 上述代码执行后将输出不确定的值

第6题 下面C++代码执行后输出是（）。

```matlab
int i;
for (i=1; i<10; i++)
    if (i % 2)
    continue;
    else
    break;
cout << i;
```

```txt
□A.1   
□B.2   
□C.9   
□D.10
```

第7题 下面C++代码执行后的输出是（）。

```txt
for (i=0; i<10; i++) {
    if (i % 3)
    continue;
    printf("0#");
}
if(i>=10)
    printf("1#");
```

```csv
□ A. 0#0#0#0#0#0#0#1#
□ B. 0#0#0#0#0#0#1#
□ C. 0#0#0#0#1#
□ D. 0#0#0#0#
```

第 8 题 下面 C++ 代码用于输出 0-100 之前（包含 100）能被 7 整除但不能被 3 整除的数，横线处不能填入的代码是（）。

```txt
for (i=0; i<100; i++)
    if(____)
    cout << i << endl;
```

```txt
□ A. i % 7 == 0 && i % 3 != 0
□ B. !(i % 7) && i % 3 != 0
□ C. i % 7 && i % 3
□ D. i % 7 == 0 && !(i % 3 == 0)
```

第 9 题 下面 C++ 代码用于求正整数各位数字之和，横线处不应填入代码是（）。

```c
int tnt, N;
printf("请输入正整数：");
cin >> N;
tnt = 0;
while (N != 0){
    N /= 10;
}
cout <<tnt;
```

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
□ A.  $\text{tnt} = \text{tnt} + \text{N} \% 10$ 
□ B.  $\text{tnt} += \text{N} \% 10$ 
□ C.  $\text{tnt} = \text{N} \% 10 + \text{tnt}$ 
□ D.  $\text{tnt} = \text{N} \% 10$
</div>

第 10 题 下图的 C++ 程序执行后的输出是（）。

```txt
for (i=0; i<5; i++)
    for (j=0; j<i; j++)
    cout << j;
```

```csv
□A.0010120123  
□B.01012012301234  
□C.001012012301234  
□D.01012012301234012345
```

第 11 题 下面 C++ 代码用于实现图示的九九乘法表。相关说法错误的是（）。

```txt
1 /*  
2 1*1=1  
3 1*2=2 2*2=4  
4 1*3=3 2*3=6 3*3=9  
5 1*4=4 2*4=8 3*4=12 4*4=16  
6 1*5=5 2*5=10 3*5=15 4*5=20 5*5=25  
7 1*6=6 2*6=12 3*6=18 4*6=24 5*6=30 6*6=36  
8 1*7=7 2*7=14 3*7=21 4*7=28 5*7=35 6*7=42 7*7=49  
9 1*8=8 2*8=16 3*8=24 4*8=32 5*8=40 6*8=48 7*8=56 8*8=64
```

```c
1*9=9 2*9=18 3*9=27 4*9=36 5*9=45 6*9=54 7*9=63 8*9=72 9*9=81
*/
for (int Hang=1; Hang<10; Hang++) {
    for (int Lie=1; Lie<Hang+1; Lie++) {
    if (Lie * Hang > 9)
    printf("%d %d=%d ", Lie, Hang, Lie*Hang);
    else 
    printf("%d %d=%d ", Lie, Hang, Lie*Hang);
    // L2
    }
    printf("\n"); // L1
}
```

☐ A. 将L1注释的 printf("\\n") 移到L2注释所在行，效果相同

```txt
B. 将L1注释的 printf("\n") 修改为 print("%c", '\n') 效果相同
```

```txt
☐ C. 将 Lie * Hang > 9 修改为 Lie * Hang >= 10 效果相同
```

```txt
☐ D. 将 Lie * Hang > 9 修改为 Hang * Lie > 9 效果相同
```

第12题在数学中N!表示N的阶乘，即1到N的乘积，如 $3! = 1*2*3$ 。下面的 $\mathrm{C}++$ 用于求1-N的阶乘之和，如N为3，则是 $1! + 2! + 3!$ 。下面代码段补充选项后用于实现上述功能，其中不能实现阶乘和的选项是（）。

```c
int N;
cin >> N;
int tnt=0, nowNum = 1; //tnt保存求和之值，当前N的阶乘
for (int i=1; i < N + 1; i++) {
    ____ // 基于上一个计算出当前数的阶乘
    ____ // 从1到i每个数阶乘之和
}
cout << tnt;
```

## □ A.

```txt
1 nowNum *= i;
2 tnt += nowNum;
```

## □ B.

```txt
1 nowNum = nowNum * i;
2 tnt = tnt + nowNum;
```

## □ C.

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
1 nowNum *= i;
2 
  $\text{tnt} = \text{nowNum} + \text{tnt};$
</div>

D.

```c
/*
高度:5
*
***
*****
*****
*****
*/
int height;
cout << "高度: ";
//获取用户输入的高度
cin >> height;
for (i=0; i<height; i++){
    //打印每行前面的空格
    for (j = 0; j < ____; j++)
    cout << " ";
    //打印每行的星号
    for (k = 0; k < ____; k++)
    cout << "*";
    //输出一行后，换行
    cout << endl;
}
```

```txt
□ A.
```

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
1 nowNum = nowNum + i;
2 
  \|  $*$  = nowNum;
</div>

第 13 题 下面C++代码用于输出N和M之间（可以包括N和M）的孪生素数。孪生素数是指间隔为2的两个数均为素数，如11和13分别是素数，且间隔为2。isPrime(N)用于判断N是否为素数的函数。为完成上述功能，横线处应填上的代码是（）。

```c
int N, M;
//本题假设N小于M
cin >> N >> M;
for (int i = N; i < ____; i++)
    if (isPrime(i) && isPrime(i + 2))
    printf("%d %d\n", i, i + 2);
```

```csv
□ A.M-2
□ B.M-1
□ C.M
□ D.M+1
```

第 14 题 下面 C++ 代码实现输出如下图形，横线应填入的代码是（）。

```txt
1 height - i
2 2 * i
```

□ B.

```txt
1 height
2 2 * i
```

□ C.

```txt
1 height - i
2 2 * i + 1
```

□ D.

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
1 height - i - 1
2  $2 * i + 1$
</div>

第 15 题 下面 C++ 代码执行后的输出是 30，则横线处不能填入（）。

```txt
int a=10,b=20,c=30;
cout << ____ << endl;
cout << endl;
```

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
□ A.  $\max(\max(a, b), c)$
</div>

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
B.  $\min(a+b, c)$
</div>

```txt
□ C. sqrt(a+b+c)
```

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
D. $(a + b + c) / 2$
</div>

## 2 判断题（每题2分，共20分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr><tr><td>答案</td><td>√</td><td>√</td><td>√</td><td>√</td><td>×</td><td>×</td><td>×</td><td>√</td><td>√</td><td>√</td></tr></table>

第 1 题 在Windows的资源管理器中为已有文件A建立副本的操作是Ctrl+C，然后Ctrl+V。（）

第2题 在C++代码中，假设N为正整数，则cout << (N - N / 10 \* 10) 将获得N的个位数。（）

第3题 在C++语句 cout << (10 <= N <= 12) 中，假设N为12，则其输出为1。（）

第4题如果C++表达式int(sqrt(N))\*int(sqrt(N)) == N的值为True，则说明N为完全平方数，如4、9、25等。（）

第 5 题 下面 C++ 代码执行后将输出 $2 \times 3 = 6$ 。()

```txt
int a = 2, b = 3;
printf("%a*%%b=%d", a*b);
```

第6题 以下 $\mathrm{C}++$ 代码因为循环变量为将导致错误，即不能作为变量名称，不符合 $\mathrm{C}++$ 变量命名规范。（）

```txt
1 for (int _ = 0; _ < 10; _++)  
2 continue;
```

第7题 下面C++代码执行后因为有break，将输出0。（）

```c
int i;
for (i = 0; i < 10; i++) {
    continue;
    break;
}
cout << i;
```

第8题 下面的C++代码执行后将输出18行“OK”。（）

```txt
int i, j;
for (i = 8; i > 2; i -= 2)
    for (j = 0; j < i; j++)
    printf("OK\n");
```

第9题 将下面C++代码中的 i = 1 调整为 i = 0 的输出结果相同。（）

```txt
int i;
int cnt = 0;
for (i = 1; i < 5; i++)
    if(i%2) cnt += 1;
cout << cnt;
```

第10题 下面两段C++代码都是用于求1-10的和，其运行结果相同。通常说来，for循环都可以用while循环实现。（）

```c
int tnt;
int i;
tnt = 0;
for (i = 1; i < 10 + 1; i++)
    tnt += i;
cout << tnt << endl;
```

```c
int tnt;
int i;
tnt = 0;
i = 1;
while (i <= 10){
    tnt += i;
    i += 1;
}
cout << tnt << endl;
```

## 3 编程题（每题25分，共50分）

## 3.1 编程题1

\- 试题名称：寻找数字

\- 时间限制： $1.0 \mathrm{~s}$

\- 内存限制：512.0 MB

## 3.1.1 题面描述

小杨有一个正整数 $a$ ，小杨想知道是否存在一个正整数 $b$ 满足 $a = b^4$ 。

## 3.1.2 输入格式

第一行包含一个正整数 t，代表测试数据组数。

对于每组测试数据，第一行包含一个正整数代表 a。

## 3.1.3 输出格式

对于每组测试数据，如果存在满足条件的正整数 b，则输出 b，否则输出 -1。

## 3.1.4 样例

```csv
1 | 3
2 | 16
3 | 81
4 | 10
1 | 2
2 | 3
3 | -1
```

对于全部数据，保证有 $1 \leq t \leq 10^{5}, 1 \leq a \leq 10^{8}$ 。

## 3.1.5 参考程序

```cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
    int a;
    cin >> a;
    int b = (int)(sqrt(sqrt(a)));
    if (b * b * b * b == a) {
    cout << b << endl;
    } else {
    cout << -1 << endl;
    }
    }
```

```txt
19 return 0;
20 }
```

## 3.2 编程题2

\- 试题名称：数位和

\- 时间限制： $1.0 \mathrm{~s}$

\- 内存限制：512.0 MB

## 3.2.1 题面描述

小杨有 $n$ 个正整数，小杨想知道这些正整数的数位和中最大值是多少。

“数位和”指的是一个数字中所有数位的和。例如：

对于数字12345，它的各个数位分别是1,2,3,4,5。将这些数位相加，得到：

$$
1 + 2 + 3 + 4 + 5 = 1 5
$$

因此，12345 的数位和是 15。

## 3.2.2 输入格式

第一行包含一个正整数 n，代表正整数个数。

之后 n 行，每行包含一个正整数。

## 3.2.3 输出格式

输出这些正整数的数位和的最大值。

## 3.2.4 样例

<table><tr><td>1</td><td>3</td></tr><tr><td>2</td><td>16</td></tr><tr><td>3</td><td>81</td></tr><tr><td>4</td><td>10</td></tr></table>

```txt
1 | 9
```

对于全部数据，保证有 $1 \leq n \leq 10^{5}$ ，每个正整数不超过 $10^{12}$ 。

## 3.2.5 参考程序

```cpp
#include <bits/stdc++.h>
using namespace std;
#define ll long long
int main() {
    int n;
    cin >> n;
    int x = 0;

    for (int i = 0; i < n; i++) {
    int smu = 0;
    ll tmp;
    cin >> tmp;
    }
}
```

```txt
while (tmp > 0) {
    smu += tmp % 10;
    tmp /= 10;
}

x = max(x, smu);
cout << x << endl;
return 0;
```