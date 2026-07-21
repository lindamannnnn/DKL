import re, io, sys

path = r"E:\DKL\server\courses\gesp3\04-练习课：数组基础.md"
text = io.open(path, encoding="utf-8").read()

# split into pages by '## ' headers
pages = re.split(r'(?m)^## ', text)
# first chunk is title/goal
chunks = []
for i, p in enumerate(pages):
    if i == 0:
        title = "(开头/目标)"
    else:
        title = p.splitlines()[0].strip()
    chunks.append((title, p))

cjk = re.compile(r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]+')

for title, body in chunks:
    # remove code fences for text measurement
    no_code = re.sub(r'```.*?```', '', body, flags=re.S)
    # strip html comments
    no_comments = re.sub(r'<!--.*?-->', '', no_code, flags=re.S)
    best = 0; best_str = ""
    for line in no_comments.splitlines():
        for m in cjk.finditer(line):
            s = m.group()
            # count chars excluding pure punctuation? keep as-is (CJK chars incl fullwidth punct)
            if len(s) > best:
                best = len(s); best_str = s
    # code lines in demo blocks
    demos = re.findall(r'```cpp\n(.*?)```', body, flags=re.S)
    demo_lines = [len([l for l in d.splitlines() if l.strip()]) for d in demos]
    print(f"页[{title}] 最长连续中文={best} | 示例代码行数={demo_lines}")
    if best > 0:
        print(f"    最长句: {best_str[:100]}")
