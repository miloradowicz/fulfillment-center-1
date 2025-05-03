import React, { useEffect } from 'react'
import { ArrowUpRight, ScrollText, Package } from 'lucide-react'
import { useAppSelector } from '@/app/hooks.ts'
import { selectProductWithPopulate } from '@/store/slices/productSlice.ts'
import useProductActions from '@/features/products/hooks/useProductActions.ts'
import { Link } from 'react-router-dom'

interface Props {
  productId?: string
}

const ProductDetails: React.FC<Props> = ({ productId }) => {
  const product = useAppSelector(selectProductWithPopulate)
  const {
    fetchProduct,
  } = useProductActions(true)

  useEffect(() => {
    if (productId) {
      void fetchProduct(productId)
    }
  }, [fetchProduct, productId])

  return (
    <>
      {product && (
        <div className="py-10 space-y-3 text-sm sm:text-md text-primary">
          <div className="flex justify-center items-center gap-2 mb-4 ps-4 rounded-md bg-blue-100 text-blue-600 sm:py-2">
            <Package className="w-6 h-6" />
            <h5 className="font-bold">{product.title}</h5>
          </div>

          <div className="flex items-center justify-between gap-2 px-4">
            <p className="font-bold text-muted-foreground">Клиент</p>
            <Link
              to={`/clients/${ product.client._id }`}
              className="inline-flex items-center gap-1 font-bold hover:text-blue-500 transition-colors"
            >
              {product.client.name}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2 px-4 justify-between">
            <p className="font-bold text-muted-foreground">Артикул</p>
            <p className="font-bold">{product.article}</p>
          </div>

          <div className="flex items-center gap-2 px-4 justify-between">
            <p className="font-bold text-muted-foreground">Баркод</p>
            <p className="font-bold">{product.barcode}</p>
          </div>

          {product.dynamic_fields?.length !== 0 ? (
            <>
              <div className="flex items-center justify-center gap-2 my-5 rounded-md bg-blue-100 text-blue-600 py-2">
                <ScrollText className="h-6 w-6 "/>
                <p className="font-bold">Характеристики</p>
              </div>

              {product.dynamic_fields?.map(field => (
                <div key={field.key} className="flex items-center gap-2 px-4 justify-between">
                  <p className="font-bold text-muted-foreground">{field.label}</p>
                  <p className="font-bold">{field.value}</p>
                </div>
              ))}
            </>
          ): null}
        </div>
      )}
    </>
  )
}

export default ProductDetails
