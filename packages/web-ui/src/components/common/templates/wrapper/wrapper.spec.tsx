import { render, screen } from '@testing-library/react'
import { Wrapper } from './wrapper'

describe('common/particles/wrapper', () => {
  it('renders children', () => {
    render(<Wrapper>test</Wrapper>)
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
