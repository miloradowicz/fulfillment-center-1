import { Component, ErrorInfo, ComponentType } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

interface State {
  hasError: boolean
}

export const ErrorBoundary = <P extends object>(
  WrappedComponent: ComponentType<P>,
): ComponentType<P> => {
  return class GlobalErrorBoundary extends Component<P, State> {
    state: State = {
      hasError: false,
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('React component error:', error, errorInfo)
      this.showError(error)
    }

    componentDidMount() {
      window.addEventListener('error', this.handleWindowError)
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection)

      axios.interceptors.response.use(
        response => response,
        error => {
          console.error('Axios error:', error)
          this.showError(error)
          return Promise.reject(error)
        },
      )
    }

    componentWillUnmount() {
      window.removeEventListener('error', this.handleWindowError)
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
    }

    handleWindowError = (event: ErrorEvent) => {
      console.error('Window error:', event.error)
      this.showError(event.error)
    }

    handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      this.showError(event.reason)
    }

    showError = (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Неизвестная ошибка'
      toast.error(`Ошибка: ${ message }`)
    }

    render() {
      return (
        <>
          <WrappedComponent {...this.props} />
        </>
      )
    }
  }
}

