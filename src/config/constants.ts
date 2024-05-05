import { Tokens } from '../interfaces/Tokens.interface';

export const PG_CONNECTION = 'PG_CONNECTION';
export const JWT_TOKEN_EXAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
export const TOKEN_OBJECT_EXAMPLE: Tokens = {
  accessToken: JWT_TOKEN_EXAMPLE,
  refreshToken: JWT_TOKEN_EXAMPLE,
};

export const UUID_V7_EXAMPLE = '0189204a-8726-7c74-8030-09836154b805';
export const DATE_EXAMPLE = '2023-03-14T10:54:26.561Z';

export const MILLISECONDS = {
  millisecond: 1,
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
  year: 1000 * 60 * 60 * 24 * 365,
};

/**
 * AUTH MESSAGES
 */

// export const NOT_AUTHORIZED = 'You are not authorized';
// export const NOT_AUTHORIZED_OR_BAD_TOKEN = 'You are not authorized or bad token';
// export const FORBIDDEN = 'You have no rigths for this';
// export const ERROR_CREATING_SESSION = 'Session was not created';
// export const ERROR_SAVING_FILE = 'Error occured during saving the file';

// export const REFRESH_NOT_FOUND = 'Refersh token not found';
// export const REFRESH_NOT_FOUND_OR_MALFORMED = 'Refersh token not found or malformed';

// export const BAD_REFRESH_TOKEN = 'Refresh token in invalid';

// export const COOKIES_NOT_SET = 'Cookies not found';

// export const WRONG_PASSWORD = "Wrong password"

// export const WRONG_EMAIL = 'Wrong email';

// export const WRONG_EMAIL_CODE = 'Wrong code from email';
// export const EMAIL_EXISTS = 'User with this email already exists';

// export const EMAIL_CODE_SENT = "Code was sent to your email"

// export const NO_EMAIL_CODE = 'You need to ask for email at first';

const byte = 1024;

export const FILE_SIZE = {
  Bytes: Math.pow(byte, 1),
  KB: Math.pow(byte, 2),
  MB: Math.pow(byte, 3),
  GB: Math.pow(byte, 4),
  TB: Math.pow(byte, 5),
};


/**
 * RUSSIAN AUTH MESSAGES
 */

export const NOT_AUTHORIZED = 'Вы не авторизованы';
export const NOT_AUTHORIZED_OR_BAD_TOKEN = 'Неверный токен авторизации';
export const FORBIDDEN = 'Вы вас нет прав для выполнения этого действия';
export const ERROR_CREATING_SESSION = 'Сессия не была создана';
export const ERROR_SAVING_FILE = 'Ошибка во время сохранения файла';

export const REFRESH_NOT_FOUND = 'Заголовок с токеном не найден';
export const REFRESH_MALFORMED = 'Запись для данного токена не найдена';

export const BAD_REFRESH_TOKEN = 'Токен недействителен';

export const COOKIES_NOT_SET = 'Необходимые заголовки не найдены';

export const WRONG_EMAIL_OR_PASSWORD = 'Неверный почтовый адрес или пароль';

export const WRONG_EMAIL_CODE = 'Неверный код с почты';

export const EMAIL_EXISTS = 'Пользователь с такой почтой уже существует';

export const IP_EXISTS = 'У вас уже есть аккаунт';

export const EMAIL_CODE_SENT = 'Проверочный код был отправлен вам на почту';

export const NO_EMAIL_CODE = 'Сначала вы должны запросить письмо';

export const BAD_RATE = 'Недопустимо для вашего тарифа';

export const TOO_LARGE_FILE = 'Слишком большой файл';

export const SUBSCRIPTION_EXISTS = 'У вас уже есть подписка';

/**
 * OTHER MESSAGES
 */

export const PRESENTATION_UNARCHIVED = 'Презентация ещё не в архиве';

export const CHAT_AMOUNT_LIMIT = 'Превышен лимит количества чатов ассистента';
