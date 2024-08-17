import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.scss';

const NewTabPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>x12</div>
    </div>
  );
};

ReactDOM.render(<NewTabPage />, document.body);