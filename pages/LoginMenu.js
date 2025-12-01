import LoginFields from "../components/LoginFields.js";
function LoginMenu() {
  return (
    <main className='d-flex flex-column' style={{
      height: '100%',
      width: '100%'
    }}>
      <LoginFields />
    </main>
  );
}

export default LoginMenu;
