import React, { useRef, useState, useEffect } from 'react';
import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickRef = useRef();
    useEffect(() => {
        if (!file) {
            return;
        }
        // build in browser, js - FileReader, help pars (convert) file from binary to readable 
        const fileReader = new FileReader();
        // fileReader don`t give promis, to execute =() => {}
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file])

    const pickedHandler = event => {
        //set variable pickedFile - if no exist - undefined
        let pickedFile;
        let fileIsValid = isValid;
        // support to upload exactly one file - user image or new place image
        if (event.target.files && event.target.files.length === 1) {
            // extract picked file from event 
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        // onInput props point at, in this props forward pickedFile and id
        // state isValid isn`t imediatlly updated, for this reason forward fileIsValid - set manually
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickRef.current.click();
    };

    return (
        <div className="form-control">
            <input
                id={props.id}
                ref={filePickRef}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`} >
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;