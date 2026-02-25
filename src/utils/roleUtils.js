const hasAdminAccess = (user) => {
  if (!user || !user.roles) return false;
  return user.roles.includes("admin") || user.roles.includes("editor");
};

export { hasAdminAccess };
