function update_query_params(
  searchParams: URLSearchParams,
  param: string,
  value?: string,
) {
  const current_search_params = new URLSearchParams(
    Array.from(searchParams.entries()),
  )
  if (value) {
    current_search_params.set(param, value)
  } else {
    current_search_params.delete(param)
  }

  return current_search_params
}

export { update_query_params }