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

const getStoredTheme = (): Theme => {
    if (typeof window !== "undefined") {
        return (localStorage.getItem("theme") as Theme) ?? "dark";
    }
    return "dark"; // default for SSR
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {

    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    useEffect(() => {

        localStorage.setItem("theme", theme);

        document.documentElement.classList.toggle(
            "dark",
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        );

    }, [theme]);


    const toggleTheme = () => {
        console.log(theme);

        setTheme((prev: Theme) => {
            const newTheme = prev === "light" ? "dark" : "light";

            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};
