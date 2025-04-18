import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import OrderForm from '@/features/orders/components/OrderForm.tsx'

const mockUseOrderForm = {
  form: { client: '', stock: '', price: '', sent_at: '', delivered_at: '', status: '', comment: '' },
  setForm: jest.fn(),
  productsForm: [],
  defectForm: [],
  newField: {},
  setNewField: jest.fn(),
  newFieldDefects: {},
  setNewFieldDefects: jest.fn(),
  modalOpen: false,
  modalOpenDefects: false,
  isButtonDefectVisible: true,
  isButtonVisible: true,
  errors: {},
  setErrors: jest.fn(),
  loading: false,
  createError: {},
  clients: [{ _id: '1', name: 'Клиент 1' }],
  availableProducts: [],
  loadingFetchClient: false,
  handleBlur: jest.fn(),
  handleBlurAutoComplete: jest.fn(),
  handleButtonClick: jest.fn(),
  handleButtonDefectClick: jest.fn(),
  handleCloseModal: jest.fn(),
  handleCloseDefectModal: jest.fn(),
  deleteProduct: jest.fn(),
  deleteDefect: jest.fn(),
  addArrayProductInForm: jest.fn(),
  addArrayDefectInForm: jest.fn(),
  onSubmit: jest.fn(),
  initialData: null,
  availableDefects: [],
  files: [],
  handleFileChange: jest.fn(),
  stocks: [{ _id: '1', name: 'Склад 1' }],
  handleRemoveFile: jest.fn(),
  handleRemoveExistingFile: jest.fn(),
  existingFiles: [],
  handleModalCancel: jest.fn(),
  handleModalConfirm: jest.fn(),
  openModal: false,
}

jest.mock('@/constants', () => ({
  featureProtection: process.env.VITE_FEATURE_PROTECTION_DISABLED !== '1',
}))

beforeEach(() => {
  process.env.VITE_FEATURE_PROTECTION_DISABLED = '1'
})

jest.mock('../features/orders/hooks/useOrderForm', () => ({
  useOrderForm: () => mockUseOrderForm,
}))

describe('OrderForm', () => {
  const renderForm = () =>
    render(
      <BrowserRouter>
        <OrderForm />
      </BrowserRouter>,
    )

  it('Renders form title', () => {
    renderForm()
    expect(screen.getByText(/Добавить новый заказ/i)).toBeInTheDocument()
  })

  it('Displays client autocomplete', () => {
    renderForm()
    expect(screen.getByLabelText('Клиент')).toBeInTheDocument()
  })

  it('Displays stock autocomplete', () => {
    renderForm()
    expect(screen.getByLabelText(/Склад, с которого будет отправлен товар/i)).toBeInTheDocument()
  })

  it('Displays order amount input field', () => {
    renderForm()
    expect(screen.getByLabelText(/Сумма заказа/i)).toBeInTheDocument()
  })

  it('Displays add product button', () => {
    renderForm()
    expect(screen.getByText('+ Добавить товар')).toBeInTheDocument()
  })

  it('Displays add defects button', () => {
    renderForm()
    expect(screen.getByText('+ Добавить дефекты')).toBeInTheDocument()
  })

  it('Displays submit button', () => {
    renderForm()
    expect(screen.getByRole('button', { name: /Создать заказ/i })).toBeInTheDocument()
  })

  it('Renders CircularProgress when loadingFetchClient is true', () => {
    mockUseOrderForm.loadingFetchClient = true

    renderForm()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    mockUseOrderForm.loadingFetchClient = false
  })
})
