import React from 'react';

import GlobalStyle from './styles/global';
import ToastContainer from './components/ToastContainer';

import AppProvider from './hooks';

import SignIn from '../src/pages/SignIn';
import SignUp from '../src/pages/SignUp';

const App: React.FC = () => (
    <>
        <AppProvider>
            <SignIn />
        </AppProvider>

        <GlobalStyle />
    </>
);
export default App;
