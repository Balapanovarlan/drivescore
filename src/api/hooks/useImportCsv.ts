import { useMutation } from '@tanstack/react-query'
import { importCsv } from '../import.api'

export function useImportCsv() {
  return useMutation({ mutationFn: importCsv })
}
