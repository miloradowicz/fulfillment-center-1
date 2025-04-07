import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import ClientForm from '../features/clients/components/ClientForm'
import { useClientForm } from '../features/clients/hooks/useClientForm'
import { ChangeEvent } from 'react'

beforeAll(() => {
  Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    value: function () {
      const event = new Event('submit', { bubbles: true, cancelable: true })
      this.dispatchEvent(event)
    },
    configurable: true,
  })
})


jest.mock('../features/clients/hooks/useClientForm', () => ({
  useClientForm: jest.fn(),
}))
jest.mock('redux-persist/es/constants', () => ({
  FLUSH: 'FLUSH',
  PAUSE: 'PAUSE',
  PERSIST: 'PERSIST',
  PURGE: 'PURGE',
  REGISTER: 'REGISTER',
  REHYDRATE: 'REHYDRATE',
}))

describe('ClientForm', () => {
  it('should render the form with default values when no client is provided', () => {
    (useClientForm as jest.Mock).mockReturnValue({
      form: {
        name: '',
        phone_number: '',
        email: '',
        inn: '',
        address: '',
        banking_data: '',
        ogrn: '',
      },
      loading: false,
      inputChangeHandler: jest.fn(),
      onSubmit: jest.fn(),
      getFieldError: jest.fn(),
    })

    render(
      <Provider store={store}>
        <ClientForm />
      </Provider>,
    )

    // Проверяем, что все поля формы присутствуют
    expect(screen.getByLabelText(/ФИО \/ Название компании \*/i)).toBeTruthy()
    expect(screen.getByLabelText(/Номер телефона \*/i)).toBeTruthy()
    expect(screen.getByLabelText(/Эл. почта \*/i)).toBeTruthy()
    expect(screen.getByLabelText(/ИНН \*/i)).toBeTruthy()
    expect(screen.getByLabelText(/Адрес/i)).toBeTruthy()
    expect(screen.getByLabelText(/Банковские реквизиты/i)).toBeTruthy()
    expect(screen.getByLabelText(/ОГРН/i)).toBeTruthy()
  })

  it('should call the submit function when the form is submitted', async () => {
    const mockOnSubmit = jest.fn()
    const mockInputChangeHandler: jest.Mock<void, [ChangeEvent<HTMLInputElement>]> = jest.fn();

    // Мокируем хук с реальными данными
    (useClientForm as jest.Mock).mockReturnValue({
      form: {
        name: 'John Doe',
        phone_number: '+1234567890',
        email: 'johndoe@example.com',
        inn: '1234567890',
        address: '123 Street',
        banking_data: 'Bank XYZ',
        ogrn: '123456789',
      },
      loading: false,
      inputChangeHandler: mockInputChangeHandler,
      onSubmit: mockOnSubmit,
      getFieldError: jest.fn(),
    })

    render(
      <Provider store={store}>
        <ClientForm />
      </Provider>,
    )

    const nameInput = screen.getByLabelText(/ФИО \/ Название компании \*/i)
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })

    const submitButton = screen.getByText(/Создать клиента/i)
    fireEvent.click(submitButton)

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledTimes(1))
  })

  it('should display error message if name field is empty and form is submitted', async () => {
    (useClientForm as jest.Mock).mockReturnValue({
      form: {
        name: '',
        phone_number: '',
        email: '',
        inn: '',
        address: '',
        banking_data: '',
        ogrn: '',
      },
      loading: false,
      inputChangeHandler: jest.fn(),
      onSubmit: jest.fn(),
      getFieldError: (field: string) => (field === 'name' ? 'Поле не может быть пустым' : ''),
    })

    render(
      <Provider store={store}>
        <ClientForm />
      </Provider>,
    )

    const submitButton = screen.getByText(/Создать клиента/i)
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorMessage = screen.queryByText('Поле не может быть пустым')
      expect(errorMessage).not.toBeNull()
      expect(errorMessage).toBeTruthy()
    })
  })
})
