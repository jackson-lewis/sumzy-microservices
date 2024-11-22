export default function Account() {
  return (
    <>
        <h1>Account</h1>
        <button onClick={() => {
            document.cookie = 'token=; max-age=0';
        }}>Log out</button>
    </>      
  )
}
