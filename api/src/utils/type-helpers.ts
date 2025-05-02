export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]
