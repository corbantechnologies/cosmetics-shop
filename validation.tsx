import * as Yup from "yup";


const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
        .min(5, "Password cannot be less than 5 characters")
        .required("This field is required"),
});

const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    code: Yup.string().required("Code is required"),
    password: Yup.string()
        .min(5, "Password cannot be less than 5 characters")
        .required("This field is required")
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Password must contain at least 5 characters, one uppercase, one number and one special case character"
        ),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Confirm Password does not match"),
});

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
});

export { LoginSchema, ResetPasswordSchema, ForgotPasswordSchema };