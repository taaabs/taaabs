import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export type HeroProps = {
  text: string
}

export const Hero: React.FC<HeroProps> = ({ text }) => {
  return (
    <section>
      <Ui.Atoms.Wrapper>
        <div css={container}>
          <h1>{text}</h1>
        </div>
      </Ui.Atoms.Wrapper>
    </section>
  )
}

const container = css`
  ${mq.at768} {
    max-width: 90%;
  }
  ${mq.at992} {
    max-width: 110rem;
  }
  & h1 {
    font-size: 4rem;
    font-family: var(${Theme.FONT_FAMILY_SERIF});
    line-height: 1.1;
    font-weight: normal;
    ${mq.at768} {
      font-size: 5rem;
    }
    ${mq.at992} {
      font-size: 5.5rem;
    }
    ${mq.at1200} {
      font-size: 6.5rem;
    }
  }
`