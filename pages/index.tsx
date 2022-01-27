import type {NextPage} from 'next'
import Link from 'next/link';
import {useUser} from '@auth0/nextjs-auth0';
import {useEffect} from 'react';
import {useRouter} from 'next/router';

const Home: NextPage = () => {

    const router = useRouter();
    const {user, isLoading} = useUser();

    useEffect(() => {
        if (user) router.push('/app');
    }, [user]);

    return <div className="bg-light text-dark min-h-screen p-12 text-center">

        <div className="font-display font-bold text-3xl ">GNTMHUB</div>

        {isLoading && 'wait'}
        {user && <Link href="/api/auth/logout">Logout</Link>}
        {!user && <Link href="/api/auth/login">Login</Link>}
    </div>
}

export default Home
