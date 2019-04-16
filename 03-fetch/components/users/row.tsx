import * as Next from 'next';
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
      <span>{props.user.login}</span>
    </td>
  </tr>
)
