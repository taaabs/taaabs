const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div>layout app</div>
      <div>{children}</div>
    </div>
  )
}

export default Layout
