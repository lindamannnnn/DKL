import { marked } from 'marked'

export interface ContentBlock {
  type: 'markdown' | 'code' | 'quiz' | 'problem' | 'hint' | 'coach-tip' | 'story' | 'card' | 'demo' | 'checkpoint'
  content: string
  language?: string
  metadata?: Record<string, any>
}

export interface LessonPage {
  title: string
  blocks: ContentBlock[]
  hasCheckpoint: boolean
}

/**
 * 读取一个以 <!-- ... --> 标记包裹的块
 */
function readTaggedBlock(
  lines: string[],
  startIdx: number,
  startTag: string,
  endTag: string
): { content: string[]; nextIdx: number } {
  const content: string[] = []
  let i = startIdx + 1
  while (i < lines.length && lines[i].trim() !== endTag) {
    content.push(lines[i])
    i++
  }
  return { content, nextIdx: i + 1 }
}

/**
 * 解析一个 checkpoint 块内部的 quiz
 */
function parseCheckpointQuiz(lines: string[], startIdx: number): { block: ContentBlock; nextIdx: number } | null {
  let i = startIdx
  // 跳过空行直到遇到 quiz 标记
  while (i < lines.length && lines[i].trim() === '') i++

  const line = lines[i]?.trim()
  if (line === '<!-- quiz: choice -->') {
    const quizLines: string[] = []
    i++
    while (i < lines.length && !lines[i].trim().startsWith('<!-- answer:')) {
      quizLines.push(lines[i])
      i++
    }
    let answer = ''
    if (i < lines.length && lines[i].trim().startsWith('<!-- answer:')) {
      answer = lines[i].trim().replace('<!-- answer:', '').replace('-->', '').trim()
      i++
    }
    return {
      block: {
        type: 'quiz',
        content: quizLines.join('\n').trim(),
        metadata: { type: 'choice', answer },
      },
      nextIdx: i,
    }
  }

  if (line === '<!-- quiz: fill -->') {
    const quizLines: string[] = []
    i++
    let answer = ''
    while (i < lines.length) {
      if (lines[i].trim().startsWith('<!-- answer:')) {
        answer = lines[i].trim().replace('<!-- answer:', '').replace('-->', '').trim()
        i++
        break
      }
      quizLines.push(lines[i])
      i++
    }
    return {
      block: {
        type: 'quiz',
        content: quizLines.join('\n').trim(),
        metadata: { type: 'fill', answer },
      },
      nextIdx: i,
    }
  }

  return null
}

/**
 * 解析 Markdown 课件为结构化内容块
 */
export function parseLessonMarkdown(raw: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  const lines = raw.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    // 故事块
    if (line === '<!-- story -->') {
      const { content, nextIdx } = readTaggedBlock(lines, i, '<!-- story -->', '<!-- end-story -->')
      blocks.push({ type: 'story', content: content.join('\n').trim() })
      i = nextIdx
      continue
    }

    // 知识卡片
    if (line.startsWith('<!-- card')) {
      const typeMatch = line.match(/type:(\w+)/)
      const cardType = typeMatch ? typeMatch[1] : 'teacher'
      const { content, nextIdx } = readTaggedBlock(lines, i, line, '<!-- end-card -->')
      blocks.push({
        type: 'card',
        content: content.join('\n').trim(),
        metadata: { type: cardType },
      })
      i = nextIdx
      continue
    }

    // 代码演示块
    if (line === '<!-- demo -->') {
      // demo 内必须是一个代码块
      let j = i + 1
      while (j < lines.length && lines[j].trim() === '') j++
      if (j < lines.length && lines[j].trim().startsWith('```')) {
        const lang = lines[j].trim().slice(3).trim()
        const codeLines: string[] = []
        j++
        while (j < lines.length && !lines[j].trim().startsWith('```')) {
          codeLines.push(lines[j])
          j++
        }
        j++ // 跳过 ```
        blocks.push({
          type: 'demo',
          content: codeLines.join('\n').trim(),
          language: lang || 'cpp',
          metadata: { runnable: true },
        })
      }
      // 跳过 demo 结束标记
      while (j < lines.length && lines[j].trim() !== '<!-- end-demo -->') j++
      i = j + 1
      continue
    }

    // 检查点
    if (line === '<!-- checkpoint -->') {
      const { content, nextIdx } = readTaggedBlock(lines, i, '<!-- checkpoint -->', '<!-- end-checkpoint -->')
      const innerLines = content
      const quizResult = parseCheckpointQuiz(innerLines, 0)
      if (quizResult) {
        blocks.push({
          type: 'checkpoint',
          content: '',
          metadata: { quiz: quizResult.block },
        })
      }
      i = nextIdx
      continue
    }

    // 代码块（旧格式兼容）
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      let isRunnable = false

      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // 跳过 ```

      // 检查下一个注释是否是 <!-- run -->
      if (i < lines.length && lines[i].trim() === '<!-- run -->') {
        isRunnable = true
        i++
      }

      blocks.push({
        type: 'code',
        content: codeLines.join('\n'),
        language: lang || 'cpp',
        metadata: { runnable: isRunnable },
      })
      continue
    }

    // 选择题（旧格式兼容）
    if (line === '<!-- quiz: choice -->') {
      const quizLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('<!-- answer:')) {
        quizLines.push(lines[i])
        i++
      }
      let answer = ''
      if (i < lines.length && lines[i].trim().startsWith('<!-- answer:')) {
        answer = lines[i].trim().replace('<!-- answer:', '').replace('-->', '').trim()
        i++
      }

      blocks.push({
        type: 'quiz',
        content: quizLines.join('\n').trim(),
        metadata: { type: 'choice', answer },
      })
      continue
    }

    // 填空题（旧格式兼容）
    if (line === '<!-- quiz: fill -->') {
      const quizLines: string[] = []
      i++
      let answer = ''
      while (i < lines.length) {
        if (lines[i].trim().startsWith('<!-- answer:')) {
          answer = lines[i].trim().replace('<!-- answer:', '').replace('-->', '').trim()
          i++
          break
        }
        quizLines.push(lines[i])
        i++
      }

      blocks.push({
        type: 'quiz',
        content: quizLines.join('\n').trim(),
        metadata: { type: 'fill', answer },
      })
      continue
    }

    // 编程题引用
    if (line.startsWith('<!-- problem:')) {
      const problemId = line.replace('<!-- problem:', '').replace('-->', '').trim()
      blocks.push({
        type: 'problem',
        content: '',
        metadata: { problemId },
      })
      i++
      continue
    }

    // 提示折叠
    if (line === '<!-- hint -->') {
      const { content, nextIdx } = readTaggedBlock(lines, i, '<!-- hint -->', '<!-- end-hint -->')
      blocks.push({ type: 'hint', content: content.join('\n').trim() })
      i = nextIdx
      continue
    }

    // 教练提示
    if (line === '<!-- coach-tip -->') {
      const { content, nextIdx } = readTaggedBlock(lines, i, '<!-- coach-tip -->', '<!-- end-coach-tip -->')
      blocks.push({ type: 'coach-tip', content: content.join('\n').trim() })
      i = nextIdx
      continue
    }

    // 普通 Markdown 内容（累积直到遇到特殊标记）
    const mdLines: string[] = []
    while (i < lines.length) {
      const current = lines[i].trim()
      if (
        current.startsWith('```') ||
        current === '<!-- quiz: choice -->' ||
        current === '<!-- quiz: fill -->' ||
        current.startsWith('<!-- problem:') ||
        current === '<!-- hint -->' ||
        current === '<!-- coach-tip -->' ||
        current === '<!-- story -->' ||
        current.startsWith('<!-- card') ||
        current === '<!-- demo -->' ||
        current === '<!-- checkpoint -->'
      ) {
        break
      }
      mdLines.push(lines[i])
      i++
    }

    if (mdLines.length > 0) {
      const content = mdLines.join('\n').trim()
      if (content) {
        blocks.push({
          type: 'markdown',
          content,
        })
      }
    }
  }

  return blocks
}

/**
 * 从 Markdown 提取章节和课时结构
 */
export function parseCourseStructure(raw: string) {
  const lines = raw.split('\n')
  const chapters: { title: string; lessons: { title: string; raw: string }[] }[] = []
  let currentChapter: { title: string; lessons: { title: string; raw: string }[] } | null = null
  let currentLesson: { title: string; raw: string } | null = null
  let currentLessonLines: string[] = []

  for (const line of lines) {
    if (line.startsWith('# ')) {
      // 新的章节
      if (currentLesson) {
        currentLesson.raw = currentLessonLines.join('\n').trim()
        currentChapter!.lessons.push(currentLesson)
        currentLessonLines = []
      }
      if (currentChapter) {
        chapters.push(currentChapter)
      }
      currentChapter = {
        title: line.replace('# ', '').trim(),
        lessons: [],
      }
      currentLesson = null
    } else if (line.startsWith('## ')) {
      // 新的课时
      if (currentLesson) {
        currentLesson.raw = currentLessonLines.join('\n').trim()
        currentChapter!.lessons.push(currentLesson)
        currentLessonLines = []
      }
      currentLesson = {
        title: line.replace('## ', '').trim(),
        raw: '',
      }
    } else {
      currentLessonLines.push(line)
    }
  }

  if (currentLesson && currentChapter) {
    currentLesson.raw = currentLessonLines.join('\n').trim()
    currentChapter.lessons.push(currentLesson)
  }
  if (currentChapter) {
    chapters.push(currentChapter)
  }

  return chapters
}

/**
 * 按 `## ` 标题将课件拆分为多个页面（微课模式）
 */
export function parseLessonPages(raw: string): LessonPage[] {
  const lines = raw.split('\n')
  const pages: LessonPage[] = []
  let currentTitle = ''
  let currentLines: string[] = []
  let courseTitleLine = ''

  for (const line of lines) {
    // 课程主标题（# 开头）不计入页面，作为课程标题
    if (line.startsWith('# ')) {
      courseTitleLine = line.replace('# ', '').trim()
      continue
    }

    if (line.startsWith('## ')) {
      if (currentTitle || currentLines.length > 0) {
        const blocks = parseLessonMarkdown(currentLines.join('\n'))
        pages.push({
          title: currentTitle,
          blocks,
          hasCheckpoint: blocks.some((b) => b.type === 'checkpoint'),
        })
      }
      currentTitle = line.replace('## ', '').trim()
      currentLines = []
    } else if (line.trim() === '---') {
      // 页面分隔线，跳过
      continue
    } else {
      currentLines.push(line)
    }
  }

  if (currentTitle || currentLines.length > 0) {
    const blocks = parseLessonMarkdown(currentLines.join('\n'))
    pages.push({
      title: currentTitle,
      blocks,
      hasCheckpoint: blocks.some((b) => b.type === 'checkpoint'),
    })
  }

  // 如果第一页没有标题（# 和第一个 ## 之间的内容），合并到第一个有标题的页面
  if (pages.length > 1 && !pages[0].title && pages[0].blocks.length > 0) {
    const preamble = pages.shift()!
    pages[0].blocks = [...preamble.blocks, ...pages[0].blocks]
  }

  return pages
}

/**
 * 渲染 Markdown 为 HTML（用于需要服务端渲染的场景）
 */
export async function renderMarkdown(md: string): Promise<string> {
  return marked.parse(md)
}
