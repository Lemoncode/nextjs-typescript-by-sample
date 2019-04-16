import { withRouter } from 'next/router';
import { getUserDetail } from '../rest-api/github';
import { UserDetailEntity } from '../model/user-detail';

interface Props {
  userId : string;
  userDetail : UserDetailEntity;
}

const InnerUserInfoPage : Next.NextSFC<Props> = (props)  => (
  <div>
    <h2>I'm the user info page</h2>      
    <p>User ID Selected: {props.userId}</p> 
    <img src={props.userDetail.avatar_url} style={{ maxWidth: '10rem' }} />
    <p>User name: {props.userDetail.name}</p>  
    <p>Company: {props.userDetail.company}</p>  
    <p>Followers: {props.userDetail.followers}</p>  
  </div>
);

InnerUserInfoPage.getInitialProps = async (data) =>  {
  const query = data.query;
  const id = query.id as string;

  const userDetail = await getUserDetail(id);  

  return {    
    userId: id,
    userDetail
  }
}

const UserInfoPage = withRouter(InnerUserInfoPage);

export default UserInfoPage;