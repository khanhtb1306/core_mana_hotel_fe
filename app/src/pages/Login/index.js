import { json, redirect } from "react-router-dom";
import LoginForm from "../../components/LoginForm";

function LoginPage() {
  return <LoginForm />
}

export default LoginPage;

export async function action({ request }) {
  console.log('1');
  const data = await request.formData();
  const authData = {
    username: data.get('username'),
    password: data.get('password'),
  };

  console.log(data.get('username') + ' ' + data.get('password'));

  // const response = await fetch('http://localhost:8080/login', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(authData),
  // });

  // if (!response.ok) {
  //   throw json({ message: 'Could not authenticate user.' }, { status: 500 });
  // }

  // const resData = await response.json();
  // const token = resData.token;

  // localStorage.setItem('token', token);
  // const expiration = new Date();
  // expiration.setHours(expiration.getHours() + 1);
  // localStorage.setItem('expiration', expiration.toISOString());

  return redirect('/');
}