import React, { useState, useContext } from 'react';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import './Auth.css';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const Auth = () => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

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

        } else {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5051/api/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                });

                const responseData = await response.json();
                // ok - property of response - fetch - ok it means 200
                // !response.ok - response with 400 or 500 status
                if (!response.ok) {
                    throw new Error(responseData.message);

                }
                console.log(responseData);
                setIsLoading(false);
                auth.login();

            } catch (error) {
                console.log(error);
                setIsLoading(false);
                setError(error.message || 'Something went wrong, please try again.');
            }
        }
    };
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
                    name: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    }
                },
                false);
        }
        setIsLoginMode(prevState => !prevState);
    };

    const errorHandler = () => {
        setError(null);
    };

    return (
        <>
            {/* {error} - state form useState  error */}
            <ErrorModal error={error} onClear={errorHandler} />
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