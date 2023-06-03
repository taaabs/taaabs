'use client'
import EmotionRegistry from './EmotionRegistry'

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <body>
        <EmotionRegistry>{children}</EmotionRegistry>
      </body>
    </html>
  )
}
