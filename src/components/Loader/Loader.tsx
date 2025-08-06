import clsx from 'clsx'

import styles from './Loader.module.scss'

type LoaderProps = {
  words?: string[]
  type?: 'page' | 'component'
}

const Loader = ({ words = ['bets', 'profits', 'analytics', 'bookmakers', 'arbs'], type = 'page' }: LoaderProps) => {
  return (
    <div className={clsx(styles.root, styles[type])}>
      <div className={styles.body}>
        <p>loading</p>
        <div className={styles.words}>
          {words.map((word, idx) => (
            <span key={idx}>{word}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loader