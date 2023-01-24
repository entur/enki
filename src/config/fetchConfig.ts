export const fetchConfig = async (apiBase?: string) => {
  const config = await fetch(`${apiBase}/app.json`);
  return config.json();
};
