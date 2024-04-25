export const get_site_variants_for_search = (site: string): string[] => {
  const variants: string[] = []
  let segments = site.split('.')
  const site_path =
    segments[segments.length - 1].split('/').slice(1).join('') || undefined
  if (site_path)
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
      if (site_path) variants.push(segments.slice(i, j).join('') + site_path)
    }
  }

  if (site_path) variants.push(site_path)

  return variants
}
