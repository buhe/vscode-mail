import { DISPLAY_KEY } from "../strategy";
import ImapFace from "./imap";
import SmtpFace from "./smtp";

export let smtpPools = new Map<string, SmtpFace>();
export let imapPools = new Map<string, ImapFace>();

export function getSmtpInstance(display: string): SmtpFace {
    if (smtpPools.has(display)) {
        return smtpPools.get(display)!;
    } else {
        throw new Error('not has ' + display);
    }
}

export async function createSmtpInstance(config: any) {
    let smtpFace = new SmtpFace(config);
    await smtpFace.init();
    smtpPools.set(config[DISPLAY_KEY], smtpFace);
    return smtpFace;
}

export function getImapInstance(display: string): ImapFace {
    if (imapPools.has(display)) {
        return imapPools.get(display)!;
    } else {
        throw new Error('not has ' + display);
    }
}

export async function createImapInstance(config: any) {
    let imapFace = new ImapFace();
    await imapFace.init(config);
    imapPools.set(config[DISPLAY_KEY], imapFace);
    return imapFace;
}