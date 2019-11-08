export default () => {
  return ({ providers }) =>
    providers.providers.find(p => p.code === providers.active);
};
