import * as path from 'path';
export const VENDOR_KEY = 'verdor';
export const IMAP_SERVER_KEY = 'imap_server';
export const IMAP_PORT_KEY = 'imap_port';
export const SMTP_SERVER_KEY = 'smtp_server';
export const SMTP_PORT_KEY = 'smtp_port';
export const MAIL_KEY = 'mail';

export const DISPLAY_KEY = "display";
export const USER_KEY = 'user';
export const PASS_KEY = 'pass';
export const TOKEN_KEY = 'token';

export const V_126 = "126";
export const V_GMAIL = "gmail";
export const V_OTHER = "other";
export const V_SINA = "sina";
export const V_QQ = "QQ exmail";

export const iconsMap: any = {
    [V_126]: {
        light: path.join(__filename, '..', '..', 'images', 'light', 'mail.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'dark', 'mail.svg')
    },
    [V_GMAIL]: {
        light: path.join(__filename, '..', '..', 'images', 'light', 'mail.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'dark', 'mail.svg')
    },
    [V_SINA]: {
        light: path.join(__filename, '..', '..', 'images', 'light', 'mail.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'dark', 'mail.svg')
    }
}