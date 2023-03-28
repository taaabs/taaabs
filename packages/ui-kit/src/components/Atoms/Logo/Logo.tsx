import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'

export const Logo: React.FC = () => {
  return (
    <div
      css={css`
        width: var(${Theme.BUTTON_HEIGHT_34});
        height: var(${Theme.BUTTON_HEIGHT_34});
        font-size: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
        background-color: var(${Theme.COLOR_BRAND});
        color: var(${Theme.COLOR_WHITE});
        &::after {
          content: 't';
          transform: translateX(-0.2px);
        }
        ${mq.at992} {
          width: var(${Theme.BUTTON_HEIGHT_40});
          height: var(${Theme.BUTTON_HEIGHT_40});
          font-size: 32px;
          &::after {
            transform: translateX(-1px);
          }
        }
      `}
    />
  )
}
