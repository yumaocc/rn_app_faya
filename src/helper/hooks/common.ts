import {useRoute} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState, useMemo, MutableRefObject} from 'react';
import {Animated, Easing} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getEnv} from '../../helper';
import {Site} from '../../models';
import {FakeRoute} from '../../models/route';
import {getCommonDispatcher} from '../../redux/common/dispatcher';
import {RootState} from '../../redux/reducers';

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

export function useParams<T = any>(): T {
  const route = useRoute() as FakeRoute;
  const param = useMemo(() => route.params || {}, [route]);
  return param;
}

export function useFetchData<T>(call: (id: number) => Promise<T>, id: number): [T, () => void] {
  const [data, setData] = useState<T>();
  const [signal, forceUpdate] = useForceUpdate();
  const fetch = useCallback(
    (param: number, cb: (result: any) => void) => {
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
      console.log(`【${labelName || 'dependency'}】 changed:`);
      console.log(deep);
    }
  }, [deep, labelName]);
}

export function useRefCallback<T = any>(initValue?: T): [MutableRefObject<T>, (value: T) => void, boolean] {
  const ref = useRef<T>(initValue || null);
  const [isReady, setIsReady] = useState(false);
  const setRef = useCallback((value: T) => {
    ref.current = value;
    setIsReady(true);
  }, []);

  return [ref, setRef, isReady];
}

export function useLoadAllSite(): [Site[]] {
  const sites = useSelector((state: RootState) => state.common.sites);
  const dispatch = useDispatch();
  const commonDispatcher = getCommonDispatcher(dispatch);
  useEffect(() => {
    if (!sites?.length) {
      commonDispatcher.loadAllSite();
    }
  }, [sites, commonDispatcher]);
  return [sites];
}

export function useInfinityRotate() {
  const rotateAnim = useRef(new Animated.Value(0)).current; // 初始角度
  useEffect(() => {
    const duration = 30000;
    const animate = Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 180,
        duration,
        easing: Easing.linear,
        isInteraction: false,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 360,
        duration,
        easing: Easing.linear,
        isInteraction: false,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(animate).start();
  }, [rotateAnim]);
  return rotateAnim;
}
