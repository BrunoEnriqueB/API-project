

import { Response, Request } from 'express';
import nodemailer, { Transport } from 'nodemailer';
import stmp from '../config/smpt';

interface User {
  name: string,
  id: string,
  email: string,
  phone: string,
  password: string
}


const transporter = nodemailer.createTransport({
  host: stmp.host,
  port: stmp.port,
  secure: false,
  auth: {
    user: stmp.user,
    pass: stmp.password
  },
  tls: {
    rejectUnauthorized: false
  },
})


export async function sendEmailForPassword(user: User, code: string){
  const mailSent = await transporter.sendMail({
    text: 'Aqui está seu código!',
    subject: 'Código de renovação de senha',
    from: 'Bruno Enrique <brunobarondev@gmail.com>',
    html: 
      `<p>Utilize o código abaixo para renovar sua senha com as vendinhas!</p>`  + 
      `<h2>${code}</h2>`,
    to: [user.email]
  })

  return mailSent;
};
