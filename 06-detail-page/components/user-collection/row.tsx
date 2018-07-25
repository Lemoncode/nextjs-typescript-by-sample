import * as React from 'react';
import { UserEntity } from 'model/user';
import Link from 'next/link';

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
    <Link as={`user-info/id/${props.user.login}`} href={`/user-info?id=${props.user.login}`}>
        <a>{props.user.login}</a>
      </Link>    
    </td>
  </tr>
