import { useEffect, useState } from 'react';
import uuid from 'uuid';
import { equals } from 'ramda';

export const replaceElement = <E>(array: E[], index: number, value: E): E[] => [
  ...array.slice(0, index),
  value,
  ...array.slice(index + 1)
];

export const removeElementByIndex = <E>(array: E[], index: number): E[] => [
  ...array.slice(0, index),
  ...array.slice(index + 1)
];

export const useUniqueKeys = (list: any[]): string[] => {
  const [ids, setId] = useState<string[]>(
    [...Array(list.length + 1)].map(_ => uuid.v4())
  );
  const [listHolder, setListHolder] = useState(list);

  useEffect(() => {
    const objectArrayIsIncreasing = list.length > listHolder.length;
    const objectArrayIsDecreasing = list.length < listHolder.length;

    if (objectArrayIsIncreasing) {
      setId([...ids, uuid.v4()]);
    } else if (objectArrayIsDecreasing) {
      const difference = listHolder.filter(
        el => !list.some(el2 => equals(el, el2))
      );
      const indexOfDeletedElement = listHolder.indexOf(difference[0]);
      const updatedList = ids.filter(
        (element, index) => index !== indexOfDeletedElement
      );
      setId(updatedList);
    }

    setListHolder(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  return ids;
};
