# GESP3-03 数组计数法 课后题快照（导出时间：重置后重学 v3）

> 来源：docker exec dkl-postgres psql -U dkl -d dkl_db
> 用于闭卷三步法测评，答案均不在快照内。

## 1. e49e041e-1150-4a92-a8bd-14f9cc547586 — 求n个数中每个数出现的次数
- description: 从键盘读入 n 个整数（n<=100，都是1~10之间），从小到大输出每个出现过的数及出现次数。
- input_desc: 第1行 n；第2行 n 个整数（空格隔开）。
- output_desc: 若干行，每行2个数（数 次数），从小到大。
- sample_input: 5 / 1 2 3 3 5
- sample_output: 1 1 / 2 1 / 3 2 / 5 1

## 2. d666fe65-de88-4941-b0b2-c22ace86ed5f — 求n个数中出现次数最多的数
- description: 读入 n 个整数（n<=100，1~10之间），求出现次数最多的数（数据保证唯一）。
- input_desc: 第1行 n；第2行 n 个整数。
- output_desc: 输出出现次数最多的数。
- sample_input: 5 / 1 2 3 3 5
- sample_output: 3

## 3. a62b0579-9512-4c42-b048-85076f03cd94 — 数字出现次数
- description: 50个数（0-19），求相同数字出现的最多次数为几次。
- input_desc: 50个数字。
- output_desc: 1个数字（相同数字出现的最多次数）。
- sample_input: 1 10 2 0 15 8 12 7 0 3 15 0 15 18 16 7 17 16 9 1 19 16 12 17 12 4 3 11 1 14 2 11 14 6 11 4 6 4 11 13 18 7 0 3 2 3 18 19 2 16
- sample_output: 4

## 4. a48caa1f-12b0-430a-bb7f-b72adeff737b — 统计数字出现次数
- description: 输入 N 个数，计算数字 M 的出现次数，并输出 M 的第一次出现的位置。
- input_desc: 共 N+2 行：第1行 N(N<=100000)；接下来 N 行每行一个整数；最后一行 M。
- output_desc: 输出 M 首次出现的位置和次数。未找到的位置输出0，次数输出0。
- sample_input: 5 / 52 / 18 / 18 / 654 / 18 / 18
- sample_output: 2 3

## 5. 6b0d1813-8c23-4837-ad7d-1d2319d893fb — 查找含有x的数
- description: 从一组数中找出"含有 x 的数"（x 是一位数），统计这样的数总共有多少个、总和是多少。
- input_desc: 三行：第1行 N；第2行 N 个整数（1~9999）；第3行一位整数 x（1~9）。
- output_desc: 一行两个整数：含有x的数的总个数、它们的总和。
- sample_input: 5 / 12 28 190 36 1255 / 2
- sample_output: 3 1295
