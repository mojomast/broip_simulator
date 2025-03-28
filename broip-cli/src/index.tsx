#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import MainMenu from './components/MainMenu';
import { UserProvider } from './utils/UserContext';

render(
    <UserProvider>
        <MainMenu />
    </UserProvider>
);
