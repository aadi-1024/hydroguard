import React from 'react';
import styled from 'styled-components';
import DetailsBar from './detailsbar';
import InputSide from './inputside';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  background-color: whitesmoke;
  padding-bottom: 50px;
`;

const PageHeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

const FormContainer = styled.div`
  width: 70%;
  display : flex;
  background-color: #fff;
  padding: 5px;
  padding-left: 20vw;
  border-radius: 5px;
  height: 75vh;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const TextOne = styled.b`
  font-size: 30px;
  color: rgb(4, 4, 59);
  text-align: center;
`;

const TextTwo = styled.p`
  color: rgb(4, 4, 34);
  font-size: 15px;
  text-align: center;
`;

const FormPage = () => {
  return (
    <PageWrapper>
      <PageHeadingWrapper>
        <TextOne>Contact US</TextOne>
        <TextTwo>Any Question or remarks? Just write us a message</TextTwo>
      </PageHeadingWrapper>
      <FormContainer>
        <DetailsBar/>
        <InputSide/>
      </FormContainer>
    </PageWrapper>
  );
};

export default FormPage;
