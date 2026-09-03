#!/bin/bash
# DKL 一键启动（守候版）：长时间等待 Docker -> 拉起基础设施 -> 迁移 -> 启动后端 -> 启动前端
# 用法：bash start-dev.sh        （默认守候 6 小时）
LOG=/e/DKL/tmp/start-dev.log
mkdir -p /e/DKL/tmp
: > "$LOG"

log() { echo "[$(date '+%H:%M:%S')] $1" >> "$LOG"; }

MAX_WAIT=${MAX_WAIT:-21600}   # 最多等 6 小时
WAITED=0
log "开始守候 Docker 引擎（最多 ${MAX_WAIT}s）..."
while [ $WAITED -lt $MAX_WAIT ]; do
  if docker info >/dev/null 2>&1; then log "Docker 已就绪（等待 ${WAITED}s）"; break; fi
  sleep 10; WAITED=$((WAITED+10))
done
if ! docker info >/dev/null 2>&1; then log "超时：Docker 仍未就绪，放弃"; exit 1; fi

log "启动基础设施（postgres / redis / judge-server）..."
docker compose up -d >> "$LOG" 2>&1
log "compose 返回码 $?"

log "等待 PostgreSQL 可连接..."
for i in $(seq 1 60); do
  if docker exec dkl-postgres pg_isready -U dkl -d dkl_db >/dev/null 2>&1; then
    log "PostgreSQL 已就绪（第 $i 次检查）"; break
  fi
  sleep 3
done

log "应用数据库迁移..."
cd /e/DKL/server && npx prisma migrate deploy >> "$LOG" 2>&1
log "migrate 返回码 $?"

log "启动后端 :4001 ..."
cd /e/DKL/server && npx tsx src/index.ts >> "$LOG" 2>&1 &
BACKEND_PID=$!
log "后端 pid=$BACKEND_PID"

for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4001/health --max-time 2)
  if [ "$code" = "200" ]; then log "后端健康检查通过（第 $i 次）"; break; fi
  sleep 2
done

log "启动前端 :3000 ..."
cd /e/DKL/client && npx vite --port 3000 --host 0.0.0.0 >> "$LOG" 2>&1 &
FRONTEND_PID=$!
log "前端 pid=$FRONTEND_PID"

for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 --max-time 2)
  if [ "$code" = "200" ]; then log "前端可访问（第 $i 次）"; break; fi
  sleep 2
done

log "=== 全部就绪 ==="
log "前端 http://localhost:3000   后端 http://localhost:4001"

wait
