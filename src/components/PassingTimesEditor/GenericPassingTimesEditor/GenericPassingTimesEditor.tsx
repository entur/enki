import { PassingTimesEditorProps } from '..';
import { FixedPassingTimeEditor } from '../FixedPassingTimeEditor/FixedPassingTimeEditor';
import { PassingTimesEditorList } from '../common/PassingTimesEditorList';

export const GenericPassingTimesEditor = (props: PassingTimesEditorProps) => (
  <PassingTimesEditorList
    {...props}
    headingId="serviceJourneyPassingTimes"
    descriptionId="passingTimesInfo"
    descriptionSx={{ mb: 2 }}
    EditorComponent={FixedPassingTimeEditor}
  />
);
