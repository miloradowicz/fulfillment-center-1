import { ComponentType } from 'react'
import { toast } from 'react-toastify'

type RequestFunction = <T = unknown>(fn: () => Promise<T>) => Promise<T | null>;

export interface WithRequestHandlerProps {
  request: RequestFunction;
}

interface AxiosLikeError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function withRequestHandler<P>(
  WrappedComponent: ComponentType<P & WithRequestHandlerProps>,
) {
  const ComponentWithRequestHandler = (props: P) => {
    const request: RequestFunction = async fn => {
      try {
        const result = await fn()
        return result
      } catch (error: unknown) {
        let message = 'Произошла ошибка при выполнении запроса'

        if (error instanceof Error) {
          message = error.message
        }

        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error
        ) {
          const axiosError = error as AxiosLikeError
          const backendMessage = axiosError.response?.data?.message
          if (typeof backendMessage === 'string') {
            message = backendMessage
          }
        }

        toast.error(message)
        return null
      }
    }

    return <WrappedComponent {...props} request={request} />
  }

  return ComponentWithRequestHandler
}
