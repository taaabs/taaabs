import { NextPage } from 'next'
import React from 'react'

export type Page<P = {}> = NextPage<P> & {
  getLayout?: Function
}
