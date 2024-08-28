import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useSelector, useDispatch} from 'react-redux';
import { selectIsAuth, fetchRegister } from '../../redax/slices/auth';
import { useForm } from 'react-hook-form';
import styles from './Login.module.scss';
import { Navigate } from 'react-router-dom';

export const Registration = () => {
    const isAuth = useSelector(selectIsAuth)
    const dispatch =useDispatch()
    const { register, handleSubmit, setError, formState: {errors, isValid} } = useForm({
      defaultValues: {
        fullname: 'admin',
        email: '@mail.com',
        password: '11111'
      },
      mode: 'onChange'
    })

    const onSubmit = async (values) => {
      const data = await dispatch(fetchRegister(values));
    
      if (!data.payload) {
        return alert('Не вдалось зареєструватися.');
      }
    
      if ('token' in data.payload) {
        window.localStorage.setItem('token', data.payload.token);
      } else {
        const errorMessage = data.payload.error || 'Произошла неизвестная ошибка';
        alert(`Не вдалось зареєструватися. Причина: ${errorMessage}`);
      }
    };
    
  
    if (isAuth) {
      return <Navigate to='/'/>
    }

  return (
    <Paper classes={{ root: styles.root }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Створити профіль
        </Typography>
        <div className={styles.avatar}>
          <Avatar sx={{ width: 100, height: 100 }} />
        </div>
        <TextField  
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          type='fullName'
          {...register('fullName', {required: "Вкажіть і'мя"})}
          className={styles.field} label="Ім’я" fullWidth />
        <TextField 
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        type='email'
        {...register('email', {required: 'Вкажіть пошту'})}
        className={styles.field} label="E-Mail" fullWidth />
        <TextField  
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type='password'
          {...register('password', {required: 'Вкажіть пошту'})}
          className={styles.field} label="Пароль" fullWidth />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зареєструватися
        </Button>
      </form>
    </Paper>
  );
};  