import { expect, test } from 'vitest';
import { useSyncRecoilSnapshot, atomWithRecoilValue } from 'jotai-recoil';

test('should export functions', () => {
  expect(useSyncRecoilSnapshot).toBeDefined();
  expect(atomWithRecoilValue).toBeDefined();
});
