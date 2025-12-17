const { auth ,requireAdmin} = require("./auth.middleware");
const {requirePermission } = require("./rbac.middleware");



function adminWithPermission(permission){
    return [auth,requireAdmin,requirePermission(permission)]
}

module.exports = { adminWithPermission };