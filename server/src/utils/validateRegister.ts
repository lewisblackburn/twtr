import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";
import isImageURL from "image-url-validator";

export const validateRegister = async (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot contain @",
      },
    ];
  }
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "must contain @",
      },
    ];
  }
  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "length must be greater than 2",
      },
    ];
  }
  if (!(await isImageURL(options.avatar))) {
    return [
      {
        field: "avatar",
        message: "must be an image url",
      },
    ];
  }
  if (!(await isImageURL(options.banner))) {
    return [
      {
        field: "banner",
        message: "must be an image url",
      },
    ];
  }
  if (options.displayname.length <= 2) {
    return [
      {
        field: "displayname",
        message: "length must be greater than 2",
      },
    ];
  }
  if (options.displayname.includes("@")) {
    return [
      {
        field: "displayname",
        message: "cannot contain @",
      },
    ];
  }
  return null;
};
