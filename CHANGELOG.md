# DKL 开发日志

> 记录每次重要迭代的改动、决策和待办，便于多会话衔接与版本回顾。

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
- **小学生体验官人设**：`docs/agents/elementary-student-persona.md` 用于课程可读性自检。

### 修复
- CSS 代码块默认文字颜色从 `inherit` 改为 `#abb2bf`，修复暗色背景下看不见代码的问题。
- 课程详情页节点与 SVG 路径使用统一像素坐标，课程名完整展示。
- `client.ts` token key 兼容（`token`/`dkl_token`、`tenantId`/`dkl_tenantId`）。
- `Layout.tsx` / `CourseHallPage.tsx` 退出登录清理 key 不一致。
- `progress.ts` 中 `nextLesson` Prisma `select` + `include` 冲突。

### 变更文件
```
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
generate_maps.py
server/courses/MICRO_LESSON_FORMAT.md
server/courses/gesp1-micro/01-走进C++.md
server/courses/gesp1-micro/02-整数运算.md
server/courses/gesp1-micro/03-小数运算.md
server/courses/gesp1-micro/04-单双路分支.md
server/courses/gesp1-micro/05-多路分支.md
server/courses/gesp1-micro/06-字符类型与 switch.md
server/courses/gesp1-micro/07-for 循环.md
server/courses/gesp1-micro/08-循环控制.md
server/courses/gesp1-micro/09-求和计数.md
server/courses/gesp1-micro/10-while 循环.md
server/courses/gesp1-micro/11-短除法.md
server/courses/gesp1-micro/12-C风格输入输出.md
.kimi/skills/gesp1-lesson-pipeline/SKILL.md
.kimi/skills/course-kid-evaluator/SKILL.md
.kimi/skills/course-kid-evaluator/references/kid-persona.md
.kimi/skills/course-kid-evaluator/references/knowledge-state.md
docs/reports/agent-gesp1-lessons-1-5.md
```

### 待办
- [x] 批量转换 GESP1 剩余 11 课为微课格式
- [x] 为 GESP1 每节课从题库匹配 5 道课后题（共 60 道）
- [ ] 批量转换 GESP2 全部 8 课为微课格式
- [ ] 用小学生智能体人设自检每节课
- [ ] 补充题目测试用例
- [ ] commit 当前所有改动

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
