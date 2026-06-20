import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: any
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full border border-red-200">
              <h1 className="text-2xl font-bold text-red-600 mb-4">😵 页面出错了</h1>
              <p className="text-gray-600 mb-4">请把下面的错误信息截图发给开发老师：</p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono mb-4">
                <p className="text-red-400 font-bold">{this.state.error?.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-gray-400 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors"
              >
                刷新页面
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
