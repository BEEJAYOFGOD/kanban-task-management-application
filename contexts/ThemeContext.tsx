"use client"
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
export type Theme = "light" | "dark";

type ThemeContext = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContext | null>(null);

export const ThemeProvider = ({ defaultTheme, children }: { defaultTheme: Theme | null, children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (defaultTheme) return defaultTheme;
        // fallback to system preference on client
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }

        return 'dark'
    });

    const setThemeCookie = (theme: Theme) => {
        document.cookie = `theme=${theme}; path=/; max-age=31536000`
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            return
        }
        setThemeCookie(theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);


    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? "dark" : "light";
            setTheme(newTheme);
            setThemeCookie(newTheme);
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
