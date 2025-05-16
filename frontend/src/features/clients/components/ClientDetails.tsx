import { useClientActions } from '../hooks/useClientActions.ts'
import React, { useEffect } from 'react'
import { Contact, CreditCard, Mail, MapPin, Phone, User } from 'lucide-react'
import CopyText from '@/components/CopyText/CopyText.tsx'
import { fetchClientById } from '@/store/thunks/clientThunk.ts'

interface Props {
  id?: string
}

const ClientDetails: React.FC<Props> = ({ id }) => {
  const {
    client,
    dispatch,
  } = useClientActions(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchClientById(id))
    }
  }, [dispatch, id])

  return (
    <>
      {client && (
        <div className="py-10 space-y-3 text-sm sm:text-md text-primary">
          <div className="flex justify-center items-center gap-2 mb-4 rounded-md bg-blue-100 text-blue-600 py-2">
            <User className="w-6 h-6" />
            <h5 className="font-bold">{client.name}</h5>
          </div>

          <div className="flex items-center gap-2 px-4 justify-between">
            <p className="font-bold text-muted-foreground uppercase">инн</p>
            <p className="font-bold">{client.inn}</p>
          </div>

          {client.ogrn ?
            <div className="flex items-center gap-2 px-4 justify-between">
              <p className="font-bold text-muted-foreground uppercase">огрн</p>
              <p className="font-bold">{client.ogrn}</p>
            </div> : null}

          <div className="flex items-center justify-center gap-2 my-5 rounded-md bg-blue-100 text-blue-600 py-2">
            <Contact className="h-6 w-6 " />
            <p className="font-bold">Контактная информация</p>
          </div>

          <div className="flex items-center gap-2 px-4 justify-between">
            <p className="font-bold text-muted-foreground">Телефон</p>
            <CopyText text={client.phone_number} children={<Phone className="h-4 w-4" />} />
          </div>

          <div className="flex items-center gap-2 px-4 justify-between">
            <p className="font-bold text-muted-foreground">Email</p>
            <CopyText text={client.email} children={<Mail className="h-4 w-4" />} />
          </div>

          {client.address ?
            <div className="flex items-center gap-2 px-4 justify-between">
              <p className="font-bold text-muted-foreground">Адрес</p>
              <CopyText text={client.address} children={<MapPin className="h-4 w-4" /> }/>
            </div> : null
          }
          {client.banking_data ?
            <div className="flex items-center gap-2 px-4 justify-between">
              <p className="font-bold text-muted-foreground">Банковские реквизиты</p>
              <CopyText text={client.banking_data} children={<CreditCard className="h-4 w-4" />} />
            </div>:null
          }
        </div>
      )}
    </>
  )
}

export default ClientDetails
