import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import StopPoint from 'model/StopPoint';
import ServiceJourneyEditor from './Editor';
import { selectIntl } from 'i18n';
import {
  removeElementByIndex,
  replaceElement,
  useUniqueKeys
} from 'helpers/arrays';
import messages from './messages';
import AddButton from 'components/AddButton/AddButton';
import ServiceJourney from 'model/ServiceJourney';
import { Heading2, Paragraph } from '@entur/typography';
import { validateServiceJourney } from 'scenes/Lines/scenes/Editor/ServiceJourneys/Editor/validate';
import ScrollToTop from 'components/ScrollToTop';

type Props = {
  serviceJourneys: ServiceJourney[];
  onChange: (sj: ServiceJourney[]) => void;
  stopPoints: StopPoint[];
  setIsValidServiceJourney: (isValid: boolean) => void;
  spoilPristine: boolean;
};

const ServiceJourneysEditor = ({
  serviceJourneys,
  onChange,
  stopPoints,
  setIsValidServiceJourney,
  spoilPristine
}: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const updateServiceJourney = (index: number, serviceJourney: any) => {
    onChange(replaceElement(serviceJourneys, index, serviceJourney));
  };
  const deleteServiceJourney = (index: number) => {
    onChange(removeElementByIndex(serviceJourneys, index));
  };
  const addNewServiceJourney = () => {
    onChange([...serviceJourneys, { passingTimes: stopPoints.map(_ => ({})) }]);
  };

  useEffect(() => {
    setIsValidServiceJourney(
      serviceJourneys.every(sj => validateServiceJourney(sj))
    );
  }, [serviceJourneys, setIsValidServiceJourney]);

  const keys = useUniqueKeys(serviceJourneys);

  return (
    <ScrollToTop>
      <div className="service-journeys-editor">
        <Heading2>{formatMessage(messages.serviceJourneys)}</Heading2>
        <Paragraph>{formatMessage(messages.serviceJourneysInfo)}</Paragraph>
        {serviceJourneys.map((sj, index) => (
          <ServiceJourneyEditor
            key={keys[index]}
            serviceJourney={sj}
            stopPoints={stopPoints}
            spoilPristine={spoilPristine}
            onChange={serviceJourney =>
              updateServiceJourney(index, serviceJourney)
            }
            deleteServiceJourney={
              serviceJourneys.length > 1
                ? () => deleteServiceJourney(index)
                : undefined
            }
          />
        ))}

        <AddButton
          onClick={addNewServiceJourney}
          buttonTitle={formatMessage(messages.addServiceJourneys)}
        />
      </div>
    </ScrollToTop>
  );
};

export default ServiceJourneysEditor;
