import { signify } from "react-signify";

interface IError {
  id: string | number;
  errorList: string[];
}

export const sErrorList = signify<IError[]>([]);
