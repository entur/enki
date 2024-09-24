import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit/development';

const ChevronDown =
  '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
const ChevronUp =
  '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
const ExternalLink =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';
const Globe =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
const Check =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

/**
 * Only the common icons needed in fds components are here to keep bundle size smaller
 */
export const FdsIcons = {
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'external-link': ExternalLink,
  globe: Globe,
  check: Check,
};

export type FdsIconType = keyof typeof FdsIcons;

/**
 * Add interactible icon element. Icon library: https://lucide.dev/
 *
 * @event click - Dispatches a MouseEvent on click.
 *
 * @property {string} icon
 * @property {string} size
 */
@customElement('fds-icon')
export default class FdsIcon extends LitElement {
  @property() icon?: FdsIconType;

  override render() {
    if (!this.icon || !FdsIcons[this.icon]) {
      console.error(`invalid icon: '${this.icon}'`);
      return null;
    }

    return html`${FdsIcons[this.icon]}`;
  }

  static override styles = css`
    :host {
      display: inline-flex;
    }
  `;
}
