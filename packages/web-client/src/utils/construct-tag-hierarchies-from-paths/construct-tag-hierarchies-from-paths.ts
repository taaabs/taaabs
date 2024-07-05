export type TagHierarchyNode = {
  name: string
  children: TagHierarchyNode[]
}

export const construct_tag_hierarchies_from_paths = (
  paths: string[],
): TagHierarchyNode[] => {
  const tree: any[] = []

  for (const path of paths) {
    const segments = path.split('/').slice(1)
    let current = tree

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      let found = false

      for (let j = 0; j < current.length; j++) {
        if (current[j].name === segment) {
          current = current[j].children
          found = true
          break
        }
      }

      if (!found) {
        const new_node = { name: segment, children: [] }
        current.push(new_node)
        current = new_node.children
      }
    }
  }

  return tree
}
