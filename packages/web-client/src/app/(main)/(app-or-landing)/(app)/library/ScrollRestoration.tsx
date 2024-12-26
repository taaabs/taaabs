'use client'

import { useEffect } from 'react'

export const ScrollRestoration: React.FC = () => {
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = 'auto'
    }
  }, [])

  return <></>
}
