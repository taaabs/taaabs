import { system_values } from '@shared/constants/system-values'
import { _Bookmark } from './_Bookmark'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import { useRef, useState } from 'react'
import styles from './Bookmark.module.scss'
import cn from 'classnames'

export namespace Bookmark {
  export type Props = _Bookmark.Props & {
    render_height?: number
    set_render_height: (height: number) => void
  }
}

export const Bookmark: React.FC<Bookmark.Props> = (props) => {
  const ref = useRef({} as HTMLDivElement)
  const is_visible = useViewportSpy(ref)
  const [dragged_tag, set_dragged_tag] =
    useState<_Bookmark.Props['dragged_tag']>()

  useUpdateEffect(() => {
    if (!props.render_height) {
      const height = ref.current.getBoundingClientRect().height
      props.set_render_height(height)
    }
  }, [is_visible])

  useUpdateEffect(() => {
    const height = ref.current.getBoundingClientRect().height
    props.set_render_height(height)
  }, [props.is_compact])

  return (
    <div
      ref={ref}
      style={{
        height: !is_visible ? props.render_height : undefined,
      }}
      className={cn(styles.wrapper, {
        [styles['wrapper--open']]: !props.is_compact,
      })}
      onMouseEnter={() => {
        set_dragged_tag(props.dragged_tag)
        if (
          props.dragged_tag &&
          props.tags.length < system_values.bookmark.tags.limit &&
          !props.tags.find((tag) => tag.name == props.dragged_tag!.name)
        ) {
          document.body.classList.add('adding-tag')
        }
      }}
      onMouseLeave={() => {
        set_dragged_tag(undefined)
        if (dragged_tag) {
          document.body.classList.remove('adding-tag')
        }
      }}
      onMouseUp={() => {
        set_dragged_tag(undefined)
      }}
    >
      {is_visible === undefined || is_visible || !props.render_height ? (
        <_Bookmark {...props} dragged_tag={dragged_tag} />
      ) : (
        <></>
      )}
    </div>
  )
}
