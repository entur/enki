import PropTypes from 'prop-types';
import { getSortDirectionValues, getTypes } from 'helpers/sorting';

export const sortConfigProps = PropTypes.shape({
  type: PropTypes.oneOf(getTypes()),
  fieldName: PropTypes.string,
  direction: PropTypes.oneOf(getSortDirectionValues()),
  onSort: PropTypes.func,
  isSorting: PropTypes.bool
});

export const filterConfigProps = PropTypes.shape({
  filterMap: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  onFilter: PropTypes.func,
  onClearFilter: PropTypes.func,
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  )
});
