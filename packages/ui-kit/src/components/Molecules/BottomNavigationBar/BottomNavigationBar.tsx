import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'

export namespace BottomNavigationBar {
  export type Props = {
    x?: string
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
        height: ${sharedValues.heights.BOTTOM_NAVIGATION_BAR}px;
        border-top: var(${Theme.BORDER_PRIMARY});
        background-color: var(${Theme.COLOR_WHITE});
        display: flex;
        justify-content: space-around;
        > * > div > svg {
          width: ${sharedValues.ICON_SIZE}px;
          height: ${sharedValues.ICON_SIZE}px;
        }
        > * {
          width: ${sharedValues.heights.BUTTON_46}px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}
    >
      <button onClick={props.onClickMyLibrary}>
        <Ui.Atoms.Icon variant="LIBRARY" />
      </button>
      <button onClick={props.onClickNotifications}>
        <Ui.Atoms.Icon variant="NOTIFICATIONS" />
      </button>
      <button onClick={props.onClickAdd}>
        <Ui.Atoms.Icon variant="ADD" />
      </button>
      <button onClick={props.onClickSearch}>
        <Ui.Atoms.Icon variant="SEARCH" />
      </button>
      <button onClick={props.onClickUser}>
        <Ui.Atoms.Icon variant="USER" />
      </button>
    </div>
  )
}
