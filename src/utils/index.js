exports.hasPermissions = (user, ...permissions) => {
  // array of objects { resource, policy }
  if (user.owner) return true;
  
  const userPermissions = user.role.permissions;
  let isAuthorized = true;

  permissions.forEach(value => {
    // deconstruct permission
    let deconstructedPermission = value.split("_");
    let action = deconstructedPermission[0];
    deconstructedPermission.splice(0, 1);
    let resource = deconstructedPermission.join("_");
    let permission = userPermissions.find(element => element.resource == resource);
    if (!permission.policy[action]) {
      isAuthorized = false;
      return;
    }
  })

  return isAuthorized;
}