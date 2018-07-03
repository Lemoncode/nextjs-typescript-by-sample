import { UserEntity } from '../model/user';
import { UserDetailEntity } from '../model/user-detail';
import fetch from 'isomorphic-unfetch';

const baseRoot = 'https://api.github.com';
const userCollectionURL = `${baseRoot}/orgs/lemoncode/members`
const userDetailsURL = `${baseRoot}/users`

export const getUserCollection = async () => {
  const res = await fetch(userCollectionURL)
  const data = await res.json();

  return data.map(
    ({ id, login, avatar_url, }) => ({ id, login, avatar_url, } as UserEntity)
  );
}

export const getUserDetail = async (login: string) => {
  const fullUserDetailURL = `${userDetailsURL}/${login}`;

  const res = await fetch(fullUserDetailURL)
  const data = await res.json();

  return data.map(
    ({ id, login, avatar_url, name, company, followers }) => ({ id, login, avatar_url, name, company, followers } as UserDetailEntity)
  );
}