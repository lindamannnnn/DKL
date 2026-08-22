# GESP3-08 练习课：字符数组与string入门 课后题快照（导出时间：重置后重学 v3）

> 来源：docker exec dkl-postgres psql -U dkl -d dkl_db
> 用于闭卷三步法测评，答案均不在快照内。本课为第06、07课复习，无新知识。

## 1. efcfa902-e9fe-4c12-9c18-46dddace4cd8 — 统计字母出现次数
- description: 输入一串小写字母（以 . 结束），统计每个字母出现次数，按字母顺序输出字母和次数（没出现的不输出，次数<10）。
- input_desc: 一行，若干字符。
- output_desc: 两行：第一行出现的小写字母，第二行对应次数。
- sample_input: abdceeef.
- sample_output: abcdef / 111131

## 2. baf351cc-6d9a-4c9c-9bc5-639c3fde735b — 判定字符位置
- description: 返回字符串中元音字母（a e i o u，仅小写）首次出现的位置；没有则输出 0。
- input_desc: 仅含小写字母字符串，长度≤20。
- output_desc: 位置或 0。
- sample_input: and
- sample_output: 1

## 3. ffa9a8b3-0a05-44c0-ae65-e3f711b83874 — 元音字母转大写辅音字母转小写
- description: 一句英文短句（仅字母和空格，≤100），元音字母转大写、辅音字母转小写（元音含大小写 A E I O U）。
- input_desc: 一句字符串。
- output_desc: 转换后的字符串。
- sample_input: HELLO my student
- sample_output: hEllO my stUdEnt

## 4. f8bf2c36-9e4d-458c-aff4-d4c040b5cf6d — 有没有重复的字符
- description: 读入仅含小写字母的字符串（≤100），若有重复字符输出第一个出现的重复字符，否则输出字符串长度。
- input_desc: 一个字符串。
- output_desc: 第一个重复字符或字符串长度。
- sample_input: hibirdboy
- sample_output: i

## 5. 3e86e1f5-14a4-4c26-8378-ed8703d5f40b — 统计单词个数
- description: 一行空格隔开的若干单词（相邻单词可能多个空格），统计单词个数。
- input_desc: 一行字符串。
- output_desc: 单词个数。
- sample_input: Hello   World
- sample_output: 2
