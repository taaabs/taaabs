import '@web-ui/styles/style.scss'

/**
 * TODO:
 *   - redirect to proper language
 *   - set theme
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default Layout
