import { UiAtoWrapper } from '@/components/atoms/UiAtoWrapper'
import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled, { css } from 'styled-components'

export type GridItem = {
  firstLine: string
  secondLine: string
  thirdLine: string
}

export type UiOrgLandingFeatureGridProps = {
  gridItems: [GridItem, GridItem, GridItem, GridItem]
}

export const UiOrgLandingFeatureGrid: React.FC<
  UiOrgLandingFeatureGridProps
> = ({ gridItems }) => {
  return (
    <section>
      <UiAtoWrapper>
        <$Container>
          {gridItems.map((gridItem) => (
            <div>
              <$FirstLine>{gridItem.firstLine}</$FirstLine>
              <$SecondLine>{gridItem.secondLine}</$SecondLine>
              <$ThirdLine>{gridItem.thirdLine}</$ThirdLine>
            </div>
          ))}
        </$Container>
      </UiAtoWrapper>
    </section>
  )
}

const $Container = styled.div`
  display: grid;
  grid-row-gap: 6rem;
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
  ${mq.to576(css`
    font-size: 1.2rem;
  `)}
  ${mq.at576(css`
    margin-bottom: 1rem;
  `)}
`

const commonProperties = css`
  font-size: 2.2rem;
  line-height: 1.2;
  white-space: pre-line;
  ${mq.at576(css`
    font-size: 2.8rem;
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
  font-family: var(${theme.font.serif});
  ${commonProperties}
`
