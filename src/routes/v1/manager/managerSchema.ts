import Joi from "@hapi/joi";
import { RoleCode } from "../../../database/model/Role";

export default {
  new: Joi.object().keys({
    name: Joi.string().required(),
    shift: Joi.string().required().valid("day", "night"),
    mobile_number: Joi.string().required(),
    date_of_join: Joi.string().required(),
    extraRoles: Joi.array().items(
      Joi.string().valid(RoleCode.DIRECTOR, RoleCode.SUPER_ADMIN).required()
    ),
    fcm_token: Joi.string(),
  }),
  getInfo: Joi.object().keys({
    mobile_number: Joi.string().required(),
  }),
  toggleIsAllowed: Joi.object().keys({
    manager_mn: Joi.string().required(),
    isAllowed: Joi.boolean().required(),
  }),
  updateFcmToken: Joi.object().keys({
    mobile_number: Joi.string().required(),
    fcm_token: Joi.string().required(),
  }),
};
