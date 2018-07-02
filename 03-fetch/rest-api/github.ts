import {UserEntity} from '../model/user';
import fetch from 'isomorphic-unfetch';
const baseRoot = 'https://api.github.com/orgs/lemoncode';
const userCollectionURL = `${baseRoot}/members`

const getUserCollection =  async () => {
  const res = await fetch(userCollectionURL)
  const data = await res.json();

  return data.map(
    ({id, login, avatar_url,}) => ({ id, login, avatar_url, } as UserEntity)
  );
}

export default getUserCollection;