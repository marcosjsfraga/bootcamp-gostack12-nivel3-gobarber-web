import styled from 'styled-components';

export const Container = styled.div`
    /* height: 100vh; */
    /* display: flex; */
    /* align-items: stretch; */
`;

export const Header = styled.header`
    padding: 32px 0;
    background: #28263e;
`;

export const HeaderContent = styled.div`
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    /* Stylize 1º image */
    > img {
        height: 80px;
    }

    button {
        margin-left: auto;
        background: transparent;
        border: 0;

        svg {
            color: #999591;
            width: 20px;
            height: 20px;
        }
    }
`;

export const Profile = styled.div`
    display: flex;
    align-items: center;
    margin-left: 80px;

    img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
    }

    div {
        display: flex;
        flex-direction: column;
        margin-left: 16px;
        line-height: 24px;
    }

    span {
        color: #f4ede8;
    }

    strong {
        color: #ff9000;
    }
`;

export const Content = styled.main`
    max-width: 1120px;
    margin: 64px;
    display: flex;
`;

export const Schedule = styled.div`
    flex: 1;
    margin-right: 120px;

    h1 {
        font-size: 36px;
    }

    p {
        margin-top: 8px;
        color: #ff9000;

        /* Applies only from the second SPAN onwards  */
        span + span {
            margin-left: 8px;
            padding-left: 8px;
            border-left: 1px solid #ff9000;
        }
    }
`;

export const Calendar = styled.aside`
    width: 380px;
`;

export const NextAppointment = styled.div`
    margin-top: 64px;

    > strong {
        color: #999591;
        font-size: 20px;
        font-weight: 400;
    }

    div {
        background: #3e3d47;
        display: flex;
        align-items: center;
        padding: 16px 24px;
        border-radius: 10px;
        margin-top: 24px;
        position: relative;

        &::before {
            position: absolute;
            height: 80%;
            width: 1px;
            left: 0;
            top: 10%;
            content: '';
            background: #ff9000;
        }

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }

        strong {
            margin-left: 24px;
            color: #fff;
        }

        span {
            margin-left: auto;
            display: flex;
            align-items: center;
            color: #999591;

            svg {
                color: #ff9000;
                margin-right: 8px;
            }
        }
    }
`;
