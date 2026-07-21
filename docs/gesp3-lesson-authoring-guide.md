# GESP3 课件编写指南（子代理必读）

> 目标：把标准教案改造成 DKL 儿童自学微课，风格与 `server/courses/gesp3/01-一维数组.md`（已定稿样板）完全一致。

## 0. 必读文件（按顺序）

1. 本指南
2. 样板课：`server/courses/gesp3/01-一维数组.md`（常规课模板）
3. 格式规范：`server/courses/MICRO_LESSON_FORMAT.md`
4. 你的源教案：`标准教案/GESP03/CSP03-XX_标题.md`
5. 练习课另读：`server/courses/gesp2/14-练习课-GESP2综合大闯关.md`（练习课模板）
6. 真题课另读：`server/courses/gesp2/15-真题练习1.md`（真题课模板）

## 1. 学生已会知识（不要重复教，可直接用）

GESP1+2 已毕业：cin/cout、scanf/printf、变量、int/double/char/bool、if/else、switch、for/while/do-while、break/continue、嵌套循环、数学函数、自定义函数、图形打印、辗转相除。
数组是 GESP3 第 1 课才教的：**01 课之后的课时可以默认学生已学前序课时**。

## 2. 硬性规则（违反必须改）

1. **一页一概念**：每个 `## ` 标题一页；标题尽量 ≤10 字。
2. **每页必互动**：至少一个 `<!-- card -->` / `<!-- demo -->` / `<!-- checkpoint -->`。
3. **每页自包含**：严禁"上面的代码""刚才""上一页"等跨页引用；检查点题干用到的代码/数字必须写在题干里（题干只能是一行，行内代码用反引号）。
4. **正文简短**：卡片正文每段 ≤2 行短句，多用 emoji。
5. **代码长度**：`<!-- demo -->` 代码 ≤9 行；挑战题参考代码 ≤13 行；必须可编译运行（`#include <bits/stdc++.h>`）。
6. **checkpoint 锁页**：每课 4-7 个；每个 checkpoint 只含一个 `<!-- quiz: choice -->` + `<!-- answer: X -->`；题目必须从本课已讲内容能答出（无知识跳跃）。
7. **不改知识体系**：教案里的核心概念一个不能少；过难的"进阶扩展"可删（参照 01 课只保留实用技巧的做法）。
8. **文件编码**：UTF-8、LF 换行。

## 3. 常规课结构（新知课）

```
# 课程NN：标题
> 🎯 目标：一句话

## 故事：XXX（story，引出本课需求）
## 回顾（card，衔接上阶段/上节课）
## 卡片：概念A（card + demo）
## 检查点：XXX
... 概念 B/C/D ...
## 挑战 1：题目（computer card 题目 + demo 参考代码 + teacher card 评讲）
## 挑战 2：题目（同上）
## 小贴士（card type:tip，1-2 条易踩坑）
## 课后挑战（teacher card 引导语 + 5 个 <!-- problem: uuid -->）
```

- 课堂挑战恰好 **2 道**，从教案例题中选最典型的；评讲卡片必含四节：**这道题考察什么知识点 / 解题思路分步说明 / 容易错的地方 / 关键代码解释**。
- 课后作业恰好 **5 道**，按简单→难排序。

## 4. 练习课结构

```
# 课程NN：练习课：标题
> 🎯 目标：复习……

## 故事：XXX
## 本课练习要点（teacher card：复习点列表 + 注意事项）
## 挑战 1 ~ 挑战 5（每题：computer card 题目 + demo 参考代码 + teacher card 评讲）
## 小贴士
## 课后挑战（5 道 problem）
```

- 课堂挑战恰好 **5 道**，难度递增，覆盖对应新知课全部知识点。

## 5. 真题课结构（19/20 课专用）

- 参照 `gesp2/15-真题练习1.md`：story + 练习要点 card +「挑战1：单选题」`挑战2：判断题`「挑战3：编程题」。
- 选择题干放 computer card（可含代码块），**答案与解析放 `<!-- demo -->`**（💡 答案：X + 讲解）。
- 从 PDF 提取真实考题，题号沿用原卷；选择/判断各选 6-8 道典型题（覆盖各知识点），编程题全收。
- 答案必须自己推导验证，不能照抄不确定的来源。

## 6. 课后题选择（数据库查询）

题库在 Docker 里的 PostgreSQL。查询命令模板（bash）：

```bash
export PATH="/c/Program Files/Docker/Docker/resources/bin:$PATH"
docker exec dkl-postgres psql -U dkl -d dkl_db -t -c \
  "SELECT id, title, difficulty FROM problems WHERE gesp_level=3 AND tags LIKE '%数组%' AND difficulty='easy' LIMIT 40;"
```

- 可用标签：`数组`、`字符串`、`模拟`、`进制转换`、`位运算`、`枚举`、`增删`、`统计`、`查找`（可组合 LIKE）。
- 选 5 道：知识点必须匹配本课；难度排序 easy 在前；题意要真的用得上本课知识（选前看一眼 description 摘要确认）。
- 排除第 1 课已用：`ddf4dc1a-1071-4c9c-b539-3747cbace207`、`ded7df5c-e634-4f0e-af7d-dc8949c53a4a`、`c1f09e7c-554f-46ea-bef1-f68d2e746cf1`、`4a3e827a-4f2c-4ef0-a597-0cc54c32947a`、`b84fb640-90d2-4dc0-8b89-60407a054e84`。
- 练习课的 5 道题从对应单元的标签池选，允许与新知课不同。
- 选定后验证 ID 存在且有测试用例：
  `docker exec dkl-postgres psql -U dkl -d dkl_db -t -c "SELECT title, (SELECT COUNT(*) FROM test_cases tc WHERE tc.problem_id=p.id) FROM problems p WHERE id IN (...);"`

## 7. 完成后自检（必须通过）

```bash
export PATH="/c/Program Files/nodejs:$PATH"
cd /e/DKL/server && npx tsx src/scripts/check-gesp3-lessons.ts
```

检查项：解析成功、每页有互动块、checkpoint/problem 数量、代码行数、标题长度、跨页引用、problem ID 存在于数据库。有报错必须修到干净为止。

## 8. 交付报告

每课一行：文件名 / 页数 / checkpoint 数 / 挑战数 / 5 道课后题标题 / 自检结果。
