import React from 'react'

import style from './App.module.scss'

/* START - View App additional imports and module code. */
import Tooltip from './components/Tooltip'

const App: React.FC = () => {
    return (
        <div className={style.container}>
            <Tooltip type={'Default'} content={'Tooltip content'} position={'Top'}>
                Tooltip children
            </Tooltip>
        </div>
    )
}

export default App
