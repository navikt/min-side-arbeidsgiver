import NAVChatBot from '@navikt/nav-chatbot';
import React, { useEffect, useState } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { openChatbot, setCallbackOnChatbotOpen } from './chatbotUtils';
import './FridaChatbot.less';

interface Chatbotconfig {
    queueKey: string;
    customerKey: string;
    configId: string;
    evaluationMessage?: string;
}

const chatbotconfig: Chatbotconfig = {
    customerKey: '41155',
    queueKey: 'Q_CHAT_BOT',
    configId: '599f9e7c-7f6b-4569-81a1-27202c419953',
    evaluationMessage: '',
};

export const FridaChatbot = () => {
    const isOpenFromStorage = sessionStorage.getItem('chatbot-frida_apen');
    const [chatbotOpened, setChatbotOpened] = useState(isOpenFromStorage === 'true');

    useEffect(() => {
        if (!chatbotOpened) {
            setCallbackOnChatbotOpen(() => setChatbotOpened(true));
        }
    }, [chatbotOpened]);

    return (
        <div
            className="chatbot-wrapper"
            onClick={() => openChatbot(setChatbotOpened)}
            onKeyPress={(e) => {if (e.keyCode === 13) openChatbot(setChatbotOpened)}}
            role="button"
            tabIndex={0}
        >
            <div
                className={`chatbot-wrapper__visual ${
                    chatbotOpened ? `chatbot-wrapper__visual--open` : ''
                }`}
            >
                <Normaltekst className="chatbot-wrapper__text">Chatbot Frida</Normaltekst>
            </div>
            <NAVChatBot {...chatbotconfig} />
        </div>
    );
};
