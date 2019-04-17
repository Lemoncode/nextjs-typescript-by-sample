import * as Next from 'next';
import { fetchUserDetail } from '../rest-api/github';
import { UserDetail } from '../model/user-detail';

interface Props {
  login: string;
  userDetail: UserDetail;
}

const UserInfoPage: Next.NextStatelessComponent<Props> = props => (
  <div>
    <h2>I'm the user infopage</h2>
    <p>User ID: {props.userDetail.id}</p>
    <img src={props.userDetail.avatar_url} style={{ maxWidth: '10rem' }} />
    <p>User name: {props.login}</p>
    <p>Company: {props.userDetail.company}</p>
    <p>Followers: {props.userDetail.followers}</p>
  </div>
);

UserInfoPage.getInitialProps = async props => {
  const login = props.query.login as string;
  const userDetail = await fetchUserDetail(login);

  return {
    login,
    userDetail,
  };
};

export default UserInfoPage;
