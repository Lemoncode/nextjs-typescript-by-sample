import * as Next from 'next';
import Link from 'next/link';
import { fetchUsers } from '../rest-api/github';
import { User } from '../model/user';
import { Table } from '../components/users';

interface Props {
  users: User[];
}

const Index: Next.NextStatelessComponent<Props> = (props) => (
  <div>
    <p>Hello Next.js</p>
    <Table users={props.users} />
    <Link href="/user-info">
      <a>Navigate to user info page</a>
    </Link>
  </div>
);

Index.getInitialProps = async () => {
  const users = await fetchUsers();

  return {
    users,
  }
}

export default Index;
