import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

const label = 'Test'

describe('Atoms/Button', () => {
  it('renders children', () => {
    render(<Ui.Common.Particles.Button href="/test">{label}</Ui.Common.Particles.Button>)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('has given href attribute', () => {
    const href = '/test'
    render(<Ui.Common.Particles.Button href={href}>{label}</Ui.Common.Particles.Button>)
    expect(screen.getByText(label)).toHaveAttribute('href', href)
  })

  it('is disabled if neither href nor onClick are provided', () => {
    render(<Ui.Common.Particles.Button>{label}</Ui.Common.Particles.Button>)
    expect(screen.getByText(label)).toBeDisabled()
  })

  it('is of type "button" when onClick is provided', () => {
    render(<Ui.Common.Particles.Button on_click={() => {}}>{label}</Ui.Common.Particles.Button>)
    expect(screen.getByText(label).tagName.toLowerCase()).toEqual('button')
  })

  it('is of type "a" when href is provided', () => {
    render(<Ui.Common.Particles.Button href="">{label}</Ui.Common.Particles.Button>)
    expect(screen.getByText(label).tagName.toLowerCase()).toEqual('a')
  })

  it('is of type "a" when href and onClick are provided', () => {
    render(
      <Ui.Common.Particles.Button href="" on_click={() => {}}>
        {label}
      </Ui.Common.Particles.Button>,
    )
    expect(screen.getByText(label).tagName.toLowerCase()).toEqual('a')
  })

  it('forwards type="submit" prop', () => {
    render(<Ui.Common.Particles.Button type="submit">{label}</Ui.Common.Particles.Button>)
    expect(screen.getByText(label)).toHaveAttribute('type', 'submit')
  })

  it('calls "onClick" on click without href', async () => {
    const onClickMock = jest.fn()
    render(<Ui.Common.Particles.Button on_click={onClickMock}>{label}</Ui.Common.Particles.Button>)
    const button = screen.getByText(label)
    await userEvent.click(button)
    expect(onClickMock).toHaveBeenCalled()
  })

  it('calls "onClick" on click with href', async () => {
    const onClickMock = jest.fn()
    render(
      <Ui.Common.Particles.Button on_click={onClickMock} href="/">
        {label}
      </Ui.Common.Particles.Button>,
    )
    const button = screen.getByText(label)
    await userEvent.click(button)
    expect(onClickMock).toHaveBeenCalled()
  })
})
