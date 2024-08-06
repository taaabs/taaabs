import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './BookmarkletButton.module.scss'

type Props = {
  label: string
  script: string
}

export const BookmarkletButton: React.FC<Props> = (props) => {
  return (
    <div className={styles.button}>
      <div
        dangerouslySetInnerHTML={{
          __html: `<a href='${props.script}' target='_blank' onclick="event.preventDefault();">${props.label}</a>`,
        }}
      />
      <Icon variant="EXTENSION_ICON" />
    </div>
  )
}
