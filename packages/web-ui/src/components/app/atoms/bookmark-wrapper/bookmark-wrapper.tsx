import { system_values } from '@shared/constants/system-values'
import { Bookmark } from '@web-ui/components/app/atoms/bookmark'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import { useRef, useState } from 'react'
import styles from './bookmark-wrapper.module.scss'
import cn from 'classnames'

namespace BookmarkWrapper {
  export type Props = Bookmark.Props & {
    render_height_?: number
    set_render_height_: (height: number) => void
    on_is_visible: () => void
  }
}

export const BookmarkWrapper: React.FC<BookmarkWrapper.Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const is_visible = useViewportSpy(ref)
  const [dragged_tag, set_dragged_tag] =
    useState<Bookmark.Props['dragged_tag_']>()

  useUpdateEffect(() => {
    if (!props.render_height_) {
      const height = ref.current!.getBoundingClientRect().height
      props.set_render_height_(height)
    }
    is_visible && props.on_is_visible()
  }, [is_visible])

  useUpdateEffect(() => {
    const height = ref.current!.getBoundingClientRect().height
    props.set_render_height_(height)
  }, [props.is_compact_])

  return (
    <div
      ref={ref}
      style={{
        height: !is_visible ? props.render_height_ : undefined,
      }}
      className={cn(
        styles.wrapper,
        {
          [styles['wrapper--compact']]: props.density_ == 'compact',
        },
        {
          [styles['wrapper--compact-open']]:
            props.density_ == 'compact' && !props.is_compact_,
        },
      )}
      onMouseEnter={() => {
        set_dragged_tag(props.dragged_tag_)
        if (
          props.dragged_tag_ &&
          props.tags_.length < system_values.bookmark.tags.limit &&
          !props.tags_.find((tag) => tag.name_ == props.dragged_tag_!.name_)
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
      {is_visible === undefined || is_visible || !props.render_height_ ? (
        <Bookmark {...props} dragged_tag_={dragged_tag} />
      ) : (
        <></>
      )}
    </div>
  )
}
