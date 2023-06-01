import { sharedValues } from '@web-ui/constants'
import { Ui } from '@web-ui/index'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { s } from '@web-ui/styles/constants'
import { css } from '@emotion/react'

export namespace BottomNavigationBar {
  export type Props = {
    onClickSearch: () => void
    onClickUser: () => void
    onClickAdd: () => void
    onClickNotifications: () => void
    onClickMyLibrary: () => void
  }
}

export const BottomNavigationBar: React.FC<BottomNavigationBar.Props> = (
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
          ${s.iconSize[24]}
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
        <Ui.Atoms.Icon variant="ADD" />
      </button>
      <button onClick={props.onClickNotifications}>
        <Ui.Atoms.Icon variant="SEARCH" />
      </button>
      <button onClick={props.onClickAdd}>
        <Ui.Atoms.Icon variant="NOTIFICATIONS" />
      </button>
      <button onClick={props.onClickUser}>
        <Ui.Atoms.Icon variant="USER" />
      </button>
    </div>
  )
}
