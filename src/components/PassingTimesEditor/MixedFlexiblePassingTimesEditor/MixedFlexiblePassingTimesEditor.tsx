import { PassingTimesEditorProps } from '..';
import { PassingTimesEditorList } from '../common/PassingTimesEditorList';
import { MixedFlexiblePassingTimeEditor } from './MixedFlexiblePassingTimeEditor';

export const MixedFlexiblePassingTimesEditor = (
  props: PassingTimesEditorProps,
) => (
  <PassingTimesEditorList
    {...props}
    headingId="serviceJourneyMixedFlexiblePassingTimes"
    descriptionId="passingTimesInfoMixedFlexible"
    EditorComponent={MixedFlexiblePassingTimeEditor}
  />
);
