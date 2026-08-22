# GESP3-05 连续性元素 课后题快照（导出时间：重置后重学 v3）

> 来源：docker exec dkl-postgres psql -U dkl -d dkl_db
> 用于闭卷三步法测评，答案均不在快照内。

## 1. 963992cd-d6ae-45f6-bcc5-dc5386d28626 — 评奖要求
- description: A公司评选先进员工，要求 n 年内至少有 1 次连续 3 年的年度考评分数都 ≥90 分，才满足参选要求，输出 Y 或 N。
- input_desc: 第1行整数 n(3≤n≤100)；第2行 n 个整数（每年考评分，0~100）。
- output_desc: 输出字符 Y 或 N。
- sample_input: 5 / 90 89 100 99 95
- sample_output: Y

## 2. e47b7c64-a9b5-48d9-9dd2-d50a3c7f7490 — 浪尖数
- description: 计算一个数组中有多少个"浪尖数"——正好比左右相邻两个数都大的数（如 2 3 1 中的 3）。
- input_desc: 第1行整数 n(≤100)；第2行 n 个整数。
- output_desc: 满足条件的浪尖数的数量。
- sample_input: 5 / 1 3 2 4 1
- sample_output: 2

## 3. 3d3efd58-5b45-4be9-8423-5b1ae5b637aa — 连胜王
- description: 给出 n 场比赛获胜队伍编号，求出连胜场次最多的球队编号（数据保证唯一）。
- input_desc: 第1行整数 n(5≤n≤100)；第2行 n 个获胜队伍编号。
- output_desc: 连胜场次最多球队的编号。
- sample_input: 6 / 1 2 2 2 6 6
- sample_output: 2

## 4. 1ded5b4a-456b-46c8-8301-7b6958d0d31e — 连胜统计
- description: 给出 n 场比赛获胜队伍编号，按读入顺序输出每个球队连胜的场数，至少连胜 2 场才列入统计。
- input_desc: 第1行整数 n(5≤n≤100)；第2行 n 个获胜队伍编号。
- output_desc: 若干行，每行2整数（球队编号 连胜场次），按读入顺序。
- sample_input: 12 / 9 9 1 2 2 2 9 9 3 3 3 2
- sample_output: 9 2 / 2 3 / 9 2 / 3 3

## 5. 9aa636a0-7238-44bc-9920-f22cc2eaaa4e — 温度统计员
- description: 给出连续 N 天最高气温，求气温一直上升的最长连续天数。
- input_desc: 第1行整数 N(1≤N≤10000)；第2行 N 个整数（气温）。
- output_desc: 最高气温一直上升的最长连续天数。
- sample_input: 10 / 1 2 3 2 4 5 6 8 5 9
- sample_output: 5
