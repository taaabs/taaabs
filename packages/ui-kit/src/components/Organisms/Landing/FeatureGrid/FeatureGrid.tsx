import { Ui } from '@/index'
import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export type GridItem = {
  firstLine: string
  secondLine: string
  thirdLine: string
}

export type FeatureGridProps = {
  gridItems: [GridItem, GridItem, GridItem, GridItem]
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ gridItems }) => {
  return (
    <section>
      <Ui.Atoms.Wrapper>
        <$Container>
          {gridItems.map((gridItem, index) => (
            <div key={index}>
              <$FirstLine>{gridItem.firstLine}</$FirstLine>
              <$SecondLine>{gridItem.secondLine}</$SecondLine>
              <$ThirdLine>{gridItem.thirdLine}</$ThirdLine>
            </div>
          ))}
        </$Container>
      </Ui.Atoms.Wrapper>
    </section>
  )
}

const $Container = styled.div`
  display: grid;
  grid-row-gap: 4rem;
  ${mq.at576(css`
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    grid-column-gap: 4rem;
    grid-row-gap: 10rem;
  `)}
`

const $FirstLine = styled.span`
  display: block;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  ${mq.at576(css`
    margin-bottom: 1rem;
  `)}
`

const commonProperties = css`
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

const $SecondLine = styled.div`
  font-weight: bold;
  ${commonProperties}
`

const $ThirdLine = styled.div`
  font-family: var(${theme.fontFamily.serif});
  ${commonProperties}
`
