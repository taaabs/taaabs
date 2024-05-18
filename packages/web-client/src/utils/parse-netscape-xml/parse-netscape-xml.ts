interface Bookmark {
  type: 'link' | 'folder'
  tags?: string[]
  addDate?: number
  title?: string
  url?: string
  is_starred?: boolean
  children?: Bookmark[]
}

interface CleanupObject {
  [key: string]: any
}

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

const cleanup_object = (obj: CleanupObject): CleanupObject => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key])
  return obj
}

const isFolder = (item: string): boolean => !!item.match(/<H3.*>.*<\/H3>/)
const isLink = (item: string): boolean => !!item.match(/<A.*>.*<\/A>/)
const get_title = (item: string): string | undefined =>
  item.match(/<(H3|A).*>(.*)<\/(H3|A)>/)?.[2]
const getUrl = (item: string): string | undefined =>
  item.match(/HREF="([^"]*)"/)?.[1]
// Specific to Raindrop.
const get_data_important = (item: string): string | undefined =>
  item.match(/DATA-IMPORTANT="([^"]*)"/)?.[1]
const getTags = (item: string): string[] | undefined =>
  item.match(/TAGS="([^"]*)"/)?.[1].split(',')

const get_numeric_property = (
  item: string,
  property: string,
): number | undefined => {
  const match = item.match(new RegExp(`${property}="(\\d+)"`))
  return match ? parseInt(match[1]) : undefined
}

const transform_link = (markup: string): Bookmark => {
  let tags: string[] | undefined
  tags = getTags(markup)
  if (tags && tags.length == 1 && tags[0] == '') {
    tags = undefined
  }
  return cleanup_object({
    type: 'link',
    created_at_timestamp: get_numeric_property(markup, 'ADD_DATE'),
    title: get_title(markup),
    url: getUrl(markup),
    is_starred: get_data_important(markup) == 'true' || undefined,
    tags,
  }) as Bookmark
}

const transform_folder = (markup: string): Bookmark =>
  cleanup_object({
    type: 'folder',
    name: get_title(markup),
  }) as Bookmark

const find_items_at_indent_level = (markup: string, level: number): string[] =>
  markup.match(new RegExp(`^\\s{${level * 4}}<DT>(.*)[\r\n]`, 'gm')) || []

const find_links = (markup: string, level: number): string[] =>
  find_items_at_indent_level(markup, level).filter(isLink)

const find_folders = (markup: string, level: number): string[] | undefined => {
  const folders = find_items_at_indent_level(markup, level)
  return folders.map((folder, index) => {
    const isLastOne = index === folders.length - 1
    return markup.substring(
      markup.indexOf(folder),
      isLastOne ? undefined : markup.indexOf(folders[index + 1]),
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
): Bookmark | undefined => {
  if (isFolder(child)) return process_folder(child, level)
  if (isLink(child)) return transform_link(child)
}

const process_folder = (folder: string, level: number): Bookmark => {
  const children = find_children(folder, level + 1)
  return cleanup_object({
    ...transform_folder(folder),
    children: children
      ?.map((child) => process_child(child, level + 1))
      .filter(Boolean),
  }) as Bookmark
}

export const parse_netscape_xml = (markup: string): any => {
  const obj = find_children(markup.replace(/\t/g, '    '))?.map((child) =>
    process_child(child),
  )
  return obj
}
