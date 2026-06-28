# DKL "每周一课" 儿童自学版 — 当前上下文

> 本文件用于在切换 Kimi 会话时快速恢复上下文。切换回 Kimi 客户端后，把这份文件内容贴给 Kimi 即可。

---

## 1. 项目目标

参考多邻国（Duolingo）心理策略，为 DKL 学生端打造"每周一课"粘性机制 + 儿童自学友好的微课形式，让 4-6 年级小学生能在家独立学习 C++。

核心策略：
- **周连胜（Weekly Streak）**：每周完成任意一课 +1，断周重置为 1
- **强烈完成庆祝动画**：全屏彩带、经验、等级、徽章、连胜展示
- **课程地图式详情页**：像素风/冒险风关卡可视化，1-8 级对应不同地形
- **吸引人的首页 Dashboard**：大按钮"开始本周课程"、连胜、进度
- **儿童自学微课**：一页一概念 + 必互动 + 故事化 + 检查点锁页

---

## 2. 当前完成状态

### ✅ 已完成

**激励与粘性**
- 后端周连胜逻辑完成（按周计算，周一为一周开始）
- 后端 `/lessons/:id/complete` 返回 `streak` 和 `weeklyCompleted`
- 后端 `/progress/stats` 返回 `weeklyCompleted` 和 `nextLesson`
- 后端 `/progress/report` 统一使用周连胜并调整文案
- 前端 `CourseHallPage` 改造为 Dashboard 风格首页
- 前端 `CourseDetailPage` 改造为像素风冒险地图（S 形路径、8 级地形）
- 前端 `CelebrationModal` 强化庆祝效果（彩带、XP、等级、徽章、连胜、下一课）
- 前端 `LessonPage` 完成时传递 streak/weeklyCompleted 给庆祝弹窗

**课程地图美术**
- 使用 AI 生成 8 张地图背景图，存放于 `client/public/maps/map-level-{1-8}.png`
- 生成 prompt 记录在 `docs/AI_MAP_PROMPTS.md`
- 课程详情页背景使用 bgImage，随 `course.levelMin` 切换 1-8 级主题
- 修复节点与 SVG 路径使用统一像素坐标，课程名完整展示

**微课格式与内容**
- 制定微课格式规范：`server/courses/MICRO_LESSON_FORMAT.md`
- 定义 story / card / demo / checkpoint / challenge 五种组件
- 完成 GESP1 全部 12 课儿童版微课：`server/courses/gesp1-micro/01-走进C++.md` 至 `12-C风格输入输出.md`
- 全部通过小学生体验官"小柯"人设评审并导入数据库
- 从 CSP01 题库为每节课匹配 5 道课后编程题（共 60 道），按知识点、难度从易到难排序，后续又根据零基础反馈从 simplest 候选集重新匹配为最简单题目
- 修复 `/lessons/:id/problems` 接口，返回顺序与课件编排一致
- 新增/更新 Skill：`.kimi/skills/gesp1-lesson-pipeline/`（改造流水线）、`.kimi/skills/course-kid-evaluator/`（小柯测评）
- 课后挑战区统一增加 Dev-C++ 编写提示（`ProblemPracticeBlock` 组件）
- 课时页关卡导航优化：课程完成后可点击回顾，关卡过多时自动换行
- 智能体验收：以 `student@dkl.local` 完成 GESP1 第 1-5 课，输出 `docs/reports/agent-gesp1-lessons-1-5.md`

**Bug 修复**
- 修复 `client.ts` token key 兼容问题（兼容 `token`/`dkl_token`、`tenantId`/`dkl_tenantId`）
- 修复 `Layout.tsx` / `CourseHallPage.tsx` 退出登录清理 key 不一致
- 修复 `progress.ts` 中 `nextLesson` Prisma `select` + `include` 冲突
- 修复 CSS 代码块默认文字颜色 bug（`inherit` → `#abb2bf`，暗色背景下可见）

**基础设施**
- 启动 Docker / PostgreSQL / Redis / JudgeServer，恢复课程数据
- 前端 `npm run build` ✅ 通过
- 后端 `npx tsc --noEmit` ✅ 通过

### 🔄 进行中 / 待优化
- GESP1 全部 12 课已完成，开始准备 GESP2 8 课改造
- 验证第 1 课知识体系完整性（变量创建/赋值/初始化已补）
- 用小学生智能体人设自检每节课可读性
- 课后编程题和课堂操作题题目、测试用例待补充
- 前端 dev server 偶有 120s 超时 / 端口占用问题

---

## 3. 关键文件改动

```
M  client/src/api/client.ts                    # token/tenantId key 兼容
M  client/src/components/CelebrationModal.tsx  # 强化庆祝弹窗
M  client/src/components/Layout.tsx            # logout 清理 key
M  client/src/index.css                         # 像素风样式、代码块颜色、地图效果
M  client/src/pages/CourseDetailPage.tsx       # 像素风地图详情页
M  client/src/pages/CourseHallPage.tsx         # Dashboard 首页
M  client/src/pages/LessonPage.tsx             # 课时完成传参、关卡导航
M  client/src/components/ProblemPracticeBlock.tsx # 课后挑战 Dev-C++ 提示
M  server/src/parsers/markdownParser.ts        # 课件分页解析
M  server/src/routes/courses.ts                # 返回用户进度
M  server/src/routes/lessons.ts                # 周连胜计算
M  server/src/routes/progress.ts               # stats/report 周连胜

A  client/public/maps/map-level-{1-8}.png      # AI 生成地图背景
A  client/public/maps/check-state.png          # 地图状态图标
A  docs/AI_MAP_PROMPTS.md                      # 地图生成 prompt
A  docs/agents/elementary-student-persona.md   # 零基础小学生体验官人设
A  generate_maps.py                            # 地图背景生成辅助脚本
A  server/courses/MICRO_LESSON_FORMAT.md       # 微课格式规范
A  server/courses/gesp1-micro/01-走进C++.md 至 12-C风格输入输出.md  # GESP1 儿童版微课全套
A  docs/reports/agent-gesp1-lessons-1-5.md    # 智能体验收学习报告
```

---

## 4. 当前技术栈 & 环境

- OS: Windows 11 + WSL2 + Docker Desktop
- Node: v24.14.0, npm 11.9.0
- Stack: Node.js + Express + Prisma + PostgreSQL + Redis + React 18 + Vite + Tailwind
- 后端: http://localhost:4001
- 前端: http://localhost:3000（被占用时可能 fallback 到 3001）
- 数据库: localhost:5432 (dkl_db)
- Git: https://github.com/lindamannnnn/DKL.git
- 最新 commit: `8648b10 feat: 周连胜粘性机制 + 像素风课程地图 MVP`

---

## 5. 测试账号

- 邮箱：`student@dkl.local`
- 密码：`student123`
- tenantId：`080ffa34-df87-4566-b1ef-555b88bfe5b8`

---

## 6. 当前主要问题

1. **课程转换任务**：GESP1 已完成；GESP2 剩 8 课需要按新微课格式重写并导入。
2. **前端 dev server 超时**：后台任务常因 120s 超时失败，实际服务可能已启动但心跳丢失。
3. **端口占用**：前后端服务进程残留导致启动失败，需手动 kill 旧进程后重启。
4. **未提交改动多**：地图图、CSS、课程详情页、新文档等均未 commit。

---

## 7. 下一步可选方向

- **方向 A：继续批量转换课程**（GESP2-01 到 GESP2-08）
- **方向 B：用小学生智能体自检第 1 课**，找出不够儿童化的地方
- **方向 C：补充课后编程题和测试用例**，让每节课形成完整闭环
- **方向 D：先 commit 当前改动**，清理端口后验证前后端都能正常启动

---

## 8. 关键约定

- 不改课件 Markdown 知识体系，只按微课格式重新包装
- 连胜按"周"计算（周一为一周开始）
- `CourseHallPage` 是学生实际首页（`/student/courses`）
- 课程详情页根据 `course.levelMin` 切换 1-8 级地形主题
- 每节课必须包含 story / card / demo / checkpoint / challenge 中的至少一种互动
- 检查点（checkpoint）必须答对才能继续下一页
- 新智能体人设位于 `docs/agents/elementary-student-persona.md`，用于课程可读性自检
