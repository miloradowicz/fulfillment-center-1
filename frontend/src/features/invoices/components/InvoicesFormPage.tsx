import Modal from '@/components/Modal/Modal'
import InvoiceForm from './InvoiceForm'

const InvoicesFormPage = () => {
  return (
    <>
      <Modal open={true} handleClose={() => void 0 }>
        <InvoiceForm />
      </Modal>
    </>
  )
}

export default InvoicesFormPage
