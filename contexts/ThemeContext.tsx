"use client"

import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContext = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContext | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        // this code runs to check if the user has a saved theme in localStorage
        // it also checks to know what the user selected in the system settings
        document.documentElement.classList.toggle(
            "dark",
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        );

        const storedTheme = localStorage.getItem("theme") as Theme | "light";

        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);


    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? "dark" : "light";
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme((prev: Theme) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};
