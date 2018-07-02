import * as React from 'react';
import { UserEntity } from 'model/user';

interface Props {
  user: UserEntity;
}

export const UserRow = (props: Props) =>
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
