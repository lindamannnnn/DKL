# 课程18：练习课：GESP1 综合大闯关

> 🎯 目标：综合运用 GESP1 全部知识，完成终极挑战！

---

## 故事：终极宝藏

<!-- story -->
小明终于来到冒险地图的最后一关！

宝藏大门上有五把锁：

> 第一把要会算除法余数；
> 第二把要会判断大小；
> 第三把要会字符转换；
> 第四把要会循环统计；
> 第五把要会格式化输出。

全部打开，就能拿到 GESP1 小达人奖杯！
<!-- end-story -->

---

## 本课练习要点

<!-- card type:teacher -->
🧑‍🏫 最后一节练习课，我们把 GESP1 学到的本领全部串起来：

- **输入输出**：`cin` / `cout` 简单方便；`scanf` / `printf` 适合做格式化输出。
- **基本计算**：整数、小数的四则运算，`%` 取余数。
- **分支判断**：`if`、`if-else`、多分支，以及 `&&`、`||` 逻辑判断。
- **循环结构**：`for` 循环用于已知次数；`while` 循环用于不知道次数；`break` 和 `continue` 控制流程。
- **数字处理**：`%10` 取个位，`/10` 去掉个位；`%02d`、`%.2f` 等格式控制。

> 💡 做题前先想清楚：**输入什么？怎么算？用什么结构？怎么输出？**
<!-- end-card -->

---

## 课堂挑战

<!-- card type:teacher -->
🧑‍🏫 下面有 5 道综合闯关题，请独立完成！

> 💪 全部通过就能获得「GESP1 综合小达人」徽章！
<!-- end-card -->

## 挑战 1：能被 3 和 5 整除吗？

<!-- card type:computer -->
🖥️ 输入一个整数，判断它是否能同时被 3 和 5 整除。如果可以，输出 "Yes"，否则输出 "No"。

例如输入 15，输出 Yes；输入 10，输出 No。

输入：一个整数 n。
输出：一行，"Yes" 或 "No"。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n % 3 == 0 && n % 5 == 0) {
        cout << "Yes" << endl;
    } else {
        cout << "No" << endl;
    }
    return 0;
}
```
<!-- end-demo -->

---

## 挑战 2：字母大小写互换

<!-- card type:computer -->
🖥️ 输入一个英文字母。如果它是小写，就输出对应的大写；如果它是大写，就输出对应的小写。

例如输入 a，输出 A；输入 Z，输出 z。

输入：一个英文字母 ch。
输出：一个英文字母，表示互换后的结果。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    char ch;
    cin >> ch;
    if (ch >= 'a' && ch <= 'z') {
        cout << char(ch - 32) << endl;   // 小写转大写
    } else {
        cout << char(ch + 32) << endl;   // 大写转小写
    }
    return 0;
}
```
<!-- end-demo -->

---

## 挑战 3：乘法表的一行

<!-- card type:computer -->
🖥️ 输入一个 1 到 9 之间的整数 n，输出乘法表里第 n 行，也就是 n×1、n×2……直到 n×9，每个结果之间用一个空格隔开。

例如输入 3，输出 `3 6 9 12 15 18 21 24 27`。

输入：一个整数 n（1 ≤ n ≤ 9）。
输出：一行，9 个整数，表示 n 的乘法表一行。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= 9; i++) {
        cout << n * i;
        if (i < 9) {
            cout << " ";
        }
    }
    cout << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 挑战 4：1 到 n 中能被 3 整除的数的和

<!-- card type:computer -->
🖥️ 输入一个正整数 n，计算 1 到 n 中所有能被 3 整除的数加起来的和。

例如输入 10，能被 3 整除的数有 3、6、9，和是 18，输出 18。

输入：一个正整数 n。
输出：一个整数，表示满足条件的数的和。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0) {
            sum = sum + i;
        }
    }
    cout << sum << endl;
    return 0;
}
```
<!-- end-demo -->

---

## 挑战 5：商品价格格式化

<!-- card type:computer -->
🖥️ 超市收银机要把价格打印成固定格式。输入一个商品价格（小数），按 `Price: ¥xx.xx` 的格式输出，保留两位小数。

例如输入 12.5，输出 `Price: ¥12.50`。

输入：一个小数 price。
输出：一行，按题目要求格式化后的价格。
<!-- end-card -->

<!-- demo -->
```cpp
#include <bits/stdc++.h>

int main() {
    double price;
    scanf("%lf", &price);
    printf("Price: ¥%.2f\n", price);
    return 0;
}
```
<!-- end-demo -->

---
---

## 课后挑战

<!-- card type:teacher -->
🧑‍🏫 下面是 5 道闯关题，点击题目编号开始挑战！

> 💪 全部通过就能获得本课徽章！
<!-- end-card -->

<!-- problem: 8d6e449d-0f53-4218-8a7f-8acd8db00614 -->
<!-- problem: f8285136-42aa-444d-a76d-9b1f36e1371b -->
<!-- problem: d9115ae8-c169-4a54-b821-6e9688fbb3dc -->
<!-- problem: 9e84f6fe-0444-4545-a597-46b7ba3a3768 -->
<!-- problem: 10b8c309-ea53-410a-93bf-db299f64bd4c -->
