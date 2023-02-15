import { render, screen } from '@testing-library/react'
import { FeatureGrid, FeatureGridProps } from './FeatureGrid'

describe('Organisms/Landing/FeatureGrid', () => {
  it('renders props data', () => {
    const props: FeatureGridProps = {
      gridItems: [
        { firstLine: 'testA1', secondLine: 'testA2', thirdLine: 'testA3' },
        { firstLine: 'testB1', secondLine: 'testB2', thirdLine: 'testB3' },
        { firstLine: 'testC1', secondLine: 'testC2', thirdLine: 'testC3' },
        { firstLine: 'testD1', secondLine: 'testD2', thirdLine: 'testD3' },
      ],
    }
    render(<FeatureGrid gridItems={props.gridItems} />)
    props.gridItems.forEach((gridItem) => {
      expect(screen.getByText(gridItem.firstLine)).toBeInTheDocument()
      expect(screen.getByText(gridItem.secondLine)).toBeInTheDocument()
      expect(screen.getByText(gridItem.thirdLine)).toBeInTheDocument()
    })
  })
})
