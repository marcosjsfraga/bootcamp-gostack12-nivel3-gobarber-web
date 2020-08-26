import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
};

// const Button: React.FC<ButtonProps> = props => <Container type="button" {...props}></Container>;
const Button: React.FC<ButtonProps> = ({ children, loading, ...props }) => (
    <Container type="button" {...props}>
        {loading ? 'Executando...' : children}
    </Container>
);

export default Button;
