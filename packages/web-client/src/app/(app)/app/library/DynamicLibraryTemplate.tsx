'use client'
import { Library, LibraryTypes } from '@web-ui/components/Templates/Library'

const DynamicLibraryTemplate: React.FC<LibraryTypes.Props> = (props) => {
  return <Library {...props}></Library>
}

export default DynamicLibraryTemplate
