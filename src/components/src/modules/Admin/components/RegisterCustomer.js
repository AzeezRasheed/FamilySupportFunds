import React from 'react'
import RegisterCustomerStepOne from './RegisterCustomerStepOne';
import RegisterCustomerStepThree from './RegisterCustomerStepThree';
import RegisterCustomerStepTwo from './RegisterCustomerStepTwo';

const RegisterCustomer = ({ handleChange, setLoader, setOpen, setWarningModal, nextPage, previousPage, values, loader, step, onSubmit }) => {

  switch (step) {
    case 1:
      return (
        <RegisterCustomerStepOne
          handleChange={handleChange}
          values={values}
          nextPage={nextPage}
          onSubmit={onSubmit}
          setWarningModal={setWarningModal}
          setOpen={setOpen}
        />
      );
    case 2:
      return (
        <RegisterCustomerStepTwo
          handleChange={handleChange}
          values={values}
          previousPage={previousPage}
          nextPage={nextPage}
          onSubmit={onSubmit}
          setWarningModal={setWarningModal}
          setOpen={setOpen}
        />
      );
    case 3:
      return (
        <RegisterCustomerStepThree
          handleChange={handleChange}
          values={values}
          previousPage={previousPage}
          onSubmit={onSubmit}
          setWarningModal={setWarningModal}
          setOpen={setOpen}
          setLoader={setLoader}
          loader={loader}
        />
      );
    default:
  }
}

export default RegisterCustomer