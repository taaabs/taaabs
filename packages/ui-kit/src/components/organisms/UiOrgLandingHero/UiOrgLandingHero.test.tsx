import { render, screen } from '@testing-library/react'
import { UiOrgLandingHero } from './UiOrgLandingHero'

describe('UiOrgLandingHero', () => {
  it('renders children', () => {
    render(<UiOrgLandingHero text="test" />)
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
