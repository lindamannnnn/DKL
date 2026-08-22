# GESP3-02 数组增删 课后题快照（导出时间：重置后重学 v3）

> 来源：docker exec dkl-postgres psql -U dkl -d dkl_db
> 用于闭卷三步法测评，答案均不在快照内。

## 1. d1fef4dd-4f2a-49da-ad2d-7ceb80823056 — 数组元素的插入
- description: 在一个数组的第 x 个位置插入一个新的数 y。
- input_desc: 四行：第一行整数 n(5<=n<=10)；第二行 n 个整数；第三行整数 x（插入位置）；第四行整数 y（插入值）。
- output_desc: 更新后的数组。
- sample_input: 5 / 7 2 3 4 5 / 2 / 9
- sample_output: 7 9 2 3 4 5

## 2. ebfa57a6-aca5-4304-967f-86b94595c3a0 — 数组元素的删除
- description: 把一个数组的第 x 个位置的元素删除掉。
- input_desc: 三行：第一行整数 n(n<=10)；第二行 n 个整数；第三行整数 x（要删除的位置）。
- output_desc: 输出更新后的数组。
- sample_input: 5 / 1 2 3 4 5 / 3
- sample_output: 1 2 4 5

## 3. 32dec78b-f1d7-48cc-bdfa-83836bfa8ea8 — 数组逆序
- description: 给你 m 个整数，将其逆序输出。
- input_desc: 第一行整数 m(3<=m<=100)；第二行 m 个整数（空格隔开，0~9999999）。
- output_desc: m 个整数（空格隔开，逆序）。
- sample_input: 3 / 1 7 5
- sample_output: 5 7 1

## 4. ca8c44c6-5606-4568-b8d4-10049c769a00 — 在最大数后面插入一个数
- description: 在一个不重复数组的最大数的后面插入一个新的数 y。
- input_desc: 三行：第一行整数 n(5<=n<=100)；第二行 n 个整数；第三行整数 y（要插入的数）。
- output_desc: 更新后的数组。
- sample_input: 5 / 7 2 3 4 5 / 9
- sample_output: 7 9 2 3 4 5

## 5. 163fa904-d382-4fa9-9e3a-ac1e79eafb28 — 移动数组元素
- description: 在一个不重复的数组中，请将这个数组的最小数和数组第一个数交换，最大数和数组最后一个数交换！
- input_desc: 两行：第一行整数 n(5<=n<=100)；第二行 n 个不重复的整数。
- output_desc: 移动位置后的数组。
- sample_input: 5 / 6 7 1 10 4
- sample_output: 1 7 6 10 4
