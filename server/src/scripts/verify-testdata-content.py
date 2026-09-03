#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
在数量校验结果基础上，用「内容指纹(md5)比对」筛掉同名不同题的误报。

为什么用 md5：测试点内容含换行，直接取文本会冲垮行格式、且体积巨大。
统一归一化后再算指纹：\r\n -> \n，去掉尾部换行。

判定：
- 有交集 且 库内是源的子集  → 真缺失（可安全补充）
- 有交集 且 库内比源多      → 是补充的隐藏测试点（非缺陷）
- 无交集                    → 同名不同题（误报，跳过）

只读，不写库。
"""
import os
import csv
import hashlib
import subprocess

ROOT = r"E:\DKL"
HYDROJ = os.path.join(ROOT, "hydroj")
OUT = os.path.join(ROOT, "docs", "reports")


def db_query(sql):
    p = subprocess.run(
        ["docker", "exec", "dkl-postgres", "psql", "-U", "dkl", "-d", "dkl_db",
         "-t", "-A", "-F", "\t", "-c", sql],
        capture_output=True, encoding="utf-8", errors="replace")
    return [ln.split("\t") for ln in p.stdout.splitlines() if ln.strip()]


def norm(s):
    return s.replace("\r\n", "\n").rstrip("\n")


def fp(s):
    return hashlib.md5(norm(s).encode("utf-8")).hexdigest()


def read_cases(tdir):
    cases = []
    if not os.path.isdir(tdir):
        return cases
    files = sorted([f for f in os.listdir(tdir) if f.endswith(".in")],
                   key=lambda x: (len(x), x))
    for f in files:
        base = f[:-3]
        out_p = os.path.join(tdir, base + ".out")
        if not os.path.exists(out_p):
            out_p = os.path.join(tdir, base + ".ans")
        if not os.path.exists(out_p):
            continue
        with open(os.path.join(tdir, f), encoding="utf-8", errors="replace") as fh:
            inp = fh.read()
        with open(out_p, encoding="utf-8", errors="replace") as fh:
            out = fh.read()
        cases.append((inp, out))
    return cases


def main():
    rows = list(csv.DictReader(open(os.path.join(OUT, "测试数据一致性校验.csv"),
                                    encoding="utf-8-sig")))
    pids = [r["题目ID"] for r in rows]
    in_list = ",".join("'" + p + "'" for p in pids)

    # 用 SQL 侧算指纹，避免把大文本拉出来
    sql = ("SELECT problem_id, md5(rtrim(replace(input, E'\\r\\n', E'\\n'), E'\\n')) "
           f"FROM test_cases WHERE problem_id IN ({in_list})")
    db_fp = {}
    for pid, h in db_query(sql):
        db_fp.setdefault(pid, set()).add(h)

    real_missing, extra, false_pos = [], [], []

    for r in rows:
        pid = r["题目ID"]
        rel = r["源目录"]
        base = os.path.join(HYDROJ, "东方博宜OJ-1042题", rel) if r["题包"] == "东方博宜" \
            else os.path.join(HYDROJ, rel.replace("/", os.sep))
        src_cases = read_cases(os.path.join(base, "testdata"))
        if not src_cases:
            continue
        src_set = {fp(a) for a, _ in src_cases}
        db_set = db_fp.get(pid, set())

        if not (db_set & src_set):
            false_pos.append((r, "内容无交集（同名不同题）"))
        elif db_set < src_set:
            real_missing.append((r, src_cases))
        elif src_set < db_set:
            extra.append((r, "库内更多（补充的隐藏测试点）"))

    print(f"候选差异 {len(rows)} 条")
    print(f"  [真缺失] 可安全补充：{len(real_missing)} 题")
    print(f"  [非缺陷] 库内更多（补充的隐藏测试点）：{len(extra)} 题")
    print(f"  [误报]   同名不同题：{len(false_pos)} 题\n")

    p = os.path.join(OUT, "测试数据-真缺失明细.csv")
    with open(p, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["题包", "源目录", "题目ID", "标题", "源测试点", "库内测试点", "待补"])
        for r, src_cases in real_missing:
            w.writerow([r["题包"], r["源目录"], r["题目ID"], r["标题"],
                        len(src_cases), r["数据库测试点数"],
                        len(src_cases) - int(r["数据库测试点数"])])
    print(f"真缺失明细 -> {p}")
    for r, src_cases in real_missing[:15]:
        n_db = int(r["数据库测试点数"])
        print(f"  {r['标题'][:22]:24s} 源{len(src_cases):>2d} 库{n_db:>2d} 补{len(src_cases)-n_db:>2d}")


if __name__ == "__main__":
    main()
