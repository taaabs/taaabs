import styles from './popup.module.scss'
import ReactDOM from 'react-dom/client'
import { use_create_bookmark } from './hooks/use-create-bookmark'
import { use_saved_check } from './hooks/use-saved-check'

export const Popup: React.FC = () => {
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

const root = ReactDOM.createRoot(document.getElementById('root-taaabs-popup') as HTMLElement)
root.render(<Popup />)
