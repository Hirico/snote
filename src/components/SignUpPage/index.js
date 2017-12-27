import React, { Component } from 'react';
import { Form, Layout } from 'antd';
import SignUpForm from './SignUpForm';
import './style.css';


const { Content } = Layout;

const WrappedSignUpForm = Form.create()(SignUpForm);

class SignUpPage extends Component {
  render() {
    return (
      <div className="SignUpPage">
        <Layout>
          <Content>
            <WrappedSignUpForm />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default SignUpPage;
