import { useEffect } from 'react';
import { atom } from 'jotai/vanilla';
import { selectAtom } from 'jotai/vanilla/utils';
import { useAtom } from 'jotai/react';
import { useHydrateAtoms } from 'jotai/react/utils';
import { useRecoilSnapshot } from 'recoil';
import type { RecoilValue, Snapshot } from 'recoil';

const recoilSnapshotAtom = atom<Snapshot | null>(null);

export const useSyncRecoilSnapshot = (dangerouslySyncInRender?: boolean) => {
  // We intentionally subscribe to recoilSnapshotAtom
  // ref: https://github.com/pmndrs/jotai/issues/2168
  const [, setRecoilSnapshot] = useAtom(recoilSnapshotAtom);
  const snapshot = useRecoilSnapshot();
  useHydrateAtoms([[recoilSnapshotAtom, snapshot]]);
  if (dangerouslySyncInRender) {
    setRecoilSnapshot(snapshot);
  }
  useEffect(() => {
    if (!dangerouslySyncInRender) {
      setRecoilSnapshot(snapshot);
    }
  }, [snapshot, setRecoilSnapshot]);
};

export const atomWithRecoilValue = <T>(recoilValue: RecoilValue<T>) =>
  selectAtom(recoilSnapshotAtom, (snapshot, prevValue?: T) => {
    if (snapshot === null) {
      throw new Error('Missing useSyncRecoilSnapshot in the tree');
    }
    const { state, contents } = snapshot.getLoadable(recoilValue);
    if (state === 'loading') {
      return prevValue as T;
    }
    if (state === 'hasError') {
      throw contents;
    }
    return contents as T;
  });
