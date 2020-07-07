import React from 'react';

import GlobalStyle from './styles/global';

import { AuthProvider } from './hooks/AuthContext';

import SignIn from '../src/pages/SignIn';
import SignUp from '../src/pages/SignUp';

const App: React.FC = () => (
    <>
        <AuthProvider>
            <SignIn />
        </AuthProvider>
        <GlobalStyle />
    </>
);
export default App;
