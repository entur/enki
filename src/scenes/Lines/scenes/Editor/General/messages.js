import { defineMessages } from 'react-intl';

export default defineMessages({
  nameFormGroupTitle: {
    id: 'lines.editor.general.nameFormGroupTitle',
    defaultMessage: 'Navn *'
  },
  descriptionFormGroupTitle: {
    id: 'lines.editor.general.descriptionFormGroupTitle',
    defaultMessage: 'Beskrivelse'
  },
  privateCodeFormGroupTitle: {
    id: 'lines.editor.general.privateCodeFormGroupTitle',
    defaultMessage: 'Privat kode'
  },
  privateCodeInputLabelTooltip: {
    id: 'lines.editor.general.privateCodeInputLabelTooltip',
    defaultMessage:
      'Privat kode er det som kjennetegner linjen internt hos en operatør'
  },
  publicCodeFormGroupTitle: {
    id: 'lines.editor.general.publicCodeFormGroupTitle',
    defaultMessage: 'Offentlig kode *'
  },
  publicCodeInputLabelTooltip: {
    id: 'lines.editor.general.publicCodeInputLabelTooltip',
    defaultMessage:
      'Offentlig kode er det som kjennetegner linjen ut mot publikum'
  },
  operatorFormGroupTitle: {
    id: 'lines.editor.general.operatorFormGroupTitle',
    defaultMessage: 'Operatør *'
  },
  networkFormGroupTitle: {
    id: 'lines.editor.general.networkFormGroupTitle',
    defaultMessage: 'Nettverk *'
  },
  typeFormGroupTitle: {
    id: 'lines.editor.general.typeFormGroupTitle',
    defaultMessage: 'Flexible line type *'
  },
  about: {
    id: 'lines.editor.journeyPatterns.editor.about',
    defaultMessage: 'Om linjen'
  },
  drawerTitle: {
    id: 'lines.editor.general.drawerTitle',
    defaultMessage: 'Fleksible linjetyper'
  },
  drawerSubTitle: {
    id: 'lines.editor.general.drawer',
    defaultMessage: 'Her er en kort beskrivelse av de ulike linjetypene.'
  },
  drawerAria: {
    id: 'lines.editor.general.drawer.aria',
    defaultMessage: 'Les mer om de ulike linjetyperna.'
  },
  fixed: {
    id: 'lines.editor.general.drawer.fixed',
    defaultMessage:
      'Fast rute til faste tider, men må forhåndsbestilles for at ruten skal kjøres.'
  },
  mainRouteWithFlexibleEnds: {
    id: 'lines.editor.general.drawer.fixed',
    defaultMessage:
      'Fast rute til faste tider, med mulighet for på-/avstigning på stoppesteder utenfor oppsatt kjøremønster ved bestilling.'
  },
  fixedStopAreaWide: {
    id: 'lines.editor.general.drawer.fixedStopAreaWide',
    defaultMessage:
      'Fleksibel rute definert av ett eller flere områder, der hvert område kan ha ulike forhåndsbestemte stopp (møteplass, knutepunkt, kommune-senter, holdeplasser).'
  },
  flexibleAreasOnly: {
    id: 'lines.editor.general.drawer.flexibleAreasOnly',
    defaultMessage:
      'Hentes og kjøres til/fra valgfritt sted innenfor et definert område og gitte åpningstider.'
  },
  hailAndRideSections: {
    id: 'lines.editor.general.drawer.hailAndRideSections',
    defaultMessage:
      'Ruten er definert og har noen faste holdeplasser. Langs bestemte strekninger på ruten kan på-/avstigning skje hvor som helst ved signal til sjåfør.'
  }
});
