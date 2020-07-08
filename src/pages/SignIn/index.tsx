import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assests/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

interface SigInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { sigIn } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: SigInFormData) => {
            try {
                // Clear errors
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    email: Yup.string().required('E-mail obrigatório.').email('Informe um e-mail válido.'),
                    password: Yup.string().required('Senha obrigatória.'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await sigIn({
                    email: data.email,
                    password: data.password,
                });
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);
                    formRef.current?.setErrors(errors);
                }

                // Send a toast
                addToast();
            }
        },
        [sigIn, addToast],
    );

    return (
        <Container>
            <Content>
                <img src={logoImg} alt="GoBarber" />

                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Faça seu login.</h1>
                    <Input name="email" icon={FiMail} placeholder="E-mail" type="text" />
                    <Input name="password" icon={FiLock} placeholder="Senha " type="password" />
                    <Button type="submit">Entrar</Button>
                    <a href="#">Esqueci minha senha</a>
                </Form>

                <a href="#">
                    <FiLogIn />
                    Criar conta
                </a>
            </Content>
            <Background />
        </Container>
    );
};

export default SignIn;
