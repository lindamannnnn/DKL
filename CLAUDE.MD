# CLAUDE.MD — DKL 项目说明

> 本文档面向 AI 开发助手（Claude / Kimi / GPT 等），说明项目背景、架构、当前进度和下一步任务。

---

## 一、项目简介

**DKL**（暂定名）是一个面向 **4-6 年级小学生** 的 **AI 辅助 C++ 信奥学习平台**。

### 核心定位
- **目标用户**：想在家自学 C++ 的小学生 + C++ 教学能力弱的机构/个人
- **课程方向**：对标 **GESP C++ 1-8 级**（CCF 编程能力等级认证）
- **产品形态**：严肃的竞赛学习平台，不游戏化，但 UI 对低龄友好
- **内容驱动**：用户上传 **Markdown 课件**，平台自动解析为互动课件
- **部署模式**：SaaS 云端托管，注册即用，多租户隔离

### 产品公式
> 平台 = Markdown 课件渲染引擎 + 在线代码编辑器 + JudgeServer 判题 + AI 竞赛教练

### 最近更新（2026-07-20）
- **GESP1 内容冻结**：01-18 课结构统一为「普通课 2+5 / 练习课 5+5」，不再修改课件知识体系。
- **GESP2 内容冻结（2026-07-20）**：16 课全部完成（含新增第 13 课「循环模拟与易错点专项」、L05 枚举去重），课后题修复与难度排序完成，双智能体测评 P0=0、真题 5 套闭卷验证通过；`server/courses/gesp2/` 源文件已与数据库同步定版，不再修改课件知识体系。
- **评估体系**：评估准则 v1（`docs/agents/evaluation-rubric-v1.md`）+ GESP1 毕业知识基线（`docs/agents/gesp1-graduate-knowledge-baseline.md`）已建立，GESP3 及以上测评可直接复用。
- **GESP3 准备**：`标准教案/GESP03/` 已就位，下一步按微课格式开发。
- 详细改动见 `CHANGELOG.md`。

---

## 二、技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Tailwind CSS + Vite + Monaco Editor |
| 后端 | Node.js + Express + Prisma ORM + PostgreSQL |
| 缓存/队列 | Redis |
| 判题沙箱 | JudgeServer (Docker) — QDUOJ 开源判题核心 |
| AI | 大模型 API（OpenAI / DeepSeek / Claude） |
| 部署 | Docker Compose（开发）/ 云端 SaaS（生产） |

---

## 三、项目目录结构

```
DKL/
├── docker-compose.yml          # PG + Redis + JudgeServer
├── plan.md                     # 完整产品方案
├── DEV_PLAN.md                 # 开发执行计划（7个Phase）
├── CLAUDE.MD                   # 本文档
│
├── server/                     # 后端服务
│   ├── src/
│   │   ├── index.ts            # Express 入口
│   │   ├── routes/             # API 路由
│   │   │   ├── auth.ts         # 认证（注册/登录/JWT）
│   │   │   ├── courses.ts      # 课程 CRUD
│   │   │   ├── lessons.ts      # 课时/进度
│   │   │   ├── problems.ts     # 题目 CRUD
│   │   │   ├── submissions.ts  # 提交/评测
│   │   │   ├── ai.ts           # AI 教练对话
│   │   │   ├── classes.ts      # 班级管理
│   │   │   ├── progress.ts     # 学习进度
│   │   │   ├── achievements.ts # 成就/徽章
│   │   │   └── mistakes.ts     # 错题本
│   │   ├── services/
│   │   │   ├── judgeService.ts # JudgeServer 调用封装（JSON API）
│   │   │   └── errorRules.ts   # 编译错误规则引擎
│   │   ├── parsers/
│   │   │   └── markdownParser.ts # Markdown 课件解析器
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT 认证中间件
│   │   │   └── tenant.ts       # 多租户中间件
│   │   └── utils/
│   │       └── prisma.ts       # Prisma 客户端单例
│   ├── prisma/
│   │   ├── schema.prisma       # 数据库模型（13张表）
│   │   ├── migrations/         # PostgreSQL 迁移文件
│   │   └── seed.ts             # 初始数据（徽章/演示课程/测试用户）
│   ├── .env                    # 环境变量（含 AI Key）
│   ├── .env.example            # 环境变量模板
│   ├── package.json
│   └── tsconfig.json
│
└── client/                     # 前端（学生端+教师后台合一）
    ├── src/
    │   ├── App.tsx             # 路由配置（React Router）
    │   ├── main.tsx            # 入口
    │   ├── index.css           # Tailwind + 全局样式
    │   ├── pages/              # 页面
    │   │   ├── LoginPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── CourseHallPage.tsx
    │   │   ├── CourseDetailPage.tsx
    │   │   ├── LessonPage.tsx
    │   │   ├── ProblemPage.tsx
    │   │   ├── SubmissionResultPage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── ExamListPage.tsx      # 考试列表（新版卡片布局）
    │   │   ├── ExamPage.tsx          # 考试答题（倒计时+Monaco）
    │   │   ├── ExamResultPage.tsx    # 考试结果
    │   │   ├── MistakesPage.tsx
    │   │   ├── AchievementsPage.tsx
    │   │   └── teacher/        # 教师后台页面
    │   │       ├── TeacherLayout.tsx
    │   │       ├── TeacherCoursesPage.tsx
    │   │       ├── CourseImportPage.tsx
    │   │       ├── TeacherProblemsPage.tsx
    │   │       ├── ProblemEditPage.tsx
    │   │       ├── TeacherClassesPage.tsx
    │   │       ├── ClassDetailPage.tsx
    │   │       └── TeacherReportsPage.tsx
    │   ├── components/         # 可复用组件
    │   │   ├── Layout.tsx      # 布局（导航栏+内容区）
    │   │   ├── LessonContent.tsx    # 课件内容渲染
    │   │   ├── CodeBlock.tsx        # 可运行代码块
    │   │   ├── QuizBlock.tsx        # 互动题组件
    │   │   ├── CodeEditor.tsx       # Monaco 编辑器包装
    │   │   ├── ProblemDescription.tsx
    │   │   ├── SubmitPanel.tsx
    │   │   ├── AICoachPanel.tsx     # AI 教练侧边栏
    │   │   ├── AchievementBadge.tsx # 徽章组件
    │   │   └── ProgressBar.tsx      # 进度条
    │   ├── stores/
    │   │   ├── authStore.ts    # Zustand 认证状态
    │   │   ├── courseStore.ts  # 课程状态
    │   │   └── problemStore.ts # 题目/提交状态
    │   └── api/
    │       └── client.ts       # Axios 客户端（统一baseURL/token）
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── tsconfig.json
    └── package.json
```

---

## 四、数据库模型（16张表 + 关系表）

```
Tenant          -- 多租户（机构）
User            -- 用户（学生/教师/管理员）
Class           -- 班级
ClassStudent    -- 班级学生关系
ClassCourse     -- 班级课程关联
Course          -- 课程
Chapter         -- 章节
Lesson          -- 课时（content字段存解析后的JSON）
Problem         -- 编程题
TestCase        -- 测试用例（含分值score字段，支持IOI赛制）
Submission      -- 提交记录（含score字段）
LearningProgress-- 课时学习进度
AIConversation  -- AI对话历史
FeedbackReport  -- 学习报告
Achievement     -- 徽章定义
UserAchievement -- 用户获得的徽章
Mistake         -- 错题本
Exam            -- 模拟考试
ExamProblem     -- 考试题目关联（含分值）
StudentExam     -- 学生考试记录（答案/结果/分数）
```

所有业务表含 `tenant_id` 字段，实现多租户隔离。

---

## 五、关键设计决策

### 1. 课件系统
- 用户按规范写 Markdown，上传后自动解析为结构化 JSON
- 支持标记：`<!-- run -->`（可运行代码）、`<!-- quiz: choice -->`（选择题）、`<!-- problem: id -->`（关联编程题）
- 解析器：`server/src/parsers/markdownParser.ts`

### 2. 评测系统（IOI 赛制）
- JudgeServer **原生支持**部分分制：通过 `test_case` 参数传入每个测试点，返回每个测试点结果
- `judgeService.ts` 内置 C++ 语言配置（g++ -std=c++14），自动处理编译运行
- 返回 `score` + `details` 数组（每个测试点：Accepted/Wrong Answer/TLE/MLE/RE）
- **重要**：JudgeServer 的 `TOKEN` 需要先 SHA256 哈希后再通过 `X-Judge-Server-Token` Header 发送
- **重要**：JudgeServer 镜像的 `/log` 目录默认不存在，需在 entrypoint 中 `mkdir -p /log`

### 3. AI 教练策略
- **编译错误**：规则引擎匹配（快、准、稳定），预设 15+ 常见错误模式
- **答案错误/答疑**：AI 大模型分析（结合课时/题目上下文）
- 提示词原则：绝不说教、用比喻短句、每次不超过3句话、学生沮丧立刻鼓励

### 4. 前端合一
- 学生端和教师后台是**同一个前端项目**，通过路由区分：
  - `/student/*` — 学生端
  - `/teacher/*` — 教师后台
- 共用组件库和 API 客户端

### 5. 题库来源
- **JudgeServer 本身不带任何题目**
- 平台自建题库管理系统
- 用户提供课件时配套题目
- GESP 官网有公开真题 PDF（需手动录入）
- 无完全免费的批量导入题库

---

## 六、开发进度

### 当前状态（截至 2026-06-12）

| Phase | 进度 | 说明 |
|-------|------|------|
| **Phase 1: 基础设施** | ✅ 100% | Docker Compose、Prisma Schema、PostgreSQL 迁移、Seed 数据、环境变量、CORS、API限流、安全头全部完成 |
| **Phase 2: 后端 API** | ✅ 100% | 12 个路由模块全部完成（auth/courses/lessons/problems/submissions/classes/progress/achievements/mistakes/ai/exams/leaderboard） |
| **Phase 3: 前端页面** | ✅ 98% | 学生端全部页面 + 教师后台全部页面已完成；课件分页式展示、互动题、代码块运行、滚动回顶部均已完成；课程大厅/考试列表视觉升级，TypeScript 检查通过，生产构建成功 |
| **Phase 4: 评测对接** | ✅ 100% | JudgeServer JSON API 对接完成，C++ 编译运行测试通过，IOI 部分分制支持 |
| **Phase 5: AI 教练** | 🟡 75% | `/ai/chat` 和 `/ai/feedback` 已接入 AI 教师 Skill 系统提示词；提交代码错误后自动调用 AI 分析并保存到 `aiFeedback`；待接入大模型 API Key 验证真实效果 |
| **Phase 6: 激励系统** | ✅ 100% | 徽章自动颁发与前端展示完成；经验值/等级/连续学习系统完成；完成课时/通过题目即时庆祝动画完成 |
| **Phase 8: 模拟考试** | ✅ 100% | 考试创建/发布/答题/提交/评分/统计全流程完成，含前端页面（已通过端到端 API 测试） |
| **Phase 7: 题库+测试** | 🟡 60% | 已全量导入东方博宜 OJ 1-1042 题，按 GESP 1-8 级分级并标注分类 tags；题目详情页排版重构完成；题库浏览改为等级 → 分类层级结构；测试用例已随导入脚本一并建立 |

### 已完成的文件

```
✅ docker-compose.yml（含 JudgeServer /log 修复）
✅ server/.env / .env.example
✅ server/prisma/schema.prisma（16张表）
✅ server/prisma/migrations/（PostgreSQL 迁移）
✅ server/prisma/seed.ts（含正确 bcrypt 密码哈希）
✅ server/src/index.ts（Express入口）
✅ server/src/utils/prisma.ts
✅ server/src/middleware/auth.ts（JWT认证）
✅ server/src/middleware/tenant.ts（多租户）
✅ server/src/parsers/markdownParser.ts（课件解析）
✅ server/src/services/judgeService.ts（JudgeServer JSON API 封装）
✅ server/src/services/errorRules.ts（编译错误规则引擎）
✅ server/src/routes/*.ts（12个API路由全部完成）
✅ client/src/App.tsx（路由配置）
✅ client/src/api/client.ts
✅ client/src/stores/*.ts
✅ client/src/pages/*.tsx（学生端全部页面，含新版 CourseHallPage / ExamListPage）
✅ client/src/pages/teacher/*.tsx（教师后台全部页面）
✅ client/src/components/*.tsx（核心组件全部完成）
✅ client/tailwind.config.js（扩展 accent 颜色 / 动画 / 发光阴影）
✅ client/src/index.css（新增毛玻璃卡片 / 渐变徽章 / 封面渐变色 / Hero 背景 / 分页课件样式）
✅ server/courses/gesp1/（GESP 1级课件目录：README + 01-走进C++ + 02-整数运算 + problem-placeholders）
✅ server/src/scripts/import-gesp1.ts（GESP 1级课件导入脚本）
✅ server/src/parsers/markdownParser.ts（新增 parseLessonPages 分页解析）
✅ client/src/pages/LessonPage.tsx（分页式课件展示，含互动题、代码运行、滚动回顶部）
✅ client/src/components/ErrorBoundary.tsx（全局错误边界，避免白屏）
✅ client/src/components/ProblemStatement.tsx（题目详情分块渲染组件）
✅ client/src/pages/ProblemListPage.tsx（题库等级入口页）
✅ client/src/pages/ProblemLevelPage.tsx（等级详情页：侧边栏分类 + 右侧题目列表）
✅ server/src/scripts/reimport-dongfangboyi.ts（东方博宜 1042 题全量导入脚本）
✅ .kimi/skills/course-creator/SKILL.md（课件创建 Skill）
✅ .kimi/skills/ai-teacher/SKILL.md（AI 教师 Skill：行为边界、系统提示词、场景话术模板）
✅ server/src/services/aiFeedbackService.ts（AI 反馈服务，供 ai.ts 和 submissions.ts 复用）
```

### 待完成的文件/功能

```
⬜ 接入 AI 大模型 API Key（DEEPSEEK_API_KEY / OPENAI_API_KEY）并验证真实 AI 效果
⬜ 继续补充除东方博宜外的其他来源题库（GESP 真题等）
⬜ 为课件中的占位编程题绑定真实题目 ID
⬜ 考试提交错误后是否也需要 AI 自动分析（当前仅练习提交接入）
⬜ 教师后台题目录入页面交互优化
⬜ 用户上传 Markdown 课件并解析（当前靠脚本导入）
⬜ 生产环境部署（云端 SaaS）
⬜ 集成测试（E2E）
```

---

## 七、下一步任务（按优先级）

### 当前最优先（P0）

1. **配置 AI API Key**
   - 在 `server/.env` 中添加 `DEEPSEEK_API_KEY` 或 `OPENAI_API_KEY`
   - 验证 AI 对话接口正常工作

2. **录入 GESP 题库**
   - GESP 1级：基础语法（变量、输入输出、条件、循环）
   - GESP 2级：数组、字符串、函数
   - GESP 3-4级：结构体、指针、文件操作
   - GESP 5-8级：算法（贪心、DP、图论等）
   - 每道题含：题目描述、输入输出说明、2-10 个测试用例（含分值）

3. **准备 Markdown 课件**
   - ✅ GESP 1级第 1-12 课儿童版微课已完成并导入数据库
   - 继续编写 GESP 2级第 1-8 课儿童版微课
   - 将课件中的占位编程题替换为带测试用例的真实题目

### 接下来（P1）

4. **完善前端交互**：连续打卡展示、学习报告页面、错题本复习模式
5. **教师后台优化**：批量导入题目（CSV/JSON）、班级学习报告导出
6. **安全加固**：API 限流、输入校验、CORS 配置

### 最后（P2）

7. **生产部署**：云服务器部署、域名配置、HTTPS、监控告警

---

## 八、环境要求

### 开发环境
- Node.js 18+
- Docker + Docker Compose
- Git
- Windows 11 + WSL2（当前开发环境）

### 启动命令（开发）
```bash
# 1. 启动基础设施
docker compose up -d

# 2. 后端
cd server
npm install
npx prisma migrate dev
npx prisma db seed
npx tsx src/index.ts

# 3. 前端
cd client
npm install
npx vite --port 3000 --host 0.0.0.0
```

### 端口
| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 | `http://localhost:3000` | Vite dev server |
| 后端 API | `http://localhost:4001` | Express（原4000端口冲突，已改为4001） |
| JudgeServer | `http://localhost:8080` | 判题沙箱 |
| PostgreSQL | `localhost:5432` | 数据库 |
| Redis | `localhost:6379` | 缓存 |

### 默认测试账号
| 角色 | 邮箱 | 密码 |
|------|------|------|
| 学生 | `student@dkl.local` | `123456` |
| 教师 | `teacher@dkl.local` | `teacher123` |
| 管理员 | `admin@dkl.local` | `admin123` |

---

## 九、重要注意事项

### JudgeServer 已知问题
1. **Token 哈希**：环境变量 `TOKEN` 的值需要先 SHA256 哈希，JudgeServer 内部做了 `hashlib.sha256(token.encode()).hexdigest()`
2. **`/log` 目录**：`qingdaou/judge_server:latest` 镜像没有预创建 `/log` 目录，需在 docker-compose 的 `entrypoint` 中 `mkdir -p /log`
3. **`privileged: true`**：JudgeServer 容器需要特权模式才能创建沙箱运行用户代码
4. **语言配置**：C++ 配置使用 `g++ -std=c++14 -O2`，`seccomp_rule` 为 `c_cpp`

### 开发注意事项
1. **端口占用**：Windows 上旧的 node 进程可能残留占用 4001/3000 端口，需用 `taskkill` 或 `Stop-Process` 强制杀掉
2. **多租户**：所有 API 必须通过 `X-Tenant-Id` Header 或 JWT 中的 tenantId 隔离数据
3. **AI 准确性**：编译错误优先用规则引擎，不依赖 AI 实时分析，避免误导学生
4. **小学生 UX**：大字号（18px+）、简洁UI、即时反馈、AI主动介入
5. **数据合规**：涉及未成年人，需考虑隐私保护和数据安全

---

## 十、相关文档

- `plan.md` — 完整产品方案（需求、架构、流程）
- `DEV_PLAN.md` — 开发执行计划（7个Phase详细任务）
- `CHANGELOG.md` — 近期开发日志与改动清单
- `CONTEXT.md` — 会话切换用上下文摘要
- `CLAUDE.MD` — 本文档（项目说明+进度+下一步）
- `server/courses/MICRO_LESSON_FORMAT.md` — 微课格式规范
- `docs/AI_MAP_PROMPTS.md` — 地图背景 AI 生成 prompt
- `docs/agents/elementary-student-persona.md` — 零基础小学生体验官人设

---

---

## 十一、今日工作记录（2026-06-11）

### 1. 后端运行时 Bug 修复（代码审核）

| Bug | 文件 | 修复 |
|-----|------|------|
| API Base URL 端口错误（4000→4001） | `client/src/api/client.ts` | 改为 `http://localhost:4001` |
| Axios 拦截器已 unwrap response，但考试页面仍用 `res.data` | `ExamListPage.tsx` / `ExamPage.tsx` / `ExamResultPage.tsx` | 全部改为直接用 `res` |
| Leaderboard 路由完全缺失 | 新建 `server/src/routes/leaderboard.ts` | 按租户聚合 AC 提交总分排名 |
| tags 返回逗号分隔字符串，前端期望数组 | `server/src/routes/problems.ts` | 添加 `formatTags()` helper，列表/详情/完整详情均转换 |
| 登录页租户ID字段暴露 UUID | `LoginPage.tsx` / `RegisterPage.tsx` | 移除输入框，后台自动填入 UUID |

### 2. 前端排版升级（参考 ACWing 活动页 + 模板1.html）

**扩展 Tailwind 配置** (`tailwind.config.js`)
- 新增 8 种 `accent` 强调色（金/红/蓝/青/紫/绿/橙/粉）
- 新增 3 组自定义动画：`fade-in-up`、`scale-in`、`float`
- 新增 4 种发光阴影：`glow-gold`、`glow-blue`、`glow-green`、`card-hover`

**更新全局 CSS** (`index.css`)
- `.card-glass` — 毛玻璃效果卡片
- `.badge-gradient-*` — 6 种渐变徽章（金/红/蓝/绿/紫/灰）
- `.cover-gesp-*` — 8 种 GESP 级别封面渐变色
- `.hero-gradient` — Hero 区域渐变背景
- `.animate-delay-*` — 动画延迟工具类

**重写 CourseHallPage.tsx**
- Hero 区域：深蓝渐变背景 + 欢迎语 + 3 个毛玻璃统计卡片
- 课程卡片：顶部彩色封面色块（根据 GESP 级别分配不同渐变）+ 标题 + 描述 + 级别徽章 + 章节/课时数
- 滚动触发 IntersectionObserver 渐入上移动画，带 stagger delay
- Hover 效果：上浮 + 阴影增强

**重写 ExamListPage.tsx**
- 页面标题区：蓝色标签线 + 描述 + 渐变创建按钮
- 考试卡片：顶部彩虹渐变条 + 结构化信息布局
- 状态徽章：`去考试`(紫) / `进行中`(蓝) / `{分数}分`(绿) / `草稿`(灰)
- 信息 pill：时长 + 总分 + 题目数 + GESP 级别标签
- 同课程大厅的滚动渐入动画

### 3. 构建验证
- 前端 TS 检查：`0 errors`
- 前端 Vite 构建：`✓ built in 4.77s`
- 后端 TS 检查：`0 errors`
- 端到端 API 测试：全部通过

---

## 十三、今日工作记录（2026-06-13）

### 1. 创建并落地 AI 教师 Skill

**新建文件**
- `.kimi/skills/ai-teacher/SKILL.md` — AI 教师完整行为规范

**核心内容**
- 角色定位：小学 4-6 年级 C++ 信奥教练，引导者而非答案提供者
- 三大铁律：
  1. 只给思路、指出错误，绝不直接给答案/完整代码
  2. 只回答与当前课程/题目相关的问题，拒绝闲聊和课堂外问题
  3. 先指出错误，再用提问引导学生自己修正
- 语气要求：风趣幽默、有情感、会鼓励学生，多用 emoji 和比喻
- 系统提示词：聊天场景 + 代码批改场景，可直接复制到后端代码
- 场景话术模板：学生问答案、编译错误、答案错误、闲聊、代码批改、沮丧、超纲等
- 测试清单 + 禁忌清单

### 2. 将 Skill 提示词接入后端 AI 接口

**修改 `server/src/routes/ai.ts`**
- `/ai/chat`：系统提示词替换为 AI 教师 Skill「聊天场景系统提示词」
- `/ai/chat`：注入课时/题目上下文，限制回答范围不超出当前学习内容
- `/ai/feedback`：系统提示词替换为 Skill「代码批改场景系统提示词」
- 无 API Key 时的 fallback 回复风格统一为 AI 老师口吻

### 3. 抽象可复用的 AI 反馈服务

**新建 `server/src/services/aiFeedbackService.ts`**
- 统一封装 `generateAIFeedback(input)`
- 输入：题目名称、代码、评测结果、编译错误、测试点详情
- 输出：引导式点评字符串（无 Key 时返回 null）
- 被 `ai.ts` 和 `submissions.ts` 共同调用，避免重复代码

### 4. 提交代码错误后自动调用 AI 分析

**修改 `server/src/routes/submissions.ts`**
- 学生提交代码后，如果结果不是 `accepted`
- 自动调用 `generateAIFeedback()` 生成 AI 老师点评
- 将点评存入 `submission.aiFeedback` 字段
- 保留原有编译错误规则引擎作为无 API Key 时的 fallback

**修改 `client/src/pages/ProblemPage.tsx`**
- 在结果面板中展示 `sub.aiFeedback`
- 样式：浅蓝色背景卡片 + "🤖 AI 老师说" 标题
- 支持多行文本和 emoji 显示

### 5. 构建验证

- 前端 TS 检查：`0 errors`
- 后端 TS 检查：`0 errors`
- 前端 Vite 构建：`✓ built`

---

## 十四、AI 教师提示词审查与事实准确性加固（2026-06-13 晚）

### 1. 发现的问题

接入 Kimi API 实测后发现，AI 教师在以下场景容易出现事实性错误：

| 问题 | 示例 | 风险 |
|------|------|------|
| cin/cout 操作符方向说反 | "cin 用 << 读取输入" | 直接教错学生 |
| 直接给出完整修改代码 | "改成 cin >> a >> b;" | 违反"不给答案"原则 |
| 编造语法规则 | 对不确定的错误胡乱解释 | 误导学生 |
| 回答超纲 | 第一节课就讲数组、函数 | 学生还没学到，造成混乱 |
| 回复过长 | 完全正确场景说 5 句以上 | 小学生读不下去 |

### 2. 加固措施

**重写系统提示词**
- 新增"事实准确性 - 最高优先级"章节
- 明确列出 AI 可以讲解的核心知识点白名单，要求严格按此描述
- 新增"不确定就承认"机制："这个问题老师要先确认一下，你可以先看看课件上的相关部分，或者问一下真人老师。"
- 新增"绝不超纲"机制：只能讲解当前课时/题目涉及的知识点，超纲问题要温和拒绝
- 新增 Few-shot 示例，展示正确/错误回答
- 新增"绝对禁止"清单：禁止说反操作符、禁止编造、禁止模糊词、禁止列步骤清单、禁止超纲

**代码批改流程优化**
- 编译错误优先使用规则引擎的确定事实
- `aiFeedbackService` 新增 `ruleFeedback` 字段，让 LLM 基于已确认事实组织语言
- `aiFeedbackService` 新增 `lessonTitle` 字段，限制 AI 不超纲讲解
- 规则引擎只把错误原因（message）传给 LLM，修复建议（hint）不直接给 LLM，避免 LLM 直接复述完整修复代码

**模型与温度调整**
- 默认模型：`moonshot-v1-8k`（快、便宜、够用）
- 批改温度降到 `0.3`，降低胡说概率
- 聊天温度保持 `0.7`，保持一定灵活性

### 3. 新增 AI 知识库（事实准确性兜底）

仅靠提示词无法完全阻止 LLM 在简单语法问题上胡说。因此新增 `server/src/services/aiKnowledgeBase.ts`：

- 预置常见 C++ 语法问题的标准答案
- `/ai/chat` 先查知识库，命中直接返回，**不调用 LLM**
- 未命中再走 LLM + 严格系统提示词

当前覆盖：cin/cout 操作符、头文件、分号、变量声明、main 函数、整数除法、取余、命名空间等。

### 4. 测试验证

新增回归测试脚本：
- `server/src/scripts/test-kimi-api.ts`：API 连通性测试
- `server/src/scripts/test-ai-strict.ts`：事实准确性 / 不给完整代码 / 长度控制测试

端到端测试结果：
- cin/cout 操作符方向：✅ 100% 准确（走知识库）
- 头文件/变量声明等基础错误：✅ 解释准确
- 不再给出完整题解代码：✅ 仅指出错误方向
- AC 代码反馈长度：✅ 控制在 3-4 句
- 开放性问题：✅ 引导式回答，不直接给答案

### 5. 课时上下文打通

- 课时页面链接编程题时 URL 带 `?lessonId=xxx`
- 编程题页面读取 `lessonId` 并随 `/submissions` 提交
- `/ai/chat` 接收 `lessonId`，注入课时标题限制回答范围
- `/ai/feedback` 通过 `lessonTitle` 限制 AI 只讲当前课时知识点

### 6. 仍存在的局限

- LLM 在代码批改中偶尔仍会说出"应该使用 >>"等片段式修改提示，但已不再写出完整代码行
- 对于复杂编译错误，仍建议学生查看课件或问真人老师，避免 AI 强行解释
- 知识库目前不感知课时范围，后续可加上课时知识点标签做更精准过滤

### 6. 更新文件

- `.kimi/skills/ai-teacher/SKILL.md`
- `server/src/routes/ai.ts`
- `server/src/services/aiFeedbackService.ts`
- `server/src/services/aiKnowledgeBase.ts`（新增）
- `server/src/routes/submissions.ts`
- `client/src/pages/LessonPage.tsx`
- `client/src/pages/ProblemPage.tsx`

---

*最后更新：2026-06-13*

---

## 十二、今日工作记录（2026-06-12）

### 1. GESP 1级课件内容创建与导入

**新建目录和文件**
- `server/courses/gesp1/README.md` — 课件使用/导入说明
- `server/courses/gesp1/01-走进C++.md` — 第1课：计算机基础、Dev-C++、Hello World、cout/cin
- `server/courses/gesp1/02-整数运算.md` — 第2课：变量、int、算术运算、数字拆位
- `server/courses/gesp1/problem-placeholders.md` — 14课共70道编程题占位规划

**课件设计原则（面向小学 4-6 年级）**
- 故事化开场、多用 emoji 和比喻
- 一页一个知识点（`## ` 二级标题分页）
- 每个知识点配 2-3 个可运行代码示例
- 每页末尾加选择题/填空题/小挑战
- 代码块加 `<!-- run -->` 标记支持在线运行

**导入脚本**
- 新建 `server/src/scripts/import-gesp1.ts`
- 清理旧课程数据，按文件创建课程/章节/课时
- 运行：`npx tsx src/scripts/import-gesp1.ts`

### 2. 课件分页式展示

**后端**
- `server/src/parsers/markdownParser.ts` 新增 `parseLessonPages()`
- 按 `## ` 标题拆分页面，移除标题重复显示
- `server/src/routes/lessons.ts` 返回 `pages` 数组

**前端**
- 重写 `client/src/pages/LessonPage.tsx`
- 一页一页展示，顶部进度条 + `第 X / 共 Y 页`
- 底部上一页/下一页 + 页面圆点导航
- 最后一页显示"下一课"或"完成学习"

### 3. 课件互动组件增强

- **选择题**：点击选项即时判断对错，显示正确答案
- **填空题**：输入答案后检查正确性
- **Hint 提示**：可折叠的"点我看提示"蓝框
- **Coach-tip**："老师小贴士"橙框
- **代码块**：顶部"红绿灯"装饰 + "运行代码"按钮

### 4. 格式与样式修复

- `client/src/index.css` 新增 `.lesson-content-paged` 专用样式
- 表格 `table-layout: fixed`，列宽固定，对齐整齐
- 代码块样式更像 IDE
- 练习题卡片圆角大卡片设计

### 5. Bug 修复

| 问题 | 原因 | 修复 |
|------|------|------|
| 进入课件白屏 | `useEffect` 写在条件 `return` 之后，Hook 数量不一致 | 把所有 Hook 移到组件顶部 |
| 页面空白只有标题 | 前端过滤掉了包含 `## ` 的第一个 markdown 块 | 后端 `parseLessonPages` 生成页面时移除标题 |
| 选择题选项挤在一行点不到 | markdown 里选项写在同一行 | 所有选项改为每行一个 |
| 选项里显示反引号 | 选项文本原样显示 | 用 `InlineMarkdown` 组件渲染选项 |
| 点击下一页不回到顶部 | 没有滚动逻辑 | 加 `useEffect` 监听 `currentPage`，滚动 window 和内容区到顶部 |

### 6. 新增 Skill 和错误边界

- 创建 `.kimi/skills/course-creator/SKILL.md`
  - 课件 Markdown 格式规范
  - 创建→导入→验证完整流程
  - 常见问题排查手册
- 新建 `client/src/components/ErrorBoundary.tsx`
  - 捕获 React 错误，避免白屏
  - 在 `App.tsx` 中包裹整个应用

### 7. 内容审核与修复

对 GESP 1级两份课件进行全面审核，修复以下问题：

| 问题 | 文件 | 修复 |
|------|------|------|
| 02 课大量不完整代码块标了 `<!-- run -->` | `02-整数运算.md` | 补全为完整可运行程序 |
| 02 课选择题选项未分行 | `02-整数运算.md` | 全部改为每行一个选项 |
| 02 课提到"常量"但未讲授 | `02-整数运算.md` | 从目标和头部描述中移除"常量" |
| 01 课选择题考查未讲的操作系统 | `01-走进C++.md` | 在"计算机四大部件"后补充操作系统介绍 |
| `using namespace std;` 解释不准确 | `01-走进C++.md` | 改为"使用标准命名空间" |
| `main` 被误列为关键字 | `02-整数运算.md` | 改为"关键字以及程序入口名 main" |
| 数字反转公式过于超前 | `02-整数运算.md` | 改为"交换两位数的个位和十位" |
| 程序骨架代码块缺少 `<!-- run -->` | `01-走进C++.md` | 补充 `<!-- run -->` |
| `system("pause")` 未说明平台限制 | `01-走进C++.md` | 注明仅 Windows + Dev-C++ 有效 |
| 中英混用 | `02-整数运算.md` | "repeatedly" → "反复地" |
| "选择题复习"实为问答题 | `02-整数运算.md` | 改为"复习思考题" |
| `_score` 示例欠妥 | `02-整数运算.md` | 改为 `score2` |

### 8. 构建验证

- 前端 TS 检查：`0 errors`
- 前端 Vite 构建：`✓ built`
- 后端 TS 检查：`0 errors`
- API 返回 `pages` 正常，每页有内容
- 数据库重新导入成功

---

*最后更新：2026-06-12*

---

## 十五、课程练习页面重构（2026-06-13）

### 1. 需求

参考 OJ 风格，重构课程练习页面：
- 顶部用 A/B/C/D/E 标签切换题目
- 题目下方直接显示递交评测区
- 不需要代码语言选择（固定 C++）
- 不需要上传文件
- 下方用格子展示通过/未通过的测试点

### 2. 实现

**新增后端接口**
- `GET /api/lessons/:id/problems`
- 从课时 `content` 中提取所有 `<!-- problem: id -->` 块
- 返回题目列表（id、title、difficulty、timeLimit、memoryLimit）

**重写 `client/src/pages/ProblemPage.tsx`**
- 整体改为垂直布局：题目详情 → 代码编辑器 → 测试点结果
- 如果 URL 带有 `lessonId`，进入"课程练习模式"：
  - 调用 `/lessons/:id/problems` 获取题目列表
  - 顶部显示 A/B/C/D/E 标签切换题目
  - 每个标签对应一道课后编程题
- 如果没有 `lessonId`，保持单题模式
- 移除语言选择框和文件上传
- 提交按钮文字改为"递交"
- 测试结果用绿色/红色格子展示，显示 AC/WA/TLE/MLE/RE 等简写和用时/内存

**前端链接调整**
- `LessonPage.tsx`：课时中的"去做课后编程题"按钮跳转时带上 `?lessonId=xxx`
- `ProblemPage.tsx`：读取 `lessonId` 参数，提交时一并传给后端（用于 AI 不超纲）

### 3. 测试

- 后端接口 `/lessons/:id/problems`：✅ 正常返回
- 单题提交流程：✅ 结果 accepted，测试点详情正常
- 前端 TS 检查：`0 errors`
- 前端 Vite 构建：`✓ built`
- 后端 TS 检查：`0 errors`

### 4. 说明

当前课时 Markdown 中还没有真实的 `<!-- problem: id -->` 块，所以课程练习模式的标签区会显示"当前暂无练习题"。后续录入真实题目后，在课件中按规范插入 problem 块即可自动显示标签切换。

### 5. 更新文件

- `server/src/routes/lessons.ts`
- `client/src/pages/ProblemPage.tsx`
- `client/src/pages/LessonPage.tsx`

---

*最后更新：2026-06-13*

---

## 十六、东方博宜题库全量导入与题目详情页重构（2026-06-10）

### 1. 背景

平台需要真实的可评测题库，用于支撑课程练习和题库浏览。之前仅有课件中的占位题和少量演示题，无法满足教学需求。

### 2. 数据准备

**来源**
- 原始题面与测试数据：`hydroj/东方博宜OJ-1042题/`
- 分类与分级总表：`docs/东方博宜1-1042题分类_总表.md`

**预处理**
- 修复总表第 892 题管道符转义导致的重复计数问题
- 按总表将 1042 道题划分为 CSP01 ~ CSP08 共 8 个等级
- 每道题保留原始分类 tags（如分支结构、循环、数组、字符串等）

### 3. 导入脚本改进

**文件**：`server/src/scripts/reimport-dongfangboyi.ts`

| 改进点 | 说明 |
|--------|------|
| 解析题面章节 | 从 markdown 中拆分 `Description / Input Format / Output Format / Hint / Source` |
| 标题本地化 | 渲染为中文标题：题目描述、输入格式、输出格式、提示、来源 |
| 字段拆分 | 输入说明存入 `input_desc`，输出说明存入 `output_desc`，不再全部堆在 `description` 中 |
| 样例清理 | 从 `inputDesc` / `outputDesc` 中移除 ```input1 / ```output1 代码块，避免与 `sampleInput` / `sampleOutput` 重复 |
| 测试用例导入 | 自动读取 `testdata/` 目录下的 `.in` / `.out` 文件，第一个测试点公开，其余隐藏 |
| 隐藏注释 | 在 `descriptionHtml` 顶部加入 `<!-- dongfangboyi-id: xxx -->`，便于溯源 |

### 4. 题目详情页重构

**新增组件**：`client/src/components/ProblemStatement.tsx`

- 题目描述、输入格式、输出格式、样例输入/输出分块展示
- 每块带中文标题和左侧强调色条
- 样例输入/输出使用独立卡片 + `pre` 代码块，支持滚动和换行
- 自动过滤仅含空白或空标签的字段

**应用位置**
- `client/src/pages/ProblemPage.tsx`
- `client/src/components/ProblemPracticeBlock.tsx`

### 5. 题库浏览层级改造

**等级入口页**：`client/src/pages/ProblemListPage.tsx`
- 原平铺题目列表改为 8 个等级卡片
- 点击卡片进入对应等级详情页

**等级详情页**：`client/src/pages/ProblemLevelPage.tsx`
- 左侧分类导航栏，显示该等级下所有分类及题数
- 右侧只展示当前选中分类的题目表格
- 默认自动选中第一个分类
- 每道题显示标题、时间限制、内存限制，点击可进入题目详情页

**路由更新**：`client/src/App.tsx`
- 新增 `/student/problems/level/:level`

### 6. 数据库状态

重新清空 `problems` 表后全量导入，最终分布：

| 等级 | 题数 |
|------|------|
| CSP01 | 298 |
| CSP02 | 119 |
| CSP03 | 276 |
| CSP04 | 108 |
| CSP05 | 84 |
| CSP06 | 117 |
| CSP07 | 14 |
| CSP08 | 26 |
| **合计** | **1042** |

### 7. 构建验证

- 后端导入脚本：1042 道题全部导入成功，无失败
- 前端 TS 检查：`0 errors`
- 前端 Vite 构建：`✓ built`
- 抽样检查：题目详情页已无残留英文标题（Description / Input Format / Output Format / Hint / Source）

### 8. 更新文件

- `server/src/scripts/reimport-dongfangboyi.ts`
- `client/src/components/ProblemStatement.tsx`（新增）
- `client/src/pages/ProblemPage.tsx`
- `client/src/components/ProblemPracticeBlock.tsx`
- `client/src/pages/ProblemListPage.tsx`
- `client/src/pages/ProblemLevelPage.tsx`（新增）
- `client/src/App.tsx`
- `README.md`

---

*最后更新：2026-06-10*

---

## 十七、课件低龄化改造与正向反馈系统（2026-06-10）

### 1. 问题

- 原课件文字密度过高，4-6 年级小学生难以独立自学。
- 缺少即时正向反馈：答对只有文字提示、完成课时没有仪式感、徽章获得无感知。

### 2. 目标

让小学生能够**独立、愉快、持续地**完成自学，每页只看少量文字，主要靠图标、代码演示和互动测验学习；每个正确操作都有即时视觉/成就感反馈。

### 3. 微课课件格式

**新文档**：`server/courses/MICRO_LESSON_FORMAT.md`

核心规范：
- 一页一概念，每页必须包含至少一个互动块
- 正文不超过 2 行短句，多用 emoji
- 新增块类型：
  - `<!-- story -->`：绘本式开场故事
  - `<!-- card type:teacher/computer/tip -->`：知识卡片
  - `<!-- demo -->`：可运行代码演示
  - `<!-- checkpoint -->`：必须答对才能继续的检查点

### 4. 解析器升级

**文件**：`server/src/parsers/markdownParser.ts`

- 新增对 `story`、`card`、`demo`、`checkpoint` 的解析
- `parseLessonPages()` 返回每页是否含 checkpoint
- 保持对旧格式（quiz、hint、coach-tip、problem、run）的兼容

### 5. 前端微课页面

**文件**：`client/src/pages/LessonPage.tsx`

- 每页显示一个核心概念卡片
- 底部"上一步 / 下一步"导航
- checkpoint 未答对时锁定下一步
- 答对 checkpoint / 普通 quiz 时触发 XP 飘字
- 完成课时后弹出 CelebrationModal（confetti + 经验 + 徽章 + 下一课按钮）

### 6. 正向反馈组件

| 组件 | 文件 | 用途 |
|------|------|------|
| CelebrationModal | `client/src/components/CelebrationModal.tsx` | 完成课时全屏庆祝 |
| BadgeToast | `client/src/components/BadgeToast.tsx` | 获得徽章右上角通知 |
| XPGain | `client/src/components/XPGain.tsx` | 经验值增加飘字动画 |
| AICoachPanel | `client/src/components/AICoachPanel.tsx` | AI 教练聊天面板 |

### 7. 激励系统数据模型

**文件**：`server/prisma/schema.prisma`

- `User` 表新增：`experience`、`level`、`streak`、`lastStudyDate`
- `Lesson` 表新增：`xpReward`、`rewards`

### 8. 后端接口调整

| 接口 | 改动 |
|------|------|
| `POST /lessons/:id/complete` | 返回 `xpGained`、`levelUp`、`newLevel`、`newBadges` |
| `POST /submissions` | 返回 `newBadges` |
| `GET /progress/stats` | 返回 `level`、`experience`、`streak` |

### 9. 新页面

- `/student/achievements`：徽章墙，展示已获得/未获得徽章和连续学习天数
- Dashboard 个人中心：展示等级、经验条、连续打卡、最近徽章

### 10. 课件样板

**文件**：`server/courses/gesp1/01-走进C++.md`

已按微课格式重写，包含：
- 开场故事
- 多个知识卡片 + 代码演示
- 每个概念后的 checkpoint 检查点
- 课后挑战题占位

### 11. 构建验证

- 前端 TS 检查：`0 errors`
- 前端 Vite 构建：`✓ built`
- 后端 TS 检查：`0 errors`

### 12. 待完成

- ✅ GESP 1级第 1-12 课微课已完成并重新导入
- 继续按微课格式重写 GESP 2级第 1-8 课

### 13. 更新文件

- `server/courses/MICRO_LESSON_FORMAT.md`（新增）
- `server/src/parsers/markdownParser.ts`
- `client/src/pages/LessonPage.tsx`
- `client/src/components/CelebrationModal.tsx`（新增）
- `client/src/components/BadgeToast.tsx`（新增）
- `client/src/components/XPGain.tsx`（新增）
- `client/src/components/AICoachPanel.tsx`（新增）
- `client/src/pages/AchievementsPage.tsx`（新增）
- `client/src/pages/DashboardPage.tsx`
- `client/src/pages/ProblemPage.tsx`
- `server/prisma/schema.prisma`
- `server/src/routes/lessons.ts`
- `server/src/routes/submissions.ts`
- `server/src/routes/progress.ts`
- `server/courses/gesp1/01-走进C++.md`
- `server/src/scripts/import-dongfangboyi.ts`（修复重复变量声明）

---

*最后更新：2026-06-10*
