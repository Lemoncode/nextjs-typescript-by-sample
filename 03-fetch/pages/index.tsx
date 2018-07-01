import * as React from 'react';
import Link from 'next/link';
import getUserCollection from '../rest-api/github';
import {UserEntity} from '../model/user'


interface State {
  userCollection: UserEntity[];
}

export class Index extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {userCollection: []};
  }

  getInitialProps = async function () {
    const data = await getUserCollection();
    this.setState({userCollection : data});
  }

  render() {
    return (
      <div>
        <p>Hello Next.js</p>
        <p>{this.state.userCollection}</p>
        <Link href="/user-info">
          <a>Navigate to user info page</a>
        </Link>
      </div>
    )
  }
}


export default Index;