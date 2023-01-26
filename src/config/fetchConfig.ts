export const fetchConfig = async (apiBase?: string) => {
  const resp = await fetch(`${apiBase}/app.json`);
  return resp.json();
};
