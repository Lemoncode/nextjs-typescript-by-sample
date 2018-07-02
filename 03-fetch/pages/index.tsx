import * as React from 'react';
import Link from 'next/link';
import getUserCollection from '../rest-api/github';
import { UserEntity } from '../model/user'
import { UserHeader } from './components/user-info/header';
import { UserRow } from './components/user-info/row';


interface Props {
  userCollection: UserEntity[],
}

// Pending add react SFC
export const Index = (props: Props) => {
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



export default Index;