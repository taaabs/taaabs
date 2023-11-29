export const get_site_variants_for_search = (site: string): string[] => {
  const variants = []
  let segments = site.split('.')
  const path = segments[segments.length - 1].split('/')[1] || undefined
  if (path)
    segments = [...segments].map((segment, i) => {
      if (i == segments.length - 1) {
        return segment.split('/')[0]
      } else {
        return segment
      }
    })

  for (let i = 0; i < segments.length - 1; i++) {
    for (let j = 1; j <= segments.length; j++) {
      if (i >= j) continue
      variants.push(segments.slice(i, j).join(''))
      if (path) variants.push(segments.slice(i, j).join('') + path)
    }
  }

  if (path) variants.push(path)

  return variants
}
