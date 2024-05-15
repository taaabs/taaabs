import { memo, useEffect, useState } from 'react'
import styles from './tag-hierarchies.module.scss'
import cn from 'classnames'
import Nestable from 'react-nestable'
import { Icon } from '@web-ui/components/common/particles/icon'
import { toast } from 'react-toastify'
import { system_values } from '@shared/constants/system-values'
import { useContextMenu } from 'use-context-menu'
import { Dropdown as UiCommon_Dropdown } from '@web-ui/components/common/dropdown'
import { StandardItem as UiCommon_Dropdown_StandardItem } from '@web-ui/components/common/dropdown/standard-item'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export namespace TagHierarchies {
  export type Node = {
    name: string
    id: number
    yields?: number
    children: Node[]
  }
  export type Props = {
    library_updated_at_timestamp_?: number
    tree_?: Node[]
    on_update_: (tags: Node[]) => void
    on_item_click_: (hierarchy_ids: number[]) => void
    selected_tag_ids_: number[]
    is_updating_?: boolean
    dragged_tag_?: { id_: number; name_: string }
    is_updatable_?: boolean
    all_bookmarks_yields_?: number
    is_all_bookmarks_selected_: boolean
    on_click_all_bookmarks_: () => void
    on_tag_rename_click_?: (tag_id: number) => void
    library_url_: string
    translations_: {
      drag_here_: string
      all_bookmarks_: string
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
    const [context_menu_of_item_id, set_context_menu_of_item_id] =
      useState<number>()
    const { contextMenu, onContextMenu } = useContextMenu(
      <UiCommon_Dropdown>
        <UiCommon_Dropdown_StandardItem
          label="Rename"
          icon_variant="EDIT"
          on_click={() => {
            props.on_tag_rename_click_!(
              items.find((i) => i.id == context_menu_of_item_id)!.tag_id,
            )
          }}
        />
        <UiCommon_Dropdown_StandardItem
          label="Delete"
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
        JSON.stringify(props.selected_tag_ids_) !=
        JSON.stringify(selected_tag_ids)
      ) {
        clear_selected_tag_ids()
      }
    }, [props.selected_tag_ids_])

    useEffect(() => {
      if (!props.tree_) return
      set_items(
        props.tree_.map((node) =>
          tag_to_item({ node, hierarchy_ids: [], hierarchy_tag_ids: [] }),
        ),
      )
    }, [props.tree_])

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
              props.on_item_click_((item as Item).hierarchy_tag_ids)
              // Calling before timeout fixes issue when selecting tag after changing filter.
              // TODO: Investigate root cause.
              set_selected_tag_ids((item as Item).hierarchy_tag_ids)
              setTimeout(() => {
                set_selected_tag_ids((item as Item).hierarchy_tag_ids)
              }, 0)
              clear_mouseover_ids()
            }}
            href={`${props.library_url_}?${search_params.toString()}`}
            onMouseEnter={() => {
              if (props.dragged_tag_) {
                document.body.classList.add('adding-tag')
              }
              if (!is_dragging) set_mouseover_ids((item as Item).hierarchy_ids)
            }}
            onMouseDown={() => {
              set_is_dragging(true)
            }}
            onMouseUp={() => {
              if (props.dragged_tag_) {
                document.body.classList.remove('adding-tag')
              }
              setTimeout(() => {
                set_is_dragging(false)
              }, 0)
              if (props.dragged_tag_) {
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
                          text: props.dragged_tag_!.name_,
                          tag_id: props.dragged_tag_!.id_,
                          children: [],
                          hierarchy_ids: [...(item as Item).hierarchy_ids, id],
                          hierarchy_tag_ids: [
                            ...(item as Item).hierarchy_tag_ids,
                            props.dragged_tag_!.id_,
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
              if (props.dragged_tag_) {
                document.body.classList.remove('adding-tag')
              }
              if (!is_dragging) {
                clear_mouseover_ids()
              }
            }}
            onContextMenu={(e) => {
              if (!props.is_updatable_) return
              set_context_menu_of_item_id((item as Item).id)
              onContextMenu(e)
            }}
          >
            <div>
              <span>{(item as Item).text}</span>
              {!props.is_updating_ && (
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
      props.on_update_(new_tree)
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
      props.on_update_(new_tree.map((item) => item_to_tag(item)))
    }

    return (
      <div
        className={styles.container}
        style={{ pointerEvents: props.is_updating_ ? 'none' : undefined }}
      >
        <button
          className={cn(styles.tag__button, styles['tag__button--all'], {
            [styles['tag__button--active']]: props.is_all_bookmarks_selected_,
          })}
          onClick={props.on_click_all_bookmarks_}
          onMouseEnter={() => {
            if (props.dragged_tag_) {
              document.body.classList.add('adding-tag')
            }
          }}
          onMouseLeave={() => {
            if (props.dragged_tag_) {
              document.body.classList.remove('adding-tag')
            }
          }}
          onMouseUp={() => {
            if (!props.tree_ || !props.dragged_tag_) return
            document.body.classList.remove('adding-tag')
            update_items({
              items: [
                tag_to_item({
                  node: {
                    id: props.dragged_tag_.id_,
                    name: props.dragged_tag_.name_,
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
            <span>{props.translations_.all_bookmarks_}</span>
            <span>{props.all_bookmarks_yields_}</span>
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
          disableDrag={!props.is_updatable_}
          renderCollapseIcon={({ isCollapsed }) =>
            render_collapse_icon({ is_collapsed: isCollapsed })
          }
          // Note: "confirmChange" can't be used for validation because it stops firing
          // deeper in the tree if there is a problem higher up.
          // confirmChange={}
        />
        {props.is_updatable_ && (
          <div
            className={cn(
              styles['drop-zone'],
              {
                [styles['drop-zone--active']]: props.dragged_tag_,
              },
              {
                [styles['drop-zone--slim']]: items.length,
              },
            )}
            onMouseUp={() => {
              if (!props.tree_ || !props.dragged_tag_) return
              document.body.classList.remove('adding-tag')
              update_items({
                items: [
                  ...items,
                  tag_to_item({
                    node: {
                      id: props.dragged_tag_.id_,
                      name: props.dragged_tag_.name_,
                      children: [],
                    },
                    hierarchy_ids: [],
                    hierarchy_tag_ids: [],
                  }),
                ],
              })
            }}
            onMouseEnter={() => {
              if (props.dragged_tag_) {
                document.body.classList.add('adding-tag')
              }
            }}
            onMouseLeave={() => {
              if (props.dragged_tag_) {
                document.body.classList.remove('adding-tag')
              }
            }}
          >
            {!items.length && props.translations_.drag_here_}
          </div>
        )}
        {contextMenu}
      </div>
    )
  },
  (o, n) =>
    o.library_updated_at_timestamp_ == n.library_updated_at_timestamp_ &&
    o.is_all_bookmarks_selected_ == n.is_all_bookmarks_selected_ &&
    o.is_updating_ == n.is_updating_ &&
    o.dragged_tag_ == n.dragged_tag_,
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
