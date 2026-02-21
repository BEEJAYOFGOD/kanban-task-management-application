'use server'
import { Theme } from '@/contexts/ThemeContext'

import { cookies } from 'next/headers'

export async function setThemeCookie(theme: Theme) {
    const cookieStore = await cookies()

    cookieStore.set('theme', theme)
    // or
    // cookieStore.set('theme', theme, { secure: true })
    // // or
    // cookieStore.set({
    //     name: 'theme',
    //     value: theme,
    //     httpOnly: true,
    //     path: '/',
    // })
}


