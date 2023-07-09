import { ReadonlyURLSearchParams } from 'next/navigation'

function updateQueryParam(
  queryParams: ReadonlyURLSearchParams,
  param: string,
  value: string,
) {
  const currentSearchParams = new URLSearchParams(
    Array.from(queryParams.entries()),
  )
  currentSearchParams.set(param, value)

  return currentSearchParams
}

export { updateQueryParam }
