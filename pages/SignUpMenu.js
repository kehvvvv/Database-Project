import SignUpFields from "../components/SignUpFields.js";
function SignUpMenu() {
  return (
    <main className='d-flex flex-column' style={{
      height: '100%',
      width: '100%'
    }}>
      <SignUpFields />
    </main>
  );
}

export default SignUpMenu;
