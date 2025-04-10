import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ClientForm from '../features/clients/components/ClientForm'
import { useClientForm } from '../features/clients/hooks/useClientForm'
import { Client } from '@/types'

beforeAll(() => {
  Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    value: function () {
      this.dispatchEvent(new Event('submit'))
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

const mockStore = configureStore({
  reducer: {
    client: (state = {}) => state,
  },
})

const mockClient: Client = {
  _id: '123',
  name: 'Тестовая компания',
  phone_number: '+7 999 123 4567',
  email: 'test@example.com',
  inn: '1234567890',
  address: 'ул. Тестовая, 123',
  banking_data: 'Тест Банк, Р/С: 40702810123456789012',
  ogrn: '1234567890123',
}

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
      <Provider store={mockStore}>
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

    expect(screen.getByText('Добавить нового клиента')).toBeTruthy()

    expect(screen.getByText('Создать клиента')).toBeTruthy()
  })

  it('should render the form with client data when editing existing client', () => {
    (useClientForm as jest.Mock).mockReturnValue({
      form: {
        name: mockClient.name,
        phone_number: mockClient.phone_number,
        email: mockClient.email,
        inn: mockClient.inn,
        address: mockClient.address,
        banking_data: mockClient.banking_data,
        ogrn: mockClient.ogrn,
      },
      loading: false,
      inputChangeHandler: jest.fn(),
      onSubmit: jest.fn(),
      getFieldError: jest.fn(),
    })

    render(
      <Provider store={mockStore}>
        <ClientForm client={mockClient} />
      </Provider>,
    )

    expect(screen.getByText('Редактировать клиента')).toBeTruthy()

    const nameInput = screen.getByLabelText(/ФИО \/ Название компании \*/i) as HTMLInputElement
    const phoneInput = screen.getByLabelText(/Номер телефона \*/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Эл. почта \*/i) as HTMLInputElement
    const innInput = screen.getByLabelText(/ИНН \*/i) as HTMLInputElement
    const addressInput = screen.getByLabelText(/Адрес/i) as HTMLInputElement
    const bankingInput = screen.getByLabelText(/Банковские реквизиты/i) as HTMLInputElement
    const ogrnInput = screen.getByLabelText(/ОГРН/i) as HTMLInputElement

    expect(nameInput.value).toBe(mockClient.name)
    expect(phoneInput.value).toBe(mockClient.phone_number)
    expect(emailInput.value).toBe(mockClient.email)
    expect(innInput.value).toBe(mockClient.inn)
    expect(addressInput.value).toBe(mockClient.address)
    expect(bankingInput.value).toBe(mockClient.banking_data)
    expect(ogrnInput.value).toBe(mockClient.ogrn)

    expect(screen.getByText('Сохранить клиента')).toBeTruthy()
  })

  it('should call the submit function when the form is submitted', () => {
    const mockOnSubmit = jest.fn(e => e.preventDefault())
    const mockInputChangeHandler = jest.fn()

    // Мокируем хук с реальными данными
    ;(useClientForm as jest.Mock).mockReturnValue({
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

    const { container } = render(
      <Provider store={mockStore}>
        <ClientForm />
      </Provider>,
    )

    // Находим форму и отправляем её напрямую
    const form = container.querySelector('form')
    expect(form).not.toBeNull()
    form && fireEvent.submit(form)

    // Проверяем, что обработчик отправки был вызван
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
  })

  it('should display error message if name field is empty and form is submitted', () => {
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
      onSubmit: jest.fn(e => e.preventDefault()),
      getFieldError: (field: string) => (field === 'name' ? 'Поле не может быть пустым' : ''),
    })

    const { container } = render(
      <Provider store={mockStore}>
        <ClientForm />
      </Provider>,
    )

    // Находим форму и отправляем её напрямую
    const form = container.querySelector('form')
    expect(form).not.toBeNull()
    form && fireEvent.submit(form)

    // Проверяем наличие сообщения об ошибке
    const errorMessage = screen.queryByText('Поле не может быть пустым')
    expect(errorMessage).not.toBeNull()
    expect(errorMessage).toBeTruthy()
  })

  it('should display validation errors for all required fields', () => {
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
      onSubmit: jest.fn(e => e.preventDefault()),
      getFieldError: (field: string) => {
        if (field === 'name' || field === 'phone_number' || field === 'email' || field === 'inn') {
          return 'Поле не может быть пустым'
        }
        return ''
      },
    })

    const { container } = render(
      <Provider store={mockStore}>
        <ClientForm />
      </Provider>,
    )

    // Находим форму и отправляем её напрямую
    const form = container.querySelector('form')
    expect(form).not.toBeNull()
    form && fireEvent.submit(form)

    // Проверяем, что все обязательные поля показывают ошибки
    const errorMessages = screen.getAllByText('Поле не может быть пустым')
    expect(errorMessages.length).toBe(4)
  })

  it('should display loading indicator when form is submitting', () => {
    (useClientForm as jest.Mock).mockReturnValue({
      form: {
        name: 'Test Company',
        phone_number: '+1234567890',
        email: 'test@example.com',
        inn: '1234567890',
        address: '123 Street',
        banking_data: 'Bank XYZ',
        ogrn: '123456789',
      },
      loading: true,
      inputChangeHandler: jest.fn(),
      onSubmit: jest.fn(),
      getFieldError: jest.fn(),
    })

    render(
      <Provider store={mockStore}>
        <ClientForm />
      </Provider>,
    )

    // Проверяем, что кнопка отключена
    const submitButton = screen.getByRole('button', { name: '' }) as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    // Проверяем, что отображается индикатор загрузки
    const loadingIndicator = document.querySelector('.MuiCircularProgress-root')
    expect(loadingIndicator).toBeTruthy()
  })

  it('should call inputChangeHandler when input values change', () => {
    const mockInputChangeHandler = jest.fn()
    ;(useClientForm as jest.Mock).mockReturnValue({
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
      inputChangeHandler: mockInputChangeHandler,
      onSubmit: jest.fn(),
      getFieldError: jest.fn(),
    })

    render(
      <Provider store={mockStore}>
        <ClientForm />
      </Provider>,
    )

    // Создаем объект события для имитации изменения input
    const nameInput = screen.getByLabelText(/ФИО \/ Название компании \*/i)
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Test Company' } })

    // Проверяем, что обработчик был вызван хотя бы один раз
    expect(mockInputChangeHandler).toHaveBeenCalled()
  })

  it('should call onClose when form is successfully submitted', () => {
    const mockOnClose = jest.fn()
    const mockOnSubmit = jest.fn().mockImplementation(e => {
      e.preventDefault()
      mockOnClose()
    })

    ;(useClientForm as jest.Mock).mockReturnValue({
      form: {
        name: 'Test Company',
        phone_number: '+1234567890',
        email: 'test@example.com',
        inn: '1234567890',
        address: '123 Street',
        banking_data: 'Bank XYZ',
        ogrn: '123456789',
      },
      loading: false,
      inputChangeHandler: jest.fn(),
      onSubmit: mockOnSubmit,
      getFieldError: jest.fn(),
    })

    const { container } = render(
      <Provider store={mockStore}>
        <ClientForm onClose={mockOnClose} />
      </Provider>,
    )

    // Находим форму и отправляем её напрямую
    const form = container.querySelector('form')
    expect(form).not.toBeNull()
    form && fireEvent.submit(form)

    // Проверяем, что onClose был вызван через onSubmit
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
