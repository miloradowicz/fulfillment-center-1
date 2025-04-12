export const removeUndefinedFields = (obj: object) =>
  Object.entries(obj)
    .filter(([_, v]) => v !== undefined)
    .reduce((a, [k, v]: [string, unknown]) => ({ ...a, [k]: v }), {})