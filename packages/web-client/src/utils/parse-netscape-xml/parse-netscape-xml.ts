type BookmarkNode = {
  type: 'link'
  title?: string
  created_at_timestamp?: number
  url?: string
  tags?: string[]
  is_starred?: boolean
  favicon?: string
}
type FolderNode = {
  type: 'folder'
  name: string
  children?: Array<FolderNode | BookmarkNode>
}
export type ParsedXmlTreeNode = BookmarkNode | FolderNode

declare global {
  interface String {
    remove(toRemove: string | string[]): string
  }
}

String.prototype.remove = function (toRemove: string | string[]): any {
  if (Array.isArray(toRemove)) {
    return toRemove.reduce((acc, value) => acc.replace(value, ''), this)
  }
  if (typeof toRemove === 'string') {
    return this.replace(toRemove, '')
  }
  return this
}

function cleanup_object<T>(obj: T): T {
  Object.keys(obj as any).forEach(
    (key) => (obj as any)[key] === undefined && delete (obj as any)[key],
  )
  return obj
}

const is_folder = (item: string): boolean => !!item.match(/<H3.*>.*<\/H3>/)
const is_link = (item: string): boolean => !!item.match(/<A.*>.*<\/A>/)
const get_title = (item: string): string | undefined =>
  item.match(/<(H3|A).*>(.*)<\/(H3|A)>/)?.[2]
const get_url = (item: string): string | undefined =>
  item.match(/HREF="([^"]*)"/)?.[1]
const get_icon = (item: string): string | undefined =>
  item.match(/ICON="([^"]*)"/)?.[1]
// Specific to Raindrop.
const get_data_important = (item: string): string | undefined =>
  item.match(/DATA-IMPORTANT="([^"]*)"/)?.[1]
const get_tags = (item: string): string[] | undefined =>
  item.match(/TAGS="([^"]*)"/)?.[1].split(',')

const get_numeric_property = (
  item: string,
  property: string,
): number | undefined => {
  const match = item.match(new RegExp(`${property}="(\\d+)"`))
  return match ? parseInt(match[1]) : undefined
}

const transform_link = (markup: string): ParsedXmlTreeNode => {
  let tags: string[] | undefined
  tags = get_tags(markup)
  if (tags && tags.length == 1 && tags[0] == '') {
    tags = undefined
  }
  return cleanup_object<ParsedXmlTreeNode>({
    type: 'link',
    created_at_timestamp: get_numeric_property(markup, 'ADD_DATE'),
    title: get_title(markup),
    url: get_url(markup),
    is_starred: get_data_important(markup) == 'true' || undefined,
    tags,
    favicon: get_icon(markup),
  })
}

const transform_folder = (markup: string): ParsedXmlTreeNode =>
  cleanup_object({
    type: 'folder',
    name: get_title(markup),
  }) as ParsedXmlTreeNode

const find_items_at_indent_level = (markup: string, level: number): string[] =>
  markup.match(new RegExp(`^\\s{${level * 4}}<DT>(.*)[\r\n]`, 'gm')) || []

const find_links = (markup: string, level: number): string[] =>
  find_items_at_indent_level(markup, level).filter(is_link)

const find_folders = (markup: string, level: number): string[] | undefined => {
  const folders = find_items_at_indent_level(markup, level)
  return folders.map((folder, index) => {
    const is_last_one = index === folders.length - 1
    return markup.substring(
      markup.indexOf(folder),
      is_last_one ? undefined : markup.indexOf(folders[index + 1]),
    )
  })
}

const find_children = (
  markup: string,
  level: number = 1,
): string[] | undefined => {
  if (find_items_at_indent_level(markup, level).length > 0) {
    const links = find_links(markup, level)
    const folders = find_folders(markup.remove(links), level)
    return [...(links || []), ...(folders || [])]
  }
}

const process_child = (
  child: string,
  level: number = 1,
): ParsedXmlTreeNode | undefined => {
  if (is_folder(child)) return process_folder(child, level)
  if (is_link(child)) return transform_link(child)
}

const process_folder = (folder: string, level: number): ParsedXmlTreeNode => {
  const children = find_children(folder, level + 1)
  return cleanup_object({
    ...transform_folder(folder),
    children: children
      ?.map((child) => process_child(child, level + 1))
      .filter(Boolean),
  }) as ParsedXmlTreeNode
}

export const parse_netscape_xml = (markup: string): ParsedXmlTreeNode[] => {
  const result = find_children(markup.replace(/\t/g, '    '))?.map((child) =>
    process_child(child),
  )
  return result as any
}
