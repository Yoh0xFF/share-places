import React, { useEffect, useState } from 'react';

import { User } from '@app/type/user';
import ErrorModal from '@app/ui/shared/components/ui-elements/ErrorModal';
import LoadingSpinner from '@app/ui/shared/components/ui-elements/LoadingSpinner';
import { useHttpClient } from '@app/ui/shared/hooks/http-hook';
import UsersList from '@app/ui/users/components/UsersList';

function Users(): JSX.Element {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [users, setUsers] = useState([] as Array<User>);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:8080/api/users'
        );
        setUsers(responseData.users as Array<User>);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </>
  );
}

export default Users;
