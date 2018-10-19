export const SORT_DIRECTION = {
  ASC: 'ASC',
  DESC: 'DESC'
};

export const TYPES = {
  STRING: 'STRING',
  DATE: 'DATE',
  NUMBER: 'NUMBER'
};

export const getSortDirectionValues = () => Object.values(SORT_DIRECTION);

export const getTypes = () => Object.values(TYPES);

export const stringCompareFunction = (a, b) => a.localeCompare(b, 'nb');

export const stringIgnoreCaseCompareFunction = (a, b) => {
  return a.localeCompare(b, 'nb', {
    sensitivity: 'base'
  });
};

export const numberCompareFunction = (a, b) => a - b;

export const dateCompareFunction = (a, b) => {
  return a > b ? -1 : a < b ? 1 : 0;
};

export function propertyCompareFunction(property, direction) {
  const sortOrder = direction === SORT_DIRECTION.ASC ? -1 : 1;
  return (a, b) => {
    const aProperty = a[property];
    const bProperty = b[property];
    let comparator = null;

    if (typeof aProperty === 'string' && typeof bProperty === 'string') {
      comparator = stringIgnoreCaseCompareFunction;
    } else if (aProperty instanceof Date && bProperty instanceof Date) {
      comparator = dateCompareFunction;
    } else if (!isNaN(aProperty) && !isNaN(bProperty)) {
      comparator = numberCompareFunction;
    } else {
      return -1;
    }
    return comparator(aProperty, bProperty) * sortOrder;
  };
}

export function geographicalIntervalCompareFunction(property, direction) {
  const sortOrder = direction === SORT_DIRECTION.ASC ? -1 : 1;
  return (a, b) => {
    let aProperty = a[property];
    let bProperty = b[property];
    let comparator = null;

    if (typeof aProperty === 'string' && typeof bProperty === 'string') {
      aProperty = Number(aProperty);
      bProperty = Number(bProperty);
      comparator = numberCompareFunction;
    } else if (!isNaN(aProperty) && !isNaN(bProperty)) {
      comparator = numberCompareFunction;
    } else {
      return -1;
    }
    return comparator(aProperty, bProperty) * sortOrder;
  };
}
