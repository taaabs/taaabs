function updateSearchParam(
  searchParams: URLSearchParams,
  param: string,
  value: string,
) {
  const currentSearchParams = new URLSearchParams(
    Array.from(searchParams.entries()),
  )
  currentSearchParams.set(param, value)

  return currentSearchParams
}

export { updateSearchParam }
