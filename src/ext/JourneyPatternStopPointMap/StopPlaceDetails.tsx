import { StopPlace } from '../../api';
import { useIntl } from 'react-intl';
import { Heading5 } from '@entur/typography';

interface StopPlaceDetailsProps {
  stopPlace: StopPlace;
}

const StopPlaceDetails = ({ stopPlace }: StopPlaceDetailsProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <>
      <section>
        <Heading5 className={'popup-title'}>{stopPlace.name.value}</Heading5>
        <div className={'popup-id'}>{stopPlace.id}</div>
      </section>

      <section>
        {formatMessage({ id: stopPlace.transportMode?.toLowerCase() })}
      </section>

      {stopPlace.quays.length > 1 ? (
        <section>
          {formatMessage(
            { id: 'numberOfQuays' },
            { count: stopPlace.quays.length },
          )}
        </section>
      ) : (
        <section>
          <div>{formatMessage({ id: 'oneQuay' })}:</div>
          <div className={'popup-id'}>{stopPlace.quays[0].id}</div>
        </section>
      )}
    </>
  );
};

export default StopPlaceDetails;
