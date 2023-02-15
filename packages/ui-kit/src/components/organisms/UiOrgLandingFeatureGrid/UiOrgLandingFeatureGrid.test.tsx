import { render, screen } from '@testing-library/react'
import { UiOrgLandingFeatureGrid, UiOrgLandingFeatureGridProps } from './UiOrgLandingFeatureGrid'

describe('UiOrgLandingFeatureGrid', () => {
  it('renders props data', () => {
    const props: UiOrgLandingFeatureGridProps = {
      gridItems: [
        { firstLine: 'testA1', secondLine: 'testA2', thirdLine: 'testA3' },
        { firstLine: 'testB1', secondLine: 'testB2', thirdLine: 'testB3' },
        { firstLine: 'testC1', secondLine: 'testC2', thirdLine: 'testC3' },
        { firstLine: 'testD1', secondLine: 'testD2', thirdLine: 'testD3' },
      ],
    }
    render(<UiOrgLandingFeatureGrid gridItems={props.gridItems} />)
    props.gridItems.forEach((gridItem) => {
      expect(screen.getByText(gridItem.firstLine)).toBeInTheDocument()
      expect(screen.getByText(gridItem.secondLine)).toBeInTheDocument()
      expect(screen.getByText(gridItem.thirdLine)).toBeInTheDocument()
    })
  })
})
