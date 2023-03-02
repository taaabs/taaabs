import { fireEvent, render, screen } from '@testing-library/react'
import { LayoutLanding, LayoutLandingProps } from './LayoutLanding'

const exampleProps: LayoutLandingProps = {
  logIn: { label: 'Log in', onClick: () => {} },
  getStarted: { label: 'Get started', onClick: () => {} },
}

describe('Layouts/Landing', () => {
  it('renders children', () => {
    const text = 'Test content'

    render(<LayoutLanding {...exampleProps}>{text}</LayoutLanding>)

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('renders labels', () => {
    const props: LayoutLandingProps = {
      logIn: { label: 'Test label for log in', onClick: () => {} },
      getStarted: { label: 'Test label for get started', onClick: () => {} },
    }

    render(<LayoutLanding {...props}></LayoutLanding>)

    expect(screen.queryByText(props.logIn.label)).toBeInTheDocument()
    expect(screen.queryByText(props.getStarted.label)).toBeInTheDocument()
  })

  it('calls callbacks when labels are clicked', () => {
    const logInOnClickMock = jest.fn()
    const signUpOnClickMock = jest.fn()
    const props: LayoutLandingProps = {
      logIn: { label: 'Log in', onClick: logInOnClickMock },
      getStarted: { label: 'Get started', onClick: signUpOnClickMock },
    }

    render(<LayoutLanding {...props}></LayoutLanding>)

    const logInButton = screen.getByText(props.logIn.label)
    const signUpButton = screen.getByText(props.getStarted.label)
    fireEvent.click(logInButton)
    expect(logInOnClickMock).toHaveBeenCalled()
    fireEvent.click(signUpButton)
    expect(signUpOnClickMock).toHaveBeenCalled()
  })
})
