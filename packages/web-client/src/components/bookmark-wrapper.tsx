import { system_values } from '@shared/constants/system-values'
import { Bookmark } from '@web-ui/components/app/atoms/bookmark'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import { useRef, useState } from 'react'

export const BookmarkWrapper: React.FC<Bookmark.Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const is_visible = useViewportSpy(ref)
  const [was_seen, set_was_seen] = useState<boolean>()
  const [dragged_tag, set_dragged_tag] =
    useState<Bookmark.Props['dragged_tag']>()

  useUpdateEffect(() => {
    if (is_visible) {
      set_was_seen(true)
    }
  }, [is_visible])

  useUpdateEffect(() => {
    const height = ref.current!.getBoundingClientRect().height
    props.set_render_height(height)
  }, [was_seen])

  return (
    <div
      ref={ref}
      style={{
        height: !is_visible ? props.render_height : undefined,
      }}
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
      {is_visible || !props.render_height ? (
        <Bookmark {...props} dragged_tag={dragged_tag} />
      ) : (
        <></>
      )}
    </div>
  )
}
