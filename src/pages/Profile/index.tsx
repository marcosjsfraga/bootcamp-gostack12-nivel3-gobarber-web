import React, { useCallback, useRef } from 'react';
import { FiMail, FiUser, FiLock, FiCamera } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
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
    password: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const { user } = useAuth();

    const handleSubmit = useCallback(
        async (data: ProfileFormData) => {
            try {
                // Clear errors
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório.'),
                    email: Yup.string().required('E-mail obrigatório.').email('Informe um e-mail válido.'),
                    password: Yup.string().min(6, 'No mínimo 6 dígitos.'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post('/users', data);

                history.push('/');

                addToast({
                    type: 'success',
                    title: 'SignUp',
                    description: 'Você já pode fazer sei login',
                });
            } catch (error) {
                // const errors = getValidationErrors(error);
                // formRef.current?.setErrors(errors);
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);
                    formRef.current?.setErrors(errors);
                    return;
                }

                // Send a toast
                addToast({
                    type: 'error',
                    title: 'Problema na autenticação',
                    description: 'Problema ao fazer login, verifique as credenciais.',
                });
            }
        },
        [addToast, history],
    );

    return (
        <Container>
            <Content>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <AvatarInput>
                        <img src={user.avatar_url} alt={user.name} />
                        <button type="button">
                            <FiCamera />
                        </button>
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

                    <Button type="submit">Confirmar mudanças</Button>
                </Form>
            </Content>
        </Container>
    );
};

export default Profile;
