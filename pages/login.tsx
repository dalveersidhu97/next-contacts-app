import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import withAuth from '../Auth/withAuth';
import Login from '../components/Login';
import LoginUser from '../types/LoginUser';

const LoginPage: NextPage<LoginUser> = (props) => {
  console.log('LoginUser', props)
  return (
    <Login></Login>
  )
}

export default LoginPage;

export const getServerSideProps = withAuth(async function(ctx: GetServerSidePropsContext){
    return {
      props: {}
    }
});