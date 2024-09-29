import { Button as UiButton } from '@web-ui/components/Button'
import styles from './DesktopActions.module.scss'
import { Icon as UiIcon } from '@web-ui/components/Icon'

export namespace DesktopActions {
  export type Props = {
    library_button_label: string
    library_button_href: string
    library_button_on_click?: (e: any) => void
    github_url: string
  }
}

export const DesktopActions: React.FC<DesktopActions.Props> = (props) => {
  return (
    <div className={styles.container}>
      <UiButton
        size="large"
        href={props.library_button_href}
        on_click={props.library_button_on_click}
      >
        {props.library_button_label}
      </UiButton>
      <div className={styles.github}>
        <a href={props.github_url}>
          <UiIcon variant="GITHUB" />
        </a>
      </div>
    </div>
  )
}
