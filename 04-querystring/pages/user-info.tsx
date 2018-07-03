import {withRouter} from 'next/router';

const Index =withRouter((props) => (
  <div>
    <h2>I'm the user info page</h2> 
    <h3>{props.router.query.id}</h3>     
  </div>
));

export default Index;