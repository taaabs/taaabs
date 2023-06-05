import { sharedValues } from '@web-ui/constants'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { styles } from '@web-ui/styles/constants'
import { css } from '@emotion/react'
import { Icon } from '@web-ui/components/Atoms/Icon'

export namespace BottomNavigationBarTypes {
  export type Props = {
    onClickSearch: () => void
    onClickUser: () => void
    onClickAdd: () => void
    onClickNotifications: () => void
    onClickMyLibrary: () => void
  }
}

export const BottomNavigationBar: React.FC<BottomNavigationBarTypes.Props> = (
  props,
) => {
  return (
    <div
      css={css`
        height: ${sharedValues.bottomNavigationBar}px;
        border-top: var(${Theme.BORDER_PRIMARY});
        background-color: var(${Theme.COLOR_WHITE});
        display: flex;
        justify-content: space-around;
        > * > div > svg {
          ${styles.iconSize[24]}
        }
        > * {
          width: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}
    >
      <button onClick={props.onClickMyLibrary}>
        <Icon variant="ADD" />
      </button>
      <button onClick={props.onClickNotifications}>
        <Icon variant="SEARCH" />
      </button>
      <button onClick={props.onClickAdd}>
        <Icon variant="NOTIFICATIONS" />
      </button>
      <button onClick={props.onClickUser}>
        <Icon variant="USER" />
      </button>
    </div>
  )
}
