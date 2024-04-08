function update_search_params(
  search_params: URLSearchParams,
  param: string,
  value?: string,
) {
  const current_search_params = new URLSearchParams([
    ...search_params.entries(),
  ])
  if (value) {
    current_search_params.set(param, value)
  } else {
    current_search_params.delete(param)
  }

  return current_search_params
}

export { update_search_params }
