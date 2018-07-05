import * as React from 'react';
import * as Next from 'next';
import {withRouter} from 'next/router';

interface Props {
  userId : string;
}


//const Index =withRouter((props) : Next.NextSFC<Props> => (
const InnerIndex : Next.NextSFC<Props> = (props)  => (
  <div>
    <h2>I'm the user info page</h2>  
    <p>User ID Selected: {props.userId}</p>   
  </div>
);

InnerIndex.getInitialProps = async (props) =>  {
  const query = props.query;
  const id = query.id as string;

  return {    
    userId: id,
  }
}

const Index = withRouter(InnerIndex);




// https://github.com/zeit/next.js/issues/438

export default Index;