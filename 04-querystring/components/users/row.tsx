import * as Next from 'next';
import Link from 'next/link';
import { User } from '../../model/user';

interface Props {
  user: User;
}

export const Row: Next.NextStatelessComponent<Props> = (props) => (
  <tr>
    <td>
      <img src={props.user.avatar_url} style={{ maxWidth: '10rem' }} />
    </td>
    <td>
      <span>{props.user.id}</span>
    </td>
    <td>
      <Link href={`/user-info?id=${props.user.id}&login=${props.user.login}`}>
        <a>{props.user.login}</a>
      </Link>
    </td>
  </tr>
)
