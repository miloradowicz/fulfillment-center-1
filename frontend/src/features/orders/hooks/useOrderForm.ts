import React, {useEffect, useState} from "react";
import {
  Defect,
  DefectForOrderForm,
  ErrorForOrder,
  OrderMutation,
  ProductForOrderForm,
  ProductOrder
} from "../../../types";
import {
  initialStateDefectForOrder,
  initialStateErrorForOrder,
  initialStateOrder,
  initialStateProductForOrder
} from "./initialState.ts";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {selectCreateOrderError, selectLoadingAddOrder} from "../../../store/slices/orderSlice.ts";
import {selectAllClients, selectLoadingFetchClient} from "../../../store/slices/clientSlice.ts";
import {selectAllProducts} from "../../../store/slices/productSlice.ts";
import {validationRules} from "./ValidationRulesForBlur.ts";
import {toast} from "react-toastify";
import {fetchClients} from "../../../store/thunks/clientThunk.ts";
import {fetchProductsByClientId} from "../../../store/thunks/productThunk.ts";
import {addOrder} from "../../../store/thunks/orderThunk.ts";
import {deleteItem} from "./deleteItem.ts";
import {addArrayItemInForm} from "./addArrayItemInForm.ts";

export const useOrderForm = () => {
  const [form, setForm] = useState<OrderMutation>(initialStateOrder)
  const [productsForm, setProductsForm] = useState<DefectForOrderForm[]>([])
  const [defectForm, setDefectForm] = useState<ProductForOrderForm[]>([])
  const [newFieldDefects, setNewFieldDefects] = useState<Defect>(initialStateDefectForOrder)
  const [modalOpenDefects, setModalOpenDefects] = useState(false)
  const [isButtonDefectVisible, setButtonDefectVisible] = useState(true)
  const [currentClient, setCurrentClient] = useState<string>('')
  const [newField, setNewField] = useState<ProductOrder>(initialStateProductForOrder)
  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddOrder)
  const createError = useAppSelector(selectCreateOrderError)
  const clients = useAppSelector(selectAllClients)
  const clientProducts = useAppSelector(selectAllProducts)
  const loadingFetchClient = useAppSelector(selectLoadingFetchClient)
  const [isButtonVisible, setButtonVisible] = useState(true)
  const [errors, setErrors] = useState<ErrorForOrder>(initialStateErrorForOrder)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errorMessage = validationRules[name]?.(value) || (value.trim() === '' ? 'Это поле обязательно для заполнения' : '');
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  }

  const handleButtonClick = () => {
    if (!currentClient) {
      toast.warn('Выберите клиента')
    } else {
      setModalOpen(true)
      setButtonVisible(false)
    }
  }

  const handleCloseDefectModal = () => {
    setModalOpenDefects(false)
    setButtonDefectVisible(true)
  }

  const handleButtonDefectClick = () => {
    if (!currentClient) {
      toast.warn('Выберите клиента')
    } else {
      setModalOpenDefects(true)
      setButtonDefectVisible(false)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setButtonVisible(true)
  }

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])

  useEffect(() => {
    if (form.client) {
      clients?.map(client => {
        if (form.client === client._id) {
          setCurrentClient(client._id)
        }
      })
      dispatch(fetchProductsByClientId(currentClient))
    }
  }, [clients, currentClient, dispatch, form.client])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form);
    if (form.products.length === 0) {
      toast.error('Добавьте товары')
    } else {
      await dispatch(addOrder(form)).unwrap()
      setForm({...initialStateOrder})
      setProductsForm([])
      toast.success('Заказ успешно создан!')
    }
  }

  const deleteProduct = (index: number) => {
    deleteItem(index, setProductsForm, setForm, "products");
  };
  const deleteDefect = (index: number) => {
    deleteItem(index, setDefectForm, setForm, "defects");
  };

  const handleBlurAutoComplete = (
    field: string,
    setErrors: React.Dispatch<React.SetStateAction<ErrorForOrder>>,
    formData: any,
    errorMessage: string
  ) => {
    if (!formData[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: errorMessage,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: '',
      }));
    }
  };

  const setFormArrayData = () => {
    setForm(prev => ({
      ...prev,
      products: newField.product ? [...prev.products, newField] : prev.products,
      defects: newFieldDefects.product
        ? prev.defects
          ? [...prev.defects, newFieldDefects]
          : [newFieldDefects]
        : prev.defects,
    }))
    setNewField(initialStateProductForOrder)
    setNewFieldDefects(initialStateDefectForOrder)
    setModalOpenDefects(false)
    setModalOpen(false)
    setButtonDefectVisible(true)
    setButtonVisible(true)
  }

  const addArrayProductInForm = () => {
    addArrayItemInForm(
      newField,
      setProductsForm,
      setFormArrayData,
      clientProducts,
      "amount",
      "description",
      "product"
    );
  };

  const addArrayDefectInForm = () => {
    addArrayItemInForm(
      newFieldDefects,
      setDefectForm,
      setFormArrayData,
      clientProducts,
      "amount",
      "defect_description",
      "product"
    );
  }
  return{
    form,
    setForm,
    productsForm,
    setProductsForm,
    defectForm,
    setDefectForm,
    newField,
    setNewField,
    newFieldDefects,
    setNewFieldDefects,
    modalOpen,
    setModalOpen,
    modalOpenDefects,
    setModalOpenDefects,
    isButtonDefectVisible,
    setButtonDefectVisible,
    isButtonVisible,
    setButtonVisible,
    currentClient,
    setCurrentClient,
    errors,
    setErrors,
    loading,
    createError,
    clients,
    clientProducts,
    loadingFetchClient,
    handleBlur,
    handleBlurAutoComplete,
    handleButtonClick,
    handleButtonDefectClick,
    handleCloseModal,
    handleCloseDefectModal,
    deleteProduct,
    deleteDefect,
    addArrayProductInForm,
    addArrayDefectInForm,
    onSubmit,
  }
}
