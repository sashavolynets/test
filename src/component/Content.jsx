import React from 'react';
import AppContext from '../context';  

 const Content = () => {
    
  const {time, start, stop, reset, wait, setTimeFormat} = React.useContext(AppContext)

  return(
        <div className='container'>
            <h1 className='container'>{setTimeFormat(time)}</h1>
            <div className="container">
                <button onClick={start} type="button" class="btn btn-primary">Start</button>
                <button onClick={stop} type="button" class="btn btn-primary">Stop</button>
                <button onClick={reset} type="button" class="btn btn-primary">Reset</button>
                <button onClick={wait} type="button" class="btn btn-primary">Wait</button>
            </div>
        </div>
);
     }

export default Content;