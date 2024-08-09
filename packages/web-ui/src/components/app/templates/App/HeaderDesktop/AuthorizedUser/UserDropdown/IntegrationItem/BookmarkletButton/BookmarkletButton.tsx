import { Icon as UiIcon } from '@web-ui/components/Icon'
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
      <UiIcon variant="EXTENSION_ICON" />
    </div>
  )
}
