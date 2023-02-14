import { render, screen } from '@testing-library/react'
import { UiAtoButton } from './UiAtoButton'

describe('UiAtoButton', () => {
  it('renders children', () => {
    render(<UiAtoButton href="/test">test</UiAtoButton>)

    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('has given href attribute', () => {
    render(<UiAtoButton href="/test">test</UiAtoButton>)

    expect(screen.getByText('test')).toHaveAttribute('href', '/test')
  })
})
