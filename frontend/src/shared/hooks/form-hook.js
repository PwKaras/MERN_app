import { useCallback, useReducer } from 'react';

// taked from NewPlace.js
const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if(!state.inputs[inputId]) {
                    continue
                    // continue tells Javascript if state in inputId are undefine don't continue with this iteration - skip to the next
                }
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                }
                // in the case when input is not updated by curently action (below)
                else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid
                }
            }

            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    // dynamically updates fields in changed input[action.inputId]
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            };
            case 'SET_DATA':
            return {
                // dotn`t copy old state (...state) because replace it entirely
                inputs: action.inputs,
                isValid: action.formIsValid

            }

        default:
            return state;
    }
};

export const useForm = (initialInputs, initialFormValidity) => {

    // taked from NewPlaces.js
    // initial states could be diferents when use new hook so, to set inital state from outside initialInputs and initialFormValidity
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        // {
        //     title: {
        //         value: '',
        //         isValid: false
        //     },
        //     description: {
        //         value: '',
        //         isValid: false
        //     },
        //     address: {
        //         value: '',
        //         isValid: false
        //     }
        // },
        isValid: initialFormValidity
        // isValid: false
    });

    // taked from NewPlace.js
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        })
    }, []);

    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        });
    }, []);

    return [formState, inputHandler, setFormData];
};
