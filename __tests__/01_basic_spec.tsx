import { useSyncRecoilSnapshot, atomWithRecoilValue } from '../src/index';

describe('basic spec', () => {
  it('should export functions', () => {
    expect(useSyncRecoilSnapshot).toBeDefined();
    expect(atomWithRecoilValue).toBeDefined();
  });
});
