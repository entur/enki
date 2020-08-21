import { useState, useEffect } from 'react';
import { equals } from 'ramda';

export default (value: any, spoil: boolean): boolean => {
  const [isPristine, setIsPristine] = useState<boolean>(true);
  const [initValue] = useState<any>(value);

  useEffect(() => {
    if (!equals(initValue, value)) setIsPristine(false);
  }, [value, initValue]);

  return isPristine && !spoil;
};
