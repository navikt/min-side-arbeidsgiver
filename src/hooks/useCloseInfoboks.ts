import { usePrefixedLocalStorage } from './useStorage';

const localStoragePrefix = 'msa-info-boks-';
export const useCloseInfoboks = (id: string) => {
    const [closed, setClosed] = usePrefixedLocalStorage(id, localStoragePrefix, false);
    return { closed, setClosed };
};
