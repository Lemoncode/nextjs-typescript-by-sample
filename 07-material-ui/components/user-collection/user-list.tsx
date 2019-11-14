import * as React from 'react';

import Grid from '@material-ui/core/Grid'

import { UserEntity } from "model/user";
import { UserCard } from "./card";

interface Props {
  userCollection: UserEntity[],
}

export const UserList = (props: Props) =>
  <div>
    <Grid container spacing={24} style={{ padding: 24 }}>
      {
        props.userCollection.map((user: UserEntity) =>
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <UserCard user={user} key={user.id} />
          </Grid>
        )
      }
    </Grid>
  </div>