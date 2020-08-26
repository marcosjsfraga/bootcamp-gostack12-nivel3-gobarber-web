import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    NextAppointment,
    Section,
    Appointment,
    Calendar,
} from './styles';

import logImg from '../../assests/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
    day: number;
    available: boolean;
}

const Dashboard: React.FC = () => {
    const { user, signOut } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available) {
            setSelectedDate(day);
        }
    }, []);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            },
        }).then(response => {
            setMonthAvailability(response.data);
        });
    }, [currentMonth, user.id]);

    const disabledDays = useMemo(() => {
        const dates = monthAvailability
            .filter(monthDay => monthDay.available === false)
            .map(monthDay => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();

                return new Date(year, month, monthDay.day);
            });

        return dates;
    }, [currentMonth, monthAvailability]);

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

                    <Section>
                        <strong>Manhã</strong>
                        <Appointment>
                            <span>
                                <FiClock />
                                08:00
                            </span>
                            <div>
                                <img
                                    src="https://avatars3.githubusercontent.com/u/6868383?s=460&u=cba9f842779e163faa6735ae8281116a2aeeb3eb&v=4"
                                    alt="Marcos"
                                />
                                <strong>Marcos Fraga</strong>
                            </div>
                        </Appointment>
                    </Section>

                    <Section>
                        <strong>Tarde</strong>
                    </Section>
                </Schedule>

                <Calendar>
                    <DayPicker
                        weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                        // fromMonth={new Date()} // Don't allow access to previous months
                        disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5] },
                        }}
                        onDayClick={handleDateChange}
                        onMonthChange={handleMonthChange}
                        selectedDays={selectedDate}
                        months={[
                            'Janeiro',
                            'Feveiro',
                            'Março',
                            'Abril',
                            'Maio',
                            'Junho',
                            'Julho',
                            'Agosto',
                            'Setembro',
                            'Outubro',
                            'Novembro',
                            'Dezembro',
                        ]}
                    />
                </Calendar>
            </Content>
        </Container>
    );
};

export default Dashboard;
