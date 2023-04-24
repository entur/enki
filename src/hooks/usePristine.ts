import isEqual from 'lodash.isequal';
import { useEffect, useState } from 'react';

export default (value: any, spoil: boolean): boolean => {
  const [isPristine, setIsPristine] = useState<boolean>(true);
  const [initValue] = useState<any>(value);

  useEffect(() => {
    if (!isEqual(initValue, value)) setIsPristine(false);
  }, [value, initValue]);

  return isPristine && !spoil;
};
