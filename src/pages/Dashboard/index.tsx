import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, parseISO, format, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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

interface Appointment {
    id: string;
    date: string;
    hourFormatted: string;
    user: {
        name: string;
        avatar_url: string;
    };
}

// PAREI: 01:46 --> https://app.rocketseat.com.br/node/nivel-05/group/dashboard/lesson/agendamentos-da-api-2

const Dashboard: React.FC = () => {
    const { user, signOut } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

    const [appointments, setAppointments] = useState<Appointment[]>([]);

    /*
     * Set selected date
     */
    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available && !modifiers.disabled) {
            setSelectedDate(day);
        }
    }, []);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    /*
     * Get month availability
     */
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

    /*
     * Get appointments
     */
    useEffect(() => {
        api.get<Appointment[]>(`/appointments/me`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            },
        }).then(response => {
            const appointmentFormatted = response.data.map(appointment => {
                return {
                    ...appointment,
                    hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
                };
            });

            setAppointments(appointmentFormatted);
        });
    }, [selectedDate]);

    /*
     * Get disabled days
     */
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

    const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR });
    }, [selectedDate]);

    const selectedWeekDay = useMemo(() => {
        return format(selectedDate, 'cccc', { locale: ptBR });
    }, [selectedDate]);

    const morningAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() < 12;
        });
    }, [appointments]);

    const afternoonAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() >= 12;
        });
    }, [appointments]);

    const nextAppointment = useMemo(() => {
        return appointments.find(appointment => isAfter(parseISO(appointment.date), new Date()));
    }, [appointments]);

    /*
     * View
     */
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
                        {}
                        {isToday(selectedDate) && <span>Hoje</span>}
                        <span>{selectedDateAsText}</span>
                        <span>{selectedWeekDay}</span>
                    </p>

                    {isToday(selectedDate) && nextAppointment && (
                        <NextAppointment key={nextAppointment.id}>
                            <strong>Agendamento a seguir</strong>
                            <div>
                                <img src={nextAppointment.user.avatar_url} alt={nextAppointment.user.name} />

                                <strong>{nextAppointment.user.name}</strong>
                                <span>
                                    <FiClock />
                                    {nextAppointment.hourFormatted}
                                </span>
                            </div>
                        </NextAppointment>
                    )}

                    <Section>
                        <strong>Manhã</strong>

                        {morningAppointments.length === 0 && <p>Não agendamento neste perído</p>}

                        {morningAppointments.map(appointment => (
                            <Appointment key={appointment.id}>
                                <span>
                                    <FiClock />
                                    {appointment.hourFormatted}
                                </span>
                                <div>
                                    <img src={appointment.user.avatar_url} alt={appointment.user.name} />
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>

                    <Section>
                        <strong>Tarde</strong>

                        {afternoonAppointments.length === 0 && <p>Não agendamento neste perído</p>}

                        {afternoonAppointments.map(appointment => (
                            <Appointment key={appointment.id}>
                                <span>
                                    <FiClock />
                                    {appointment.hourFormatted}
                                </span>
                                <div>
                                    <img src={appointment.user.avatar_url} alt={appointment.user.name} />
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
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
