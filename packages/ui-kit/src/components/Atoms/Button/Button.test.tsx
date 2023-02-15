import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('UiAtoButton', () => {
  it('renders children', () => {
    render(<Button href="/test">test</Button>)
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('has given href attribute', () => {
    render(<Button href="/test">test</Button>)
    expect(screen.getByText('test')).toHaveAttribute('href', '/test')
  })
})
