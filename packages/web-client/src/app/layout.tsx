export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
