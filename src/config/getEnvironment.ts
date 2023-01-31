export const getEnvironment = () => {
  if (window.location.hostname === 'nplan.entur.org') {
    return 'prod';
  } else if (window.location.hostname === 'nplan.staging.entur.org') {
    return 'test';
  } else {
    return 'dev';
  }
};
