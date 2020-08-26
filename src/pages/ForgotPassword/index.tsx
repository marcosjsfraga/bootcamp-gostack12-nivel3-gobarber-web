import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assests/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
    email: string;
    password: string;
}

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: ForgotPasswordFormData) => {
            try {
                setLoading(true);

                // Clear errors
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    email: Yup.string().required('E-mail obrigatório.').email('Informe um e-mail válido.'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                // Recuperação de senha
                await api.post('/password/forgot', {
                    email: data.email,
                });

                // Send a toast
                addToast({
                    type: 'success',
                    title: 'Email de recuperação enviado',
                    description:
                        'Enviamos um e-mail para confirmar a recuperação de senha, verifique sua caixa de entrada',
                });

                // history.push('/dashboard');
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);
                    formRef.current?.setErrors(errors);
                    return;
                }

                // Send a toast
                addToast({
                    type: 'error',
                    title: 'Problema na recuperação de senha',
                    description: 'Problema ao tentar realizar a recuperação de senha',
                });
            } finally {
                setLoading(false);
            }
        },
        [addToast],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recuperar senha</h1>

                        <Input name="email" icon={FiMail} placeholder="E-mail" type="text" />

                        <Button loading={loading} type="submit">
                            Recuperar
                        </Button>
                    </Form>

                    <Link to="/">
                        <FiLogIn />
                        Voltar ao login
                    </Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export default ForgotPassword;
