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

export const iconsMap: any = {
    [V_126]: {
        light: path.join(__filename, '..', '..', 'images', 'light', '126.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'dark', '126.svg')
    },
    [V_GMAIL]: {
        light: path.join(__filename, '..', '..', 'images', 'light', 'gmail.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'dark', 'gmail.svg')
    },
    [V_SINA]: {
        light: path.join(__filename, '..', '..', 'images', 'light', 'sina.svg'),
        dark: path.join(__filename, '..', '..', 'images', 'dark', 'sina.svg')
    }
}