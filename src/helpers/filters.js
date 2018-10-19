const getNameById = (source, id) => {
  if (!source || !source.length) {
    return 'N/A';
  }

  const foundItem = source.find(item => item.id === id);
  return foundItem ? foundItem.name : 'N/A';
};

/*
 * Create filters for reports table.
 *
 * Extends available filters for reports table with labels.
 * Filters are used in ReportTable.
 */
export const createReportsFilters = (organisations, categories, filters) => {
  const organisationFilters = filters.organisations.map(organisationId => ({
    value: organisationId,
    label: getNameById(organisations, organisationId)
  }));
  const categoryFilters = filters.categories.map(categoryId => ({
    value: categoryId,
    label: getNameById(categories, categoryId)
  }));
  return {
    organisationFilters,
    categoryFilters
  };
};

/*
 * Create query param for reports filters.
 */
export const createFilterQueryParams = filterMap => {
  if (!filterMap || !Object.keys(filterMap).length) {
    return '';
  }

  let queryString = '';

  Object.keys(filterMap).forEach(key => {
    if (key === 'organisationId') {
      const filters = filterMap['organisationId'];
      if (filters.length) {
        queryString += '&organisationIds=' + filters.join(',');
      }
    }
    if (key === 'categoryId') {
      const filters = filterMap['categoryId'];
      if (filters.length) {
        queryString += '&categoryIds=' + filters.join(',');
      }
    }
    if (key === 'status') {
      const filters = filterMap['status'];
      if (filters.length) {
        queryString += '&publishedStatus=true';
      }
    }
  });
  return queryString;
};

/*
 * Immutable helper method to update filter based on previous state.
 */
export const updateFilter = (fieldName, filterValue, prevFilterMap = {}) => {
  let filterMap = Object.assign({}, prevFilterMap);

  if (!filterMap[fieldName]) {
    filterMap[fieldName] = [filterValue];
  } else {
    const filterForFieldName = filterMap[fieldName];
    const filterIsFound = filterForFieldName.indexOf(filterValue) > -1;
    if (filterIsFound) {
      filterMap[fieldName] = filterForFieldName.filter(
        val => val !== filterValue
      );
    } else {
      filterMap[fieldName] = filterForFieldName.concat(filterValue);
    }
  }
  return filterMap;
};

const hasFilter = (fieldName, filterMap) => {
  if (!filterMap) {
    return false;
  }
  return (filterMap[fieldName] || []).length > 0;
};

export const fieldHasFilters = filterConfig => {
  if (!filterConfig) {
    return false;
  }
  const { fieldName, filterMap } = filterConfig;
  return hasFilter(fieldName, filterMap);
};

export const hasAnyFilters = filterMap => {
  if (!filterMap) {
    return false;
  }
  return Object.keys(filterMap).every(key => hasFilter(key, filterMap));
};
