import { memo, useState } from 'react'
import styles from './tag-hierarchies.module.scss'
import cn from 'classnames'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import Nestable from 'react-nestable'
import { Icon } from '@web-ui/components/common/particles/icon'
import { toast } from 'react-toastify'

export namespace TagHierarchies {
  export type Node = {
    name: string
    id: number
    children: Node[]
  }
  export type Props = {
    tree: Node[]
    on_update: (tags: Node[]) => void
    on_item_click: (hierarchy_ids: number[]) => void
    selected_tag_ids: number[]
    is_updating: boolean
  }
}

type Item = {
  id: number
  tag_id: number
  text: string
  hierarchy_ids: number[]
  hierarchy_tag_ids: number[]
  children: Item[]
}

export const TagHierarchies: React.FC<TagHierarchies.Props> = memo(
  (props) => {
    const [count, set_count] = useState(0)
    const [is_dragging, set_is_dragging] = useState(false)
    const [items, set_items] = useState<Item[]>(
      props.tree.map((node) =>
        tag_to_item({ node, hierarchy_ids: [], hierarchy_tag_ids: [] }),
      ),
    )
    const [mouseover_ids, set_mouseover_ids] = useState<number[]>([])

    useUpdateEffect(() => {
      props.on_update(items.map((item) => item_to_tag(item)))
      set_count(count + 1)
    }, [items])

    const render_tag = ({
      item,
      collapseIcon,
    }: {
      item: any
      collapseIcon: any
    }) => {
      let is_active = false
      const selected_tags = (item as Item).hierarchy_tag_ids
      if (
        JSON.stringify(props.selected_tag_ids.slice(0, selected_tags.length)) ==
        JSON.stringify(selected_tags)
      ) {
        is_active = true
      }

      return (
        <div className={styles.tag}>
          {collapseIcon ? collapseIcon : <div className={styles.tag__spacer} />}
          <button
            className={cn(styles.tag__button, {
              [styles['tag__button--active']]: is_active,
              [styles['tag__button--highlighted']]: mouseover_ids.includes(
                (item as Item).id,
              ),
            })}
            onClick={() => {
              props.on_item_click((item as Item).hierarchy_tag_ids)
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
            }}
            onMouseLeave={() => {
              if (!is_dragging) {
                set_mouseover_ids([])
              }
            }}
          >
            {(item as Item).text}
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

    return (
      <div className={styles.container}>
        <Nestable
          key={count}
          items={items}
          renderItem={render_tag}
          onChange={(params) => {
            set_mouseover_ids([])
            if (JSON.stringify(params.items) == JSON.stringify(items)) return

            // Perform validation: check for duplicates in a node, in a branch and in the root.
            // If invalid, revert changes and dispatch toast.
            const adjecency_list: { text: string; parent_text?: string }[] = []
            const node_to_adjecency_list_item = (params: {
              node: Item
              parent_text?: string
            }) => {
              adjecency_list.push({
                text: params.node.text,
                parent_text: params.parent_text,
              })
              params.node.children.forEach((node) =>
                node_to_adjecency_list_item({
                  node,
                  parent_text: params.node.text,
                }),
              )
            }
            ;(params.items as Item[]).forEach((node) =>
              node_to_adjecency_list_item({ node }),
            )

            // Filter duplicated siblings.
            const adjecency_list_without_dupes = adjecency_list.filter(
              (item, i) =>
                i ===
                adjecency_list.findIndex(
                  (el) =>
                    el.text == item.text && el.parent_text == item.parent_text,
                ),
            )
            if (
              JSON.stringify(adjecency_list) !=
              JSON.stringify(adjecency_list_without_dupes)
            ) {
              set_count(count + 1)
              toast.error('Siblings must be unique')
              return
            }

            // Verify if adjecency list converts back to tree (don't have duplicates in branches).
            const adjecency_list_to_tree = (params: {
              text: string | null
              adjecency_list: { text: string; parent_text?: string }[]
            }): any =>
              params.adjecency_list
                .filter(({ parent_text }) => parent_text == params.text)
                .map(({ text }) => ({
                  children: adjecency_list_to_tree({
                    text,
                    adjecency_list: params.adjecency_list,
                  }),
                }))

            try {
              adjecency_list_to_tree({ text: null, adjecency_list })
            } catch {
              set_count(count + 1)
              toast.error('Hierarchy cannot have duplicates')
              return
            }

            set_items(params.items as Item[])
          }}
          maxDepth={5}
          disableDrag={props.is_updating}
          renderCollapseIcon={({ isCollapsed }) =>
            render_collapse_icon({ is_collapsed: isCollapsed })
          }
          // Note: "confirmChange" can't be used for validation because it stops firing
          // deeper in the tree if there is a problem higher up.
          // confirmChange={}
        />
      </div>
    )
  },
  (o, n) => o.selected_tag_ids.length == n.selected_tag_ids.length,
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
    children: item.children.map((i) => item_to_tag(i)),
  }
}
