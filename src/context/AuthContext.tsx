"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/data";
const USER_KEY = "user";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(USER_KEY);
            if (raw) setUser(JSON.parse(raw));
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (u: User) => {
        setUser(u);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem(USER_KEY);
    }
    return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}