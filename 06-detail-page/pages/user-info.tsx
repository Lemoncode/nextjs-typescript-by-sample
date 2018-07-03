import * as React from 'react';
import * as Next from 'next';
import {withRouter} from 'next/router';
import { getUserDetail } from '../rest-api/github';
import { UserDetailEntity } from 'model/user-details';

interface Props {
}


//const Index =withRouter((props) : Next.NextSFC<Props> => (
const InnerIndex : Next.NextSFC<Props> = ()  => (
  <div>
    <h2>I'm the user info page</h2>     
  </div>
);

const Index = withRouter(InnerIndex);


// https://github.com/zeit/next.js/issues/438

export default Index;