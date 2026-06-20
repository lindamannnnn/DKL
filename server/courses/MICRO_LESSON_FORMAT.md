# 微课课件格式规范

> 面向 4-6 年级小学生的自学课件，每页只讲一个概念，必须配互动。

## 核心原则

1. **一页一概念**：每个 `## ` 标题对应一个知识点或故事节点。
2. **少文字**：每页正文不超过 2 行短句，优先用 emoji、代码、图标表达。
3. **必互动**：每页必须包含至少一个 `<!-- card -->`、`<!-- demo -->` 或 `<!-- checkpoint -->`。
4. **检查点锁页**：`<!-- checkpoint -->` 内的 Quiz 必须答对，才能解锁下一页。
5. **正向反馈**：课件本身不需要写鼓励语，前端会自动在答对/完成时弹出庆祝。

## 支持的块类型

### 1. 故事块 `<!-- story -->`

用于课程开场或过渡，吸引小朋友注意力。文字要短，像绘本一样。

```markdown
## 故事：你好呀，小电脑！

<!-- story -->
小明买了一台新电脑，兴奋地问：

> 妈妈，电脑是怎么听懂我说话的呀？

妈妈笑着说：电脑会听一种特别的语言，叫做**程序**。我们今天就来认识它！
<!-- end-story -->
```

### 2. 知识卡片 `<!-- card -->`

只讲一个小点，由"老师"或"小电脑"说出来。

```markdown
## 卡片：Dev-C++ 是魔法工具

<!-- card type:teacher -->
🧑‍🏫 Dev-C++ 就像一支魔法笔。用它写出程序，电脑就能执行。
<!-- end-card -->
```

type 可选值：
- `teacher`：老师说话（默认）
- `computer`：小电脑说话
- `tip`：小贴士

### 3. 代码演示 `<!-- demo -->`

必须可运行，代码不超过 8 行。

```markdown
<!-- demo -->
```cpp
#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
```
<!-- end-demo -->
```

### 4. 检查点 `<!-- checkpoint -->`

必须答对才能进入下一页。内部只能包含一个 Quiz。

```markdown
## 检查点：程序从哪开始？

<!-- checkpoint -->
<!-- quiz: choice -->
程序是从哪个函数开始执行的？
A. main
B. cout
C. return
<!-- answer: A -->
<!-- end-checkpoint -->
```

### 5. 折叠提示 `<!-- hint -->`

可选，用于给需要帮助的学生额外提示。

```markdown
<!-- hint -->
如果黑框框一闪而过，可以在 `return 0;` 前加 `system("pause");`
<!-- end-hint -->
```

### 6. 编程题引用 `<!-- problem: id -->`

课后挑战题，放在课程最后一页。

```markdown
## 课后挑战

<!-- problem: problem-id-uuid -->
```

## 一节课的标准结构

```markdown
# 课程XX：标题

> 目标：一句话说明学完能做什么

## 故事：XXXX
<!-- story --> ... <!-- end-story -->

## 卡片：概念 A
<!-- card type:teacher --> ... <!-- end-card -->
<!-- demo --> ... <!-- end-demo -->
<!-- checkpoint --> ... <!-- end-checkpoint -->

## 卡片：概念 B
...

## 课后挑战
<!-- problem: xxx -->
```

## 编写 checklist

- [ ] 每个 `## ` 标题控制在 8 个字以内
- [ ] 每页至少一个 card / demo / checkpoint
- [ ] 每段文字不超过 2 行
- [ ] 代码块不超过 8 行
- [ ] 每个 checkpoint 只有一个 quiz
- [ ] 不使用复杂表格，数据用代码演示代替
- [ ] 多用 emoji，少用抽象术语

## 旧课件迁移说明

旧课件使用 `<!-- quiz: choice -->`、`<!-- quiz: fill -->`、`<!-- hint -->`、`<!-- coach-tip -->`、`<!-- run -->` 等标记，仍可被解析器兼容。
迁移时，建议把旧课件拆分为上述新结构：
1. 把大段说明改为 `<!-- card -->`
2. 把长代码块缩短，并包入 `<!-- demo -->`
3. 在关键位置插入 `<!-- checkpoint -->` 强制互动
