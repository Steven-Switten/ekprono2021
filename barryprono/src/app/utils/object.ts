export const getNestedProperty = (object: any, field: string) => {
  field = field.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  field = field.replace(/^\./, ''); // strip a leading dot
  const fields = field.split('.');
  for (let i = 0, n = fields.length; i < n; ++i) {
    const k = fields[i];
    if (object && k in object) {
      object = object[k];
    } else {
      return;
    }
  }
  return object;
};
