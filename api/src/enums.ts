class Expressions {
  get email(): RegExp {
    return /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/
  }

  get phone(): RegExp {
    return /^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?(\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4})$/
  }
}

export const Regex = new Expressions()

export const RolesList = ['stock-worker', 'manager', 'admin', 'super-admin'] as const
export type RolesType = (typeof RolesList)[number]