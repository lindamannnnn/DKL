# C++ 一级

2024年12月

1 单选题 (每题 2 分, 共 30 分)

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr><tr><td>答案</td><td>C</td><td>C</td><td>D</td><td>B</td><td>B</td><td>D</td><td>B</td><td>C</td><td>C</td><td>C</td><td>D</td><td>C</td><td>D</td><td>B</td><td>D</td></tr></table>

第1题 2024年10月8日，诺贝尔物理学奖“意外地”颁给了两位计算机科学家约翰·霍普菲尔德（John J. Hopfield）和杰弗里·辛顿（Geoffrey E. Hinton）。这两位科学家的主要研究方向是（）。  
□A.天体物理  
□B.流体力学  
□C.人工智能  
□D.量子理论

第2题 下列软件中是操作系统的是（）。  
□A.高德地图  
□B.腾讯会议  
□C.纯血鸿蒙  
□D.金山永中

第 3 题 有关下列C++代码的说法，正确的是( )。
1 printf("Hello, GESP!");

□A.配对双引号内，不可以有汉字  
□B.配对双引号可以相应改变为英文单引号而输出效果不变  
□C.配对双引号可以相应改变为三个连续英文单引号而输出效果不变  
□D.配对双引号可以相应改变为三个连续英文双引号而输出效果不变

第4题 C++表达式 12 - 3 \* 2 && 2 的值是( )。
□ A.0
□ B.1
□ C.6
□ D.9

```c
int N, nowDay, afterDays;
cout << "今天星期几？" << endl;
cin >> nowDay;
cout << "求几天后星期几？" << endl;
cin >>afterDays;

N = nowDay+afterDays;

if(____)
    printf("星期天");
else
    printf("星期%d", N%7);
```

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
第5题在 $\mathrm{C}++$ 中，假设N为正整数2，则cout&lt;&lt;（N/3 + N% 3）将输出( )。  
□A.0  
□B.2  
□C.3  
□D.4
</div>

第6题 C++语句 cout << 7%3 << ' ' << "7%3" << ' ' << "7%3={7%3}" 执行后的输出是( )。
□ A. 1 1 1=1
□ B. 1 7%3 1=1
W C. 1 7%3 7%3=1
○ D. 1 7%3 7%3={7%3}

第 7 题 下面 C++ 代码执行后，求出几天后星期几。如果星期日则输出“星期天”否则输出形如“星期1”。横线上应填入的代码是（）。

```matlab
□ A. N % 7 != 0
□ B. N % 7 == 0
W C. N == 0
□ D. N % 7
```

第 8 题 下面 C++ 代码执行后输出是（）。

```txt
int N=0,i;
for (i = 1; i < 10; i++)
    N += 1;
cout << (N + i);
```

□A.54  
□B.20  
□C.19  
□D.18

```txt
int N;
cin >> N;

if(____)
    cout << "能被3整除的偶数" << endl;
else
    cout << "其他情形" << endl;

cout << endl;
```

第 9 题 下面 C++ 代码执行后输出的是（）。

```txt
int tnt = 0;
for (i = 0; i < 100; i++)
    tnt += i % 10;
cout << tnt;
```

第 10 题 下面 C++ 代码执行后输出的是（）。

```txt
int N=0,i;
int tnt = 0;
for (i = 5; i < 100; i+=5){
    if (i % 2 == 0)
    continue;
    tnt += 1;
    if (i >= 50)
    break;
}
cout << tnt;
```

第11题 下面的程序用于判断输入的整数N是否为能被3整除的偶数，横线处应填写代码是（ ）。

```txt
□ A. (N%2) && (N%3)
□ B. (N%2 == 0) && (N%3)
□ C. (N%2) && (N%3 == 0)
□ D. (N%2 == 0) && (N%3 == 0)
```

第 12 题 下面 C++ 代码执行后的输出是（）。

```txt
int cnt;
cnt = 0;
for(int i = 1; i < 10; i++)
    cnt += i++;
cout << cnt;
cout << endl;
```

□A.54  
□B.45  
□C.25  
□D.10

第13题int类型变量a的值是一个正方形的边长，如下图中的正方形的四条边长都为4，则下列哪个语句执行后能够使得正方形的周长（四条边长的和）增加4？（）。

```txt
1 + + + + +
2 +    + +
3 +    + +
4 +    + +
5 + + + + +
```

□ A. a\*4;
□ B. a+4;
□ C. a+1;
□ D. ++a;

第14题 C++表达式（6 > 2）\* 2 的值是( )。
□ A. 1
□ B. 2
□ C. true
□ D. truetrue

第15题 下面 $\mathrm{C}++$ 代码用于判断输入的整数是否为位增数，即从首位到个位逐渐增大，是则输出1。如123是一个位增数。下面横线处应填入的是（ ）。

```c
int N;
int n1,n2;
cin >> N;
while(N){
n1 = N % 10;
```

```txt
if(n1 >= n2){
    cout << 0;
    return 1;
}
n2 = n1, N /=10;
}
cout << 1;
cout << endl;
return 0;
```

```txt
□ A. n2 = N%10
□ B. N /= 10
□ C. n2 = N/10, N %= 10
□ D. n2 = N%10, N /= 10
```

## 2 判断题 (每题 2 分, 共 20 分)

```txt
题号 1 2 3 4 5 6 7 8 9 10
答案 √ √ × × × × × √ × ×
```

第 1 题 在Windows的资源管理器中为已有文件A建立副本的操作是 Ctrl+C，然后 Ctrl+V。（）

第 2 题 在C++中，表达式 8/3 和 8%3 的值相同。（）

第 3 题 X 是 C++ 语言的基本类型变量，则语句 cin >> X，cout << X 能接收键盘输入并原样输出。（）

第 4 题 下面C++代码执行后将输出10。（）

```txt
int N = 0;
for (int i = 0; i < 10; i++) {
    continue;
    N += 1;
}
cout << N;
```

第 5 题 下面C++代码执行后将输出100。（）

```c
int i;
for (i = 0; i <= 100; i++)
    continue;
cout << i;
```

第6题 下面 $\mathrm{C}++$ 代码被执行时，将执行三次输出（即标记行L2将被执行一次）。（）

```txt
1 for (int i = 0; i < 10; i+=3)
2 cout << i; //L2
```

第 7 题 C++语句 cout << (3,2) 执行后，将输出3和2，且3和2之间有逗号间隔。（）

第 8 题 在C++代码中，studentName、student\_name 以及 sStudentName 都是合法的变量名称。（）

第9题在C++中，对浮点变量floatf，则语句cin >> f;cout << (f<1);在输入是2e-1时，输出是0。（）第10题在C++的循环体内部，如果break和continue语句连续在一起，那么作用抵消，可以顺利执行下一次循环。（）

## 3 编程题 (每题 25 分, 共 50 分)

3.1 编程题 1
- 试题名称：温度转换
- 时间限制：1.0 s
- 内存限制：512.0 MB

3.1.1 题目描述

小杨最近学习了开尔文温度、摄氏温度和华氏温度的转换。令符号 K 表示开尔文温度，符号 C 表示摄氏温度，符号 F 表示华氏温度，这三者的转换公示如下： $C = K - 273.15$ $F = C'X\ 1.8 + 32$

现在小杨想编写一个程序计算某一开尔文温度对应的摄氏温度和华氏温度，你能帮帮他吗？

3.1.2 输入格式
一行，一个实数 K，表示开尔文温度。
3.1.3 输出格式

一行，若输入开尔文温度对应的华氏温度高于212，输出Temperature is too high!；否则，输出两个由空格分隔的实数C和F，分别表示摄氏温度和华氏度，保留两位小数。3.1.4 样例3.1.5 输入样例11 412.00

3.1.6 输出样例 1
1 Temperature is too high!

3.1.7 输入样例2 1 | 173.56

3.1.8 输出样例2 1 -99.59 -147.26

## 3.1.9 数据范围

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
$0 &lt; K &lt; 105$
</div>

## 3.1.10 参考程序

```cpp
#include <cstdio>
using namespace std;

int main() {
    double K; scanf("%lf", &K);
    double C = K - 273.15;
    double F = 32 + C * 1.8;
    if (F > 212)
    printf("Temperature is too high!\n");
    else
    printf("%.2f %.2f\n", C, F);
    return 0;
}
```

## 3.2 编程题 2

## . 试题名称：奇数和偶数

. 时间限制： $1.0 \mathrm{~s}$

· 内存限制：512.0 MB

## 3.2.1 题面描述

小杨有 n 个正整数，他想知道其中的奇数有多少个，偶数有多少个。

## 3.2.2 输入格式

第一行包含一个正整数 n，代表正整数个数。

之后 n 行，每行包含一个正整数。

## 3.2.3 输出格式

输出两个正整数（用英文空格间隔），代表奇数的个数和偶数的个数。如奇数或偶数的个数为0，则对应输出0。

## 3.2.4 样例

```csv
1 | 5
2 | 1
3 | 2
4 | 3
5 | 4
6 | 5
1 | 3 2
```

对于全部数据，保证有 $1 \leq n \leq 105$ 且正整数大小不超过 105。

## 3.2.5 参考程序

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    int n;
    int a=0,b=0;
    cin>>n;
    for(int i=1;i<=n;i++){
    int x;
    cin>>x;
    if(x%2 !=0)a++;
    else b++;
    }
    cout<<a<<" "<<b<<"\n";
}
```