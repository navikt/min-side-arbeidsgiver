import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { LoggInn } from './LoggInn/LoggInn';
import Spinner from './Spinner';
import { Innlogget, LoginContext } from './LoginProvider';

const LoginBoundary: FunctionComponent = props => {
    const {innlogget} = useContext(LoginContext)

    return (
        <>
            {innlogget === Innlogget.INNLOGGET ? (
                props.children
            ) : innlogget === Innlogget.IKKE_INNLOGGET ? (
                <LoggInn />
            ) : (
                <Spinner />
            )}
        </>
    );
};

export default LoginBoundary;
