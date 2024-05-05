// export const emailConfirmation = (email: string, code: string) =>
//   `<p>Hey  ${email},</p><p>Here is your email confirmation code<div style="background-color:#ddd;color:#000;padding:3rem;border-radius:.5rem;font-size:3rem;text-align:center;font-weight:700">${code}</div></p><p>If you did not request this email you can safely ignore it.</p>`;

// export const forgotPassword = (link: string) =>
//   `<p>Greetings!</p><p>here is your link to change the password</p><p><a style="font-size:1.5rem" href="${link}">Yes, change the password</a></p><p>If you didn't request password restoration, just ignore this message</p>`;

export const emailConfirmation = (email: string, code: string) =>
  `<p>Здравствуйте  ${email}!</p><p>Ваш код подтверждения<div style="background-color:#ddd;color:#000;padding:3rem;border-radius:.5rem;font-size:3rem;text-align:center;font-weight:700">${code}</div></p><p>Если вы не запрашивали данное письмо, просто игнорируйте его.</p>`;

export const forgotPassword = (link: string) =>
  `<p>Приветствуем!</p><p>Нажмите на ссылку ниже если хотите восстановить пароль</p><p><a style="font-size:1.5rem" href="${link}">Да, я хочу изменить пароль</a></p><p>Если вы не запрашивали данное письмо, просто игнорируйте его.</p>`;
