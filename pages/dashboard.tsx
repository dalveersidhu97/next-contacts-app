import type {GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import withAuth from '../Auth/withAuth';
import Dashboard from '../components/Dashboard';

const DashboardPage: NextPage<{email: string}> = (props) => {
  
  return <div>
    <Dashboard></Dashboard>
    <h1>Email: {props.email}</h1>
  </div>
}

export default DashboardPage;

export const getServerSideProps: GetServerSideProps = withAuth(async (context: GetServerSidePropsContext) => {

  const email = 'dalveer@gmail.com';

  return {
    props: {email}, 
  }
});