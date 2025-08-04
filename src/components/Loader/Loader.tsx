import styles from './Loader.module.scss'

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.content}>
				<p>
					loading
				</p>
      	<div className={styles.words}>
					<span>buttons</span>
					<span>forms</span>
					<span>switches</span>
					<span>cards</span>
					<span>buttons</span>
				</div>
			</div>
    </div>
  )
}

export default Loader