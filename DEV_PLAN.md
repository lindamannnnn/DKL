# DKL 平台开发执行计划

## 关键结论（Agent 调研结果）

| 调研项 | 结论 |
|--------|------|
| **JudgeServer IOI 赛制** | ✅ **原生支持**。通过 `test_case.json` 配置每个测试点分值权重，返回 `total_score` 和每个测试点详细结果。不需要自己逐个调用。 |
| **免费 GESP 题库** | ⚠️ **没有完全免费的批量导入题库**。洛谷有题单、GitHub 有代码解析、官网有真题 PDF，但需要手动整理录入。建议：用户提供课件时配套题目，或后续手动录入真题。 |

---

## 开发阶段

### Phase 1：基础设施 + 数据库（已完成骨架，需细化）

**目标**：`docker-compose up` 后，所有服务可运行，数据库可连接。

| 任务 | 文件 | 状态 |
|------|------|------|
| Docker Compose（PG + Redis + JudgeServer） | `docker-compose.yml` | ✅ 已写 |
| 数据库模型（Prisma Schema） | `server/prisma/schema.prisma` | ✅ 已写 |
| 数据库迁移脚本 | `server/prisma/migrations/` | ⬜ 待生成 |
| Seed 数据（初始徽章 + 演示课程） | `server/prisma/seed.ts` | ⬜ 待写 |
| 环境变量配置 | `server/.env` | ⬜ 待配置 |
| Docker 网络联调 | - | ⬜ 待验证 |

**验收标准**：`curl http://localhost:4001/health` 返回 OK，`curl http://localhost:8080/ping` 返回 JudgeServer OK。

> 注：后端实际运行在 4001 端口。

---

### Phase 2：后端核心 API

**目标**：所有业务接口可独立测试（用 Postman / curl）。

| 模块 | 路由 | 接口 | 说明 |
|------|------|------|------|
| **认证** | `POST /api/auth/*` | 注册、登录、JWT 刷新 | bcrypt + jwt |
| **租户** | 请求头 `X-Tenant-Id` | 所有接口自动过滤租户 | middleware 实现 |
| **课程** | `GET /api/courses` | 课程列表 | 学生看已加入的，教师看全部 |
| | `GET /api/courses/:id` | 课程详情（含章节/课时树） | |
| | `POST /api/courses` | 创建课程（教师） | |
| **课时** | `GET /api/lessons/:id` | 课时内容（解析后的 JSON） | |
| | `POST /api/lessons/:id/complete` | 标记课时完成 | |
| **课件上传** | `POST /api/courses/import` | 上传 Markdown/ZIP | 解析 → 存章节/课时 |
| **题目** | `GET /api/problems` | 题目列表 | 支持按 GESP 级别筛选 |
| | `GET /api/problems/:id` | 题目详情 | 含样例、模板代码 |
| | `POST /api/problems` | 创建题目（教师） | |
| | `POST /api/problems/:id/submit` | 提交代码评测 | 调用 JudgeServer |
| **评测** | `POST /api/judge` | 评测接口 | 封装 JudgeServer，返回部分分 |
| | `GET /api/submissions` | 提交记录 | 个人历史 |
| | `GET /api/submissions/:id` | 提交详情 | 含每个测试点结果 |
| **AI 教练** | `POST /api/ai/chat` | AI 对话 | 上下文 + 课时/题目关联 |
| | `POST /api/ai/feedback` | 代码点评 | 提交后 AI 分析 |
| **班级** | `POST /api/classes` | 创建班级 | 生成邀请码 |
| | `POST /api/classes/:id/join` | 学生加入班级 | 通过邀请码 |
| | `GET /api/classes/:id/students` | 班级学生列表 | 教师查看 |
| **进度/报告** | `GET /api/progress` | 个人学习进度 | |
| | `GET /api/reports/daily` | 每日报告 | AI 生成 |
| **错题本** | `GET /api/mistakes` | 错题列表 | |
| | `POST /api/mistakes/:id/review` | 标记已复习 | |
| **成就** | `GET /api/achievements` | 成就列表 | |
| | `GET /api/achievements/my` | 我的成就 | |

**验收标准**：每个接口用 curl 测试通过，返回正确数据结构。

---

### Phase 3：前端核心页面

**目标**：学生可完整浏览课程、学习课时、编写代码、提交评测。

| 页面 | 路由 | 组件 | 说明 |
|------|------|------|------|
| **登录/注册** | `/login`, `/register` | `LoginPage`, `RegisterPage` | 学生/教师共用，role 区分 |
| **课程大厅** | `/student/courses` | `CourseHallPage` | 大卡片列表，进度条 |
| **课程详情** | `/student/courses/:id` | `CourseDetailPage` | 章节/课时树，点击学习 |
| **课时学习** | `/student/lessons/:id` | `LessonPage` | **核心页面**：左侧目录 + 右侧课件渲染 |
| | | `LessonContent` | Markdown 渲染 + 代码块 + 互动题 |
| | | `CodeBlock` | 可运行代码块（点击弹出编辑器） |
| | | `QuizBlock` | 选择题/填空题 |
| **编程练习** | `/student/problems/:id` | `ProblemPage` | **核心页面**：题面 + Monaco 编辑器 |
| | | `ProblemDescription` | 题面渲染（Markdown） |
| | | `CodeEditor` | Monaco Editor，预填模板 |
| | | `SubmitPanel` | 提交按钮 + 结果展示 |
| **提交结果** | `/student/submissions/:id` | `SubmissionResultPage` | 每个测试点结果 + AI 点评 |
| **AI 教练** | 侧边栏组件 | `AICoachPanel` | 常驻右下/右侧，对话式 |
| **个人中心** | `/student/dashboard` | `DashboardPage` | 进度、正确率曲线、今日任务 |
| **错题本** | `/student/mistakes` | `MistakesPage` | 错题列表 + 复习 |
| **成就** | `/student/achievements` | `AchievementsPage` | 徽章墙 |
| **教师后台** | `/teacher/*` | `TeacherLayout` | 侧边导航 + 内容区 |
| | `/teacher/courses` | `TeacherCoursesPage` | 课程管理 |
| | `/teacher/courses/import` | `CourseImportPage` | 上传 Markdown/ZIP |
| | `/teacher/problems` | `TeacherProblemsPage` | 题库管理 |
| | `/teacher/problems/new` | `ProblemEditPage` | 题目录入（题面 + 测试用例） |
| | `/teacher/classes` | `TeacherClassesPage` | 班级管理 |
| | `/teacher/classes/:id` | `ClassDetailPage` | 学生进度看板 |
| | `/teacher/reports` | `TeacherReportsPage` | 学情报告 |

**验收标准**：学生端可完成「浏览课程 → 学习课时 → 运行代码 → 提交评测 → 查看结果」完整闭环。

---

### Phase 4：评测系统精细对接

**目标**：代码提交后，正确返回 IOI 赛制部分分结果。

| 任务 | 说明 |
|------|------|
| JudgeServer 配置 | 配置 `test_case.json`，设置每个测试点分值 |
| 评测服务封装 | `judgeService.ts` 对接 JudgeServer 原生 API |
| 结果解析 | 解析 `total_score` + `details` 数组 |
| 前端结果展示 | 测试点通过情况表格 + 得分展示 |
| 编译错误处理 | 规则引擎匹配常见错误（中文标点、缺少分号等） |

**验收标准**：提交一道有 5 个测试点的题目，通过 3 个，正确显示「得分 60/100」。

---

### Phase 5：AI 教练接入

**目标**：AI 可结合课时/题目上下文进行教学对话和代码点评。

| 任务 | 说明 |
|------|------|
| AI API 封装 | 支持 OpenAI / DeepSeek，统一接口 |
| 对话上下文 | Redis 存储近期对话，限制长度 |
| 课时上下文注入 | 系统 prompt 包含当前课时内容摘要 |
| 题目上下文注入 | 系统 prompt 包含题目描述和样例 |
| 编译错误规则库 | 预设 20+ 常见错误模式及提示语 |
| 代码点评 | 提交后自动触发 AI 分析代码 |
| 每日报告生成 | 定时任务汇总数据，调用 AI 生成报告 |

**验收标准**：学生在课时页问「这段代码什么意思」，AI 能结合课件内容回答；提交代码 WA 后，AI 给出有针对性的提示。

---

### Phase 6：轻度激励系统

**目标**：维持学生学习动力，非游戏化。

| 功能 | 说明 |
|------|------|
| 连续打卡 | 每日学习记录 streak，断了 AI 鼓励 |
| 徽章系统 | 「首 AC」「7天连胜」「循环大师」「数组达人」等 |
| 等级称号 | 编程学徒 → 语法新手 → 算法小将 → 信奥选手 |
| 进度可视化 | 课程完成度、正确率趋势图 |

**验收标准**：学生完成第一节课，获得「启程徽章」；连续学习 7 天，获得「坚持徽章」。

---

### Phase 7：题库建设与测试

**目标**：平台有内容可学，机构可直接开课。

| 任务 | 说明 |
|------|------|
| GESP 1-2 级题目 | 约 30 道基础语法题（用户可提供课件配套） |
| GESP 3-4 级题目 | 约 30 道数组/排序/递推题 |
| 测试用例配置 | 每题 5-10 组测试用例（样例+隐藏） |
| 全真模拟考试 | 限时模式、随机抽题、IOI 赛制 |
| 集成测试 | 端到端测试完整学习闭环 |

**验收标准**：一个模拟学生账号，可从注册到学完 GESP 1 级全部课时，完成配套编程题。

---

## 开发优先级

```
P0（必须先做）:
  - Phase 1: Docker 基础设施
  - Phase 2: 认证 + 课程/课时 API
  - Phase 3: 课程大厅 + 课时页 + 编辑器 + 提交
  - Phase 4: 评测对接（JudgeServer）

P1（核心体验）:
  - Phase 2: 题目/评测/提交记录 API
  - Phase 3: 提交结果页 + AI 教练 UI
  - Phase 5: AI 对话 + 代码点评
  - Phase 6: 徽章 + 打卡

P2（机构功能）:
  - Phase 2: 班级/课件上传/进度 API
  - Phase 3: 教师后台全部页面
  - Phase 5: 每日报告
  - Phase 7: 题库录入 + 模拟考试
```

---

## 当前状态（截至 2026-07-20）

| Phase | 进度 |
|-------|------|
| Phase 1 | 90% — Docker Compose 可运行 PG + Redis + JudgeServer，数据库连接正常，后端/前端服务可启动 |
| Phase 2 | 85% — 认证、租户、课程/课时、题目、评测、AI、提交记录、错题本、成就、班级、进度报告、模拟考试等 API 已完成 |
| Phase 3 | 75% — 登录/注册、课程大厅、课程详情、课时学习（含分页式课件、代码块运行、选择题、操作题）、编程练习、提交结果、AI 教练面板、错题本、成就、个人中心、教师后台等页面已完成 |
| Phase 4 | 85% — JudgeServer 对接完成，支持 C++ 编译运行、IOI 部分分、编译错误/答案错误检测、友好结果提示 |
| Phase 5 | 85% — Kimi API 已接入，AI 对话、代码点评、课时/题目上下文注入、知识库优先回答、规则引擎辅助已实现 |
| Phase 6 | 70% — 徽章系统自动颁发、连续打卡计算、学习进度可视化已完成；等级称号待完善 |
| Phase 7 | 95% — GESP 1级 18 课已冻结；GESP 2级 16 课已冻结（2026-07-20）；**GESP 3级 20 课课件修复完成（2026-07-22）**：补齐 P0 知识缺口（sizeof、字母循环移位、位运算优先级链/`~`取反、进制左补零去前导零、反码循环进位）、修正 P1 知识性错误（05挑战1教师卡、02逆序矛盾、04 a[++m]、06读`\0`纠错、10未教先考）、修复 P2 呈现问题（字典序/getline/strcmp差值/检查点答案分布/样例放跑/示例行数等）、补回 39 条教案丢失知识点中核心 9 条+补充 30 条的大部分；全 20 课 `check-gesp3-lessons.ts` 自检 🎉 全部通过；15/17 课课后题换编码/位运算类题并补测试点。**GESP3 双智能体 V3 重测（2026-07-23，重置到 GESP2 毕业态重学）**：小柯 20/20 全过（01–10 理解率100/完成度1.0，11/13/17–20 理解率100+0.8~0.9，12/14/15/16 理解率75+0.8~0.9）；小明 19/20 过（仅 20 课完成度 0.7<0.75 未过线，其余均 75/0.75~1.0）。V3 新暴露待修项：① 多课课后题与课核不匹配（15/16 是进制题、17 是字符串题、19/20 偏离真题考点）；② 14/16 单课认知负荷超标建议拆课；③ 指数记号 2ⁿ/2^32 未解释；④ 方向数组编号 12/13 两课打架+off-by-one 未讲透；⑤ 超长数/大范围题缺字符串脚手架；⑥ 多课课后题题面残缺/超纲（13/15/17/18/19）；⑦ 教了没收进题（03 前缀和、06 strcat/恺撒、09 双指针回文、10 前后缀匹配）；⑧ 0/1 下标偏移、"以.结束"句点陷阱反复踩。详见 docs/reports/eval-{xiaoke,xiaoming}-gesp3-*-v3.md（40 份）+ snapshots/（20 份）。剩余：P3-3 题库测试点普遍不足（约 70 道被引用题仅 1–4 个测试点，需逐题补录，原评估已标「需排期」） | **V3 问题整改（2026-07-23，按用户审定改法）**：06/09/10/15/16/17 课后题整改（15/16 换编码/位运算题、17 换掉残缺的夏令营小旗手补位运算题、06 补恺撒覆盖、09/10 补近似覆盖）；11/12/13/14/18 数组样例统一从1、18 换掉残缺题(出现次数最多的小写字母)；19/20 改用 测试/GESP_C++_3级 真实真题重建（computer 卡放客观题+先想一想提示卡）。全 20 课 `check-gesp3-lessons.ts` 🎉 全过，已 import 同步数据库。遗留：① 15 课因库内缺 tc≥5 纯编码/原反补题，课后题仍为进制转换类（与正课讲的原反补主题仍不匹配），需后续补题库；② 14/16 拆课维持现状（用户拍板不改）；③ P3-3 测试点不足仍待排期 |
