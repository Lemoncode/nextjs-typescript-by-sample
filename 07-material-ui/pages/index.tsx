import * as React from 'react';
import * as Next from 'next';

import Typography from '@material-ui/core/Typography';

import { getUserCollection } from '../rest-api/github';
import { UserList } from '../components/user-collection';
import { UserEntity } from 'model/user';

interface Props {
  userCollection: UserEntity[],
}

const Index: Next.NextSFC<Props> = (props) => (
  <div>
    <Typography variant="display1" gutterBottom>
      Hello Next.js
    </Typography>

    <UserList userCollection={props.userCollection} />
  </div>
)

Index.getInitialProps = async () => {
  const data = await getUserCollection();

  return {
    userCollection: data,
  }
}

export default Index;