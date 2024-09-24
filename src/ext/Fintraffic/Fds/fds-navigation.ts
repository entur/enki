import {
  FdsColorBrandBlack,
  FdsColorBrandWhite,
  FdsColorNeutral100,
  FdsColorText300,
  FdsSizeToken,
  uiLabelTextClass,
} from './lib';
import {
  adoptStyles,
  css,
  CSSResult,
  html,
  LitElement,
  PropertyValues,
  unsafeCSS,
} from 'lit';
import { nothing, TemplateResult } from 'lit-html';
import { customElement, property, state } from 'lit/decorators.js';
import './fds-icon';
import { FdsIconType } from './fds-icon';
import './global-types';
import { styleMap } from 'lit/directives/style-map.js';

export enum FdsNavigationVariant {
  primary = 'primary',
  secondary = 'secondary',
}

export interface FdsNavigationItem {
  label: string;
  value: unknown;
  position?: FdsNavigationItemPosition;
  mobileOrder?: number;
  icon?: FdsIconType;
  iconSize?: FdsSizeToken;
  bold?: boolean;
  dropDownItems?: FdsNavigationItem[];
  isCheckable?: boolean;
}

export enum FdsNavigationItemPosition {
  left = 'left',
  right = 'right',
}
/**
 * Navigation component.
 *
 * @property {FdsNavigationVariant} variant - Primary or secondary style
 * @property {FdsNavigationItem[]} items - List of navigation items
 * @property {FdsNavigationItem} selected - Currently selected value
 * @property {string} mobileNavText - Text for mobile navigation button
 * @property {number} mobileWidth - Width in pixels when navigation is collapsed
 * @event select - Triggered when destination is clicked. The selected item is in event details field.
 */

@customElement('fds-navigation')
export default class FdsNavigation extends LitElement {
  @property() variant: FdsNavigationVariant = FdsNavigationVariant.primary;
  @property() items: FdsNavigationItem[] = [];
  @property() selected?: FdsNavigationItem;
  @property({ attribute: 'mobile-nav-text' }) mobileNavText: string = '';
  @property({ type: Number, attribute: 'mobile-width' }) mobileWidth = -1;

  @state() private _open = false;
  @state() private _dropdownItemOpen = false;
  @state() private _selectedDropdownItem = '';

  override connectedCallback(): void {
    super.connectedCallback();
    adoptStyles(this.shadowRoot as ShadowRoot, [
      FdsNavigation.cssVariables,
      uiLabelTextClass,
      FdsNavigation.mobileStyles,
      this.desktopStyles(),
    ]);
  }

  override render(): TemplateResult {
    const itemsOnRight = this.items.filter(
      (item) => item.position === FdsNavigationItemPosition.right,
    );
    const itemsOnLeft = this.items.filter(
      (item) => item.position !== FdsNavigationItemPosition.right,
    );
    return html`<div
      class="navigation navigation--${this.variant} ui-label-text"
    >
      ${this.variant === FdsNavigationVariant.primary
        ? html`<div class="navigation__header">
            <slot></slot>
          </div>`
        : nothing}
      <ul class="navigation__body ${this._open ? 'navigation__open' : ''}">
        ${itemsOnLeft
          .map((item) => this.renderItem(item))
          .concat(
            itemsOnRight.map((item, index) =>
              this.renderItem(item, index === 0 ? 'item__first-right' : ''),
            ),
          )}
      </ul>
      <div class="navigation__button-wrapper">
        ${this.renderNavigationButton()}
      </div>
    </div>`;
  }

  renderNavigationButton(): TemplateResult {
    let icon;
    switch (this.variant) {
      case FdsNavigationVariant.primary:
        icon = this._open
          ? html`<fds-icon icon="chevron-up"></fds-icon>`
          : html`<fds-icon icon="chevron-down"></fds-icon>`;
        break;
      case FdsNavigationVariant.secondary:
        icon = html`<fds-icon icon="menu"></fds-icon>`;
        break;
    }
    return html`
      <button
        class="navigation__button navigation__button--${this.variant}"
        type="button"
        @click=${this.handleNavigationClick}
      >
        <span class="navigation__label ui-label-text"
          >${this.mobileNavText}</span
        >
        ${icon}
      </button>
    `;
  }

  handleNavigationClick(): void {
    this._open = !this._open;
  }

  handleDropdownItemClick(item: FdsNavigationItem): void {
    if (!(item.dropDownItems && item.dropDownItems.length > 0)) {
      return;
    }

    if (this._dropdownItemOpen && this._selectedDropdownItem !== item.label) {
      this._selectedDropdownItem = item.label;
    } else {
      this._dropdownItemOpen = !this._dropdownItemOpen;
      this._selectedDropdownItem = this._dropdownItemOpen ? item.label : '';
      if (this._dropdownItemOpen) {
        document.addEventListener('click', this._handleOutsideNavigationClick);
      } else {
        document.removeEventListener(
          'click',
          this._handleOutsideNavigationClick,
        );
      }
    }
  }

  public willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);
  }

  private _handleOutsideNavigationClick = (e: MouseEvent) => {
    const targets = e.composedPath() as Element[];
    if (!this._dropdownItemOpen) {
      return;
    }
    if (
      !targets.some((target) => {
        return (
          target.className &&
          typeof target.className.includes !== 'undefined' &&
          target.className.includes('item') &&
          target.childElementCount === 2
        );
      })
    ) {
      const selectedItem = this.items.filter(
        (i) => i.label === this._selectedDropdownItem,
      );
      selectedItem &&
        selectedItem.length == 1 &&
        this.handleDropdownItemClick(selectedItem[0]);
    }
  };

  renderItem(item: FdsNavigationItem, clazz: string = ''): TemplateResult {
    const mobileOrder = item.mobileOrder ?? 0;
    const dropdownItemIcon =
      this._dropdownItemOpen && this._selectedDropdownItem === item.label
        ? 'chevron-up'
        : 'chevron-down';

    return html`<li
      @click=${(): void => {
        if (item.dropDownItems && item.dropDownItems.length > 0) {
          this.handleDropdownItemClick(item);
        } else {
          //this.handleDropdownItemClick(item)
          this.handleSelect(item);
        }
      }}
      class="item ${this.selected === item ? 'item--active' : ''} ${clazz}"
      style=${styleMap({ order: mobileOrder })}
    >
      <div class=" item__label ${item.bold ? 'item__label--bold' : ''}">
        ${item.icon &&
        html`<fds-icon class="item__icon" icon="${item.icon}"></fds-icon>`}
        <span>${item.label}</span>
        ${item.dropDownItems &&
        item.dropDownItems.length > 0 &&
        html`<fds-icon
          class="item__icon--dropdown"
          icon=${dropdownItemIcon}
        />`}
      </div>
      ${item.dropDownItems &&
      item.dropDownItems.length > 0 &&
      this._dropdownItemOpen &&
      this._selectedDropdownItem === item.label
        ? html`<ul class="navigation__dropdown">
            ${item.dropDownItems.map(
              (opt: FdsNavigationItem) =>
                html`<li
                  class="${opt.isCheckable && !opt.icon && 'checkable'}"
                  @click=${(): void => {
                    this.handleSelect(opt);
                    this.handleDropdownItemClick(opt);
                  }}
                >
                  ${opt.icon &&
                  html`<fds-icon
                    class="item__icon"
                    icon="${opt.icon}"
                  ></fds-icon>`}
                  ${opt.label}
                </li>`,
            )}
          </ul>`
        : ''}
    </li> `;
  }

  handleSelect(item: FdsNavigationItem): void {
    this.selected = item;
    this.dispatchEvent(
      new CustomEvent<FdsNavigationItem>('select', {
        detail: item,
      }),
    );
  }

  static cssVariables = css`
    :host {
      --element-vertical-padding--primary: 9px;
      --element-vertical-padding--secondary: 16px;
      --element-horizontal-padding--primary: 20px;
      --item-border-bottom-width--secondary: 3px;
    }
  `;

  static mobileStyles = css`
    .navigation {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
      user-select: none;
    }

    .navigation__header,
    .navigation__body,
    .item__label {
      display: flex;
    }

    .item__label--bold {
      font-weight: 700;
    }

    .item {
      cursor: pointer;
      display: grid;
      grid-template-rows: auto 0;
      padding: var(--element-vertical-padding--primary)
        var(--element-horizontal-padding--primary);
    }

    .item--active {
      padding-right: 0;
    }

    .navigation--secondary .item {
      padding: var(--element-vertical-padding--secondary) 16px;
    }

    .item__label {
      align-items: end;
    }

    .item__icon {
      margin-right: 6px;
      margin-bottom: 3.5px;
    }

    .item__icon--dropdown {
      margin-left: 10px;
    }

    .navigation__header ::slotted(*) {
      padding: var(--element-vertical-padding--primary) 24px
        var(--element-vertical-padding--primary) 32px;
    }

    .navigation__body {
      order: 2;
      align-items: stretch;
      flex-direction: column;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .navigation__body {
      height: 1px;
      width: 1px;
      visibility: hidden;
      opacity: 0;
      overflow-y: hidden;
      margin-left: -1px;
      margin-top: -1px;
      white-space: nowrap;
    }

    .navigation--primary {
      background-color: ${FdsColorBrandBlack};
      color: ${FdsColorBrandWhite};
    }

    .navigation--primary .item:hover {
      color: ${FdsColorText300};
    }

    .navigation--primary .item--active {
      justify-items: center;
    }

    .navigation--primary .navigation__open .item--active .item__label:after {
      content: '';
      position: relative;
      align-self: center;
      height: 0;
      margin-left: auto;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: var(--element-vertical-padding--primary) solid
        ${FdsColorBrandWhite};
    }

    .navigation--secondary .navigation__body {
      padding: 0px 16px;
    }

    .navigation--secondary {
      background-color: ${FdsColorBrandWhite};
      border-bottom: 1px solid ${FdsColorBrandBlack};
    }

    .navigation--secondary .item {
      border-bottom: 1px solid ${FdsColorNeutral100};
    }

    .navigation--secondary .item:hover {
      color: ${FdsColorText300};
    }

    .navigation__open {
      height: auto;
      width: 100%;
      visibility: visible;
      opacity: 1;
      overflow-y: visible;
      margin-left: 0;
      margin-top: 0;

      border-top: 1px solid ${FdsColorNeutral100};
    }

    .navigation__button-wrapper {
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
    }

    .navigation__button {
      display: flex;
      align-items: center;

      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      text-align: center;
      user-select: none;
      white-space: nowrap;
    }

    .navigation__button--primary {
      background-color: ${FdsColorBrandBlack};
      color: ${FdsColorBrandWhite};
      padding: var(--element-vertical-padding--primary);
    }

    .navigation__button--primary:hover {
      color: ${FdsColorText300};
    }

    .navigation__button--secondary {
      background-color: ${FdsColorBrandWhite};
      color: ${FdsColorBrandBlack};
      padding: var(--element-vertical-padding--secondary);
    }

    .navigation__button--secondary:hover {
      color: ${FdsColorText300};
    }

    .navigation__label {
      margin-right: 10px;
    }
  `;

  /**
   * These styles are inside a function instead of being static because they depend on the mobileWidth property
   * that the end user can change
   */
  desktopStyles(): CSSResult {
    return css`
      @media (min-width: ${unsafeCSS(this.mobileWidth)}px) {
        .navigation {
          flex-wrap: nowrap;
        }

        .navigation__body {
          width: 100%;
          height: 100%;
          order: 0;
          align-items: end;
          flex-direction: row;
        }

        .navigation__body {
          height: auto;
          visibility: visible;
          opacity: 1;
          overflow-y: visible;
          margin-left: 0;
          margin-top: 0;
        }

        .item__first-right {
          margin-left: auto;
        }

        .item {
          order: 0 !important;
        }

        .item--active {
          padding-right: var(--element-horizontal-padding--primary);
        }

        .navigation--primary {
          height: 40px;
        }

        .navigation--primary .item--active:after {
          content: '';
          position: relative;
          top: 1px;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: var(--element-vertical-padding--primary) solid
            ${FdsColorBrandWhite};
        }

        /* Disable the arrow shown on mobile */
        .navigation--primary
          .navigation__open
          .item--active
          .item__label:after {
          content: '';
          display: none;
        }

        .navigation__dropdown {
          position: absolute;
          top: 55px;
          height: auto;
          color: black;
          background-color: white;
          box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.3);
          list-style-type: none;
          padding: 0;
          min-width: 100%;
        }

        .navigation__dropdown > li {
          border-bottom: 1px solid var(--fds-color-neutral-100, #cdcdd7);
          padding: var(--element-vertical-padding--primary) 16px;
          width: auto;
          list-style: none;
          white-space: nowrap;
        }

        .navigation__dropdown > .checkable {
          padding-left: 42px;
        }

        .navigation__dropdown > li:hover {
          background-color: rgba(205, 205, 215, 0.2);
        }

        .navigation--secondary .item {
          position: relative;
          z-index: 2;
          padding-bottom: calc(
            var(--element-vertical-padding--secondary) - var(
                --item-border-bottom-width--secondary
              )
          );
          border-bottom: var(--item-border-bottom-width--secondary) solid white;
        }

        .navigation--secondary .item--active {
          border-bottom: var(--item-border-bottom-width--secondary) solid black;
        }

        .navigation__button {
          display: none;
        }

        li:not(:has(ul)) {
          padding: 0;
          border-bottom: none;
          width: auto;
        }
      }
    `;
  }

  static override styles = [
    FdsNavigation.cssVariables,
    uiLabelTextClass,
    FdsNavigation.mobileStyles,
  ];
}
