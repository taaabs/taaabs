import { Button } from '@web-ui/components/Button'
import styles from './DesktopActions.module.scss'
import { Icon } from '@web-ui/components/Icon'

export namespace DesktopActions {
  export type Props = {
    library_button_label: string
    library_button_href: string
    github_url: string
  }
}

export const DesktopActions: React.FC<DesktopActions.Props> = (props) => {
  return (
    <div className={styles.container}>
      <Button size="large" href={props.library_button_href}>
        {props.library_button_label}
      </Button>
      <div className={styles.github}>
        <a href={props.github_url}>
          <Icon variant="GITHUB" />
        </a>
      </div>
    </div>
  )
}
