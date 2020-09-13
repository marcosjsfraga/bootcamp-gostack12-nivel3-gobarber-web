import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback(
        async (data: ProfileFormData) => {
            try {
                // Clear errors
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório.'),
                    email: Yup.string().required('E-mail obrigatório.').email('Informe um e-mail válido.'),
                    old_password: Yup.string(),
                    password: Yup.string().when('old_password', {
                        is: val => !!val.length,
                        then: Yup.string().required('Campo obrigatório'),
                        otherwise: Yup.string(),
                    }),
                    password_confirmation: Yup.string()
                        .when('old_password', {
                            is: val => !!val.length,
                            then: Yup.string().required('Campo obrigatório'),
                            otherwise: Yup.string(),
                        })
                        .oneOf([Yup.ref('password'), ''], 'A senha não confere'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const { name, email, old_password, password, password_confirmation } = data;

                const formData = Object.assign(
                    {
                        name,
                        email,
                    },
                    old_password
                        ? {
                              old_password,
                              password,
                              password_confirmation,
                          }
                        : {},
                );

                const response = await api.put('/profile', formData);

                updateUser(response.data);

                history.push('/dashboard');

                addToast({
                    type: 'success',
                    title: 'Perfil atualizado!',
                    description: 'Seu perfil foi atualizado!',
                });
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);
                    formRef.current?.setErrors(errors);
                    return;
                }

                // Send a toast
                addToast({
                    type: 'error',
                    title: 'Problema na atualização',
                    description: 'Problema ao altualizar o seu perfil.',
                });
            }
        },
        [addToast, history, updateUser],
    );

    const handleAvatarChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const data = new FormData();

                data.append('avatar', e.target.files[0]);

                api.patch('/users/avatar', data).then(response => {
                    updateUser(response.data);

                    addToast({
                        type: 'success',
                        title: 'Avatar atualizado',
                    });
                });
            }
        },
        [addToast, updateUser],
    );

    return (
        <Container>
            <header>
                <div>
                    <Link to="/dashboard">
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>

            <Content>
                <Form
                    ref={formRef}
                    initialData={{
                        name: user.name,
                        email: user.email,
                    }}
                    onSubmit={handleSubmit}
                >
                    <AvatarInput>
                        <img src={user.avatar_url} alt={user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />
                            <input type="file" id="avatar" onChange={handleAvatarChange} />
                        </label>
                    </AvatarInput>

                    <h1>Meu perfil</h1>

                    <Input name="name" icon={FiUser} placeholder="Nome" type="text" />
                    <Input name="email" icon={FiMail} placeholder="E-mail" type="text" />

                    <Input
                        name="old_password"
                        icon={FiLock}
                        placeholder="Senha Atual "
                        type="password"
                        containerStyle={{ marginTop: 24 }}
                    />
                    <Input name="password" icon={FiLock} placeholder="Nova Senha " type="password" />
                    <Input name="password_confirmation" icon={FiLock} placeholder="Confirmar Senha " type="password" />

                    <Button type="submit">Confirmar</Button>
                </Form>
            </Content>
        </Container>
    );
};

export default Profile;
