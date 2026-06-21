# DKL "每周一课" 粘性机制 — 当前上下文

> 本文件用于在切换 Kimi 会话时快速恢复上下文。切换回 Kimi 客户端后，把这份文件内容贴给 Kimi 即可。

## 1. 项目目标

参考多邻国（Duolingo）心理策略，为 DKL 学生端增加"每周一课"粘性机制，让学生每周能坚持完成一课 C++ 课程。

核心策略：
- **周连胜（Weekly Streak）**：每周完成一课 +1，断签提醒
- **强烈完成庆祝动画**：全屏彩带、经验、等级、徽章、连胜展示
- **课程地图式详情页**：像素风/冒险风关卡可视化
- **吸引人的首页 Dashboard**：大按钮"开始本周课程"、连胜、进度

## 2. 当前完成状态

### ✅ 已完成
- 后端周连胜逻辑完成（按周计算，周一为一周开始）
- 后端 `/lessons/:id/complete` 返回 `streak` 和 `weeklyCompleted`
- 后端 `/progress/stats` 返回 `weeklyCompleted` 和 `nextLesson`
- 后端 `/progress/report` 统一使用周连胜并调整文案
- 前端 `CourseHallPage` 改造为 Dashboard 风格首页
- 前端 `CourseDetailPage` 改造为地图式关卡页（S 形路径、像素节点）
- 前端 `CelebrationModal` 强化庆祝效果（星星彩带、奖励、连胜、下一课）
- 前端 `LessonPage` 完成时传递 streak/weeklyCompleted 给庆祝弹窗
- 修复 `client.ts` token key 兼容问题（兼容 `token`/`dkl_token`、`tenantId`/`dkl_tenantId`）
- 修复 `Layout.tsx` / `CourseHallPage.tsx` 退出登录清理 key 不一致
- 修复 `progress.ts` 中 `nextLesson` Prisma `select` + `include` 冲突
- 启动 Docker / PostgreSQL / Redis，恢复课程数据
- 前端 `npm run build` ✅ 通过
- 后端 `npx tsc --noEmit` ✅ 通过

### 🔄 进行中 / 待优化
- 课程详情页背景艺术感不足，需要更像"一路冒险"的像素风场景
- 用户希望参考提供的像素艺术图风格（细腻树木/建筑/光影）
- 当前环境无法 AI 生图，需要用代码模拟或后续接入外部图片资源
- 需要确认地图节点、路径、课程标题的显示效果

## 3. 关键文件改动

```
M client/src/api/client.ts              # token/tenantId key 兼容
M client/src/components/CelebrationModal.tsx  # 强化庆祝弹窗
M client/src/components/Layout.tsx       # logout 清理 key
M client/src/index.css                   # 像素风样式、badge、封面
M client/src/pages/CourseDetailPage.tsx  # 地图式详情页（主战场）
M client/src/pages/CourseHallPage.tsx    # Dashboard 首页
M client/src/pages/LessonPage.tsx        # 课时完成传参
M client/tailwind.config.js              # 动画扩展
M server/src/parsers/markdownParser.ts   # 课件分页解析
M server/src/routes/courses.ts           # 返回用户进度
M server/src/routes/lessons.ts           # 周连胜计算
M server/src/routes/progress.ts          # stats/report 周连胜
```

## 4. 当前技术栈 & 环境

- OS: Windows 11 + WSL2 + Docker Desktop
- Node: v24.14.0, npm 11.9.0
- Stack: Node.js + Express + Prisma + PostgreSQL + Redis + React 18 + Vite + Tailwind
- 后端: http://localhost:4001
- 前端: http://localhost:3000
- 数据库: localhost:5432 (dkl_db)
- Git: https://github.com/lindamannnnn/DKL.git

## 5. 测试账号

- 邮箱：`student@dkl.local`
- 密码：`student123`
- tenantId：`080ffa34-df87-4566-b1ef-555b88bfe5b8`

## 6. 当前主要问题

1. **课程详情页背景不够艺术/冒险**：当前用 CSS/SVG/emoji 模拟像素风，距离用户期望的精致像素艺术场景还有差距。
2. **无法 AI 生图**：当前环境没有图像生成能力，不能直接产出像素美术素材。

## 7. 下一步可选方向

方向 A：继续用代码优化像素风地图（更精致的 CSS/SVG 背景层、视差、粒子、动态装饰）
方向 B：为每个 GESP 等级编写 AI 绘画 prompt，用户拿到 Midjourney/即梦/Stable Diffusion 生成后替换
方向 C：接入外部图片资源接口，先预留好背景图槽位，后续换真图
方向 D：先 commit 当前代码，再切换到 Kimi 客户端继续

## 8. 关键约定

- 不改课件 Markdown 内容
- 连胜按"周"计算（周一为一周开始）
- `CourseHallPage` 是学生实际首页（`/student/courses`）
- 课程详情页根据 `course.levelMin` 切换 1-8 级地形主题
