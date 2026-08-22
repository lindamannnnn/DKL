# GESP3-06 字符数组 课后题快照（导出时间：重置后重学 v3）

> 来源：docker exec dkl-postgres psql -U dkl -d dkl_db
> 用于闭卷三步法测评，答案均不在快照内。

## 1. 0693c6a8-f4ce-4687-b16e-7e2fc7817cc7 — 统计大写英文字母的个数
- description: 算算以 '.' 结束的一串字符中含有多少个大写的英文字母。
- input_desc: 输入一串字符，以 . 结束。
- output_desc: 输出这串字符中大写字母的个数。
- sample_input: PRC,PRC,I'm from China.
- sample_output: 8

## 2. acfe941c-3a14-4bcb-8c32-6a8e6f972757 — 大小写转换
- description: 把字符串里所有大写字母换成小写、小写换成大写，其他字符不变。
- input_desc: 一行字符串，不含空格，长度不超过 80。
- output_desc: 转换好的字符串。
- sample_input: ABCDefgh123
- sample_output: abcdEFGH123

## 3. 491e0797-7a7f-494f-a960-8c5169ebdd64 — 统计字母数字空格和其他字符
- description: 一行含大小写字母、数字、空格及其他字符，分别统计四类的个数。
- input_desc: 一行字符，含各类。
- output_desc: 4 个整数（大小写字母、数字、空格、其他字符的个数）。
- sample_input: aklsjflj123 sadf918u324 asdf91u32oasdf/.';123
- sample_output: 23 16 2 4

## 4. cd0fc5d3-8ecc-4e9c-ac8f-cd13879193fd — 比较字符串
- description: 比较两个字符串字典序；相等输出 0，否则输出第一个不同字符的 ASCII 码差值（s1>s2 为正，s1<s2 为负）。保证互非前缀、长度≤100。
- input_desc: 输入 2 个字符串，仅含小写字母、不含空格，空格隔开。
- output_desc: 差值或 0。
- sample_input: java basic
- sample_output: 8

## 5. e5195f62-c843-473f-8a3b-d1f31a98fc0e — 倒置输出字符串
- description: 随机输入长度不超过 255 的字符串，将其倒置后输出。
- input_desc: 只有一行。
- output_desc: 只有一行（倒置后）。
- sample_input: asdfghjkl123456
- sample_output: 654321lkjhgfdsa
