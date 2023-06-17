'use client'

import { Library, LibraryTypes } from '@web-ui/components/app/templates/Library'

const DynamicLibrary: React.FC<LibraryTypes.Props> = (props) => {
  return <Library {...props}></Library>
}

export default DynamicLibrary
