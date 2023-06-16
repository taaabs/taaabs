import { Button } from '@web-ui/components/common/atoms/Button'
import styles from './HeaderDesktopUser.module.scss'

export namespace HeaderDesktopUserTypes {
  export type Props = {
    isLoading: boolean
    buttonLabel: string
    buttonOnClick: () => void
  }
}

export const HeaderDesktopUser: React.FC<HeaderDesktopUserTypes.Props> = (
  props,
) => {
  const loading = <div>loading...</div>
  const loaded = (
    <div className={styles.container}>
      <Button size="large" onClick={props.buttonOnClick}>
        {props.buttonLabel}
      </Button>
      {/* TODO: user avatar with menu for logout, theme etc. */}
    </div>
  )

  return props.isLoading ? loading : loaded
}
