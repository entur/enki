import { useEffect, useState } from 'react';
import isEqual from 'lodash.isequal';
import uuid from 'uuid';

export default (list: any[]): string[] => {
  const [ids, setId] = useState<string[]>(
    [...Array(list.length + 1)].map((_) => uuid.v4())
  );
  const [listHolder, setListHolder] = useState(list);

  useEffect(() => {
    const objectArrayIsIncreasing = list.length > listHolder.length;
    const objectArrayIsDecreasing = list.length < listHolder.length;

    if (objectArrayIsIncreasing) {
      setId([...ids, uuid.v4()]);
    } else if (objectArrayIsDecreasing) {
      const difference = listHolder.filter(
        (el) => !list.some((el2) => isEqual(el, el2))
      );
      const indexOfDeletedElement = listHolder.indexOf(difference[0]);
      const updatedList = ids.filter(
        (_, index) => index !== indexOfDeletedElement
      );
      setId(updatedList);
    }

    setListHolder(list);
    // eslint-disable-next-line
  }, [list]);

  return ids;
};
