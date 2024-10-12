import { _FeedItem } from './_FeedItem'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import { useRef } from 'react'
import styles from './FeedItem.module.scss'
import cn from 'classnames'

export namespace FeedItem {
  export type Props = _FeedItem.Props & {
    render_height?: number
    set_render_height: (height: number) => void
  }
}

export const Bookmark: React.FC<FeedItem.Props> = (props) => {
  const ref = useRef({} as HTMLDivElement)
  const is_visible = useViewportSpy(ref)

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
      className={cn(
        styles.wrapper,
        {
          [styles['wrapper--compact']]: props.density == 'compact',
        },
        {
          [styles['wrapper--compact-open']]:
            props.density == 'compact' && !props.is_compact,
        },
      )}
    >
      {is_visible === undefined || is_visible || !props.render_height ? (
        <_FeedItem {...props} />
      ) : (
        <></>
      )}
    </div>
  )
}
