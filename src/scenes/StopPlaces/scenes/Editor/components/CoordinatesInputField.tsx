import { TextArea } from '@entur/form';
import {
  Coordinate,
  validateCoordinateInput,
  PolygonValidationResult,
} from 'model/GeoJSON';
import { ChangeEvent, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { coordinatesToText } from '../utils/coordinatesToText';

const coordinatesPlaceholder = `[
  [
    12.345,
    67.890
  ], [
    12.345,
    67.890
  ], [
    12.345,
    67.890
  ], [
    12.345,
    67.890
  ]
]`;

export interface Props {
  coordinates: Coordinate[];
  changeCoordinates: (coordinates: Coordinate[]) => void;
}

export const CoordinatesInputField = ({
  coordinates,
  changeCoordinates,
}: Props) => {
  const { formatMessage } = useIntl();

  const [inputValue, setInputValue] = useState<string>(
    coordinatesToText(coordinates),
  );

  // Validate input on each change, but only for display purposes
  const validationResult: PolygonValidationResult = useMemo(
    () => validateCoordinateInput(inputValue),
    [inputValue],
  );

  // Determine error message to show
  const errorMessage = useMemo(() => {
    if (validationResult.valid) return null;
    if (!validationResult.error) return null;

    const { error } = validationResult;

    // For self-intersection, include count if available
    if (error.type === 'selfIntersecting' && error.details?.intersectionCount) {
      return formatMessage(
        { id: 'errorCoordinatesSelfIntersectingCount' },
        { count: error.details.intersectionCount },
      );
    }

    return formatMessage({ id: error.messageKey });
  }, [validationResult, formatMessage]);

  const handleBlur = () => {
    // Only update if validation passed or we have normalized coordinates
    if (validationResult.valid && validationResult.normalizedCoordinates) {
      changeCoordinates(validationResult.normalizedCoordinates);

      // Update the displayed text to show the normalized coordinates
      // (includes auto-fixed closure and winding order)
      if (
        validationResult.corrections?.closedPolygon ||
        validationResult.corrections?.fixedWindingOrder
      ) {
        setInputValue(
          coordinatesToText(validationResult.normalizedCoordinates),
        );
      }
    } else if (
      validationResult.error?.type === 'selfIntersecting' &&
      validationResult.normalizedCoordinates
    ) {
      // For self-intersection errors, still update coordinates to show the
      // partially normalized version (closed, correct winding) but keep error shown
      changeCoordinates(validationResult.normalizedCoordinates);
      setInputValue(coordinatesToText(validationResult.normalizedCoordinates));
    }
  };

  return (
    <TextArea
      label={formatMessage({
        id: 'editorCoordinatesFormLabelText',
      })}
      variant={errorMessage ? 'error' : undefined}
      feedback={errorMessage ?? undefined}
      rows={12}
      value={inputValue}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        setInputValue(e.target.value)
      }
      onBlur={handleBlur}
      placeholder={coordinatesPlaceholder}
    />
  );
};
