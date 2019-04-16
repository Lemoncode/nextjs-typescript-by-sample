import { withRouter } from 'next/router';

const UserInfoPage = withRouter((props) => (
  <div>
    <h2>I'm the user infopage</h2>
    <h3>{props.router.query.id}</h3>
    <h3>{props.router.query.login}</h3>
  </div>
));

export default UserInfoPage;
