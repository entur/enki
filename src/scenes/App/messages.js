import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.title',
    defaultMessage: 'Bestillingstransport',
  },
  home: { id: 'app.navBar.introduction', defaultMessage: 'Introduksjon' },
  homeHeader: {
    id: 'app.home.header',
    defaultMessage: 'Entur Fleksibel transport',
  },
  leadParagraph: {
    id: 'app.home.header.paragraph',
    defaultMessage:
      'Velkommen til Entur fleksibel transport. Dette er et verktøy for at aktører selv skal kunne legge inn fleksible linjetilbud som synliggjøres i våre kanaler.',
  },
  introductionTitle: {
    id: 'app.home.main.section.1.title',
    defaultMessage: 'Kom i gang!',
  },
  summaryNetwork: {
    id: 'app.home.main.section.1.summary.item.1',
    defaultMessage:
      '1. Lag et nytt nettverk under ‘Nettverk’ i menyen til venstre ',
  },
  summaryStopPoints: {
    id: 'app.home.main.section.1.summary.item.2',
    defaultMessage:
      '2. Lag stoppested eller sone under ’Stoppesteder’ i menyen til venstre ',
  },
  summaryLine: {
    id: 'app.home.main.section.1.summary.item.3',
    defaultMessage:
      '3. Opprett en ny linje under ‘Linjer’ i menyen til venstre',
  },
});
