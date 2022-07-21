import {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {getEnv} from '../../helper';

// 用于检测是否已卸载
export function useUnmountRef() {
  const ref = useRef(false);
  useEffect(() => {
    return () => {
      ref.current = true;
    };
  }, []);
  return ref.current;
}

export function useForceUpdate(): [unknown, () => void] {
  const [signal, setSignal] = useState<unknown>();
  const forceUpdate = () => {
    setSignal({});
  };
  return [signal, forceUpdate];
}

// export function useQuery<T = qs.ParsedQs>(): T {
//   const {search} = useLocation();
//   const query = useMemo(
//     () => qs.parse(search, {ignoreQueryPrefix: true}),
//     [search],
//   );
//   return query as unknown as T;
// }

export function useFetchData<T>(
  call: (id: number) => Promise<T>,
  id: number,
): [T, () => void] {
  const [data, setData] = useState<T>();
  const [signal, forceUpdate] = useForceUpdate();
  const fetch = useCallback(
    (param, cb) => {
      call(param).then((res: T) => {
        cb(res);
      });
    },
    [call],
  );

  useEffect(() => {
    if (id) {
      fetch(id, (res: T) => {
        setData(res);
      });
    }
  }, [signal, id, fetch]);

  return [data!, forceUpdate];
}

export function useLog<T = unknown>(deep: T, label = ''): void {
  const labelName = useMemo(() => label, [label]);
  useEffect(() => {
    if (getEnv() === 'development') {
      console.log(`${labelName || 'dependency'} changed:`);
      console.log(deep);
    }
  }, [deep, labelName]);
}
