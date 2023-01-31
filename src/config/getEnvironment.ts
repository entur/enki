export const getEnvironment = () => {
  if (
    window.location.hostname === 'nplan.entur.org' ||
    window.location.hostname === 'ent-enki-prd.web.app'
  ) {
    return 'prod';
  } else if (
    window.location.hostname === 'nplan.staging.entur.org' ||
    window.location.hostname === 'ent-enki-tst.web.app'
  ) {
    return 'test';
  } else {
    return 'dev';
  }
};
