import React, { useState } from 'react';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from '../../utils/constants';
import { useUser } from '../../lib/customHooks';
import { storeInLocalStorage } from '../../lib/common';
import { ReactComponent as Logo } from '../../images/Logo.svg';
import styles from './SignIn.module.css';

function SignIn({ setUser }) {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  if (user || authenticated) {
    navigate(APP_ROUTES.DASHBOARD);
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, message: '' });

  const signIn = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: 'post',
        url: API_ROUTES.SIGN_IN,
        data: {
          email,
          password,
        },
      });
      if (!response?.data?.token) {
        setNotification({ error: true, message: 'Une erreur est survenue' });
        console.log('Something went wrong during signing in: ', response);
      } else {
        storeInLocalStorage(response.data.token, response.data.userId);
        setUser(response.data);
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      setNotification({ error: true, message: err.message });
      console.log('Some error occured during signing in: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: 'POST',
        url: API_ROUTES.SIGN_UP,
        data: {
          email,
          password,
        },
      });
      if (!response?.data) {
        console.log('Something went wrong during signing up: ', response);
        setNotification({ error: true, message: 'Une erreur est survenue lors de la création de votre compte' });
        return;
      }
      setNotification({ error: false, message: 'Votre compte a bien été créé, vous pouvez vous connecter' });
    } catch (err) {
      setNotification({ error: true, message: err.message });
      console.log('Some error occured during signing up: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const errorClass = notification.error ? styles.Error : null;

  return (
    <div className={`${styles.SignIn} container`}>
      <Logo />
      <div className={`${styles.Notification} ${errorClass}`}>
        {notification.message.length > 0 && <p>{notification.message}</p>}
      </div>
      <div className={styles.Form}>
        <label htmlFor="email">
          <p>Adresse email</p>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); }}
          />
        </label>
        <label htmlFor="password">
          <p>Mot de passe</p>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); }}
          />
        </label>
        <div className={styles.Submit}>
          <button
            type="submit"
            onClick={signIn}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Se connecter'}
          </button>
          <span>OU</span>
          <button
            type="button"
            onClick={signUp}
          >
            {isLoading ? 'Loading...' : "S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}

SignIn.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default SignIn;
