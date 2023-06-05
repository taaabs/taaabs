import { sharedValues } from '@web-ui/constants'
import { ButtonOutlinedIcon } from '@web-ui/components/Atoms/ButtonOutlinedIcon'
import { SearchBox } from '@web-ui/components/Molecules/SearchBox'
import { ButtonAvatar } from '@web-ui/components/Atoms/ButtonAvatar'
import { css } from '@emotion/react'

export namespace HeaderDesktopUserAreaTypes {
  export type Props = {
    avatar?: {
      url: string
      blurhash: string
    }
    onClickSearch: () => void
    onClickTheme: () => void
    onClickAdd: () => void
    currentTheme: 'LIGHT' | 'DARK'
  }
}

export const HeaderDesktopUserArea: React.FC<
  HeaderDesktopUserAreaTypes.Props
> = (props) => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        flex-grow: 1;
        justify-content: flex-end;
        gap: ${sharedValues.distance[8]}px;
        height: 100%;
      `}
    >
      <SearchBox onClick={() => {}} placeholder="Search anything..." />
      <ButtonOutlinedIcon iconVariant="SUN" onClick={props.onClickTheme} />
      <ButtonOutlinedIcon iconVariant="ADD" onClick={props.onClickAdd} />
      {props.avatar ? (
        <ButtonAvatar
          url={props.avatar.url}
          blurhash={props.avatar.blurhash}
          onClick={() => {}}
        />
      ) : (
        <ButtonOutlinedIcon iconVariant="USER" onClick={() => {}} />
      )}
    </div>
  )
}
