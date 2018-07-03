import * as React from 'react';
import * as Next from 'next';
import Link from 'next/link';
import getUserCollection from '../rest-api/github';
import {UserTable} from './components/user-info';
import { UserEntity } from 'model/user';

interface Props {
  userCollection: UserEntity[],
}

const Index : Next.NextSFC<Props> = (props) => (
  <div>
  <p>Hello Next.js</p>

  <UserTable userCollection={props.userCollection}/>

  <Link href="/user-info">
    <a>Navigate to user info page</a>
  </Link>
</div>
)

Index.getInitialProps = async () =>  {
  const data = await getUserCollection();

  return {
    userCollection: data,
  }
}

/*
const async getInitialProps = () => {
    const data = await getUserCollection();

    return {
      userCollection: data,
      mytest: 'initialProps called'  
    }
  }
  
  return (
    <div>
      <p>Hello Next.js</p>

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

      <Link href="/user-info">
        <a>Navigate to user info page</a>
      </Link>
    </div>
  )
}
*/


export default Index;