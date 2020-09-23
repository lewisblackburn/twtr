import React, { HtmlHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/core";

type InputFieldProps = HtmlHTMLAttributes<HTMLInputElement> & {
  label?: string;
  type?: string;
  name: string;
  textarea?: boolean;
  pr?: string;
  mt?: number;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  let InputOrTextarea = Input;
  if (props.textarea) {
    InputOrTextarea = Textarea;
  }
  const [field, { error }] = useField(props);
  return (
    <FormControl color="white" isInvalid={!!error}>
      <InputOrTextarea
        {...field}
        {...props}
        type={props.type}
        id={field.name}
        bg="gray.900"
        width="100%"
        border="none"
        _focus={{
          outline: 0,
          border: 0,
        }}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
