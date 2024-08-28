export const useHasPermission = ({
  requiredPermission,
  session,
}: {
  requiredPermission?: string[];
  session: any | null | undefined;
}): boolean => {

  if (!session?.user?.role?.permissions) {
    return false;
  }

  const userActions = session.user.role.permissions.map(
    (permission: Record<string, any>) => permission.action
  );

  const hasPermission: boolean | undefined = requiredPermission?.some((action: string) =>
    userActions.includes(action) 
  );

  return hasPermission ?? false
};
