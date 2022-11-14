import React from 'react';
import styles from '../../styles/confirm/style.module.css';

interface Props {
    active : boolean
    title : string,
    descript : string,
    btnText : string[]
    onRemove : () => void
    onSubmit : () => void
}

function Confirm({active, title, descript, btnText, onRemove, onSubmit} : Props) {
  return (
    <>
        {active && <div className={styles.contaier}>  
            <div className={styles.text}>
                {title}<br/>
                <p>{descript}</p>
            </div>
            <button className={styles.exit} onClick={onRemove}>{btnText[0]}</button>
            <button className={styles.sumbit} onClick={()=> onSubmit()}>{btnText[1]}</button>
        </div>}
    </>
  );
}

export default Confirm;