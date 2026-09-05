# DKL 信奥学习平台

面向 4-6 年级小学生的 AI 辅助 C++ 信奥学习平台，对标 GESP C++ 1-8 级。

## 这个项目在解决什么问题

让没有 C++ 教学能力的家长或机构，也能让孩子在家**系统、正确地**自学信奥。孩子看的是一页一个知识点的微课，写完代码立刻有判题结果，卡住了有 AI 老师答疑——而这个 AI 老师经过专门约束，不会胡说、不会直接给答案、不会讲超纲内容。

## 核心功能

- **Markdown 微课渲染**：上传 Markdown 自动解析为分页互动课件（故事卡片 / 可运行代码 / 检查点 / 测验）
- **在线判题**：Monaco 编辑器 + JudgeServer 沙箱，支持 IOI 部分分，逐测试点返回结果
- **AI 竞赛教练**：结合当前课时与题目上下文答疑、点评代码，带完整的事实准确性护栏
- **智慧书库（RAG 知识库）**：把 GESP 1-8 级教案 + 算法模板 + 官方考纲切成知识块入向量库，学生可检索原文、问 AI、或让"编程老师"按"讲逻辑 → 讲代码 → 给例子 → 讲坑"六段式重新讲解（SSE 流式打字机输出）
- **题库系统**：1500+ 道带测试数据的可判题，按 GESP 等级 → 分类层级浏览
- **激励系统**：经验值 / 等级 / 周连胜 / 徽章墙 / 完成庆祝动画
- **模拟考试**：创建、答题、倒计时、评分、统计全流程
- **教师后台**：课程 / 题目 / 班级 / 考试管理，多租户数据隔离

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + Tailwind CSS + Monaco Editor |
| 后端 | Node.js + Express + Prisma ORM + PostgreSQL |
| 缓存 | Redis |
| 判题沙箱 | JudgeServer（Docker，IOI 部分分） |
| AI | OpenAI / DeepSeek / Kimi（三层护栏架构） |
| 部署 | Docker Compose |

## 几个有代表性的设计

**AI 教练的三层护栏。** 直接拿大模型教小孩是危险的——实测发现它会讲反 `cin`/`cout`、直接给答案、超前讲解。所以做了三层：高频语法问题走预置事实知识库（不调 LLM）→ 编译错误走规则引擎（确定性匹配）→ 其余才走 LLM，且系统提示词里写死了"防超纲、防编造、不给完整答案"，并注入当前课时上下文限定讲解范围。

**用"虚拟学生"评测课件质量。** 课件好不好不靠感觉。建了两个水平不同的智能体学生人设 + 一套客观测量准则（禁止凭空打分、测"能否独立解题"时必须遮住示例代码、每条结论要给出证据位置），逐课产出评测报告，反向驱动课件修复。

**智慧书库的"防幻觉"是三层硬闸门，不是靠 prompt 自觉。** 直接让大模型回答学生问题会编造。所以 RAG 检索后在后端强制过三道闸：相关度（向量+关键词分都低就拒）→ 术语（问题里的专有名词如"B+树"在资料里没出现过，直接拒，防张冠李戴）→ 级别（问"GESP 九级"而资料最高八级，直接拒）。过了闸才把资料交给 LLM，且回答末尾强制附真实来源。这些阈值是用 46 道题的评测集标定的——评测真抓到过"topK 放宽导致库外题被边缘噪声放行"的 bug，才收敛到现在的闸门。

**题库数据流水线。** 从多个公开 OJ 源抓取 → 清洗（修 markdown 转义、配对 in/out 测试数据、兼容 `.ans` 扩展名）→ 按 GESP 1-8 级分级 → 幂等导入 → 校验。目前库内 1500+ 道可判题。

更完整的架构与设计取舍见 [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)。

## 本地运行

需先启动 Docker Desktop，然后：

```bash
# 1. 基础设施（PostgreSQL + Redis + JudgeServer）
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
npx vite --port 3000
```

| 服务 | 地址 | 测试账号 |
|------|------|----------|
| 前端 | http://localhost:3000 | 学生 `student@dkl.local / 123456` |
| 后端 API | http://localhost:4001 | 教师 `teacher@dkl.local / teacher123` |
| JudgeServer | http://localhost:8080 | |

## 目录结构

```
DKL/
├── client/          # 前端（学生端 + 教师后台）
├── server/          # 后端 API（含课件解析器、AI 服务、判题封装、题库导入脚本）
├── docs/            # 项目文档、评测报告、题库盘点
├── hydroj/          # 题库原始数据（不入库）
└── docker-compose.yml
```

## 相关文档

- `docs/PROJECT_OVERVIEW.md` — 架构与设计取舍（AI 护栏 / 评测体系 / 题库工程详解）
- `CLAUDE.MD` — 项目说明与逐日开发记录
- `DEV_PLAN.md` — 开发计划与完成度
- `CHANGELOG.md` — 开发日志
- `server/courses/MICRO_LESSON_FORMAT.md` — 微课格式规范
