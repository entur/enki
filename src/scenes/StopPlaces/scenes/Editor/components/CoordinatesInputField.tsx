import { TextArea } from '@entur/form';
import { Coordinate, stringIsValidCoordinates } from 'model/GeoJSON';
import { ChangeEvent, useState } from 'react';
import { useIntl } from 'react-intl';
import { coordinatesToText } from '../utils/coordinatesToText';
import { transformTextToCoordinates } from '../utils/transformTextToCoordinates';

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
    coordinatesToText(coordinates)
  );

  const isValid = inputValue === '' || stringIsValidCoordinates(inputValue);

  return (
    <TextArea
      label={formatMessage({
        id: 'editorCoordinatesFormLabelText',
      })}
      variant={isValid ? undefined : 'error'}
      feedback={formatMessage({ id: 'errorCoordinates' })}
      rows={12}
      value={inputValue}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        setInputValue(e.target.value)
      }
      onBlur={() =>
        isValid && changeCoordinates(transformTextToCoordinates(inputValue))
      }
      placeholder={coordinatesPlaceholder}
    />
  );
};
