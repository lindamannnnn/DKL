# GESP3-04 练习课：数组基础 课后题快照（导出时间：重置后重学 v3）

> 来源：docker exec dkl-postgres psql -U dkl -d dkl_db
> 用于闭卷三步法测评，答案均不在快照内。本课为第01~03课复习，无新知识。

## 1. f229a249-9e0d-459f-a4cd-13f68f60f675 — 数组元素的查找
- description: 给 m 个整数，查找有无值为 n 的数；有则输出第一次出现的位置，没有则输出 -1。
- input_desc: 第一行整数 m(0<=m<=100)；第二行 m 个整数(0~1000000)；第三行要查找的数 n。
- output_desc: n 的位置或 -1。
- sample_input: 4 / 1 2 3 3 / 3
- sample_output: 3

## 2. dd4f3d5b-8803-4503-9d1c-be54a6e59316 — 换位置
- description: 全班 n 人站成一队，最高的和最矮的两位同学调换位置，其余不动（所有人高矮都不同）。
- input_desc: 第一行整数 n(≤100)；第二行 n 个身高。
- output_desc: 调换位置后的结果。
- sample_input: 8 / 8 9 3 4 7 6 5 10
- sample_output: 8 9 10 4 7 6 5 3

## 3. 03fae952-5e13-44ae-aefc-37c987513fe8 — 删除数组的最小数
- description: 在一个不重复的数组中，请将最小数删除后输出。
- input_desc: 两行：第一行整数 n(5<=n<=100)；第二行 n 个不重复整数。
- output_desc: 删除最小数后的数组。
- sample_input: 5 / 1 7 6 8 2
- sample_output: 7 6 8 2

## 4. 6ffbd1fe-66fa-4f2f-b148-54aa384aa1e1 — 输入的这些数是否对称
- description: 输入 N 个数，判断是否对称（正读反读一样），对称 YES 否则 NO（N 可奇可偶）。
- input_desc: 第1行整数 N(4<=N<=20)；第2行 N 个整数。
- output_desc: YES 或 NO。
- sample_input: 4 / 1 2 2 1
- sample_output: YES

## 5. 56d15ba7-1f0a-4c71-9750-30eda777005c — 元素插入有序数组
- description: 给整数 n 和从小到大排列的数列（≤1000个），将 n 插入使新数列仍从小到大。
- input_desc: 第一行整数 n（待插入）；第二行整数 m（数列个数）；第三行 m 个整数（空格隔开，升序）。
- output_desc: 一行整数：新的数列（空格隔开）。
- sample_input: 2 / 4 / 1 3 4 5
- sample_output: 1 2 3 4 5
