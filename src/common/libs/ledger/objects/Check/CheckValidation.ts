import Check from './CheckClass';

/* Validator ==================================================================== */
const CheckValidation = (object: Check): Promise<void> => {
    return new Promise((resolve, reject) => {
        reject(new Error(`Object type ${object.Type} does not container validation!`));
    });
};

/* Export ==================================================================== */
export default CheckValidation;
