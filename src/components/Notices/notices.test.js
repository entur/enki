import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import pretty from 'pretty';

import Notices from './';

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const formatMessage = (id) => id;

it('should render a notice', () => {
  act(() => {
    render(
      <Notices
        notices={[]}
        setNotices={() => {}}
        formatMessage={formatMessage}
      />,
      container
    );
  });

  expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
    "<section class=\\"notices\\">
      <h4 class=\\"eds-h4\\">noticesHeader</h4>
      <table class=\\"eds-table eds-table--fixed\\">
        <tbody class=\\"eds-table__body\\">
          <tr class=\\"eds-table__row eds-table__row--hover\\">
            <td class=\\"eds-table__data-cell eds-editable-cell notices-editable-cell\\">
              <div class=\\"eds-form-control-wrapper notices-text-area eds-form-control-wrapper--size-medium\\"><label class=\\"\\" id=\\"eds-textarea-4265370790792993\\"><span class=\\"eds-input-group__label\\">newNoticeLabel </span></label><textarea class=\\"eds-form-control eds-textarea\\" aria-labelledby=\\"eds-textarea-4265370790792993\\"></textarea></div>
            </td>
            <td class=\\"eds-table__data-cell\\" align=\\"right\\"><button class=\\"eds-icon-button notices-icon-button\\" aria-disabled=\\"false\\" aria-describedby=\\"eds-tooltip-5917847635618552\\"><svg viewBox=\\"0 0 16 16\\" width=\\"1em\\" height=\\"1em\\" class=\\"eds-icon \\" color=\\"currentColor\\">
                  <path fill=\\"currentColor\\" fill-rule=\\"evenodd\\" d=\\"M8.7 1l-.001 6.3H15v1.4H8.699L8.7 15H7.3V8.7H1V7.3h6.3V1h1.4z\\" clip-rule=\\"evenodd\\"></path>
                </svg></button></td>
          </tr>
        </tbody>
      </table>
    </section>"
  `);

  act(() => {
    render(
      <Notices
        notices={[{ text: 'This a notice' }]}
        setNotices={() => {}}
        formatMessage={formatMessage}
      />,
      container
    );
  });

  expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
    "<section class=\\"notices\\">
      <h4 class=\\"eds-h4\\">noticesHeader</h4>
      <table class=\\"eds-table eds-table--fixed\\">
        <tbody class=\\"eds-table__body\\">
          <tr class=\\"eds-table__row notices-row eds-table__row--hover\\">
            <td class=\\"eds-table__data-cell eds-editable-cell notices-editable-cell\\">
              <div class=\\"eds-form-control-wrapper notices-text-area eds-form-control-wrapper--size-medium\\"><label class=\\"eds-input-group-label-wrapper--filled\\" id=\\"eds-textarea-11759304407018156\\"><span class=\\"eds-input-group__label eds-input-group__label--filled\\"> </span></label><textarea class=\\"eds-form-control eds-textarea\\" aria-labelledby=\\"eds-textarea-11759304407018156\\">This a notice</textarea></div>
            </td>
            <td class=\\"eds-table__data-cell\\" align=\\"right\\"><button class=\\"eds-icon-button notices-icon-button\\" aria-disabled=\\"false\\" aria-describedby=\\"eds-tooltip-6925152316365326\\"><svg viewBox=\\"0 0 16 16\\" width=\\"1em\\" height=\\"1em\\" class=\\"eds-icon \\" color=\\"currentColor\\">
                  <path fill=\\"currentColor\\" fill-rule=\\"evenodd\\" d=\\"M10.314 1c.322 0 .588.24.63.55l.006.086v1.678H15v1.273l-1.901-.001v9.778c0 .322-.24.588-.55.63l-.086.006H3.372a.636.636 0 01-.63-.55l-.006-.086-.001-9.778H1V3.315h4.049V1.636c0-.322.24-.588.55-.63L5.687 1h4.628zm1.512 3.586H4.008v9.141h7.818V4.586zM9.786 8v3.471H8.515V8h1.273zM7.474 8v3.471H6.2V8h1.273zm2.204-5.727H6.322v1.041h3.355V2.273z\\" clip-rule=\\"evenodd\\"></path>
                </svg></button></td>
          </tr>
          <tr class=\\"eds-table__row eds-table__row--hover\\">
            <td class=\\"eds-table__data-cell eds-editable-cell notices-editable-cell\\">
              <div class=\\"eds-form-control-wrapper notices-text-area eds-form-control-wrapper--size-medium\\"><label class=\\"\\" id=\\"eds-textarea-4265370790792993\\"><span class=\\"eds-input-group__label\\">newNoticeLabel </span></label><textarea class=\\"eds-form-control eds-textarea\\" aria-labelledby=\\"eds-textarea-4265370790792993\\"></textarea></div>
            </td>
            <td class=\\"eds-table__data-cell\\" align=\\"right\\"><button class=\\"eds-icon-button notices-icon-button\\" aria-disabled=\\"false\\" aria-describedby=\\"eds-tooltip-5917847635618552\\"><svg viewBox=\\"0 0 16 16\\" width=\\"1em\\" height=\\"1em\\" class=\\"eds-icon \\" color=\\"currentColor\\">
                  <path fill=\\"currentColor\\" fill-rule=\\"evenodd\\" d=\\"M8.7 1l-.001 6.3H15v1.4H8.699L8.7 15H7.3V8.7H1V7.3h6.3V1h1.4z\\" clip-rule=\\"evenodd\\"></path>
                </svg></button></td>
          </tr>
        </tbody>
      </table>
    </section>"
  `);

  act(() => {
    render(
      <Notices
        notices={[
          { text: 'This a notice' },
          { text: 'This is another notice' },
        ]}
        setNotices={() => {}}
        formatMessage={formatMessage}
      />,
      container
    );
  });

  expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
    "<section class=\\"notices\\">
      <h4 class=\\"eds-h4\\">noticesHeader</h4>
      <table class=\\"eds-table eds-table--fixed\\">
        <tbody class=\\"eds-table__body\\">
          <tr class=\\"eds-table__row notices-row eds-table__row--hover\\">
            <td class=\\"eds-table__data-cell eds-editable-cell notices-editable-cell\\">
              <div class=\\"eds-form-control-wrapper notices-text-area eds-form-control-wrapper--size-medium\\"><label class=\\"eds-input-group-label-wrapper--filled\\" id=\\"eds-textarea-11759304407018156\\"><span class=\\"eds-input-group__label eds-input-group__label--filled\\"> </span></label><textarea class=\\"eds-form-control eds-textarea\\" aria-labelledby=\\"eds-textarea-11759304407018156\\">This a notice</textarea></div>
            </td>
            <td class=\\"eds-table__data-cell\\" align=\\"right\\"><button class=\\"eds-icon-button notices-icon-button\\" aria-disabled=\\"false\\" aria-describedby=\\"eds-tooltip-6925152316365326\\"><svg viewBox=\\"0 0 16 16\\" width=\\"1em\\" height=\\"1em\\" class=\\"eds-icon \\" color=\\"currentColor\\">
                  <path fill=\\"currentColor\\" fill-rule=\\"evenodd\\" d=\\"M10.314 1c.322 0 .588.24.63.55l.006.086v1.678H15v1.273l-1.901-.001v9.778c0 .322-.24.588-.55.63l-.086.006H3.372a.636.636 0 01-.63-.55l-.006-.086-.001-9.778H1V3.315h4.049V1.636c0-.322.24-.588.55-.63L5.687 1h4.628zm1.512 3.586H4.008v9.141h7.818V4.586zM9.786 8v3.471H8.515V8h1.273zM7.474 8v3.471H6.2V8h1.273zm2.204-5.727H6.322v1.041h3.355V2.273z\\" clip-rule=\\"evenodd\\"></path>
                </svg></button></td>
          </tr>
          <tr class=\\"eds-table__row notices-row eds-table__row--hover\\">
            <td class=\\"eds-table__data-cell eds-editable-cell notices-editable-cell\\">
              <div class=\\"eds-form-control-wrapper notices-text-area eds-form-control-wrapper--size-medium\\"><label class=\\"eds-input-group-label-wrapper--filled\\" id=\\"eds-textarea-7398642781309819\\"><span class=\\"eds-input-group__label eds-input-group__label--filled\\"> </span></label><textarea class=\\"eds-form-control eds-textarea\\" aria-labelledby=\\"eds-textarea-7398642781309819\\">This is another notice</textarea></div>
            </td>
            <td class=\\"eds-table__data-cell\\" align=\\"right\\"><button class=\\"eds-icon-button notices-icon-button\\" aria-disabled=\\"false\\" aria-describedby=\\"eds-tooltip-41056463605479676\\"><svg viewBox=\\"0 0 16 16\\" width=\\"1em\\" height=\\"1em\\" class=\\"eds-icon \\" color=\\"currentColor\\">
                  <path fill=\\"currentColor\\" fill-rule=\\"evenodd\\" d=\\"M10.314 1c.322 0 .588.24.63.55l.006.086v1.678H15v1.273l-1.901-.001v9.778c0 .322-.24.588-.55.63l-.086.006H3.372a.636.636 0 01-.63-.55l-.006-.086-.001-9.778H1V3.315h4.049V1.636c0-.322.24-.588.55-.63L5.687 1h4.628zm1.512 3.586H4.008v9.141h7.818V4.586zM9.786 8v3.471H8.515V8h1.273zM7.474 8v3.471H6.2V8h1.273zm2.204-5.727H6.322v1.041h3.355V2.273z\\" clip-rule=\\"evenodd\\"></path>
                </svg></button></td>
          </tr>
          <tr class=\\"eds-table__row eds-table__row--hover\\">
            <td class=\\"eds-table__data-cell eds-editable-cell notices-editable-cell\\">
              <div class=\\"eds-form-control-wrapper notices-text-area eds-form-control-wrapper--size-medium\\"><label class=\\"\\" id=\\"eds-textarea-4265370790792993\\"><span class=\\"eds-input-group__label\\">newNoticeLabel </span></label><textarea class=\\"eds-form-control eds-textarea\\" aria-labelledby=\\"eds-textarea-4265370790792993\\"></textarea></div>
            </td>
            <td class=\\"eds-table__data-cell\\" align=\\"right\\"><button class=\\"eds-icon-button notices-icon-button\\" aria-disabled=\\"false\\" aria-describedby=\\"eds-tooltip-5917847635618552\\"><svg viewBox=\\"0 0 16 16\\" width=\\"1em\\" height=\\"1em\\" class=\\"eds-icon \\" color=\\"currentColor\\">
                  <path fill=\\"currentColor\\" fill-rule=\\"evenodd\\" d=\\"M8.7 1l-.001 6.3H15v1.4H8.699L8.7 15H7.3V8.7H1V7.3h6.3V1h1.4z\\" clip-rule=\\"evenodd\\"></path>
                </svg></button></td>
          </tr>
        </tbody>
      </table>
    </section>"
  `);
});
