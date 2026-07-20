# C++ 二级

2024年09月

1 单选题（每题2分，共30分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr><tr><td>答案</td><td>A</td><td>C</td><td>A</td><td>C</td><td>C</td><td>D</td><td>A</td><td>A</td><td>C</td><td>B</td><td>C</td><td>A</td><td>A</td><td>B</td><td>A</td></tr></table>

第1题 据有关资料，山东大学于1972年研制成功DJL-1计算机，并于1973年投入运行，其综合性能居当时全国第三位。DJL-1计算机运算控制部分所使用的磁心存储元件由磁心颗粒组成，设计存贮周期为 $2\mu \mathrm{s}$ （微秒）。那么该磁心存储元件相当于现代计算机的（）。  
□A.内存  
□B.磁盘  
□C.CPU  
□D.显示器

第2题 IPv4版本的因特网总共有（）个A类地址网络。
□ A. 65000
□ B. 200万
□ C. 126
□ D. 128

第3题 在C++中，下列不可做变量的是()。
□ A. ccf-gesp
□ B. ccf\_gesp
□ C. ccfGesp
□ D. \_ccfGesp

第4题 在C++中，与 for (int i = 1; i < 10; i++) 效果相同的是( )。
□ A. for (int i = 0; i < 10; i++)
□ B. for (int i = 0; i < 11; i++)
□ C. for (int i = 1; i < 10; ++i)
□ D. for (int i = 0; i < 11; ++i)

第5题在C++中，cout << (5 / 2 + 5 % 3) 的输出是( )。
□ A.1
□ B.2
□ C.4
□ D.5

第6题 假定变量a和b可能是整型、字符型或浮点型，则下面C++代码执行时先后输入-2和3.14后，其输出不可能是( )。[已知字符'+'、'-'、'='的ASCII码值分别是43、45和61]

```txt
1 cin >> a;
2 cin >> b;
3 cout << (a + b);
```

□A.1  
□B.1.14  
□C.47  
□D.将触发异常

第7题在 $\mathrm{C}++$ 代码中假设N为正整数，则下面代码能获得个位数的是（）。  
□A.N%10  
□B.N/10  
□C.N&&10  
□D.以上选项均不正确

第8题 下面C++代码执行后的输出是（）。

```txt
int i;
for (i = 0; i < 10; i++) {
    if (i % 2)
    break;
    cout << "0#";
}
if(i==10) cout << "1#";
```

□A.0#  
□B.1#  
□C.0#0#1  
□D.没有输出

第9题 执行下面 $\mathrm{C}++$ 代码并输入1和0，有关说法正确的是（）。

```txt
int a,b;
cin >> a >> b;
if(a&&b)
    cout << ("1");
else if(!(a||b))
    cout << ("2");
else if(a || b)
    cout << ("3");
else
    cout << ("4");
```

第10题 下面 $\mathrm{C}++$ 代码执行后的输出是（）。

```c
int loopCount = 0;
for (int i = 1; i < 5; i += 2)
    loopCount += 1;
cout << (loopCount);
```

第 11 题 下图是 C++ 程序执行后的输出。为实现其功能，横线处应填入代码是（）。

```c
1 7
2 1
3 2 3
4 3 4 5
5 4 5 6 7
6 5 6 7 8 9
7 6 7 8 9 10 11
8 7 8 9 10 11 12 13
9 
10 /////////
11 int lineNum;
12 cin >> lineNum;
13 for (int i= 1; i < lineNum+1; i++){
14    for(int ____)    cout << j << " ";
15    cout << endl;
16 }
```

```txt
□ A. j = i; j < i; j++
```

```txt
□ B. j = 1; j < i; j++
□ C. j = i; j < i*2; j++
□ D. j = i+1; j < i+i; j++
```

第 12 题 下面 C++ 代码执行后输出逆序数，如输入 123 则输出 321。如输入 120 则输出 21。横线处先后应填入的代码是（）。

```txt
int N;
cin >> N;
int rst = 0;
while (N){
    ____;
    ____;
}
cout << (rst);
```

```txt
☐ A. rst = rst * 10 + N % 10 N = N / 10
☐ B. rst += N % 10 N = N / 10
☐ C. rst = rst * 10 + N / 10 N = N % 10
☐ D. rst += N / 10 N = N % 10
```

第 13 题 下面的 C++ 代码用于输入学生成绩，并根据人数计算出平均成绩，有关说法错误的是（）。

```txt
float Sum = 0; // 保存总成绩
int cnt = 0; // 保存学生人数
while (1){
    int score;
    cin >> score;
    if (score < 0)
    break;
    cnt += 1;
    Sum += score;
}
cout << "总学生数：" << cnt << "平均分：" << Sum/cnt;
```

□ A. 代码 while (1) 写法错误
□ B. 如果输入负数，将结束输入，并正确输出
□ C. 如果输入的学生成绩含有小数，程序将无法正常执行
□ D. 变量 int score 初始值不确定，但不影响程序执行

第 14 题 以下 C++ 代码判断输入的正整数是否为质数，如果该数字是质数，则输出 YES，否则输出 NO。质数是指仅能被 1 和它本身整除的正整数。请在横线上填写代码。（）

```c
int num, i;
cin >> num;
for(i = 2; i < num; i++)
    if (____){
    cout << ("NO");
    break;
    }
    if(i == num)
    cout << ("YES");
```

```txt
□ A. num % i
□ B. num % i == 0
□ C. num / i
□ D. num / i == 0
```

第 15 题 一个数如果能被某个数（比如7）整除，或者含有该数，则说该数是某个数的相关数。下面C++代码用于判定输入的数与7是否有关。下列说法错误的是（）。

```txt
int N, M;
bool Flag = false;
cin >> N;
M = N;

if (M % 7 == 0)
    Flag = true;

while (!Flag && M){
    if (M % 10 == 7){
    Flag = true;
    break;
    }
    M /= 10;
}

if (Flag)
    cout << N << "与7有关";
else
    cout << N << "与7无关";
```

☐ A. 删除break语句不会导致死循环，但有时会导致结果错误

□ B. 删除 M /= 10 将可能导致死循环

□ C. 删除 M = N 并将其后代码中的M变量改为N，并调整输出同样能完成相关功能

D. 删除 break 语句不会导致死循环，但有时会影响效率

## 2 判断题（每题 2 分，共 20 分）

<table><tr><td>题号</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr><tr><td>答案</td><td>√</td><td>×</td><td>√</td><td>×</td><td>×</td><td>√</td><td>×</td><td>√</td><td>√</td><td>×</td></tr></table>

第1题 小杨最近开始学习C++编程，老师说C++是一门面向对象的编程语言,也是一门高级语言。（）

第2题 在C++中，cout << (3, 4, 5) 可以输出345，且每个输出项之间用空格分开。（）

第 3 题 C++ 表达式 12 % 10 % 10 的值为 2。（）

第 4 题 C++语句 cout << rand() << ' ' << rand(); 的第二个输出值较大。（）

第5题 定义C++的 int 类型的变量 ch，而且值为 '1'，则语句 cout << int(ch); 的输出为 1。（）

第6题 下面 $\mathrm{C}++$ 代码执行后将输出10。（）

```txt
int i;
for (i = 0; i < 10; i++)
    continue;
if(i == 10)
    cout << i;
```

第 7 题 下面 C++ 代码能求整数 N 和 M 之间所有整数之和，包含 N 和 M。（）

```c
int N, M, Sum;
cin >> N >> M;
if (N > M){
    int tmp = N;
    N = M, M = tmp;
}
for (int i = N; i < M + 1; i++)
    Sum += i;
cout << Sum;
```

第8题 将下面C++代码中的L3标记的代码行调整为for (int i = 0; i < 5; i++)后输出结果相同。（）

```txt
int loopCount = 0;
for (int i = 1; i < 5; i++) // L3
    for (int j = 0; j < i; j++)
    loopCount += 1;
cout << loopCount;
```

第9题 某一系列数据的规律是从第3个数值开始是前两个数之和。下面的代码求第N个数的值，N限定为大于2。（）

```c
int start1; // 第1个数
int start2; // 第2个数
int N; // 求N个数的值
int tmp;
cin >> start1 >> start2 >> N;

for (int i = 2; i < N; i++) {
    tmp = start1 + start2;
    start1 = start2;
    start2 = tmp;
}
cout << start2;
```

第 10 题 下面 C++ 代码执行时如果输入 2024 ，则输出是 4202 。（）

```txt
int N, flag=0;
cin >> N;
while (N){
    if(!flag) cout << N % 10;
    N /= 10;
    flag = (flag + 1)%2;
}
```

## 3 编程题（每题25分，共50分）

## 3.1 编程题1

\- 试题名称：数位之和

\- 时间限制： $1.0 \mathrm{~s}$

\- 内存限制：512.0 MB

## 3.1.1 题面描述

小杨有 $n$ 个正整数，他认为一个正整数是美丽数字当且仅当该正整数每一位数字的总和是7的倍数。

小杨想请你编写一个程序判断 $n$ 个正整数哪些是美丽数字。

## 3.1.2 输入格式

第一行包含一个正整数 n，代表正整数个数。

之后 n 行，每行包含一个正整数。

## 3.1.3 输出格式

对于每个正整数，如果是美丽数字则输出 Yes，否则输出 No。

## 3.1.4 样例1

```txt
1 3
2 7
3 52
4 103
```

<table><tr><td>1</td><td>Yes</td></tr><tr><td>2</td><td>Yes</td></tr><tr><td>3</td><td>No</td></tr></table>

7 的各位数字之和为 7，是 7 的倍数。52 的各位数字之和为 $5 + 2 = 7$ ，是 7 的倍数。103 的各位数字之和为 $1 + 0 + 3 = 4$ ，不是 7 的倍数。

对于全部数据，保证有 $1 \leq n \leq 10^{5}, 1 \leq a_{i} \leq 10^{5}$ 。

## 3.1.5 参考程序

```txt
#include<bits/stdc++.h>
using namespace std;

int main(){
    int n;
    cin>>n;
    int ans=0;
    for(int i=1;i<=n;i++){
    int x;
    cin>>x;
    int tot=0;
    while(x){
    tot+=(x%10);
    x/=10;
    }
    if(tot%7==0)cout<<"Yes\n";
    else cout<<"No\n";
    }
    return 0;
}
```

## 3.2 编程题2

\- 试题名称：小杨的

\- 时间限制：1.0 s

\- 内存限制：512.0 MB

## 3.2.1 题面描述

小杨想要构造一个 $m \times m$ 的N字矩阵（ $m$ 为奇数），这个矩阵的从左上角到右下角的对角线、第1列和第 $m$ 列都是半角加号 $+$ ，其余都是半角减号-。例如，一个 $5 \times 5$ 的N字矩阵如下：

```txt
1 | +---+
2 | ++---+
3 | +-+-+
4 | +---+
5 | +---+
```

请你帮小杨根据给定的 m 打印出对应的 N 字矩阵。

## 3.2.2 输入格式

第一行包含一个正整数 m。

## 3.2.3 输出格式

输出对应的 N 字矩阵。

## 3.2.4 样例1

```diff
1 +---+
2 +++-+
3 +-+-+
4 +--++
5 +---+
```

对于全部数据，保证有 $3 \leq m \leq 49$ 且 $m$ 为奇数。

## 3.2.5 参考程序

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    int n;
    cin >> n;
    for(int i=1;i<=n;i++){
    for(int j=1;j<=n;j++){
    if(j==1||j==n)cout<<"+";
    else{
    if(i==j)cout<<"+";
    else cout<<"-";
    }
    }
    cout << "\n";
    }
}
```