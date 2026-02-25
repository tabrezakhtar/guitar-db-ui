const hasAdminAccess = (user) => {
  if (!user || !user.role) return false;
  return user.role.includes("admin") || user.role.includes("editor");
};

export { hasAdminAccess };
