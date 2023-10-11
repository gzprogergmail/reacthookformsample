import { PrimaryButton, TextField } from "@fluentui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ValidationRule } from "react-hook-form";
import debounce from "lodash.debounce"

const urlRegex = /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/;

export const RequiredRule: ValidationRule<boolean> = {
  value: true,
  message: "This field is required!"
};
export const MinLengthRule: ValidationRule<number> = {
  value: 3,
  message: "Minimum 3 letters"
};
export const MaxLengthRule: ValidationRule<number> = {
  value: 6,
  message: "Maximum 6 letters"
};
export const DomainPatternRule: ValidationRule<RegExp> = {
  value: urlRegex,
  message: "this is not a domain"
};


type FormData = {
  firstName: string;
  lastName: string;
  hostAddress: string;
};

const App = () => {
  const [dataToSubmit, setDataToSubmit] = useState<FormData>();
  const {
    register,
    setValue,
    handleSubmit,
    formState,
    formState: { errors},
    reset
  } = useForm<FormData>({
    mode: "onChange"
  });
  const onSubmit = handleSubmit((data) => {
    console.log(data);
    setDataToSubmit(data);
    reset();
  });

  const onTextFieldChangeCore = useCallback(
    (name: keyof FormData) => (
      _e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => setValue(name, newValue || "", { shouldDirty: true, shouldValidate: true }),
    [setValue]
  );

  //write a wrapper to debounce the onTextFieldChangeCore function, pass in the name of the field
  const onTextFieldChange =  (name: keyof FormData) => debounce(onTextFieldChangeCore(name), 500);

  useEffect(() => {
    // you can find all the rules in ValidationRules.ts file
    register("firstName", {
      required: RequiredRule,
      minLength: MinLengthRule
    });
    register("lastName", {
      required: RequiredRule,
      maxLength: MaxLengthRule
    });
    register("hostAddress", {
      required: RequiredRule,
      pattern: DomainPatternRule //Pattern rule
    });
  }, [register]);

  return (
    <>
      <pre>Is Form Dirty: {formState.isDirty ? "true" : "false"}</pre>
      <hr />
      Fill in the form and press save. You will see the data below the save
      button. After you change any field after pressing save, the panel is in
      dirty state again and you need press save again if you want to see the
      changed data
      <hr />
      <form onSubmit={onSubmit}>
        <TextField
          label="First Name"
          required
          onChange={onTextFieldChange("firstName")}
          placeholder="First Name"
          errorMessage={errors.firstName?.message}
        />
        <TextField
          label="Last Name"
          required
          onChange={onTextFieldChange("lastName")}
          placeholder="Last Name"
          errorMessage={errors.lastName?.message}
        />
        <TextField
          prefix="sftp://"
          label="Your SFTP Storage"
          required
          onChange={onTextFieldChange("hostAddress")}
          errorMessage={errors.hostAddress?.message}
          placeholder="google.com"
        />
        <hr />
        <PrimaryButton disabled={!formState.isValid} type="submit">
          Save
        </PrimaryButton>
      </form>
      {dataToSubmit != null && !formState.isDirty ? (
        <pre>{JSON.stringify(dataToSubmit)}</pre>
      ) : null}
    </>
  );
};
export default App;