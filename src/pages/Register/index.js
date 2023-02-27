import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useNavigate } from 'react-router-dom';
import { get } from 'lodash';
import { FaOpencart } from 'react-icons/fa';
import axios from '../../services/axios';
import { Form } from './styled';
import { manageToastNotification } from '../../utils/toast';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const usernameIsValid = () => !(username.length < 3 || username.length > 255);

  const passwordIsValid = () => password.length > 8;

  const passwordIsEqual = () => password === confirmPassword;

  const inputHandleFocus = (e) => {
    const inputParent = e.target.parentElement;

    inputParent.classList.toggle('focus');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = false;

    if (!usernameIsValid()) {
      manageToastNotification('register-username-error', toast.TYPE.ERROR);
      toast.error('Username must have at least 3 characters', {
        toastId: 'register-username-error',
      });
      formErrors = true;
    }

    if (!isEmail(email)) {
      manageToastNotification('register-email-error', toast.TYPE.ERROR);

      toast.error('Email is invalid. Please enter a valid email address', {
        toastId: 'register-email-error',
      });
      formErrors = true;
    }

    if (!passwordIsValid()) {
      manageToastNotification('register-password-error', toast.TYPE.ERROR);

      toast.error('Password must have at least 8 characters', {
        toastId: 'register-password-error',
      });
      formErrors = true;
    }

    if (!passwordIsEqual()) {
      manageToastNotification(
        'register-password-confirmation-error',
        toast.TYPE.ERROR
      );

      toast.error('Password don`t match', {
        toastId: 'register-password-confirmation-error',
      });
      formErrors = true;
    }

    if (!formErrors) {
      const user = {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
      };

      try {
        await axios.post('users/', { ...user });

        manageToastNotification('register-user-success', toast.TYPE.SUCCESS);

        toast.success('You were registered successfully', {
          toastId: 'register-user-success',
        });
        navigate('/login');
      } catch (error) {
        const status = get(error, 'response.status');
        const errors = [get(error, 'response.data')];

        if (status === 400) {
          errors.forEach((err) => {
            Object.keys(err).map((key) => {
              manageToastNotification('register-user-error', toast.TYPE.ERROR);
              return toast.error(`${key}: ${err[key]}`, {
                toastId: 'register-user-error',
              });
            });
          });
        }
      }
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="register-form"
      action="#"
      method="POST"
    >
      <div className="form-header">
        <h2 translate="no">
          E-commerce
          <span className="cart-icon">
            <FaOpencart size={34} />
          </span>
        </h2>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="first name">
          <span className="label-container">First name</span>
          <input
            type="text"
            name="first name"
            id="first name"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onFocus={inputHandleFocus}
            onBlur={inputHandleFocus}
          />
        </label>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="last name">
          <span className="label-container">Last name</span>
          <input
            type="text"
            name="last name"
            id="last name"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onFocus={inputHandleFocus}
            onBlur={inputHandleFocus}
          />
        </label>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="username">
          <span className="label-container">Username</span>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="jonhdoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={inputHandleFocus}
            onBlur={inputHandleFocus}
          />
        </label>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="email">
          <span className="label-container">E-mail</span>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={inputHandleFocus}
            onBlur={inputHandleFocus}
          />
        </label>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="password">
          <span className="label-container">Password</span>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={inputHandleFocus}
            onBlur={inputHandleFocus}
          />
        </label>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="password-confirmation">
          <span className="label-container">C.Password</span>
          <input
            type="password"
            name="password-confirmation"
            id="password-confirmation"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={inputHandleFocus}
            onBlur={inputHandleFocus}
          />
        </label>
      </div>
      <button type="submit">Sign up</button>
    </Form>
  );
}
