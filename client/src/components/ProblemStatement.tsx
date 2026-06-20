interface ProblemStatementProps {
  title?: string
  description: string
  inputDesc?: string | null
  outputDesc?: string | null
  sampleInput?: string | null
  sampleOutput?: string | null
  sampleExplanation?: string | null
}

function stripHtmlTags(html: string): string {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function hasRealContent(html: string | null | undefined): boolean {
  if (!html) return false
  const text = stripHtmlTags(html).trim()
  return text.length > 0
}

export default function ProblemStatement({
  title,
  description,
  inputDesc,
  outputDesc,
  sampleInput,
  sampleOutput,
  sampleExplanation,
}: ProblemStatementProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {title && <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>}

      {/* 题目描述 */}
      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="w-1 h-4 bg-primary-500 rounded-full" />
          题目描述
        </h3>
        <div className="prose prose-gray max-w-none text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </section>

      {/* 输入说明 */}
      {hasRealContent(inputDesc) && (
        <section className="mt-5">
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary-500 rounded-full" />
            输入格式
          </h3>
          <div className="prose prose-gray max-w-none text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: inputDesc! }} />
          </div>
        </section>
      )}

      {/* 输出说明 */}
      {hasRealContent(outputDesc) && (
        <section className="mt-5">
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary-500 rounded-full" />
            输出格式
          </h3>
          <div className="prose prose-gray max-w-none text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: outputDesc! }} />
          </div>
        </section>
      )}

      {/* 样例输入 / 样例输出 */}
      {(sampleInput || sampleOutput) && (
        <section className="mt-5">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary-500 rounded-full" />
            样例
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {sampleInput && (
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                  样例输入
                </div>
                <pre className="p-3 text-sm font-mono text-gray-800 bg-white overflow-x-auto whitespace-pre-wrap">
                  {sampleInput}
                </pre>
              </div>
            )}
            {sampleOutput && (
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                  样例输出
                </div>
                <pre className="p-3 text-sm font-mono text-gray-800 bg-white overflow-x-auto whitespace-pre-wrap">
                  {sampleOutput}
                </pre>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 样例说明 */}
      {hasRealContent(sampleExplanation) && (
        <section className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <strong className="font-semibold">说明：</strong>
          <div className="mt-1 prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: sampleExplanation! }} />
        </section>
      )}
    </div>
  )
}
