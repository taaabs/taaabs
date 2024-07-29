import React from 'react'
import styles from './SavingStatus.module.scss'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Icon } from '@web-ui/components/common/particles/icon'

export namespace SavingStatus {
  export type Props = {
    is_saving: boolean
    dictionary: {
      saving: string
      saved: string
    }
  }
}

export const SavingStatus: React.FC<SavingStatus.Props> = (props) => {
  const [is_visible, set_is_visible] = React.useState(props.is_saving)

  useUpdateEffect(() => {
    if (!props.is_saving) {
      setTimeout(() => {
        set_is_visible(false)
      }, 2000)
    } else {
      set_is_visible(true)
    }
  }, [props.is_saving])

  return (
    <div
      className={styles.container}
      style={{ opacity: !is_visible ? 0 : undefined }}
    >
      {props.is_saving && <div className={styles.spinner}></div>}
      {!props.is_saving && (
        <div className={styles.tick}>
          <Icon variant="CHECK" />
        </div>
      )}
      <div className={styles.text}>
        {props.dictionary[props.is_saving ? 'saving' : 'saved']}
      </div>
    </div>
  )
}
