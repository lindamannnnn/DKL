# GESP3-07 string使用1 课后题快照（导出时间：重置后重学 v3）

> 来源：docker exec dkl-postgres psql -U dkl -d dkl_db
> 用于闭卷三步法测评，答案均不在快照内。

## 1. a030b86e-80cd-403e-901b-1a7672b3c71e — 字符串对比
- description: 给定两字符串（仅大小写字母，长度1~100），判断属于4类哪一类：1长度不等；2等长且逐字符全等(区分大小写)；3等长且逐字符仅不区分大小写时一致；4等长但即使不区分大小写也不一致。输出类编号。
- input_desc: 两行，每行一个字符串。
- output_desc: 一个数字（1~4）。
- sample_input: BEIjing / beiJing
- sample_output: 3

## 2. 38cf6255-06d1-4815-91dc-664622e93047 — 求子串的位置
- description: 父串 s 中是否存在子串 t；存在则输出所有起始位置，不存在输出 -1。
- input_desc: 第一行父串；第二行子串。
- output_desc: 所有位置（换行），不存在输出 -1。
- sample_input: Go Abc good goole! / go
- sample_output: 8 / 13

## 3. 3e108b63-c729-4b14-aeb5-c7c742b89596 — 字符串出现次数
- description: 求子串 s1 在字符串 s2 中出现的次数。
- input_desc: 第一行 s1；第二行 s2。
- output_desc: 一个整数（出现次数）。
- sample_input: ab / abbaabcaabc
- sample_output: 3

## 4. 1a248e7b-8653-4c6e-b22b-8edf3f1c9652 — 删除指定字符
- description: 输入字符串 str 和字符 c，删除 str 中所有字符 c 并输出。
- input_desc: 第一行字符串（不含空格）；第二行一个字符。
- output_desc: 删除指定字符后的字符串。
- sample_input: sdf$$$sdf$$ / $
- sample_output: sdfsdf

## 5. e2261f27-fb75-4f70-b7b0-fab28364f6a9 — 查找子串并替换
- description: 对输入字符串实现查找并置换（找到子串换成另一子串，替换所有出现）。大小写完全一致才算子串。
- input_desc: 第一行原串；第二行要查找的子串；第三行要替换成的子串。
- output_desc: 替换好的字符串。
- sample_input: abcf abdabc / abc / AA
- sample_output: AAf abdAA
