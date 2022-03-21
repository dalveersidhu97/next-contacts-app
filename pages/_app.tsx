import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'
import Layout from '../components/Layout'
import LoginProvider, { LoginContext } from '../store/LoginContext'
import { useContext } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import withAuth from '../Auth/withAuth';
import LoginUser from '../types/LoginUser';

function MyApp({ Component, pageProps }: AppProps) {

  return <LoginProvider> <Layout><Component {...pageProps} /></Layout></LoginProvider>
}


export default MyApp
