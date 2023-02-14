import { render, screen } from '@testing-library/react'
import { UiAtoWrapper } from './UiAtoWrapper'

describe('UiAtoWrapper', () => {
  it('renders children', () => {
    render(<UiAtoWrapper>test</UiAtoWrapper>)
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
