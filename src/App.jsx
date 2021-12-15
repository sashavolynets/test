import React, {useCallback, useEffect, useState, useMemo} from 'react';
import { Observable, Subject } from 'rxjs';
import { map, buffer, debounceTime, filter, takeUntil} from 'rxjs/operators';
import Content from './component/Content';
import AppContext from './context';
const App = () => {
  const [state, setState] = useState('stop');
  const [time, setTime] = useState(0);

  const stop$ = useMemo(() => new Subject(), []);
  const click$ = useMemo(() => new Subject(), []);

  const start = () => {
    setState('start');
  };

  const stop = useCallback(() => {
    setTime(0);
    setState('stop');
  }, []);

  const reset = useCallback(() => {
    setTime(0);
  }, []);

  const wait = useCallback(() => {
    click$.next();
    setState('wait');
    click$.next();
  }, []);

  const setTimeFormat = (totalSecs) => {
    const seconds = (totalSecs % 60);
    const minutes = Math.floor(totalSecs / 60);
    const hours = Math.floor(totalSecs / 3600);
    const hoursFormat = (hours < 1 || hours > 23)
      ? '00'
      : (hours >= 1 && hours <= 9) ? `0${hours}` : `${hours}`;
    const minutesFormat = (minutes < 10)
      ? ((minutes === 0) ? '00' : `0${minutes}`)
      : `${minutes}`;
    const secondsFormant = (seconds < 10) ? `0${seconds}` : `${seconds}`;
  
    return `${hoursFormat}:${minutesFormat}:${secondsFormant}`;
  };

  useEffect(() => {
    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((list) => list.length),
      filter((value) => value >= 2),
    );
    const timer$ = new Observable((observer) => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next(count += 1);
        console.log(count);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    });

    const subscribtion$ = timer$
      .pipe(takeUntil(doubleClick$))
      .pipe(takeUntil(stop$))
      .subscribe({
        next: () => {
          if (state === 'start') {
            setTime((prev) => prev + 1);
          }
        },
      });

    return (() => {
      subscribtion$.unsubscribe();
    });
  }, [state]);

  return (
    <div>
      <AppContext.Provider value={{time, start, stop, reset, wait, setTimeFormat}}>
        <Content/>
      </AppContext.Provider>
    </div>
  );
};

export default App;