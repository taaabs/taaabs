import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export namespace FeatureGridTypes {
  export type GridItem = {
    firstLine: string
    secondLine: string
    thirdLine: string
  }
  export type Props = {
    gridItems: [GridItem, GridItem, GridItem, GridItem]
  }
}

export const FeatureGrid: React.FC<FeatureGridTypes.Props> = ({
  gridItems,
}) => {
  return (
    <section>
      <Ui.Atoms.Wrapper>
        <S.Grid>
          {gridItems.map((gridItem, index) => (
            <div key={index}>
              <S.FirstLine>{gridItem.firstLine}</S.FirstLine>
              <S.SecondLine>{gridItem.secondLine}</S.SecondLine>
              <S.ThirdLine>{gridItem.thirdLine}</S.ThirdLine>
            </div>
          ))}
        </S.Grid>
      </Ui.Atoms.Wrapper>
    </section>
  )
}

namespace S {
  export const Grid = styled.div`
    display: grid;
    grid-row-gap: 4rem;
    ${mq.at576(css`
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      grid-column-gap: 4rem;
      grid-row-gap: 10rem;
    `)}
  `
  export const FirstLine = styled.span`
    display: block;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    ${mq.at576(css`
      margin-bottom: 1rem;
    `)}
  `
  const base = css`
    font-size: 2.6rem;
    line-height: 1.2;
    white-space: pre-line;
    ${mq.at576(css`
      font-size: 3rem;
    `)}
    ${mq.at1200(css`
      font-size: 3.6rem;
    `)}
  `
  export const SecondLine = styled.div`
    ${base}
    font-weight: bold;
  `
  export const ThirdLine = styled.div`
    ${base}
    font-family: var(${Theme.FONT_FAMILY_SERIF});
  `
}
