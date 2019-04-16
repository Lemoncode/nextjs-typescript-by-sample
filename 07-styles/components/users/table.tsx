import * as Next from 'next';
import { User } from '../../model/user';
import { Header } from './header';
import { Row } from './row';

interface Props {
  users: User[];
}

export const Table: Next.NextStatelessComponent<Props> = (props) => (
  <table>
    <thead>
      <Header />
    </thead>
    <tbody>
      {
        props.users.map(user => (
          <Row key={user.id} user={user} />
        ))
      }
    </tbody>
  </table>
)
