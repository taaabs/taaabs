import { memo, useEffect, useRef, useState } from 'react'
import styles from './TagHierarchies.module.scss'
import cn from 'classnames'
import Nestable from 'react-nestable'
import { Icon } from '@web-ui/components/common/particles/icon'
import { toast } from 'react-toastify'
import { system_values } from '@shared/constants/system-values'
import { useContextMenu } from 'use-context-menu'
import { Dropdown as UiCommon_Dropdown } from '@web-ui/components/common/Dropdown'
import { StandardItem as UiCommon_Dropdown_StandardItem } from '@web-ui/components/common/Dropdown/standard-item'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import Skeleton from 'react-loading-skeleton'
import SimpleBar from 'simplebar-react'

export namespace TagHierarchies {
  export type Node = {
    name: string
    id: number
    yields?: number
    children: Node[]
  }
  export type Props = {
    on_update: (tags: Node[]) => void
    on_item_click: (hierarchy_ids: number[]) => void
    selected_tag_ids: number[]
    show_skeleton: boolean
    is_all_bookmarks_selected: boolean
    on_click_all_bookmarks: () => void
    library_url: string
    library_updated_at_timestamp?: number
    tree?: Node[]
    is_updating?: boolean
    dragged_tag?: { id: number; name: string }
    is_read_only?: boolean
    all_bookmarks_yields?: number
    on_tag_rename_click?: (tag_id: number) => void
    translations: {
      drag_here: string
      all_bookmarks: string
      rename: string
      delete: string
    }
  }
}

type Item = {
  id: number
  tag_id: number
  text: string
  yields?: number
  hierarchy_ids: number[]
  hierarchy_tag_ids: number[]
  children: Item[]
}

export const TagHierarchies: React.FC<TagHierarchies.Props> = memo(
  function TagHierarchies(props) {
    const [is_dragging, set_is_dragging] = useState(false)
    const [items, set_items] = useState<Item[]>([])
    const [mouseover_ids, set_mouseover_ids] = useState<number[]>([])
    const [selected_tag_ids, set_selected_tag_ids] = useState<number[]>([])
    const [
      is_simplebar_tag_hierarchies_scrolled_to_top,
      set_is_simplebar_tag_hierarchies_scrolled_to_top,
    ] = useState(true)
    const simplebar_tag_hierarchies = useRef<any>(null)
    const [context_menu_of_item_id, set_context_menu_of_item_id] =
      useState<number>()
    const { contextMenu, onContextMenu } = useContextMenu(
      <UiCommon_Dropdown>
        <UiCommon_Dropdown_StandardItem
          label={props.translations.rename}
          icon_variant="EDIT"
          on_click={() => {
            props.on_tag_rename_click!(
              items.find((i) => i.id == context_menu_of_item_id)!.tag_id,
            )
          }}
        />
        <UiCommon_Dropdown_StandardItem
          label={props.translations.delete}
          icon_variant="DELETE"
          on_click={() => {
            if (!context_menu_of_item_id) return
            clear_mouseover_ids()
            delete_item({ item_id: context_menu_of_item_id })
            set_selected_tag_ids([])
          }}
        />
      </UiCommon_Dropdown>,
    )

    const clear_mouseover_ids = () => {
      set_mouseover_ids([])
    }
    const clear_selected_tag_ids = () => {
      set_selected_tag_ids([])
    }

    useUpdateEffect(() => {
      if (
        JSON.stringify(props.selected_tag_ids) !=
        JSON.stringify(selected_tag_ids)
      ) {
        clear_selected_tag_ids()
      }
    }, [props.selected_tag_ids])

    useEffect(() => {
      if (!props.tree) return
      set_items(
        props.tree.map((node) =>
          tag_to_item({ node, hierarchy_ids: [], hierarchy_tag_ids: [] }),
        ),
      )
    }, [props.tree])

    useEffect(() => {
      const handle_scroll = (e: any) => {
        if (e.target.scrollTop == 0) {
          set_is_simplebar_tag_hierarchies_scrolled_to_top(true)
        } else {
          set_is_simplebar_tag_hierarchies_scrolled_to_top(false)
        }
      }
      const element = simplebar_tag_hierarchies.current.getScrollElement()
      element!.addEventListener('scroll', handle_scroll, { passive: true })
      return () => {
        element!.removeEventListener('scroll', handle_scroll)
      }
    }, [])

    const render_tag = ({
      item,
      collapseIcon,
    }: {
      item: Item
      collapseIcon: any
    }) => {
      const search_params = new URLSearchParams(window.location.search)
      search_params.set('t', (item as Item).hierarchy_tag_ids.join(','))
      return (
        <div className={styles.tag}>
          {collapseIcon ? collapseIcon : <div className={styles.tag__spacer} />}
          <a
            className={cn(styles.tag__button, {
              [styles['tag__button--active']]:
                JSON.stringify(item.hierarchy_tag_ids) ==
                JSON.stringify(
                  selected_tag_ids.slice(0, item.hierarchy_tag_ids.length),
                ),
              [styles['tag__button--highlighted']]: mouseover_ids.includes(
                (item as Item).id,
              ),
            })}
            onClick={(e) => {
              e.preventDefault()
              props.on_item_click((item as Item).hierarchy_tag_ids)
              // Calling before timeout fixes issue when selecting tag after changing filter.
              // TODO: Investigate root cause.
              set_selected_tag_ids((item as Item).hierarchy_tag_ids)
              setTimeout(() => {
                set_selected_tag_ids((item as Item).hierarchy_tag_ids)
              }, 0)
              clear_mouseover_ids()
            }}
            href={`${props.library_url}?${search_params.toString()}`}
            onMouseEnter={() => {
              if (props.dragged_tag) {
                document.body.classList.add('adding-tag')
              }
              if (!is_dragging) set_mouseover_ids((item as Item).hierarchy_ids)
            }}
            onMouseDown={() => {
              set_is_dragging(true)
            }}
            onMouseUp={() => {
              if (props.dragged_tag) {
                document.body.classList.remove('adding-tag')
              }
              setTimeout(() => {
                set_is_dragging(false)
              }, 0)
              if (props.dragged_tag) {
                if (
                  (item as Item).hierarchy_ids.length >=
                  system_values.library.max_selected_tags
                ) {
                  toast.error('Maximum tree depth reached')
                  return
                }
                const parent_id = (item as Item).hierarchy_ids.slice(-1)[0]
                const loop_over_items = (item: Item): Item => {
                  if (item.id == parent_id) {
                    const id = Math.round(Math.random() * 1e12)
                    return {
                      ...item,
                      children: [
                        {
                          id,
                          text: props.dragged_tag!.name,
                          tag_id: props.dragged_tag!.id,
                          children: [],
                          hierarchy_ids: [...(item as Item).hierarchy_ids, id],
                          hierarchy_tag_ids: [
                            ...(item as Item).hierarchy_tag_ids,
                            props.dragged_tag!.id,
                          ],
                        },
                        ...item.children,
                      ],
                    }
                  } else {
                    return {
                      ...item,
                      children: item.children.map((item) =>
                        loop_over_items(item),
                      ),
                    }
                  }
                }
                // Without timeout, newly added item cannot be dragged.
                setTimeout(() => {
                  update_items({
                    items: items.map((item) => loop_over_items(item)),
                  })
                }, 0)
              }
            }}
            onMouseLeave={() => {
              if (props.dragged_tag) {
                document.body.classList.remove('adding-tag')
              }
              if (!is_dragging) {
                clear_mouseover_ids()
              }
            }}
            onContextMenu={(e) => {
              if (props.is_read_only) return
              set_context_menu_of_item_id((item as Item).id)
              onContextMenu(e)
            }}
          >
            <div>
              <span>{(item as Item).text}</span>
              {!props.is_updating && (
                <span>
                  {(item as Item).yields !== undefined
                    ? (item as Item).yields
                    : '?'}
                </span>
              )}
            </div>
          </a>
        </div>
      )
    }

    const render_collapse_icon = (params: { is_collapsed: boolean }) => {
      return (
        <button
          className={cn(styles.collapse, {
            [styles['collapse--collapsed']]: params.is_collapsed,
          })}
        >
          {params.is_collapsed ? (
            <Icon variant="LESS_THAN" />
          ) : (
            <Icon variant="LESS_THAN" />
          )}
        </button>
      )
    }

    const update_items = (params: { items: Item[] }) => {
      if (JSON.stringify(params.items) == JSON.stringify(items)) return

      // Find duplicates in nodes.
      const filter_duplicated_siblings = (items: Item[]) => {
        const unique_siblings: Item[] = []
        items.forEach((item) => {
          if (
            unique_siblings.findIndex(
              (sibling) => sibling.tag_id == item.tag_id,
            ) == -1
          ) {
            unique_siblings.push({
              ...item,
              children: filter_duplicated_siblings(item.children),
            })
          }
        })
        return unique_siblings
      }

      if (
        JSON.stringify(filter_duplicated_siblings(params.items)) !=
        JSON.stringify(params.items)
      ) {
        toast.error('Siblings must be unique')
        return
      }

      // Find duplicates in branches.
      const filter_branches_with_duplicates = (
        item: Item | undefined,
        seen_tag_ids: Set<number>,
      ): Item | undefined => {
        if (item === undefined) {
          return undefined
        }
        if (seen_tag_ids.has(item?.tag_id)) {
          return undefined
        }
        seen_tag_ids.add(item.tag_id)
        const filtered_children = item.children.map((child) =>
          filter_branches_with_duplicates(child, new Set(seen_tag_ids)),
        )
        const valid_children: any = filtered_children.filter((child) => child)
        return {
          ...item,
          children: valid_children,
        }
      }

      for (let i = 0; i <= params.items.length; i++) {
        if (
          JSON.stringify(params.items[i]) !=
          JSON.stringify(
            filter_branches_with_duplicates(params.items[i], new Set()),
          )
        ) {
          toast.error('Hierarchies cannot have duplicates')
          return
        }
      }

      // We need to regenerate ids so on mouseover highlight can work with the new tree.
      const new_tree = params.items.map((item) => item_to_tag(item))
      set_items(
        new_tree.map((node) =>
          tag_to_item({ node, hierarchy_ids: [], hierarchy_tag_ids: [] }),
        ),
      )
      props.on_update(new_tree)
    }

    const delete_item = (params: { item_id: number }) => {
      const filter_items = (current_items: Item[], item_id: number) =>
        current_items.filter((item) => {
          if (item.children)
            item.children = filter_items(item.children, item_id)
          return item.id !== item_id
        })

      const new_tree = filter_items(items, params.item_id)
      set_items(new_tree)
      props.on_update(new_tree.map((item) => item_to_tag(item)))
    }

    return (
      <SimpleBar
        className={cn(styles.simplebar)}
        ref={simplebar_tag_hierarchies}
      >
        {!props.show_skeleton ? (
          <div
            className={cn({
              [styles['simplebar__scrolled']]:
                !is_simplebar_tag_hierarchies_scrolled_to_top,
            })}
          >
            <div
              className={styles.container}
              style={{ pointerEvents: props.is_updating ? 'none' : undefined }}
            >
              <button
                className={cn(styles.tag__button, styles['tag__button--all'], {
                  [styles['tag__button--active']]:
                    props.is_all_bookmarks_selected,
                })}
                onClick={props.on_click_all_bookmarks}
                onMouseEnter={() => {
                  if (props.dragged_tag) {
                    document.body.classList.add('adding-tag')
                  }
                }}
                onMouseLeave={() => {
                  if (props.dragged_tag) {
                    document.body.classList.remove('adding-tag')
                  }
                }}
                onMouseUp={() => {
                  if (!props.tree || !props.dragged_tag) return
                  document.body.classList.remove('adding-tag')
                  update_items({
                    items: [
                      tag_to_item({
                        node: {
                          id: props.dragged_tag.id,
                          name: props.dragged_tag.name,
                          children: [],
                        },
                        hierarchy_ids: [],
                        hierarchy_tag_ids: [],
                      }),
                      ...items,
                    ],
                  })
                }}
              >
                <div>
                  <span>{props.translations.all_bookmarks}</span>
                  <span>{props.all_bookmarks_yields}</span>
                </div>
              </button>
              <Nestable
                items={items}
                renderItem={render_tag as any}
                onChange={(params) => {
                  clear_mouseover_ids()
                  update_items({ items: params.items as Item[] })
                  set_is_dragging(false)
                }}
                maxDepth={5}
                disableDrag={props.is_read_only}
                renderCollapseIcon={({ isCollapsed }) =>
                  render_collapse_icon({ is_collapsed: isCollapsed })
                }
                // Note: "confirmChange" can't be used for validation because it stops firing
                // deeper in the tree if there is a problem higher up.
                // confirmChange={}
              />
              {!props.is_read_only && (
                <div
                  className={cn(
                    styles['drop-zone'],
                    {
                      [styles['drop-zone--active']]: props.dragged_tag,
                    },
                    {
                      [styles['drop-zone--slim']]: items.length,
                    },
                  )}
                  onMouseUp={() => {
                    if (!props.tree || !props.dragged_tag) return
                    document.body.classList.remove('adding-tag')
                    update_items({
                      items: [
                        ...items,
                        tag_to_item({
                          node: {
                            id: props.dragged_tag.id,
                            name: props.dragged_tag.name,
                            children: [],
                          },
                          hierarchy_ids: [],
                          hierarchy_tag_ids: [],
                        }),
                      ],
                    })
                  }}
                  onMouseEnter={() => {
                    if (props.dragged_tag) {
                      document.body.classList.add('adding-tag')
                    }
                  }}
                  onMouseLeave={() => {
                    if (props.dragged_tag) {
                      document.body.classList.remove('adding-tag')
                    }
                  }}
                >
                  {!items.length && props.translations.drag_here}
                </div>
              )}
              {contextMenu}
            </div>
          </div>
        ) : (
          <div className={styles.simplebar__skeleton}>
            {[200, 180, 140, 160, 120].map((width, i) => (
              <Skeleton width={width} key={i} />
            ))}
          </div>
        )}
      </SimpleBar>
    )
  },
  (o, n) =>
    o.library_updated_at_timestamp == n.library_updated_at_timestamp &&
    o.is_all_bookmarks_selected == n.is_all_bookmarks_selected &&
    o.is_updating == n.is_updating &&
    o.dragged_tag == n.dragged_tag,
)

const tag_to_item = (params: {
  node: TagHierarchies.Node
  hierarchy_ids: number[]
  hierarchy_tag_ids: number[]
}): Item => {
  const id = Math.round(Math.random() * 1e12)
  const hierarchy_ids = [...params.hierarchy_ids, id]
  const hierarchy_tag_ids = [...params.hierarchy_tag_ids, params.node.id]
  return {
    // Nestable requires unique ids for items.
    id,
    tag_id: params.node.id,
    text: params.node.name,
    yields: params.node.yields,
    hierarchy_ids,
    hierarchy_tag_ids,
    children: params.node.children.map((node) =>
      tag_to_item({ node, hierarchy_ids, hierarchy_tag_ids }),
    ),
  }
}

const item_to_tag = (item: Item): TagHierarchies.Node => {
  return {
    name: item.text,
    id: item.tag_id,
    yields: item.yields,
    children: item.children.map((i) => item_to_tag(i)),
  }
}