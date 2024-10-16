import { userInfoHandler, userInfoV2Handler } from './handlers/userInfoHandler';
import { pamHandlers } from './handlers/pamHandler';
import { varslingStatusHandler } from './handlers/varslingStatusHandler';
import { altinnTilgangHandler } from './handlers/altinnTilgangHandler';
import { eregHandlers } from './handlers/eregHandler';
import { arbeidsforholdHandler } from './handlers/arbeidsforholdHandler';
import { tiltaksgjennomforingHandler } from './handlers/tiltaksgjennomforingHandler';
import { sykefraværHandler } from './handlers/sykefraværHandler';
import { presenterteKandidaterHandler } from './handlers/presenterteKandidaterHandler';
import { storageHandlers } from './handlers/storageHandler';
import { kontaktinfoHandler } from './handlers/kontaktinfoHandler';
import { kontonummerStatusHandler } from './handlers/kontonummerStatusHandler';
import { brukerApiHandlers } from './handlers/brukerApiHandler';

export const handlers = [
    userInfoHandler,
    userInfoV2Handler,

    ...pamHandlers,

    varslingStatusHandler,

    altinnTilgangHandler,

    ...eregHandlers,

    arbeidsforholdHandler,

    tiltaksgjennomforingHandler,

    sykefraværHandler,

    presenterteKandidaterHandler,

    ...storageHandlers,

    kontaktinfoHandler,

    kontonummerStatusHandler,

    ...brukerApiHandlers,
];
