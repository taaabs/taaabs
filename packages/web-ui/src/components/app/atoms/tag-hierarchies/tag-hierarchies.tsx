import { memo, useEffect, useState } from 'react'
import styles from './tag-hierarchies.module.scss'
import cn from 'classnames'
import Nestable from 'react-nestable'
import { Icon } from '@web-ui/components/common/particles/icon'
import { toast } from 'react-toastify'
import { system_values } from '@shared/constants/system-values'
import { useContextMenu } from 'use-context-menu'
import { DropdownMenu } from '../dropdown-menu'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export namespace TagHierarchies {
  export type Node = {
    name: string
    id: number
    yields?: number
    children: Node[]
  }
  export type Props = {
    tree: Node[]
    on_update: (tags: Node[]) => void
    on_item_click: (hierarchy_ids: number[]) => void
    selected_tag_ids: number[]
    is_updating: boolean
    dragged_tag?: { id: number; name: string }
    query_params: string
    is_draggable: boolean
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
  (props) => {
    const [is_dragging, set_is_dragging] = useState(false)
    const [items, set_items] = useState<Item[]>([])
    const [mouseover_ids, set_mouseover_ids] = useState<number[]>([])
    const [selected_tag_ids, set_selected_tag_ids] = useState<number[]>([])
    const [context_menu_of_item_id, set_context_menu_of_item_id] =
      useState<number>()
    const { contextMenu, onContextMenu } = useContextMenu(
      <>
        <DropdownMenu
          items={[
            {
              label: 'Delete',
              on_click: () => {
                if (!context_menu_of_item_id) return
                clear_mouseover_ids()
                delete_item({ item_id: context_menu_of_item_id })
              },
              other_icon: <Icon variant="DELETE" />,
            },
          ]}
        />
      </>,
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
        setTimeout(() => {
          clear_selected_tag_ids()
        }, 0)
      }
    }, [props.selected_tag_ids])

    useEffect(() => {
      set_items(
        props.tree.map((node) =>
          tag_to_item({ node, hierarchy_ids: [], hierarchy_tag_ids: [] }),
        ),
      )
    }, [props.tree])

    const render_tag = ({
      item,
      collapseIcon,
    }: {
      item: any
      collapseIcon: any
    }) => {
      return (
        <div className={styles.tag}>
          {collapseIcon ? collapseIcon : <div className={styles.tag__spacer} />}
          <button
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
            onClick={() => {
              props.on_item_click((item as Item).hierarchy_tag_ids)
              set_selected_tag_ids((item as Item).hierarchy_tag_ids)
              clear_mouseover_ids()
            }}
            onMouseEnter={() => {
              if (!is_dragging) set_mouseover_ids((item as Item).hierarchy_ids)
            }}
            onMouseDown={() => {
              set_is_dragging(true)
            }}
            onMouseUp={() => {
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
                    const id = Math.floor(Math.random() * 1e12)
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
              if (!is_dragging) {
                clear_mouseover_ids()
              }
            }}
            onContextMenu={(e) => {
              set_context_menu_of_item_id((item as Item).id)
              onContextMenu(e)
            }}
          >
            <div>
              <span>{(item as Item).text}</span>
              {<span> {(item as Item).yields || 0}</span>}
            </div>
          </button>
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
      <div className={styles.container}>
        <Nestable
          items={items}
          renderItem={render_tag}
          onChange={(params) => {
            clear_mouseover_ids()
            update_items({ items: params.items as Item[] })
            set_is_dragging(false)
          }}
          maxDepth={5}
          disableDrag={!props.is_draggable || props.is_updating}
          renderCollapseIcon={({ isCollapsed }) =>
            render_collapse_icon({ is_collapsed: isCollapsed })
          }
          // Note: "confirmChange" can't be used for validation because it stops firing
          // deeper in the tree if there is a problem higher up.
          // confirmChange={}
        />
        {contextMenu}
      </div>
    )
  },
  (o, n) =>
    o.query_params == n.query_params &&
    JSON.stringify(o.selected_tag_ids) == JSON.stringify(n.selected_tag_ids) &&
    o.dragged_tag == n.dragged_tag &&
    JSON.stringify(o.tree) == JSON.stringify(n.tree),
)

const tag_to_item = (params: {
  node: TagHierarchies.Node
  hierarchy_ids: number[]
  hierarchy_tag_ids: number[]
}): Item => {
  const id = Math.floor(Math.random() * 1e12)
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
