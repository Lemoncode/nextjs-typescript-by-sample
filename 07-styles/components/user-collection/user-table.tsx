import { UserEntity } from "model/user";
import { UserHeader } from "./header";
import { UserRow } from "./row";

interface Props {
  userCollection: UserEntity[],
}

export const UserTable = (props : Props) =>
<table>
<thead>
  <UserHeader />
</thead>
<tbody>
  {
    props.userCollection.map((user: UserEntity) =>
      <UserRow user={user} key={user.id} />
    )
  }
</tbody>
</table>


