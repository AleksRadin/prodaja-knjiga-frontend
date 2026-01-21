"use client";

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth"
import { RegisterForm } from "../components/RegisterForm"; 
import { useRouter } from "next/navigation";

const RegisterPage = () => {
    const { isLoggedIn, error, register } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn) {
            router.replace("/");
        }
    }, [isLoggedIn, router]);

    const handleRegisterSubmit = (
        firstname: string, 
        lastname: string, 
        email: string, 
        password: string, 
        phoneNumber: string
    ) => {
        register(firstname, lastname, email, password, phoneNumber);
    };

    if (isLoggedIn) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl font-medium">Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <RegisterForm
                error={error}
                onRegisterSubmit={handleRegisterSubmit}
            />
        </div>
    );
};

export default RegisterPage;