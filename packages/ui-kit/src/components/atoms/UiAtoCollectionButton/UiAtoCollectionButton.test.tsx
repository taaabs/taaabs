import { render, screen } from '@testing-library/react'
import { UiAtoCollectionButton } from './UiAtoCollectionButton'

describe('UiAtoCollectionButton', () => {
  it('renders children', () => {
    render(<UiAtoCollectionButton href="/test">test</UiAtoCollectionButton>)

    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('has given href attribute', () => {
    render(<UiAtoCollectionButton href="/test">test</UiAtoCollectionButton>)

    expect(screen.getByText('test')).toHaveAttribute('href', '/test')
  })
})
