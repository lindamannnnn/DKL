# -*- coding: utf-8 -*-
"""客观测量：GESP3-09 每页最长连续中文字符数 + 代码块行数"""
import re, io, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

path = r"E:\DKL\server\courses\gesp3\12-模拟算法.md"
lines = open(path, encoding="utf-8").read().splitlines()

# 分页：按 ## 标题
pages = []  # (title, start_line, [lines])
cur_title, cur_start, cur = "（开头）", 1, []
for i, ln in enumerate(lines, 1):
    if ln.startswith("## "):
        pages.append((cur_title, cur_start, cur))
        cur_title, cur_start, cur = ln[3:].strip(), i, []
    else:
        cur.append((i, ln))
pages.append((cur_title, cur_start, cur))

CJK = re.compile(r"[一-鿿]+")

print("=== A. 每页最长连续中文字符数（标点/英文/代码均断开）===")
for title, start, body in pages:
    if title == "（开头）":
        continue
    in_code = False
    best, best_line, best_txt = 0, 0, ""
    for no, ln in body:
        if ln.strip().startswith("```"):
            in_code = not in_code
            continue
        if in_code or ln.strip().startswith("<!--"):
            continue
        for m in CJK.finditer(ln):
            if len(m.group()) > best:
                best, best_line, best_txt = len(m.group()), no, m.group()
    flag = "✅" if best <= 80 else "❌超标"
    print(f"[{title}] 最长 {best} 字 @行{best_line} {flag}  「{best_txt}」")

print()
print("=== C. 代码块行数 ===")
in_code, start_ln, buf = False, 0, []
blocks = []
for i, ln in enumerate(lines, 1):
    if ln.strip().startswith("```"):
        if not in_code:
            in_code, start_ln, buf = True, i, []
        else:
            in_code = False
            blocks.append((start_ln, i, len(buf)))
        continue
    if in_code:
        buf.append(ln)
for s, e, n in blocks:
    print(f"代码块 行{s}-{e}: {n} 行")
