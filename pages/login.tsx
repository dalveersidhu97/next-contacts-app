import type {NextPage } from 'next';
import Login from '../components/Login';

const LoginPage: NextPage = (props) => {
  console.log('Props', props)
  console.log(' ------- --------  --------')
  return (
    <Login></Login>
  )
}

export default LoginPage;