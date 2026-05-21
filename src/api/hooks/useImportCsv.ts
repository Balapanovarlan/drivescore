import { useMutation } from '@tanstack/react-query'
import { importViolationsCsv } from '../import.api'

export function useImportCsv() {
  return useMutation({ mutationFn: importViolationsCsv })
}
