import { useState } from 'react'
import styles from './tag-hierarchies.module.scss'
import cn from 'classnames'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import Nestable from 'react-nestable'
import { Icon } from '@web-ui/components/common/particles/icon'

export namespace TagHierarchies {
  export type Node = {
    name: string
    children: Node[]
  }
  export type Props = {
    tree: Node[]
    on_update: (tags: Node[]) => void
    on_item_click: (tag_id: number) => void
  }
}

type Item = {
  id: number
  text: string
  children: Item[]
}

export const TagHierarchies: React.FC<TagHierarchies.Props> = (props) => {
  const [items, set_items] = useState<Item[]>(
    props.tree.map((node) => tag_to_item(node)),
  )

  useUpdateEffect(() => {
    props.on_update(items.map((item) => item_to_tag(item)))
  }, [items])

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
        <button>{item.text}</button>
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
        items={items}
        renderItem={render_tag}
        onChange={(params) => {
          // TODO: Validate new tree: check of duplicates in a node, in a branch and in the root.
          // If invalid, revert changes and dispatch toast.
          const new_items = params.items as Item[]
          set_items(new_items)
        }}
        maxDepth={5}
        renderCollapseIcon={({ isCollapsed }) =>
          render_collapse_icon({ is_collapsed: isCollapsed })
        }
        // Note: "confirmChange" can't be used for validation because it stops firing
        // as soon as some conflict higher up in the tree is detected.
        // confirmChange={}
      />
    </div>
  )
}

const tag_to_item = (node: TagHierarchies.Node): Item => {
  return {
    // Items must have unique ids.
    id: Math.floor(Math.random() * 1e12),
    text: node.name,
    children: node.children.map((node) => tag_to_item(node)),
  }
}

const item_to_tag = (item: Item): TagHierarchies.Node => {
  return {
    name: item.text,
    children: item.children.map((i) => item_to_tag(i)),
  }
}
