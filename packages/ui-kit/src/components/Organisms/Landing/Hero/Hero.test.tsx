import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('UiOrgLandingHero', () => {
  it('renders children', () => {
    render(<Hero text="test" />)
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
