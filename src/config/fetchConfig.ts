export const fetchConfig = async (apiBase?: string) => {
  const resp = await fetch(`${apiBase}/app.json`);
  const config = await resp.json();
  return {
    ...config,
    adminRole: process.env.REACT_APP_ADMIN_ROLE,
  };
};
