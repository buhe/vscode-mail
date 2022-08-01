import SmtpFace from "./smtp";

export let smtpPools = new Map<string, SmtpFace>();

export function getSmtpInstance(): SmtpFace {
    return new SmtpFace();
}
