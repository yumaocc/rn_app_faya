export function getFirstFormError(err: any): string {
  const errorFields = err?.errorFields || [];
  const errorMessages = errorFields[0]?.errors || [];
  const firstError = errorMessages[0];
  return firstError || '';
}
