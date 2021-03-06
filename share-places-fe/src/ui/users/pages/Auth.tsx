import React, { FormEvent, useContext, useEffect, useState } from 'react';

import './Auth.css';

import Button from '@app/ui/shared/components/form-elements/Button';
import ImageUpload from '@app/ui/shared/components/form-elements/ImageUpload';
import Input from '@app/ui/shared/components/form-elements/Input';
import Card from '@app/ui/shared/components/ui-elements/Card';
import ErrorModal from '@app/ui/shared/components/ui-elements/ErrorModal';
import LoadingSpinner from '@app/ui/shared/components/ui-elements/LoadingSpinner';
import { AuthContext } from '@app/ui/shared/context/auth-context';
import { useForm } from '@app/ui/shared/hooks/form-hook';
import { useHttpClient } from '@app/ui/shared/hooks/http-hook';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '@app/ui/shared/util/validators';

export default function Auth(): JSX.Element {
  const auth = useContext(AuthContext);
  const [isLoginMode, setLoginMode] = useState<boolean>(true);
  const [authData, setAuthData] = useState<
    { userId: string; token: string } | undefined
  >();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: '', isValid: false },
      password: { value: '', isValid: false },
    },
    false
  );

  useEffect(() => {
    if (authData) {
      auth.login(authData.userId, authData.token);
    }
  }, [auth, authData]);

  const formSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (isLoginMode) {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );

        setAuthData({
          userId: responseData.user.id,
          token: responseData.token,
        });
      } else {
        const formData = new FormData();
        formData.append('name', formState.inputs.name.value as string);
        formData.append('email', formState.inputs.email.value as string);
        formData.append('password', formState.inputs.password.value as string);
        formData.append('image', formState.inputs.image.value as File);

        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/users/signup`,
          'POST',
          formData,
          {}
        );

        setAuthData({
          userId: responseData.user.id,
          token: responseData.token,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const toggleModeHandler = () => {
    if (!isLoginMode) {
      const { name, image, ...otherInputs } = formState.inputs;
      setFormData(
        {
          ...otherInputs,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: '', isValid: false },
          image: { value: '', isValid: false },
        },
        false
      );
    }

    setLoginMode((prevState) => !prevState);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}

        <h2>Login Required</h2>
        <hr />
        <form className='auth-form' onSubmit={formSubmitHandler}>
          {!isLoginMode && (
            <Input
              element='input'
              id='name'
              type='text'
              label='Your Name'
              errorText='Please enter your name.'
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
          )}

          {!isLoginMode && (
            <ImageUpload
              id='image'
              center
              onInput={inputHandler}
              errorText='Please provide an image.'
            />
          )}

          <Input
            element='input'
            id='email'
            type='email'
            label='E-Mail'
            errorText='Please enter a valid email.'
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />

          <Input
            element='input'
            id='password'
            type='password'
            label='Password'
            errorText='Please enter a valid password (at least 5 characters).'
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
          />

          <Button type='submit' disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>

        <Button inverse onClick={toggleModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  );
}
