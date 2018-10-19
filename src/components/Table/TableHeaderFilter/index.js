import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Menu from '../../Menu';
import MenuItem from '../../Menu/MenuItem';
import Divider from '../../Menu/Divider';
import {
  ArrowDown,
  Filter,
  TailedArrowDown,
  Checkbox,
  RadioButton
} from '../../icons';
import {
  getSortDirectionValues,
  SORT_DIRECTION,
  TYPES
} from '../../../helpers/sorting';
import {
  sortConfigProps,
  filterConfigProps
} from '../TableHeaderCell/headerPropTypes';
import { fieldHasFilters } from '../../../helpers/filters';

import './styles.css';
import '../../Menu/styles/sort-filter-menu.css';

class TableHeaderFilter extends React.Component {
  state = { isOpen: false };

  handleCollapse() {
    this.setState({
      isOpen: false
    });
  }

  handleExpand() {
    this.setState({
      isOpen: true
    });
  }

  getClearFiltersMenuItem(filterConfig) {
    if (!filterConfig) {
      return null;
    }

    const { onClearFilter, fieldName } = filterConfig;

    if (fieldHasFilters(filterConfig) && onClearFilter) {
      return (
        <MenuItem onClick={() => onClearFilter(fieldName)}>
          Fjern alle filtre
        </MenuItem>
      );
    }
    return null;
  }

  getMessageId(type, direction) {
    switch (type) {
      case TYPES.STRING:
        return direction === SORT_DIRECTION.ASC
          ? 'sorting.string_asc'
          : 'sorting.string_desc';
      case TYPES.NUMBER:
        return direction === SORT_DIRECTION.ASC
          ? 'sorting.number_asc'
          : 'sorting.number_desc';
      case TYPES.DATE:
        return direction === SORT_DIRECTION.ASC
          ? 'sorting.date_asc'
          : 'sorting.date_desc';
      default:
        return 'sorting.invalid_parameter';
    }
  }

  getFilterMenu(filterConfig) {
    if (!filterConfig) {
      return [];
    }

    const { dataSource, onFilter, fieldName, filterMap } = filterConfig;

    const filterOptions = dataSource.map(item => {
      const isChecked = !filterMap[fieldName]
        ? false
        : (filterMap[fieldName] || []).indexOf(item.value) > -1;
      return (
        <MenuItem
          key={item.value}
          onClick={() => {
            onFilter(fieldName, item.value);
          }}
        >
          <div className="icon-container">
            {<Checkbox checked={isChecked} />}
          </div>
          {item.label}
        </MenuItem>
      );
    });

    return (
      <MenuItem menuItems={filterOptions}>
        {this.props.i18n('sorting.filter_by')}
      </MenuItem>
    );
  }

  getSortMenuItems(sortConfig) {
    if (!sortConfig) {
      return [];
    }

    const { fieldName, direction, onSort, isSorting, type } = sortConfig;
    const directions = getSortDirectionValues();

    return directions.map(itemDirection => {
      const isChecked = itemDirection === direction && isSorting;
      const messageId = this.getMessageId(type, itemDirection);
      return (
        <MenuItem
          key={itemDirection}
          onClick={() => {
            onSort(fieldName, itemDirection);
          }}
        >
          <div className="icon-container">
            {<RadioButton checked={isChecked} />}
          </div>
          {this.props.i18n(messageId)}
        </MenuItem>
      );
    });
  }

  renderMenu(props) {
    const { filterConfig, sortConfig, ...restProps } = props;

    const sortMenuItems = this.getSortMenuItems(sortConfig);
    const filterMenu = this.getFilterMenu(filterConfig);
    const showDivider = sortMenuItems.length > 0 && filterConfig;

    const ClearFiltersMenuItem = this.getClearFiltersMenuItem(filterConfig);

    return (
      <Menu className="sort-filter-menu" {...restProps}>
        {sortMenuItems}
        {showDivider && <Divider />}
        {filterMenu}
        {ClearFiltersMenuItem}
      </Menu>
    );
  }

  render() {
    const { sortConfig, filterConfig } = this.props;
    const { isOpen } = this.state;

    if (!sortConfig && !filterConfig) {
      return null;
    }

    const filterSortMenu = isOpen ? this.renderMenu(this.props) : null;
    const isSorting = sortConfig ? sortConfig.isSorting : false;
    const direction = sortConfig ? sortConfig.direction : null;

    const arrowClassNames = cx('arrow', {
      desc: isSorting && direction === SORT_DIRECTION.ASC,
      hidden: !isSorting
    });

    const showFilterIcon = fieldHasFilters(this.props.filterConfig);

    return (
      <div onBlur={::this.handleCollapse} tabIndex={0}>
        <div className="sort-filter-arrow">
          {showFilterIcon && <Filter />}
          <TailedArrowDown className={arrowClassNames} />
          <ArrowDown height={14} onMouseDown={::this.handleExpand} />
        </div>
        {filterSortMenu}
      </div>
    );
  }
}

PropTypes.propTypes = {
  sortConfig: sortConfigProps,
  filterConfig: filterConfigProps
};

export default TableHeaderFilter;
