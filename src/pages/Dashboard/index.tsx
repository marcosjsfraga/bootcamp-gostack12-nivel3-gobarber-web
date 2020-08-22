import React from 'react';
import { Container, Header, HeaderContent, Profile, Content, Schedule, NextAppointment, Calendar } from './styles';

import logImg from '../../assests/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
    const { signOut, user } = useAuth();

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logImg} alt="Logo" />
                    <Profile>
                        <img src={user.avatar_url} alt={user.name} />
                        <div>
                            <span>Bem-vindo</span>
                            <strong>{user.name}</strong>
                        </div>
                    </Profile>
                    <button type="button" onClick={signOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Horários Agendados</h1>
                    <p>
                        <span>Hoje</span>
                        <span>Dia 22</span>
                        <span>Sábado</span>
                    </p>

                    <NextAppointment>
                        <strong>Atendimento a seguir</strong>
                        <div>
                            <img
                                src="https://avatars3.githubusercontent.com/u/6868383?s=460&u=cba9f842779e163faa6735ae8281116a2aeeb3eb&v=4"
                                alt="Marcos"
                            />

                            <strong>Marcos Fraga</strong>
                            <span>
                                <FiClock />
                                08:30
                            </span>
                        </div>
                    </NextAppointment>
                </Schedule>

                <Calendar />
            </Content>
        </Container>
    );
};

export default Dashboard;
