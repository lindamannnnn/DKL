# DKL 开发日志

> 记录每次重要迭代的改动、决策和待办，便于多会话衔接与版本回顾。

---

## [未发布] 2026-07-20 — GESP2 内容冻结

### 目标
用户已完成 GESP2 第 13 课终验，正式冻结 GESP 2级课件内容。

### 变更
- **`server/courses/gesp2/` 源文件定版**：从 15 课旧版重建为 16 课冻结版——新增 `13-循环模拟与易错点专项.md`，原 13/14/15 课顺延为 14/15/16（git mv 保留历史）；全部 16 课内容替换为 7 月 18 日修复后的数据库版本（课后题修复、内容修复、L05 枚举去重等此前只进了数据库的改动，现在回落到源文件），统一 LF 换行。
- **新增 `server/courses/gesp2/README.md`**：16 课总览表 + 冻结声明 + 质量验证记录（替代已删除的旧 10 课规划版 README）。
- **文档同步**：README / DEV_PLAN / CLAUDE.MD / CONTEXT 中 GESP2 状态更新为「已冻结」，下一步方向改为 GESP3 开发、真题录入、AI Key 验证。

### 决策
- GESP2 课件知识体系自本日起不再修改，与 GESP1 冻结口径一致。
- 第 14/15/16 课标题编号已修正为「课程14/15/16」（`server/src/scripts/fix-gesp2-lesson-titles.ts` 同步源文件与数据库，学习进度按 id 关联不受影响）。

### 环境备注
- Windows 上启动 Docker Desktop 必须通过正常桌面会话（开始菜单或 `explorer.exe "C:\Program Files\Docker\Docker\Docker Desktop.exe"`）：Git Bash 环境缺少 `ProgramData`/`SystemRoot` 等变量，直接启动会导致后端崩溃。详见 CLAUDE.MD「启动 Docker（必须第一步）」。

### 待办（下一步）
- [ ] 推进 GESP 3级课件开发（`标准教案/GESP03/` 已就位，评估体系可复用）
- [ ] GESP 真题录入与模拟考试题库扩充
- [ ] 配置真实 AI Key，验证 AI 教练在线效果

---

## [未发布] 2026-07-18

### 目标
完成 GESP 2级课件的质量修复、双智能体测评、真题验证与查漏补缺，使 GESP2 内容达到可交付状态。

### 新增
- **评估准则 v1**（`docs/agents/evaluation-rubric-v1.md`）：为小学生智能体建立可复现的评估标准——闭卷三步独立测试、5 档理解度（0/25/50/75/100）、完成度公式 `(✅×1+🟡×0.5)/总题数`、客观测量项（CJK 行宽≤80、代码块≤8 行）、禁止编造分数/开卷/迎合。
- **GESP1 毕业知识基线**（`docs/agents/gesp1-graduate-knowledge-baseline.md`）：把 GESP1 已学知识（bool、&&/||/!、素数、scanf/printf 等）固化为基线文件，GESP2 及以上测评必须注入，消除"未教先考"误报。
- **新第 13 课「循环模拟与易错点专项」**（`标准教案/GESP02/CSP02-13_循环模拟与易错点专项.md`）：针对真题高频失分点补课——画表格模拟循环三步法、break/continue、嵌套循环套 break、逗号表达式、and/or/not、类型四坑（整数除法/char 运算/(int) 截断/浮点精度）、辗转相除法 GCD+LCM。插入为第 13 课，原 13/14/15 顺延为 14/15/16，GESP2 现共 **16 课**。
- **L05 补「枚举别重复数」**：枚举去重技巧（`for(b=a)` 内层从外层开始），配 checkpoint。补的是真题编程大题套路（2025-06 数三角形）。
- **新增脚本**：`insert-gesp2-lesson13.ts` / `update-gesp2-lesson13.ts` / `update-gesp2-lesson5.ts`（安全单课插入/更新，不用会清空整课的 import-gesp2）。

### 变更
- **课后题修复**：修复 7 处 HTML 标签泄露（东方博宜源数据 `font-family` 残留）；L04/L06 错题全部从题库替换；L11 改为纯知识课（去课后题）；全部 15 课课后题按简单→难排序，每课 5 道；rawMarkdown 与 content 双源同步。
- **课件内容修复**（不改知识点）：L01 骰子输出格式对齐、L07 照抄例题改变式、L10 补 `k=i-n` 代入演示、L09/L12 加"先自己做"提示、L13 素数写法对齐基线 `i*i<=n`、补超纲术语大白话（time(0)/编译器/穿透/悬空else/伪代码/基本数据类型/操作系统/逗号赋值/负数循环/and-or）。

### 验证（双智能体）
- **课件测评 v2**（注入真实学习进度）：小柯 完成度 0.93 / 理解度 76.7，小明 0.98 / 85，均通过（≥0.8 且 ≥75），P0=0。报告 `tmp/gesp2_eval_xiaoke_v2.md`、`tmp/gesp2_eval_xiaoming_v2.md`。
- **真题考试**（最新 5 套 2025-06~2026-06，闭卷）：小柯 平均 79.6（合格 5/5、优秀 3/5）；小明 平均 ~84（合格 4/5，2025-06 不合格 52 分）。报告 `tmp/gesp2_exam_xiaoke.md`、`tmp/gesp2_exam_xiaoming.md`。
- **新第 13 课验证**：两人确认解决逗号表达式/字符运算/单层 break/and-or/辗转相除；修复挑战 4 超纲数组（改 3 变量）；补嵌套 break 完整画表 + 浮点精度页。报告 `tmp/lesson13_check_xiaoke.md`、`tmp/lesson13_check_xiaoming.md`。

### 决策
- 冷僻通识考点（%g、TCP 握手、char 截断、操作系统 vs 编译器、负数循环起点等）**不补**——考频低、投入产出不划算；枚举去重属真题编程套路，单独补。
- 课件正文渲染走 `rawMarkdown`，`content` 仅用于提取课后题 problemId；改课件必须双源同步。

### 待办（下一步）
- [ ] GESP 2级内容冻结前，可让双智能体把修复后的第 13 课再过一遍终验
- [ ] 推进 GESP 3级课件开发
- [ ] GESP 真题录入与模拟考试题库扩充

---

## [未发布] 2026-07-01 ~ 2026-07-04

### 目标
完成 GESP 1级最终整理与智能体验证，冻结课件内容，准备进入 GESP 2级课程开发。

### 新增
- **GESP1 课程结构统一**：普通课固定为「2 道课堂挑战 + 5 道课后作业」，练习课固定为「5 道课堂挑战 + 5 道课后作业」；课堂挑战后统一补充评讲逻辑（知识点、思路、易错点、关键代码解释）。
- **GESP1 小学生智能体 v6 评估**：重置小柯（9 岁三年级）和小明（11 岁五年级）的学习状态，从零重新学习 01-18 课。
  - 小柯平均理解率 **89.3%**（未达 90% 标准），最卡壳：第 17 课（C 风格 IO）、第 09 课（字符/switch）、第 14 课（while 哨兵输入）。
  - 小明平均理解率 **72.8%**（达到 70% 标准），最卡壳：第 02 课（整数运算）、第 09 课、第 11 课、第 17 课。
  - 报告：`docs/reports/evaluation-xiaoke-18-lessons-v6.md`、`docs/reports/evaluation-xiaoming-18-lessons-v6.md`。
- **GESP1 一级真题 14 套自测**：每套卷前重置智能体状态为"刚学完 18 课"，独立测试不累积。
  - 小柯 14 套平均 **98.8 分**，12 套满分。
  - 小明 14 套平均 **68.9 分**，最高 86.0 分，最低 57.0 分。
  - 报告：`docs/reports/xiaoke-gesp1-exam-v6-report.md`、`docs/reports/xiaoming-gesp1-exam-v6-report.md`。

### 变更
- `server/courses/gesp1/` 与 `server/courses/gesp1-micro/` 保持同步，课程结构统一为 2+5 / 5+5，不再继续修改课件知识体系。

### 待办（下一步）
- [ ] 开始 GESP 2级课程改造（`server/courses/gesp2-micro/`）
- [ ] 为 GESP2 匹配课后编程题
- [ ] GESP2 小学生智能体验证

---

## [未发布] 2026-06-10 ~ 2026-06-27

### 目标
为 DKL 学生端增加"每周一课"粘性机制，并将现有 GESP 课程改造为儿童自学友好的微课形式。

### 新增
- **周连胜机制**：后端 `streak` 改为按周计算（每周完成任意一课 +1，断周重置为 1）。
- **完成庆祝增强**：`CelebrationModal` 全屏彩带 + XP/等级/徽章/连胜展示 + 下一课入口。
- **学生首页 Dashboard**：`CourseHallPage` 改为大按钮"开始本周课程" + 连胜 + 进度。
- **像素风课程地图**：`CourseDetailPage` 改为 S 形冒险路径，1-8 级对应不同地形主题。
- **AI 地图背景**：`client/public/maps/` 放入 8 张 AI 生成背景图，prompt 记录在 `docs/AI_MAP_PROMPTS.md`。
- **微课格式规范**：`server/courses/MICRO_LESSON_FORMAT.md` 定义 story / card / demo / checkpoint / challenge 结构。
- **GESP1 儿童版微课全套**：`server/courses/gesp1-micro/01-走进C++.md` 至 `12-C风格输入输出.md` 全部按微课格式重写，经小学生体验官"小柯"评审后导入数据库。
- **课后题匹配**：从东方博宜 CSP01 题库中为 GESP1 每节课精选 5 道课后编程题（共 60 道），按知识点和难度从易到难编排，并修复 `/lessons/:id/problems` 接口保持课件题目顺序。
- **课后题难度再调整**：针对零基础小学生反馈，从 simplest 候选集中重新为 12 课匹配最简单的入门级题目，确保第 1 课仅使用整数输入输出与基础四则运算；已重新运行 `import-gesp1.ts` 导入数据库。
- **课后挑战提示**：全部 12 节课的课后挑战区增加 Dev-C++ 编写提示，引导学生先在本地 Dev-C++ 完成程序并运行，再复制到提交测评中递交。
- **课时页关卡导航优化**：课程完成后，顶部关卡号可点击跳转回顾；进度条改为自动换行，避免关卡过多时超出屏幕。
- **智能体验收报告**：以 `student@dkl.local` 从零开始学习并完成 GESP1 第 1-5 课全部课后题，输出 `docs/reports/agent-gesp1-lessons-1-5.md`。
- **GESP1 第 6-12 课课后题匹配验证**：导出 7 课共 35 道题目，逐课核对知识点覆盖，发现 7 道超纲/不匹配题并替换；更新 `server/courses/gesp1-micro/` 与 `server/courses/gesp1/` 对应课件，同步更新数据库课时内容，全部 35 题通过评测，输出 `docs/reports/agent-gesp1-lessons-6-12.md`。
- **GESP1 从 12 课扩充到 18 课**：按"3 新知 + 1 练习课"节奏插入 5 节练习课，并将"单双路分支"拆分为"单路分支 + 双路分支"；同步调整 `server/courses/gesp1-micro/` 与 `server/courses/gesp1/` 两套目录为 18 个文件，运行 `server/src/scripts/migrate-gesp1-18-lessons.ts` 完成数据库迁移，保留现有 `learning_progress` 学习进度。
- **GESP1 练习课选题与验证**：为 5 节新练习课各匹配 5 道编程题（优先选自对应前 3 节课题库，综合练习课跨全书），18 课共 90 道课后题全部编写参考答案并通过自动提交验证，`server/src/scripts/verify-gesp1-all.ts` 输出 `90/90 accepted`。
- **GESP1 18 课前端显示确认**：课程地图 S 形路径与课时页进度条均按课程数量动态生成，18 课在前端正常展示，无需修改页面代码。
- **小学生体验官人设**：`docs/agents/elementary-student-persona.md` 用于课程可读性自检。
- **新增智能体"小明"人设**：`docs/agents/xiaoming-persona.md` 定位为小学五年级、对 C++ 有兴趣但成绩中等、注意力容易受影响的学生，用于评估课程的持续学习意愿与抗挫败感。

### 修复
- CSS 代码块默认文字颜色从 `inherit` 改为 `#abb2bf`，修复暗色背景下看不见代码的问题。
- 课程详情页节点与 SVG 路径使用统一像素坐标，课程名完整展示。
- `client.ts` token key 兼容（`token`/`dkl_token`、`tenantId`/`dkl_tenantId`）。
- `Layout.tsx` / `CourseHallPage.tsx` 退出登录清理 key 不一致。
- `progress.ts` 中 `nextLesson` Prisma `select` + `include` 冲突。

### 变更文件
```
server/courses/gesp1-micro/01-走进C++.md
server/courses/gesp1-micro/02-整数运算.md
server/courses/gesp1-micro/03-小数运算.md
server/courses/gesp1-micro/04-练习课-计算小达人.md
server/courses/gesp1-micro/05-分支入门.md
server/courses/gesp1-micro/06-双路分支.md
server/courses/gesp1-micro/07-多路分支.md
server/courses/gesp1-micro/08-练习课-分支大冒险.md
server/courses/gesp1-micro/09-字符类型与 switch.md
server/courses/gesp1-micro/10-for 循环.md
server/courses/gesp1-micro/11-循环控制.md
server/courses/gesp1-micro/12-练习课-循环闯关.md
server/courses/gesp1-micro/13-求和计数.md
server/courses/gesp1-micro/14-while 循环.md
server/courses/gesp1-micro/15-短除法.md
server/courses/gesp1-micro/16-练习课-数字拆解与统计.md
server/courses/gesp1-micro/17-C风格输入输出.md
server/courses/gesp1-micro/18-练习课-GESP1综合大闯关.md

server/courses/gesp1/01-走进C++.md
server/courses/gesp1/02-整数运算.md
server/courses/gesp1/03-小数运算.md
server/courses/gesp1/04-练习课-计算小达人.md
server/courses/gesp1/05-分支入门.md
server/courses/gesp1/06-双路分支.md
server/courses/gesp1/07-多路分支.md
server/courses/gesp1/08-练习课-分支大冒险.md
server/courses/gesp1/09-字符类型与 switch.md
server/courses/gesp1/10-for 循环.md
server/courses/gesp1/11-循环控制.md
server/courses/gesp1/12-练习课-循环闯关.md
server/courses/gesp1/13-求和计数.md
server/courses/gesp1/14-while 循环.md
server/courses/gesp1/15-短除法.md
server/courses/gesp1/16-练习课-数字拆解与统计.md
server/courses/gesp1/17-C风格输入输出.md
server/courses/gesp1/18-练习课-GESP1综合大闯关.md

server/src/scripts/migrate-gesp1-18-lessons.ts
server/src/scripts/verify-gesp1-all.ts

client/src/api/client.ts
client/src/components/CelebrationModal.tsx
client/src/components/Layout.tsx
client/src/index.css
client/src/pages/CourseDetailPage.tsx
client/src/pages/CourseHallPage.tsx
client/src/pages/LessonPage.tsx
client/src/components/ProblemPracticeBlock.tsx
server/src/parsers/markdownParser.ts
server/src/routes/courses.ts
server/src/routes/lessons.ts
server/src/routes/progress.ts

client/public/maps/map-level-{1-8}.png
client/public/maps/check-state.png
docs/AI_MAP_PROMPTS.md
docs/agents/elementary-student-persona.md
docs/agents/xiaoming-persona.md
generate_maps.py
server/courses/MICRO_LESSON_FORMAT.md
.kimi/skills/gesp1-lesson-pipeline/SKILL.md
.kimi/skills/course-kid-evaluator/SKILL.md
.kimi/skills/course-kid-evaluator/references/kid-persona.md
.kimi/skills/course-kid-evaluator/references/knowledge-state.md

docs/reports/agent-gesp1-lessons-1-5.md
docs/reports/agent-gesp1-lessons-6-12.md
docs/reports/agent-gesp1-18-lessons.md
```

### 待办
- [x] 批量转换 GESP1 剩余 11 课为微课格式
- [x] 为 GESP1 每节课从题库匹配 5 道课后题（共 90 道）
- [x] 验证并调整 GESP1 第 6-12 课课后题与知识点匹配度
- [x] 将 GESP1 从 12 课扩充到 18 课并验证全部 90 道课后题
- [x] 小学生智能体 v6 评估与 14 套一级真题自测
- [ ] commit 当前所有改动
- [ ] 批量转换 GESP2 全部 8 课为微课格式
- [ ] 为 GESP2 每节课匹配课后编程题
- [ ] 用小学生智能体人设自检 GESP2 每节课
- [ ] 补充题目测试用例

---

## 2026-06-10

### 提交
`8648b10 feat: 周连胜粘性机制 + 像素风课程地图 MVP`

### 内容
- 周连胜后端逻辑
- Dashboard 首页
- 像素风课程地图初版
- 完成庆祝弹窗

---

## 更早之前

见 `DEV_PLAN.md` 与 `CLAUDE.MD` 中的 Phase 记录。
