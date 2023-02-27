import { render, screen } from '@testing-library/react'
import { CollectionButton } from './CollectionButton'

const label = 'Test'

describe('Atoms/CollectionButton', () => {
  it('renders children', () => {
    render(<CollectionButton href="/test">{label}</CollectionButton>)

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('has given href attribute', () => {
    render(<CollectionButton href="/test">{label}</CollectionButton>)

    expect(screen.getByText(label)).toHaveAttribute('href', '/test')
  })
})
