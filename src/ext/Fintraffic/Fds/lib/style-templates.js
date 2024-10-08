import {
  FdsTypographyUiLabelDisplay,
  FdsTypographyUiLabelFontFamily,
  FdsTypographyUiLabelFontSize,
  FdsTypographyUiLabelFontWeight,
  FdsTypographyUiLabelLetterSpacing,
  FdsTypographyUiLabelLineHeight,
} from './style-properties';

import { css } from 'lit';

export const uiLabelTextClass = css`
  .ui-label-text {
    display: ${FdsTypographyUiLabelDisplay};
    font-family: ${FdsTypographyUiLabelFontFamily};
    font-size: ${FdsTypographyUiLabelFontSize};
    font-weight: ${FdsTypographyUiLabelFontWeight};
    letter-spacing: ${FdsTypographyUiLabelLetterSpacing};
    line-height: ${FdsTypographyUiLabelLineHeight};
  }
`;
