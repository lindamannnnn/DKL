# DKL 信奥学习平台

面向 4-6 年级小学生的 AI 辅助 C++ 信奥学习平台，对标 GESP C++ 1-8 级。

## 核心功能

- **Markdown 课件渲染**：上传 Markdown 课件后自动解析为分页式互动课件
- **在线代码编辑器**：基于 Monaco Editor，固定 C++ 语言
- **JudgeServer 判题**：支持 IOI 赛制部分分，返回每个测试点结果
- **AI 竞赛教练**：结合课时/题目上下文进行答疑和代码点评
- **题库系统**：按 GESP 等级 → 分类 → 题目的层级结构浏览
- **课程与课时**：课程大厅、课程详情、课时学习、课后编程练习
- **模拟考试**：考试创建、答题、提交、评分、统计
- **教师后台**：课程/题目/班级/考试管理

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Tailwind CSS + Vite + Monaco Editor |
| 后端 | Node.js + Express + Prisma ORM + PostgreSQL |
| 缓存/队列 | Redis |
| 判题沙箱 | JudgeServer (Docker) |
| AI | 大模型 API（OpenAI / DeepSeek / Kimi） |
| 部署 | Docker Compose（开发） |

## 目录结构

```
DKL/
├── client/          # 前端（学生端 + 教师后台）
├── server/          # 后端 API 服务
├── docs/            # 题库分类总表等文档
├── hydroj/          # 外部题库原始数据
├── docker-compose.yml
└── README.md
```

## 开发启动

```bash
# 1. 启动基础设施（PG + Redis + JudgeServer）
docker compose up -d

# 2. 启动后端
cd server
npm install
npx prisma migrate dev
npx prisma db seed
npx tsx src/index.ts

# 3. 启动前端
cd client
npm install
npx vite --port 3000 --host 0.0.0.0
```

## 默认端口

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:3000 |
| 后端 API | http://localhost:4001 |
| JudgeServer | http://localhost:8080 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## 默认测试账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 学生 | student@dkl.local | student123 |
| 教师 | teacher@dkl.local | teacher123 |
| 管理员 | admin@dkl.local | admin123 |

## 关键页面路由

| 页面 | 路由 |
|------|------|
| 课程大厅 | `/student/courses` |
| 题库（等级入口） | `/student/problems` |
| 等级详情（按分类） | `/student/problems/level/:level` |
| 题目详情 | `/student/problems/:id` |
| 课时学习 | `/student/lessons/:id` |
| 个人中心 | `/student/dashboard` |
| 考试列表 | `/student/exams` |
| 教师后台 | `/teacher/*` |

## 课件系统（微课格式）

平台采用专为 4-6 年级小学生设计的微课课件格式：

- **一页一概念**：每个 `## ` 标题对应一个知识点
- **少文字**：每页正文不超过 2 行，多用 emoji 和图标
- **必互动**：每页包含知识卡片、代码演示或检查点
- **Checkpoint 锁页**：检查点内的测验必须答对才能继续
- **故事化开场**：用故事/角色/问题引入，降低儿童自学门槛

格式规范见：`server/courses/MICRO_LESSON_FORMAT.md`

儿童版课件示例：`server/courses/gesp1-micro/01-走进C++.md`

课件导入脚本：`server/src/scripts/import-gesp1.ts`

> ✅ GESP 1级（01-18 课）已按微课格式重写，结构为「普通课 2 道挑战 + 5 道课后作业；练习课 5 道挑战 + 5 道课后作业」，并通过小学生体验官评审入库。
>
> ⏳ GESP 2级内容准备中。

## 正向反馈系统

- 完成课时：全屏 confetti 庆祝 + 经验值 + 徽章
- 周连胜：每周完成任意一课 +1，断周重置为 1
- 通过题目：右上角徽章获得通知
- 答对测验/检查点：经验值飘字动画
- 个人中心：等级、经验条、连续学习天数、徽章墙

## 课程地图

- 课程详情页采用像素风冒险地图，S 形蜿蜒路径
- 1-8 级 GESP 课程对应 8 套不同地形主题（草原 → 沙漠 → 森林 → 雪山 → 火山 → 沼泽 → 深渊 → 星河）
- 地图背景图：`client/public/maps/map-level-{1-8}.png`
- AI 生成 prompt：`docs/AI_MAP_PROMPTS.md`

## 题库数据

- 当前已导入 **东方博宜 OJ 1-1042 题**
- 按 GESP 1-8 级分级，每道题已标注分类 tags
- 导入脚本：`server/src/scripts/reimport-dongfangboyi.ts`

## 相关文档

- `CLAUDE.MD` — 面向 AI 助手的项目说明与进度记录
- `DEV_PLAN.md` — 开发执行计划
- `CHANGELOG.md` — 近期开发日志
- `CONTEXT.md` — 会话切换用上下文摘要
- `plan.md` — 完整产品方案
- `docs/agents/elementary-student-persona.md` — 零基础小学生体验官人设
