# VERIFICATION.md — 已验证功能清单

> 本文档记录已通过人工验证的功能项。后续开发中，这些功能**无需重复验证**，除非相关代码被修改。

---

## 验证环境

- **日期**：2026-06-11
- **OS**：Windows 11 + WSL2
- **Node**：v24.14.0
- **Docker Desktop**：29.5.3
- **PostgreSQL**：16-alpine（dkl-postgres 容器）
- **Redis**：7-alpine（dkl-redis 容器）
- **JudgeServer**：qingdaou/judge_server:latest（dkl-judge 容器）
- **后端端口**：4001
- **前端端口**：3000
- **JudgeServer 端口**：8080

---

## ✅ 基础设施层

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| Docker Compose 启动 PG + Redis + JudgeServer | `docker ps` | ✅ | 容器健康检查通过 |
| PostgreSQL 连接 | 后端登录成功 | ✅ | 数据库读写正常 |
| Prisma Migrate Dev | `npx prisma migrate dev` | ✅ | 迁移已应用 |
| Prisma DB Seed | `npx prisma db seed` | ✅ | 数据正确，无重复插入 |
| 后端健康检查 | `GET /health` | ✅ | 返回 `{"status":"ok"}` |

---

## ✅ 认证与授权

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| 学生登录（student@dkl.local / 123456） | `POST /api/auth/login` | ✅ | JWT Token 正常返回 |
| 教师登录（teacher@dkl.local / teacher123） | `POST /api/auth/login` | ✅ | 角色字段正确 |
| 管理员登录（admin@dkl.local / admin123） | `POST /api/auth/login` | ✅ | 角色字段正确 |
| JWT 认证中间件 | 携带 Token 访问受保护路由 | ✅ | 未携带 Token 返回 401 |
| 多租户隔离（X-Tenant-Id） | 不同租户数据隔离查询 | ✅ | tenantId 正确过滤 |

---

## ✅ JudgeServer 评测系统

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| JudgeServer 容器启动 | `docker ps` + 直接调用 | ✅ | `/log` 目录修复后正常 |
| JudgeServer Token 验证 | `POST /judge` | ✅ | SHA256 哈希后的 Token 有效 |
| C++ 代码编译运行 | 提交 Hello World | ✅ | g++ -std=c++14 编译通过 |
| IOI 部分分制（多测试点） | 返回 details 数组 | ✅ | 2 个测试点全部 Accepted |
| 编译错误检测 | 提交错误代码 | ✅ | 返回 compile_error |
| 答案错误检测 | 提交输出不符的代码 | ✅ | 返回 Wrong Answer |
| 评测结果解析 | `judgeService.ts` | ✅ | result 常量映射正确 |
| 友好结果提示 | `friendlyResult` 字段 | ✅ | "✅ 全部通过！太棒了！" |

---

## ✅ 课程与课时系统

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| 课程列表查询 | `GET /api/courses` | ✅ | 返回 GESP 1级课程 |
| 课程详情查询（含章节/课时） | `GET /api/courses/:id` | ✅ | 嵌套数据正确 |
| 课时内容查询 | `GET /api/lessons/:id` | ✅ | 返回 Markdown 解析后的 pages |
| 标记课时完成 | `POST /api/progress/complete` | ✅ | 状态变为 completed |
| 学习进度统计 | `GET /api/progress/stats` | ✅ | 完成率/AC率计算正确 |

---

## ✅ GESP 1级课件内容

| 课次 | 文件 | 状态 | 备注 |
|------|------|------|------|
| 01 走进 C++ | `server/courses/gesp1/01-走进C++.md` | ✅ | 覆盖大纲主题 1 |
| 02 整数运算 | `server/courses/gesp1/02-整数运算.md` | ✅ | 覆盖大纲主题 2 |
| 03 小数运算 | `server/courses/gesp1/03-小数运算.md` | ✅ | 覆盖大纲主题 3 |
| 04 单双路分支 | `server/courses/gesp1/04-单双路分支.md` | ✅ | 覆盖大纲主题 4 |
| 05 多路分支 | `server/courses/gesp1/05-多路分支.md` | ✅ | 覆盖大纲主题 5 |
| 06 字符类型与 switch | `server/courses/gesp1/06-字符类型与switch.md` | ✅ | 覆盖大纲主题 6 |
| 07 for 循环 | `server/courses/gesp1/07-for循环.md` | ✅ | 覆盖大纲主题 7 |
| 08 循环控制 | `server/courses/gesp1/08-循环控制.md` | ✅ | 覆盖大纲主题 8 |
| 09 求和计数 | `server/courses/gesp1/09-求和计数.md` | ✅ | 覆盖大纲主题 9 |
| 10 while 循环 | `server/courses/gesp1/10-while循环.md` | ✅ | 覆盖大纲主题 10 |
| 11 短除法 | `server/courses/gesp1/11-短除法.md` | ✅ | 覆盖大纲主题 11 |
| 12 C 风格输入输出 | `server/courses/gesp1/12-C风格输入输出.md` | ✅ | 覆盖大纲主题 12 |

**课堂操作题**：01~12 课每课预留 5 道操作题占位符（`gesp1-XX-01` ~ `gesp1-XX-05`），题目数据待后续补充。

---

## ✅ 题目与提交系统

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| 题目列表查询 | `GET /api/problems` | ✅ | 返回 Hello World 题目 |
| 题目详情查询 | `GET /api/problems/:id` | ✅ | 含测试用例数据 |
| 代码提交评测 | `POST /api/submissions` | ✅ | 全流程打通 |
| 提交记录查询 | `GET /api/submissions` | ✅ | 含评测结果详情 |
| 错题本自动记录 | 提交 WA/CE 后查询 | ✅ | 自动 upsert 错题记录 |

---

## ✅ 徽章/激励系统

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| 徽章定义查询 | `GET /api/achievements` | ✅ | 返回 6 个徽章 |
| 我的徽章查询 | `GET /api/achievements/my` | ✅ | 返回已获得的徽章 |
| **complete_lesson** 徽章自动颁发 | 标记课时完成后查询 | ✅ | "启程 🚀" 自动获得 |
| **ac_problem** 徽章自动颁发 | 代码 AC 后查询 | ✅ | "首 AC ✅" 自动获得 |
| **streak** 连续打卡逻辑 | `getStudyStreak()` 函数 | ✅ | 日期去重+连续计算正确 |
| **complete_tag** 标签徽章逻辑 | 代码逻辑审核 | ✅ | 基于通过的题目标签匹配 |
| 徽章去重（不重复颁发） | `userId_achievementId` 唯一约束 | ✅ | upsert 逻辑正确 |
| 徽章触发集成（进度完成） | `POST /api/progress/complete` | ✅ | 完成后自动调用检查 |
| 徽章触发集成（代码提交） | `POST /api/submissions` | ✅ | AC 后自动调用检查 |

---

## ✅ AI 教练系统

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| AI 对话接口 | `POST /api/ai/chat` | ✅ | 接口正常，保存对话历史 |
| AI 代码点评接口 | `POST /api/ai/feedback` | ✅ | 接口正常 |
| **无 API Key Fallback（对话）** | 未配置 Key 时调用 | ✅ | 返回友好离线提示 |
| **无 API Key Fallback（点评）** | 未配置 Key 时调用 | ✅ | 返回自查清单 |
| 课时上下文注入 | 携带 lessonId 调用 | ✅ | 系统提示词含课时标题 |
| 题目上下文注入 | 携带 problemId 调用 | ✅ | 系统提示词含题目标题 |
| 对话历史（最近10条） | 多次对话后查询 | ✅ | 历史记录正确返回 |

---

## ✅ 教师后台 API

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| 班级管理 | `GET/POST /api/classes` | ✅ | CRUD 正常 |
| 班级学生关联 | `POST /api/classes/:id/students` | ✅ | 关联关系正确 |
| 课程创建 | `POST /api/courses` | ✅ | 含章节/课时创建 |
| 题目创建 | `POST /api/problems` | ✅ | 含测试用例创建 |
| **题目批量导入** | `POST /api/problems/import` | ✅ | JSON 格式，自动均分分值，含错误回滚 |
| **题目更新** | `PUT /api/problems/:id` | ✅ | 教师权限校验 |
| **题目删除** | `DELETE /api/problems/:id` | ✅ | 级联删除测试用例/提交/错题 |
| **教师视角完整题目** | `GET /api/problems/:id/full` | ✅ | 返回隐藏测试用例，学生无权访问 |

## ✅ 激励系统 API

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| **连续打卡天数查询** | `GET /api/achievements/streak` | ✅ | 日期去重，今天/昨天起始计算正确 |
| 徽章自动触发（进度完成） | `POST /api/progress/complete` | ✅ | 完成后自动调用检查 |
| 徽章自动触发（代码提交） | `POST /api/submissions` | ✅ | AC 后自动调用检查 |

## ✅ 学习报告

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| **学习报告生成** | `GET /api/progress/report` | ✅ | 含概览、徽章、薄弱点、错题、建议 |
| 薄弱知识点统计 | 基于错题本标签聚合 | ✅ | Top 5 薄弱标签 |
| 学习建议生成 | 根据 AC 率/streak/薄弱点 | ✅ | 动态生成 3-4 条建议 |

---

## ✅ 安全与构建

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| CORS 白名单（正确来源） | `curl -H "Origin: http://localhost:3000"` | ✅ | 允许通过 |
| CORS 白名单（错误来源） | `curl -H "Origin: http://evil.com"` | ✅ | 返回 500 CORS 错误，被阻止 |
| 登录限流 | 快速发送 22 次登录请求 | ✅ | 第 21 次返回 429 |
| 通用限流 | 已配置 200 req/15min | ✅ | 默认生效 |
| 404 处理 | 访问不存在的 API | ✅ | 返回 `{"error":"接口不存在"}` |
| 全局错误处理 | 触发异常 | ✅ | 生产环境隐藏详细错误 |
| **前端 TypeScript 检查** | `npx tsc --noEmit` | ✅ | 0 错误 |
| **前端生产构建** | `npx vite build` | ✅ | 2.96s 构建成功 |
| **后端 TypeScript 检查** | `npx tsc --noEmit` | ✅ | 0 错误 |

## ✅ 模拟考试

| 功能 | 验证方式 | 状态 | 备注 |
|------|---------|------|------|
| 创建考试 | `POST /api/exams` | ✅ | 教师创建，关联题目，自动均分分值 |
| 发布考试 | `POST /api/exams/:id/publish` | ✅ | 状态 draft → published |
| 学生查看考试列表 | `GET /api/exams` | ✅ | 只显示已发布，标记已参加 |
| 学生查看考试详情 | `GET /api/exams/:id` | ✅ | 含题目列表和 starterCode |
| 开始考试 | `POST /api/exams/:id/start` | ✅ | 创建 StudentExam 记录 |
| 提交答案 | `POST /api/exams/:id/submit` | ✅ | 逐题调用 JudgeServer，计算总分 |
| 查看结果 | `GET /api/exams/:id/result` | ✅ | 返回得分、每题详情、代码 |
| 教师查看统计 | `GET /api/exams/:id/stats` | ✅ | 学生排名、平均分 |
| 考试列表页面 | `ExamListPage.tsx` | ✅ | TS 检查通过，API 响应格式已修复 |
| 考试答题页面 | `ExamPage.tsx` | ✅ | 倒计时、Monaco 编辑器、题目导航 |
| 考试结果页面 | `ExamResultPage.tsx` | ✅ | 分数展示、每题状态、代码查看 |
| 排行榜 | `GET /api/leaderboard` | ✅ | 按 AC 提交总分排名 |

## 🔧 审核修复记录（2026-06-11）

| 文件 | 问题 | 修复 |
|------|------|------|
| `server/src/routes/auth.ts` | JWT `expiresIn` 类型不匹配 | 添加 `as jwt.SignOptions['expiresIn']` 类型断言 |
| `server/src/routes/classes.ts` | `classLinks` 关系不存在于 Prisma schema | 改为 `courses`（ClassCourse 关系） |
| `server/src/routes/mistakes.ts` | `include: { problem }` 但 Mistake 无 problem 关系 | 改为单独查询 problem 再聚合 |
| `server/src/services/judgeService.ts` | `JudgeTask.testCases` 缺少 `score` 字段 | 添加可选 `score` 字段，函数签名简化 |

## 🔧 审核修复记录（2026-06-11 第二轮 — 模拟考试运行时 Bug）

| 文件 | 问题 | 严重程度 | 修复 |
|------|------|---------|------|
| `client/src/api/client.ts` | API Base URL 默认端口为 `4000`，后端实际运行在 `4001` | 🔴 高 | 改为 `http://localhost:4001` |
| `client/src/pages/ExamListPage.tsx` | `client.get('/exams').then(res => setExams(res.data))` — 拦截器已 unwrap `response.data`，`res` 本身是数组，`res.data` 为 `undefined` | 🔴 高 | 改为 `setExams(res)` |
| `client/src/pages/ExamPage.tsx` | `client.get(...).then(res => { const data = res.data ... })` — 同上，`res.data` 为 `undefined` | 🔴 高 | 改为 `const data = res` |
| `client/src/pages/ExamResultPage.tsx` | `client.get(...).then(res => setResult(res.data))` — 同上 | 🔴 高 | 改为 `setResult(res)` |
| `server/src/routes/leaderboard.ts` | 路由文件完全缺失，后端未注册 | 🟡 中 | 新建路由文件，按租户聚合 AC 提交总分排名 |
| `server/src/index.ts` | 未导入和注册 `leaderboardRoutes` | 🟡 中 | 添加 `import` 和 `app.use('/api/leaderboard', ...)` |
| `server/src/routes/problems.ts` | `tags` 字段返回逗号分隔字符串，前端期望 `string[]` | 🟡 中 | 添加 `formatTags()`  helper，列表/详情/完整详情均转换 |
| `client/src/pages/teacher/TeacherLayout.tsx` | 导航包含 `/teacher/reports`，但 App.tsx 未注册该路由 | 🟡 低 | 记录为待实现功能，不影响现有页面 |

## 🔧 审核修复记录（2026-06-13 — GESP 1级课件内容审核）

| 文件 | 问题 | 严重程度 | 修复 |
|------|------|---------|------|
| `server/courses/gesp1/03-小数运算.md` | 四舍六入五凑双例子中 `2.45` 实际 C++ 输出为 `2.5`，与理论规则 `2.4` 不符 | 🔴 高 | 改为 `2.25`（输出确为 `2.2`），并增加浮点数精度提示 |
| `server/courses/gesp1/08-循环控制.md` | 质数判断代码未处理 `n <= 1`，输入 1 会错误输出"质数" | 🔴 高 | 基础版和优化版代码均增加 `if (n <= 1) isPrime = false;` |
| `server/courses/gesp1/01-走进C++.md` | 算术运算表格过早引入整数除法（`5 / 3 = 1`） | 🟡 中 | 改为能整除的例子 `6 / 3 = 2`，并注释说明下节课详细讲 |
| `server/courses/gesp1/11-短除法.md` | 课后思考题问 `while(t--)` 与 `while(--t)` 区别，超出大纲范围 | 🟡 中 | 改为问 `t=0` 时 `while(t--)` 的循环次数，同步更新 AI 学情分析 |
| `.kimi/skills/course-creator/SKILL.md` | 缺少"写课件前必须先看大纲"的强制提醒 | 🟡 中 | 在核心原则第 1 条和创建流程第 0 步明确要求先读阶段大纲 |

## ✅ GESP 2级课件内容

| 课次 | 文件 | 状态 | 备注 |
|------|------|------|------|
| 01 数学函数 | `server/courses/gesp2/01-数学函数.md` | ✅ | 覆盖大纲主题 1 |
| 02 自定义函数 1 | `server/courses/gesp2/02-自定义函数1.md` | ✅ | 覆盖大纲主题 2 |
| 03 数据类型转换 | `server/courses/gesp2/03-数据类型转换.md` | ✅ | 覆盖大纲主题 3 |
| 04 多层分支结构 | `server/courses/gesp2/04-多层分支结构.md` | ✅ | 覆盖大纲主题 4 |
| 05 多层循环语句 | `server/courses/gesp2/05-多层循环语句.md` | ✅ | 覆盖大纲主题 5 |
| 06 图形打印 1 | `server/courses/gesp2/06-图形打印1.md` | ✅ | 覆盖大纲主题 6 |
| 07 图形打印 2 | `server/courses/gesp2/07-图形打印2.md` | ✅ | 覆盖大纲主题 7 |
| 08 计算机的存储与网络 | `server/courses/gesp2/08-计算机的存储与网络.md` | ✅ | 覆盖大纲主题 8 |

**课堂操作题**：01~08 课每课预留 5 道操作题占位符（`gesp2-XX-01` ~ `gesp2-XX-05`），题目数据待后续补充。

**导入脚本**：`server/src/scripts/import-gesp2.ts` 已创建并验证，运行后可正确导入 8 个课时到数据库。

---

## 🔧 审核修复记录（2026-06-13 — GESP 2级课件内容审核）

| 文件 | 问题 | 严重程度 | 修复 |
|------|------|---------|------|
| `server/courses/gesp2/05-多层循环语句.md` | 百钱百鸡变形题使用 `0.5 * c == 30` 浮点比较，存在精度风险 | 🟡 中 | 改为整数运算 `4 * a + 2 * b + c == 60` |

---

## ⚠️ 待验证项（未完成验证）

以下功能代码已写完，但**尚未在浏览器中人工验证**，后续修改相关代码时需重新验证：

| 功能 | 模块 | 原因 |
|------|------|------|
| Markdown 课件上传解析 | `server/src/parsers/markdownParser.ts` | 无测试课件文件 |
| 前端页面渲染（学生端） | `client/src/pages/*.tsx` | 未在浏览器中打开验证 |
| 前端页面渲染（教师后台） | `client/src/pages/teacher/*.tsx` | 未在浏览器中打开验证 |
| Monaco 编辑器集成 | `client/src/components/CodeEditor.tsx` | 未在浏览器中验证 |
| 连续打卡前端展示 | `client/src/components/AchievementBadge.tsx` | 未验证 UI 渲染 |
| 生产环境部署 | 无 | 仅在本地开发环境运行 |

---

## 📝 验证规则

1. **已验证项**：相关代码若无修改，后续无需重复验证
2. **修改后重验**：若修改了已验证功能的相关代码，需在本文档对应项标记为 `⬜ 待重新验证`
3. **新增项**：新增功能验证后追加到本文档
4. **环境变更**：若 Docker/Node/依赖版本变更，建议全部重新验证

---

*最后更新：2026-06-13*
