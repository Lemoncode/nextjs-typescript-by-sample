import Link from 'next/link';

const UserInfoPage = () => (
  <div>
    <h2>I'm the user info page</h2>
    <Link href="index">
    <a>Go back to home</a>
  </Link>
  </div>  
);

export default UserInfoPage;