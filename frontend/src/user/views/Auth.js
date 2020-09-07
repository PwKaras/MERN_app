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
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState();
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

        console.log(formState.inputs);
        // setIsLoading(true);

        if (isLoginMode) {
            try {
                const responseData = await sendRequest('http://localhost:5051/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    },
                );

                auth.login(responseData.user.id);
            } catch (error) {

            }

        } else {
            try {
                const responseData = await sendRequest('http://localhost:5051/api/users/signup', 'POST',
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );

                auth.login(responseData.user.id);

            } catch (error) {

            }

        }
    };

    //before useHttpClinet hook - pure fetch()
    //     if (isLoginMode) {
    //         try {
    //             const response = await fetch('http://localhost:5051/api/users/login', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({
    //                     email: formState.inputs.email.value,
    //                     password: formState.inputs.password.value
    //                 })
    //             });
    //             const responseData = await response.json();
    //             if (!response.ok) {
    //                 throw new Error(responseData.message);
    //             };
    //             setIsLoading(false);
    //             auth.login();

    //         } catch (error) {
    //             setIsLoading(false);
    //             setError(error.message || 'Something went wrong, please try again.');
    //         }

    //     } else {
    //         try {
    //             const response = await fetch('http://localhost:5051/api/users/signup', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({
    //                     name: formState.inputs.name.value,
    //                     email: formState.inputs.email.value,
    //                     password: formState.inputs.password.value
    //                 })
    //             });

    //             const responseData = await response.json();
    //             // ok - property of response - fetch - ok it means 200
    //             // !response.ok - response with 400 or 500 status
    //             if (!response.ok) {
    //                 throw new Error(responseData.message);

    //             }
    //             setIsLoading(false);
    //             auth.login();

    //         } catch (error) {
    //             console.log(error);
    //             setIsLoading(false);
    //             setError(error.message || 'Something went wrong, please try again.');
    //         }
    //     }
    // };

    //pure React front only
    // const authSubminHandler = event => {
    //     event.preventDefault();
    //     console.log(formState.inputs);
    //     auth.login();
    // };

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

    // const errorHandler = () => {
    //     setError(null);
    // };

    /* {error} - state form useState  error */
    /* <ErrorModal error={error} onClear={errorHandler} /> */

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
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
                        // initialValue={formState.inputs.email.value}
                        // initialValid={formState.inputs.email.isValid}
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
                    // initialValue={formState.inputs.email.value}
                    // initialValid={formState.inputs.email.isValid}
                    />
                    <Input
                        id="password"
                        element="input"
                        type="text"
                        label="Password"
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
                        errorText="Please enter a valid password (at least 8 characters)."
                        onInput={inputHandler}
                    // initialValue={formState.inputs.password.value}
                    // initialValid={formState.inputs.password.isValid}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? "LOGIN" : "SINGUP"}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? "SINGUP" : "LOGIN"}</Button>
            </Card>
        </>
    );
};

export default Auth;