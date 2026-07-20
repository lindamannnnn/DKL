import json, yaml, re, os
from pathlib import Path

BASE = Path("C:/Users/kass/AppData/Local/Temp/gesp_exams/GESP客观题-更新至202509")
REPORT_DIR = Path("E:/DKL/docs/reports")

with open(REPORT_DIR / "gesp1_my_answers.json", encoding="utf-8") as f:
    data = json.load(f)

def extract_questions(md_path):
    text = md_path.read_text(encoding="utf-8")
    # split by select markers
    parts = re.split(r"\{\{\s*select\((\d+)\)\s*\}\}", text)
    # parts[0] is preamble, then alternating qnum, body
    questions = {}
    if len(parts) < 2:
        return questions
    for i in range(1, len(parts), 2):
        qnum = parts[i].strip()
        body = parts[i+1] if i+1 < len(parts) else ""
        # find options: lines starting with '- '
        opts = re.findall(r"^-\s*(.+)$", body, re.MULTILINE)
        questions[qnum] = {"body": body.strip(), "options": opts}
    return questions

def normalize_answer(ans, options):
    a = str(ans).strip()
    if a in ("A", "B", "C", "D"):
        return a
    if not options:
        return a
    # compare with option text
    first = options[0].strip().lstrip("`").rstrip("`")
    second = options[1].strip().lstrip("`").rstrip("`") if len(options) > 1 else ""
    if a in (first, "正确", "对"):
        return "A"
    if a in (second, "错误", "错"):
        return "B"
    return a

results = []
for exam in data["exams"]:
    src = exam["source"]
    exam_dir = BASE / src
    config_path = exam_dir / "testdata" / "config.yaml"
    md_path = exam_dir / "problem_zh.md"
    with open(config_path, encoding="utf-8") as f:
        config = yaml.safe_load(f)
    questions = extract_questions(md_path)
    correct_map = {}
    for k, v in config.get("answers", {}).items():
        qnum = str(k)
        ans_text = v[0] if isinstance(v, (list, tuple)) else v
        opts = questions.get(qnum, {}).get("options", [])
        correct_map[qnum] = normalize_answer(ans_text, opts)
    my_ans = exam["answers"]
    wrongs = []
    answered = 0
    for qnum in sorted(questions.keys(), key=lambda x: int(x)):
        mine = my_ans.get(qnum, "UNANSWERED")
        correct = correct_map.get(qnum, "?")
        if mine == "UNANSWERED":
            continue
        answered += 1
        if mine != correct:
            qinfo = questions[qnum]
            wrongs.append({
                "qnum": qnum,
                "body": qinfo["body"],
                "options": qinfo["options"],
                "my": mine,
                "correct": correct,
            })
    results.append({
        "id": exam["id"],
        "source": src,
        "total": len(questions),
        "answered": answered,
        "wrong_count": len(wrongs),
        "wrongs": wrongs,
    })

with open(REPORT_DIR / "gesp1_comparison.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(json.dumps(results, ensure_ascii=False, indent=2))
