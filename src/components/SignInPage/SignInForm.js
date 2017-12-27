import React, { Component } from 'react';
import { Form, Input, Icon, Checkbox, Button } from 'antd';
import { Link, Redirect } from 'react-router-dom';

const FormItem = Form.Item;

class SignInForm extends Component {
  state = {
    redirect: false,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        fetch('/apis/signin', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        }).then(res => res.json()).then(json => {
          const result = json.info;
          if (result === 'success') {
            this.setState({ redirect: true });
          }
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    if (this.state.redirect) {
      return <Redirect push to="/main" />;
    }
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ type: 'email', message: 'Not a valid email address.' },
              { required: true, message: 'Please input your email address!' }],
          })(
            <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="Email address" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <Button type="primary" htmlType="submit" className="login-form-button">
            Sign in
          </Button>
          Or <Link to="/signup">sign up now!</Link>
        </FormItem>
      </Form>
    );
  }
}

export default SignInForm;
