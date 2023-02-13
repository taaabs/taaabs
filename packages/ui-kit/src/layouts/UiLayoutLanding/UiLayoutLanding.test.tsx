import { fireEvent, render, screen } from '@testing-library/react'
import { UiLayoutLanding, UiLayoutLandingProps } from './UiLayoutLanding'

const exampleProps: UiLayoutLandingProps = {
  logIn: { label: 'Log in', onClick: () => {} },
  getStarted: { label: 'Get started', onClick: () => {} },
}

describe('UiLayoutLanding', () => {
  it('renders children', () => {
    const text = 'Test content'
    render(<UiLayoutLanding {...exampleProps}>{text}</UiLayoutLanding>)
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('renders labels', () => {
    const props: UiLayoutLandingProps = {
      logIn: { label: 'Test label for log in', onClick: () => {} },
      getStarted: { label: 'Test label for get started', onClick: () => {} },
    }
    render(<UiLayoutLanding {...props}></UiLayoutLanding>)
    expect(screen.queryByText(props.logIn.label)).toBeInTheDocument()
    expect(screen.queryByText(props.getStarted.label)).toBeInTheDocument()
  })

  it('calls callbacks when labels are clicked', () => {
    const logInOnClickMock = jest.fn()
    const signUpOnClickMock = jest.fn()
    const props: UiLayoutLandingProps = {
      logIn: { label: 'Log in', onClick: logInOnClickMock },
      getStarted: { label: 'Get started', onClick: signUpOnClickMock },
    }
    render(<UiLayoutLanding {...props}></UiLayoutLanding>)
    const logInButton = screen.getByText(props.logIn.label)
    const signUpButton = screen.getByText(props.getStarted.label)
    fireEvent.click(logInButton)
    expect(logInOnClickMock).toHaveBeenCalled()
    fireEvent.click(signUpButton)
    expect(signUpOnClickMock).toHaveBeenCalled()
  })
})
