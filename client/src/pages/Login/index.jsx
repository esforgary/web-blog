import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from 'react-hook-form';
import styles from "./Login.module.scss";
import { NavLink, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {fetchAuth, selectIsAuth } from "../../redax/slices/auth";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch =useDispatch()
  const { register, handleSubmit, formState: {errors, isValid} } = useForm({
    defaultValues: {
      email: '@mail.com',
      password: '1111'
    },
    mode: 'onChange'
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values))

    if (!data.payload) {
      return alert('Не вдалось авторизуватися.');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    } else {
      alert('Не вдалось авторизуватися.');
    }
  }

  if (isAuth) {
    return <Navigate to='/'/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вхід в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', {required: 'Вкажіть пошту'})}
          fullWidth
        />
        <TextField className={styles.field} 
          label="Пароль" 
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', {required: 'Вкажіть пароль'})}
          fullWidth 
        />
        <Button disabled={!isValid} size="large" type="submit" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};