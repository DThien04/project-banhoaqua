const router = require("express").Router()
const controller = require("./user.controller")
const userValidator = require("./user.validator");
const { PERMISSIONS } = require("../../middlewares/auth/permissions");
const { adminWithPermission } = require("../../middlewares/auth/combine.middleware")
const { validate } = require("../../middlewares/validate.middleware");
router.get("/", adminWithPermission(PERMISSIONS.USER_READ), controller.getAllUsers);
router.delete("/delete/:id",
    adminWithPermission(PERMISSIONS.USER_READ),

    controller.delete);
router.patch("/bulk/status",
    adminWithPermission(PERMISSIONS.USER_READ),
    validate(userValidator.bulkStatus),
    controller.changeStatusMany);
router.patch("/bulk/delete",
    adminWithPermission(PERMISSIONS.USER_WRITE),
    validate(userValidator.bulkDelete),
    controller.softDeleteManyUsers);
router.patch("/bulk/change-status",
    adminWithPermission(PERMISSIONS.USER_WRITE),
    controller.softDeleteManyUsers);

module.exports = router