import { render, screen } from '@testing-library/react'
import { Wrapper } from './Wrapper'

describe('Wrapper', () => {
  it('renders children', () => {
    render(<Wrapper>test</Wrapper>)
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
