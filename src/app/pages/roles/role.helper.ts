import { getLocalStorageData } from "../../services/helper.service";
import { Permission, PermissionAction } from "./roles.service";

export async function hasRole(checkRole: string) {
  const roles = await getLocalRoles();

  for (let i = 0; i < roles.length; i++) {
    const role: any = roles[i];
    if (role.name == checkRole) return true;
  }
  return false;
}

export async function hasPermission(
  permission: Permission,
  action: PermissionAction | PermissionAction[]
) {
  // get user roles
  const roles = await getLocalRoles();

  for (let i = 0; i < roles.length; i++) {
    const role: any = roles[i];
    // check if has permissions
    if (Array.isArray(role.permissions)) {
      for (let j = 0; j < role.permissions.length; j++) {
        const permissionItem = role.permissions[j];
        // check if has permission module
        if (
          permissionItem?.internal_permission?.module_name.toLocaleLowerCase() ==
          permission.toLocaleLowerCase()
        ) {
          // if not array check if has access
          if (
            !Array.isArray(action) &&
            (permissionItem?.internal_permission?.[action] == "1" ||
              permissionItem?.internal_permission?.[action] == "1")
          ) {
            return true;
          } else if (
            Array.isArray(action) &&
            permissionItem?.internal_permission
          ) {
            // check if array has any permissions
            for (const [key, value] of Object.entries(
              permissionItem?.internal_permission
            )) {
              if (action.includes(key as any) && (value == 1 || value == "1"))
                return true;
            }
          }
        }
      }
    }
  }

  return false;
}

async function getLocalRoles() {
  const profileStorageData: any = await getLocalStorageData();
  const rolesData = JSON.parse(atob(profileStorageData?.amcode)) || [];
  if (!Array.isArray(rolesData)) return [];
  let roles = rolesData.map((role: any) => {
    return {
      name: role?.humanizing_data_internal_role_name?.name,
      permissions:
        role?.humanizing_data_internal_role_name
          ?.humanizing_data_internal_role_name_s_has_permission_s || [],
    };
  });

  return roles;
}
