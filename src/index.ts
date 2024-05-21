import { useEffect } from 'react';
import { atom } from 'jotai/vanilla';
import { selectAtom } from 'jotai/vanilla/utils';
import { useSetAtom } from 'jotai/react';
import { useHydrateAtoms } from 'jotai/react/utils';
import { useRecoilSnapshot } from 'recoil';
import type { RecoilValue, Snapshot } from 'recoil';

const recoilSnapshotAtom = atom<Snapshot | null>(null);

export const useSyncRecoilSnapshot = (dangerouslySyncInRender?: boolean) => {
  const setRecoilSnapshot = useSetAtom(recoilSnapshotAtom);
  const snapshot = useRecoilSnapshot();
  useHydrateAtoms([[recoilSnapshotAtom, snapshot]]);
  if (dangerouslySyncInRender) {
    setRecoilSnapshot(snapshot);
  }
  useEffect(() => {
    if (!dangerouslySyncInRender) {
      setRecoilSnapshot(snapshot);
    }
  }, [dangerouslySyncInRender, snapshot, setRecoilSnapshot]);
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
