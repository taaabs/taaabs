function updateSearchParam(
  searchParams: URLSearchParams,
  param: string,
  value?: string,
) {
  const currentSearchParams = new URLSearchParams(
    Array.from(searchParams.entries()),
  )
  if (value) {
    currentSearchParams.set(param, value)
  } else {
    currentSearchParams.delete(param)
  }

  return currentSearchParams
}

export { updateSearchParam }
