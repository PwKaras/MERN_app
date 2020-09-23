import React, { useState, useContext } from 'react';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE, VALIDATOR_FILE } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import './Auth.css';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const Auth = () => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const authSubminHandler = async event => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    },
                );

                auth.login(responseData.userId, responseData.token);
            } catch (error) {
            }
        } else {
            try {
                // FormData - browser API
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value)
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/signup', 'POST', formData
                );

                auth.login(responseData.userId, responseData.token);

            } catch (error) {

            }
        }
    };

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    },
                    image: {
                        value: null,
                        isValid: false
                    }
                },
                false);
        }
        setIsLoginMode(prevState => !prevState);
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <div className="center">
                <Card className="authentication">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <h2>Login Required</h2>
                    <hr />
                    <form onSubmit={authSubminHandler}>
                        {!isLoginMode &&
                            <Input
                                id="name"
                                element="input"
                                type="text"
                                label="Name"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a name."
                                onInput={inputHandler}
                            />
                        }
                        {!isLoginMode && <ImageUpload center
                            id="image"
                            element="input"
                            type="file"
                            label="image"
                            validators={[VALIDATOR_FILE()]}
                            errorText="Please add Your image."
                            onInput={inputHandler}
                        />}
                        <Input
                            id="email"
                            element="input"
                            type="email"
                            label="E-mail"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                            errorText="Please enter a valid email address."
                            onInput={inputHandler}
                        />
                        <Input
                            id="password"
                            element="input"
                            type="text"
                            label="Password"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
                            errorText="Please enter a valid password (at least 8 characters)."
                            onInput={inputHandler}
                        />
                        <Button type="submit" disabled={!formState.isValid}>
                            {isLoginMode ? "LOGIN" : "SINGUP"}
                        </Button>
                    </form>
                    <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? "SINGUP" : "LOGIN"}</Button>
                </Card>
            </div>
        </>
    );
};

export default Auth;