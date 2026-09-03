#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
校验：数据库里每道题的测试点数量，是否与源数据目录里的 .in 文件数量一致。

- 东方博宜：用题目描述里的 <!-- dongfangboyi-id: N --> 反查源目录 N
- hydro / 炼石noip：用标题匹配

只读，不写库。输出差异报告到 docs/reports/
"""
import os
import re
import csv
import subprocess
import sys
from collections import defaultdict

ROOT = r"E:\DKL"
HYDROJ = os.path.join(ROOT, "hydroj")
OUT_DIR = os.path.join(ROOT, "docs", "reports")
os.makedirs(OUT_DIR, exist_ok=True)


def db_query(sql):
    """通过 docker exec 在 PG 里执行查询，返回行列表（制表符分隔）"""
    p = subprocess.run(
        ["docker", "exec", "dkl-postgres", "psql", "-U", "dkl", "-d", "dkl_db",
         "-t", "-A", "-F", "\t", "-c", sql],
        capture_output=True, encoding="utf-8", errors="replace"
    )
    rows = []
    for line in p.stdout.splitlines():
        line = line.rstrip("\n")
        if line.strip():
            rows.append(line.split("\t"))
    return rows


def norm(s):
    """标题归一化：去【】前缀、去空白"""
    s = re.sub(r"^【.+?】", "", (s or "")).strip()
    return re.sub(r"\s+", "", s)


def count_in_files(tdir):
    """统计 testdata 里 有配套输出文件(.out 或 .ans) 的 .in 数量"""
    if not os.path.isdir(tdir):
        return 0
    n = 0
    for f in os.listdir(tdir):
        if not f.endswith(".in"):
            continue
        base = f[:-3]
        if os.path.exists(os.path.join(tdir, base + ".out")) or \
           os.path.exists(os.path.join(tdir, base + ".ans")):
            n += 1
    return n


def read_yaml_title(yaml_path):
    """极简 yaml：只取 title / pid"""
    title, pid = None, None
    try:
        with open(yaml_path, encoding="utf-8", errors="replace") as f:
            for line in f:
                m = re.match(r"^title:\s*(.+)$", line.strip())
                if m and title is None:
                    title = m.group(1).strip().strip('"').strip("'")
                m = re.match(r"^pid:\s*(.+)$", line.strip())
                if m and pid is None:
                    pid = m.group(1).strip().strip('"').strip("'")
    except Exception:
        pass
    return title, pid


def scan_pack(root):
    """扫描一个题包：返回 {归一化标题: (目录, in文件数)}"""
    found = {}
    if not os.path.isdir(root):
        return found
    for dirpath, dirnames, filenames in os.walk(root):
        if "problem.yaml" in filenames:
            n = count_in_files(os.path.join(dirpath, "testdata"))
            title, pid = read_yaml_title(os.path.join(dirpath, "problem.yaml"))
            if not title:
                title = os.path.basename(dirpath)
            found[norm(title)] = (dirpath, n)
            dirnames[:] = []  # 不再往下钻
    return found


def main():
    # 1. 数据库侧：id, 标题, 测试点数, 描述(用于提取东方博宜 id)
    rows = db_query(
        "SELECT p.id, p.title, count(tc.id) FROM problems p "
        "LEFT JOIN test_cases tc ON tc.problem_id = p.id GROUP BY p.id, p.title"
    )
    desc_rows = db_query("SELECT id, left(description, 200) FROM problems")
    desc_map = {r[0]: r[1] for r in desc_rows if len(r) >= 2}

    db_by_title = {}
    db_by_dfb = {}
    for pid, title, cnt in rows:
        db_by_title[norm(title)] = (pid, title, int(cnt))
        d = desc_map.get(pid, "")
        m = re.search(r"dongfangboyi-id:\s*(\d+)", d)
        if m:
            db_by_dfb[m.group(1)] = (pid, title, int(cnt))

    print(f"数据库：{len(rows)} 道题")
    results = []

    # 2. 东方博宜：按 dongfangboyi-id 精确匹配
    dfb_root = os.path.join(HYDROJ, "东方博宜OJ-1042题")
    dfb_matched = dfb_mismatch = 0
    if os.path.isdir(dfb_root):
        for d in sorted(os.listdir(dfb_root), key=lambda x: (len(x), x)):
            dpath = os.path.join(dfb_root, d)
            if not os.path.isdir(dpath):
                continue
            src_n = count_in_files(os.path.join(dpath, "testdata"))
            rec = db_by_dfb.get(d)
            if not rec:
                continue
            pid, title, db_n = rec
            dfb_matched += 1
            if src_n != db_n:
                dfb_mismatch += 1
                results.append(("东方博宜", d, pid, title, src_n, db_n))
    print(f"东方博宜：比对 {dfb_matched} 题，不一致 {dfb_mismatch} 题")

    # 3. hydro / 炼石noip：按标题匹配
    for pack in ("hydro", "炼石noip"):
        mapping = scan_pack(os.path.join(HYDROJ, pack))
        matched = mismatch = 0
        for t, (dirpath, src_n) in mapping.items():
            rec = db_by_title.get(t)
            if not rec:
                continue
            pid, title, db_n = rec
            matched += 1
            if src_n != db_n:
                mismatch += 1
                results.append((pack, os.path.relpath(dirpath, HYDROJ), pid, title, src_n, db_n))
        print(f"{pack}：比对 {matched} 题，不一致 {mismatch} 题")

    # 4. 输出报告
    report = os.path.join(OUT_DIR, "测试数据一致性校验.md")
    csv_path = os.path.join(OUT_DIR, "测试数据一致性校验.csv")
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["题包", "源目录", "题目ID", "标题", "源文件测试点数", "数据库测试点数", "差异"])
        for r in results:
            w.writerow(list(r) + [r[5] - r[4]])

    with open(report, "w", encoding="utf-8") as f:
        f.write("# 测试数据一致性校验报告\n\n")
        f.write("校验方式：数据库每题测试点数量 vs 源数据目录里有配套输出的 .in 文件数量\n\n")
        f.write(f"- 数据库题目总数：**{len(rows)}**\n")
        f.write(f"- 不一致题目数：**{len(results)}**\n\n")
        if not results:
            f.write("## 结论：全部一致，未发现测试点丢失或合并。\n")
        else:
            f.write("| 题包 | 源目录 | 标题 | 源测试点 | 库内测试点 |\n")
            f.write("|---|---|---|---|---|\n")
            for pack, dirp, pid, title, src_n, db_n in results:
                f.write(f"| {pack} | {dirp} | {title} | {src_n} | {db_n} |\n")
    print(f"\n报告：{report}\n明细：{csv_path}")


if __name__ == "__main__":
    main()
