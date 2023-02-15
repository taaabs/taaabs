import { render, screen } from '@testing-library/react'
import { CollectionButton } from './CollectionButton'

describe('UiAtoCollectionButton', () => {
  it('renders children', () => {
    render(<CollectionButton href="/test">test</CollectionButton>)

    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('has given href attribute', () => {
    render(<CollectionButton href="/test">test</CollectionButton>)

    expect(screen.getByText('test')).toHaveAttribute('href', '/test')
  })
})
