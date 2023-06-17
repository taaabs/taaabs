import { Button } from '@web-ui/components/common/atoms/Button'
import styles from './DesktopUserForHeader.module.scss'
import Skeleton from 'react-loading-skeleton'

export namespace DesktopUserForHeaderTypes {
  export type Props = {
    isLoading: boolean
    buttonLabel: string
    buttonOnClick: () => void
  }
}

export const DesktopUserForHeader: React.FC<DesktopUserForHeaderTypes.Props> = (
  props,
) => {
  const loading = <Skeleton className={styles.skeleton} />
  const loaded = (
    <Button size="large" onClick={props.buttonOnClick}>
      {props.buttonLabel}
    </Button>
  )

  return props.isLoading ? loading : loaded
}
