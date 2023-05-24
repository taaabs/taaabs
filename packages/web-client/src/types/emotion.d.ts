import { appTheme } from '@/styles/constants/appTheme'
import '@emotion/react'

type AppTheme = typeof appTheme

declare module '@emotion/react' {
  export interface Theme extends AppTheme {}
}
