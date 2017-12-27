import React, { Component } from 'react';
import { Form, Layout } from 'antd';
import SignInForm from './SignInForm';
import './style.css';


const { Content } = Layout;

const WrappedSignInForm = Form.create()(SignInForm);

class SignInPage extends Component {
  render() {
    return (
      <div className="SignInPage">
        <Layout>
          <Content>
            <WrappedSignInForm />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default SignInPage;
