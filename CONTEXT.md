# DKL "每周一课" 儿童自学版 — 当前上下文

> 本文件用于在切换 Kimi 会话时快速恢复上下文。切换回 Kimi 客户端后，把这份文件内容贴给 Kimi 即可。
> 
> **最后更新**：2026-07-20（GESP2 冻结）

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

## 2. 当前会话完成的工作（2026-07-04）

### 2.1 GESP1 最终整理与冻结
- 课程结构统一：普通课「2 道课堂挑战 + 5 道课后作业」，练习课「5 道课堂挑战 + 5 道课后作业」。
- 课堂挑战后统一补充评讲逻辑（知识点、思路、易错点、关键代码解释）。
- `server/courses/gesp1/` 与 `server/courses/gesp1-micro/` 同步，GESP1 课件内容冻结，不再修改知识体系。

### 2.2 GESP1 智能体 v6 评估
- 重置小柯（9 岁三年级）和小明（11 岁五年级）状态，从零重新学习 01-18 课。
- 小柯平均理解率 **89.3%**（未达 90%），小明平均理解率 **72.8%**（达 70%）。
- 报告：`docs/reports/evaluation-xiaoke-18-lessons-v6.md`、`docs/reports/evaluation-xiaoming-18-lessons-v6.md`。

### 2.3 GESP1 一级真题 14 套自测
- 每套卷前重置智能体状态为"刚学完 18 课"，独立测试不累积。
- 小柯 14 套平均 **98.8 分**（12 套满分）。
- 小明 14 套平均 **68.9 分**（最高 86，最低 57）。
- 报告：`docs/reports/xiaoke-gesp1-exam-v6-report.md`、`docs/reports/xiaoming-gesp1-exam-v6-report.md`。

### 2.4 文档更新
- `README.md`：GESP1 状态更新为 01-18 课完成，GESP2 准备中。
- `CHANGELOG.md`：新增 v6 评估与真题自测阶段记录。
- `DEV_PLAN.md`：Phase 7 进度更新为 70%，GESP1 冻结、GESP2 待开始。
- `CONTEXT.md`：即本文件，已同步到最新状态。

### 2.5 服务恢复
- Docker Desktop 已启动，容器 `dkl-postgres`、`dkl-redis`、`dkl-judge` 运行中。
- 后端 dev server 已启动：`http://localhost:4001`
- 前端 dev server 已启动：`http://localhost:3000`
- 登录接口测试通过，数据库连接正常。

---

## 3. 当前运行中的服务

| 服务 | URL | 状态 |
|------|-----|------|
| 前端 | http://localhost:3000 | 运行中 |
| 后端 | http://localhost:4001 | 运行中 |
| PostgreSQL | localhost:5432 | Docker 运行中 |
| Redis | localhost:6379 | Docker 运行中 |
| JudgeServer | localhost:8080 | Docker 运行中 |

测试账号：
- 邮箱：`student@dkl.local`
- 密码：`student123`
- tenantId：`080ffa34-df87-4566-b1ef-555b88bfe5b8`

快速验证：
```bash
curl -s http://localhost:3000       # 前端 200
curl -s -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@dkl.local","password":"student123","tenantId":"080ffa34-df87-4566-b1ef-555b88bfe5b8"}'
```

如果后端起不来，常见原因：
1. Docker Desktop 没开 → 手动启动 Docker Desktop，等待 `docker ps` 能看到容器。
2. 端口 4001 被占用 → 运行 `npx kill-port 4001` 后再启动。
3. 前端 3000 被占用 → Vite 会自动 fallback 到 3001。

---

## 4. 当前未提交改动

本次会话产生大量改动，**尚未 commit/push**。

主要变更：
- `CHANGELOG.md`、`CONTEXT.md` 更新
- `server/courses/gesp1-micro/` 和 `server/courses/gesp1/` 从 12 个文件调整为 18 个文件
- 新增：
  - `server/src/scripts/migrate-gesp1-18-lessons.ts`
  - `server/src/scripts/verify-gesp1-all.ts`
  - `docs/reports/agent-gesp1-18-lessons.md`
  - `docs/reports/agent-gesp1-lessons-6-12.md`
  - `docs/reports/agent-xiaoming-gesp1-evaluation.md`
  - `docs/agents/xiaoming-persona.md`

查看完整状态：
```bash
cd e:/DKL && git status --short
```

---

## 5. 关键文件清单

| 文件 | 作用 |
|------|------|
| `server/courses/gesp1-micro/01-走进C++.md` ~ `18-练习课-GESP1综合大闯关.md` | 儿童版微课源文件（导入/展示用） |
| `server/courses/gesp1/01-走进C++.md` ~ `18-练习课-GESP1综合大闯关.md` | 标准版微课源文件（迁移脚本读取用） |
| `server/courses/MICRO_LESSON_FORMAT.md` | 微课格式规范 |
| `server/src/scripts/migrate-gesp1-18-lessons.ts` | 18 课数据库迁移脚本 |
| `server/src/scripts/verify-gesp1-all.ts` | 90 道课后题自动验证脚本 |
| `docs/agents/elementary-student-persona.md` | 零基础小学生体验官"小柯"人设 |
| `docs/agents/xiaoming-persona.md` | 五年级零基础贪玩体验官"小明"人设 |
| `docs/reports/agent-gesp1-lessons-1-5.md` | 1-5 课验证报告 |
| `docs/reports/agent-gesp1-lessons-6-12.md` | 6-12 课验证报告 |
| `docs/reports/agent-gesp1-18-lessons.md` | 18 课扩充与全量验证报告 |
| `docs/reports/agent-xiaoming-gesp1-evaluation.md` | 小明人设 18 课体验评估报告 |
| `docs/reports/evaluation-xiaoke-18-lessons-v6.md` | 小柯 v6 学习评估报告 |
| `docs/reports/evaluation-xiaoming-18-lessons-v6.md` | 小明 v6 学习评估报告 |
| `docs/reports/xiaoke-gesp1-exam-v6-report.md` | 小柯 14 套一级真题自测报告 |
| `docs/reports/xiaoming-gesp1-exam-v6-report.md` | 小明 14 套一级真题自测报告 |

---

## 6. 当前主要问题与下一步

### 6.1 当前状态（2026-07-20 更新）
- **GESP1 已冻结**：18 课完成，90/90 课后题验证通过，双智能体多轮评估完成。
- **GESP2 已冻结（2026-07-20）**：16 课全部就绪。课后题修复（HTML 泄露、错题替换、简单→难排序）、双智能体课件测评（小柯 0.93/76.7、小明 0.98/85，P0=0）、真题 5 套闭卷验证（小柯 79.6/合格5/5、小明 ~84/合格4/5）、新增第 13 课「循环模拟与易错点专项」、L05 补枚举去重。`server/courses/gesp2/` 源文件已与数据库同步定版（16 个文件，含新第 13 课），课件知识体系不再修改。
- **评估体系已建好**：评估准则 v1（`docs/agents/evaluation-rubric-v1.md`）+ GESP1 毕业知识基线（`docs/agents/gesp1-graduate-knowledge-baseline.md`），GESP3 及以上测评可直接复用。

### 6.2 待处理
1. **测试用例补充**：部分课后题测试用例覆盖不足。
2. **前端渲染抽查**：新第 13 课含 7 个 checkpoint 块，建议在浏览器里实际过一遍确认锁页与渲染正常。
3. **课时标题编号遗留**：GESP2 第 14/15/16 课的标题仍显示「课程13/14/15」（插入新第 13 课时只调了 sortOrder）。源文件与数据库保持一致，属已知 cosmetic 问题，可在 GESP3 开发前统一修正（需同步改数据库标题）。

### 6.3 下一步可选方向
- **方向 A：推进 GESP 3级课件开发**（标准教案 GESP03 已就位，评估体系可直接复用）。
- **方向 B：GESP 真题录入与模拟考试题库扩充**。
- **方向 C：配置真实 AI Key，验证 AI 教练在线效果**。

---

## 7. 关键约定

- 不改课件 Markdown 知识体系，只按微课格式重新包装。
- 连胜按"周"计算（周一为一周开始）。
- `CourseHallPage` 是学生实际首页（`/student/courses`）。
- 课程详情页根据 `course.levelMin` 切换 1-8 级地形主题。
- 每节课必须包含 story / card / demo / checkpoint / challenge 中的至少一种互动。
- 检查点（checkpoint）必须答对才能继续下一页。
- 新智能体人设位于 `docs/agents/elementary-student-persona.md` 和 `docs/agents/xiaoming-persona.md`，用于课程可读性自检。

---

## 8. 环境信息

- OS: Windows 11 + WSL2 + Docker Desktop
- Node: v24.14.0, npm 11.9.0
- Stack: Node.js + Express + Prisma + PostgreSQL + Redis + React 18 + Vite + Tailwind
- Git: https://github.com/lindamannnnn/DKL.git
- 最新 commit: `8648b10 feat: 周连胜粘性机制 + 像素风课程地图 MVP`

---

## 9. 新会话恢复步骤

如果切换到新 Kimi 会话，请按以下顺序恢复：

1. **贴入本文件全文**作为上下文。
2. **检查服务状态**：
   ```bash
   docker ps
   curl -s http://localhost:4001/api/auth/login ... # 见第 3 节
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
   ```
3. 如果服务没起，按第 3 节说明启动 Docker、后端、前端。
4. 继续当前**进行中**的工作（推荐先 commit，再按小明报告优化课件或开始 GESP2）。
