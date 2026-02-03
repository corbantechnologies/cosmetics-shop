"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { getSession, signIn } from "next-auth/react";
import { Session, User } from "next-auth";
import Link from "next/link";
import { useFormik } from "formik";
import { LoginSchema } from "@/validation";

interface CustomUser extends User {
    is_vendor?: boolean;
    is_customer?: boolean;
    is_superuser?: boolean;
}

interface CustomSession extends Session {
    user?: CustomUser;
}

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            setLoading(true);

            const response = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            const session = (await getSession()) as CustomSession | null;

            setLoading(false);

            if (response?.error) {
                toast.error("Invalid email or password");
            } else {
                toast.success("Login successful! Redirecting...");

                if (session?.user?.is_vendor === true) {
                    router.push("/vendor/dashboard");
                } else if (session?.user?.is_customer === true) {
                    router.push("/");
                } else if (session?.user?.is_superuser === true) {
                    // TODO: Add superuser dashboard
                    router.push("/vendor/dashboard");
                } else {
                    router.push("/");
                }
            }
        },
    });
    return (
        <div>
            <h1>Login</h1>
        </div>
    )
}