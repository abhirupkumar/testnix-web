import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface IAuth {
    user: User | null
    signUp: (email: string, password: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    error: string | null
    loading: boolean
}

const AuthContext = createContext<IAuth>({
    user: null,
    signUp: async () => { },
    signIn: async () => { },
    logout: async () => { },
    error: null,
    loading: false,
})

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState(null)
    const [initialLoading, setInitialLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // Persisting the user
    useEffect(
        () =>
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser(user)
                    setLoading(false)
                } else {
                    setUser(null)
                    if (pathname == '/dashboard') {
                        router.push('/sign-in')
                    }
                    setLoading(false)
                }

                setInitialLoading(false)
            }),
        [auth, pathname])

    useEffect(() => {
        if (error != null) {
            setLoading(false)
            setError(null);
        }
    }, [error])

    const signUp = async (email: string, password: string) => {
        setLoading(true)

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user)
                router.push('/')
                setLoading(false)
            })
            .catch((err) => {
                alert(err.message)
                setError(err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true)

        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user)
                router.push('/')
                setLoading(false)
            })
            .catch((err) => {
                alert(err.message)
                setError(err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const logout = async () => {
        setLoading(true)

        signOut(auth)
            .then(() => {
                setUser(null)
            })
            .catch((err) => {
                alert(err.message)
                setError(err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const memoedValue = useMemo(
        () => ({
            user,
            signUp,
            signIn,
            logout,
            loading,
            error,
        }),
        [user, loading]
    )

    return (
        <AuthContext.Provider value={memoedValue}>
            {!initialLoading && children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext)
}