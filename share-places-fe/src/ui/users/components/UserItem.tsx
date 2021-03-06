import React from 'react';
import { Link } from 'react-router-dom';

import './UserItem.css';

import { User } from '@app/types/user';
import Avatar from '@app/ui/shared/components/ui-elements/Avatar';
import Card from '@app/ui/shared/components/ui-elements/Card';

export interface UserItemProps {
  user: User;
}

export default function UserItem(props: UserItemProps): JSX.Element {
  const { user } = props;

  return (
    <li className='user-item'>
      <Card className='user-item__content'>
        <Link to={`/${user.id}/places`}>
          <div className='user-item__image'>
            <Avatar
              image={`${process.env.REACT_APP_API_URL}/${user.image}`}
              alt={user.name}
            />
          </div>

          <div className='user-item__name'>
            <h2>{user.name}</h2>
            <h3>
              {user.places.length}{' '}
              {user.places.length === 1 ? 'place' : 'places'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
}
