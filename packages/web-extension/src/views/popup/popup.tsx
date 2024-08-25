import { render } from 'preact'
import styles from './popup.module.scss'

import { use_create_bookmark } from './hooks/use-create-bookmark'
import { use_saved_check } from './hooks/use-saved-check'

export const Popup: preact.FunctionComponent = () => {
  const saved_check_hook = use_saved_check()
  const create_bookmark_hook = use_create_bookmark()

  return (
    <div className={styles.container}>
      {saved_check_hook.is_saved !== undefined &&
        (saved_check_hook.is_saved ? (
          <>
            <a
              href={
                'https://taaabs.com/library#url=' +
                encodeURIComponent(location.href)
              }
              rel="noreferrer noopener"
            >
              Edit
            </a>
          </>
        ) : (
          <button onClick={create_bookmark_hook.create_bookmark}>Save</button>
        ))}
    </div>
  )
}

render(<Popup />, document.getElementById('root-taaabs-popup')!)
