const { Markup } = require('telegraf')
const Scene = require('telegraf/scenes/base')
const validateBirthDate = require('./methods')


class SceneGenerator {
    //получение фамилии 
    GenLastName() {
        const lastName = new Scene('lastName')
        /*при входе в сцену запрашивается фамилия и на клавиатуре предлагается фамилия, указанная в телеграме, 
        для быстрой отправки*/
        lastName.enter((ctx) => ctx.reply('Введите вашу фамилию.', Markup.keyboard(
            [
                [`${ctx.message.from.last_name}`]
            ]
        )
            .resize()
            .extra()
        ))
        /*при получении текстового ответа проверяется состоит ли он только из букв русского алфавита. 
        Если нет, то уведомляем клиента и заново заходим в сцену. Если да, то переходим в сцену 
        получения имени*/
        lastName.on('text', async (ctx) => {
            const answer = ctx.message.text
            if (/[^а-яА-Я]/.test(answer)) {
                await ctx.reply('К сожалению, это не похоже на фамилию.')
                await ctx.scene.reenter()
            } else {
                await ctx.scene.enter('name')
            }
        })
        //если в ответ приходит не текстовое сообщение, заново заходим в сцену
        lastName.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на фамилию.')
            await ctx.scene.reenter()
        })

        return lastName
    }
    //получение имени, аналогично получению фамилии
    GenName() {
        const name = new Scene('name')

        name.enter((ctx) => ctx.reply('Введите ваше имя.', Markup.keyboard(
            [
                [`${ctx.message.from.first_name}`]
            ]
        )
            .oneTime()
            .resize()
            .extra()
        ));

        name.on('text', async (ctx) => {
            const answer = ctx.message.text
            if (/[^а-яА-Я]/.test(answer)) {
                await ctx.reply('К сожалению, это не похоже на имя.')
                await ctx.scene.reenter()
            } else { 
                await ctx.scene.enter('middleName')
            }
        })

        name.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на имя.')
            await ctx.scene.reenter()
        })

        return name
    }
    /*получение отчества при его наличии. Аналогично получению имени и фамилии, отсутствует только 
    клавиатура с отчеством из телеграма, так как нет такого поля в телеграме*/
    GenMiddleName() {
        const middleName = new Scene('middleName')

        middleName.enter((ctx) => ctx.reply('Введите ваше отчество.\n\nЕсли у вас нет отчества, то введите "Нет".'))

        middleName.on('text', async (ctx) => {
            const answer = ctx.message.text;
            if (/[^а-яА-Я]/.test(answer)) {
                await ctx.reply('К сожалению, это не похоже на отчество.')
                await ctx.scene.reenter()
            } else {
                await ctx.scene.enter('birthDate')
            }
        })

        middleName.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на отчество.')
            await ctx.scene.reenter()
        })

        return middleName
    }
    //получение даты рождения
    GenBirthDate() {
        const birthDate = new Scene('birthDate');
        //при входе в сцену запрашиваем дату рождения в нужном формате
        birthDate.enter((ctx) => {
            ctx.reply('Введите вашу дату рождения в формате ДД.ММ.ГГГГ')
        })
        /*при получении текстового ответа проверяем нужный формат, возможность существования 
        введенной даты и подходит ли возраст для получения кредита*/
        birthDate.on('text', async (ctx) => {
            const answer = ctx.message.text;
            //если формат не соответствует заходим в сцену заново
            if (!answer.match(/\d\d.\d\d.\d\d\d\d/)) {
                await ctx.reply('К сожалению, это не похоже на дату рождения.')
                await ctx.scene.reenter()
            } else {
                let answerArr = answer.split('.');
                /*проверяем валидность даты с помощью функции из файла methods.js. Если все впорядке 
                переходим в сцену получения номера телефона. Если возраст меньше 18, уведомляем о 
                невозможности получения кредита и бот далее не запрашивает информацию. Если введена несуществующая дата, 
                заходим в сцену заново*/
                if (validateBirthDate(answerArr) == 'wrong date') {
                    await ctx.reply('К сожалению, это не похоже на дату рождения.')
                    await ctx.scene.reenter()
                } else if (validateBirthDate(answerArr) == 'wrong age') {
                    await ctx.reply('К сожалению, если вам меньше 18 лет, то мы не можем выдать вам кредит.')
                    await ctx.scene.leave()
                } else {
                    await ctx.scene.enter('phone')
                }
            }
        })
        //при вводе не текстового ответа, заходим в сцену заново
        birthDate.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на дату рождения.')
            await ctx.scene.reenter()
        });

        return birthDate
    }
    //получение номера телефона
    GenPhone() {
        const phone = new Scene('phone');
        /*при входе в сцену запрашиваем номер в нужном формате и предлагаем 
        поделиться номером из телеграма с помощью клавиатуры*/
        phone.enter((ctx) => {
            ctx.reply('Введите ваш телефон в формате +7XXXXXXXXXX или выберите опцию "Поделиться контактом" на клавиатуре.', Markup.keyboard([
                [{text: 'Поделиться контактом', request_contact: true}] 
              ])
                .resize()
                .extra())
        })
        /*при получении номера телефона уточняем правильность ввода, появляется 
        всопомгательная клавиатура с вариантами ответа*/
        phone.phone((ctx) => {
            ctx.reply(`Вы бы хотели оставить номер телефона ${ctx.message.text} в вашей заявке?`, Markup.keyboard([
                ['Да', 'Нет'], 
              ])
                .resize()
                .extra())
        });
        /*если получаем контакт, то берем из него номер телефона и также уточняем правильность ввода*/
        phone.on('contact', (ctx) => {
            ctx.reply(`Вы бы хотели оставить номер телефона +${ctx.message.contact.phone_number} в вашей заявке?`, Markup.keyboard([
                ['Да', 'Нет'], 
              ])
                .resize()
                .extra())
        })
        //есл правильность ввода подтверждена, переходим к получению email
        phone.hears('Да', (ctx) => ctx.scene.enter('email'))
        //если правльность не подтверждена, заходим заново в сцену
        phone.hears('Нет', (ctx) => ctx.scene.reenter())
        //если в ответ пришел не контакт и не номер, заходим заново в сцену
        phone.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на телефон.')
            await ctx.scene.reenter()
        });

        return phone
    }
    //получение email, аналогично предыдущим сценам проверяем правильность ввода email
    GenEmail() {
        const email = new Scene('email');

        email.enter((ctx) => {
            ctx.reply('Введите ваш email.')
        })

        email.email((ctx) => ctx.scene.enter('creditSum'));
        email.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на email.')
            await ctx.scene.reenter()
        });

        return email
    }
    //получение суммы кредита в рублях
    GenCreditSum() {
        const creditSum = new Scene('creditSum')

        creditSum.enter((ctx) => {
            ctx.reply('Введите сумму кредита в рублях.')
        })
        //при текстовом ответе проверяем, чтобы введены были только цифры
        creditSum.on('text', async (ctx) => {
            const answer = ctx.message.text
            if (/[^\d]/.test(answer)) {
                await ctx.reply('К сожалению, это не похоже на сумму кредита.')
                await ctx.scene.reenter()
            } else { 
                await ctx.scene.enter('loanPeriod')
            }
        })
        //если ответ не текстовый, входим в сцену заново
        creditSum.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на сумму кредита.')
            await ctx.scene.reenter()
        })

        return creditSum
    }
    //получение срока кредитования в месяцах, аналогично получению суммы кредита
    GenLoanPeriod() {
        const loanPeriod = new Scene('loanPeriod')

        loanPeriod.enter((ctx) => {
            ctx.reply('Введите срок кредитования в месяцах.')
        })

        loanPeriod.on('text', async (ctx) => {
            const answer = ctx.message.text
            if (/[^\d]/.test(answer)) {
                await ctx.reply('К сожалению, это не похоже на срок кредитования.')
                await ctx.scene.reenter()
            } else { 
                await ctx.scene.enter('lastMessage')
            }
        })

        loanPeriod.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на срок кредитования.')
            await ctx.scene.reenter()
        })

        return loanPeriod
    }
    //отправка завершающего сообщения
    GenLastMessage() {
        const lastMessage = new Scene('lastMessage')
        /*при входе в сцену уведомляем о принятии заявки и информируем о том, что перезвонит сотрудник 
        банка, затем выходим из сцены*/
        lastMessage.enter((ctx) => {
            ctx.reply('Мы получили вашу заявку и перезвоним в ближайшее время.\n\nПожалуйста, дождитесь звонка сотрудника банка и вы сможете обсудить с ним подробно условия продукта, а также подобрать программу в соответствии с вашими потребностями.\n\nОбращаем ваше внимание, что звонок будет совершен с 8:00 до 21:00 по московскому времени.\n\nЕсли вам нужно исправить заявку, не дублируйте ее, сообщите об этом сотруднику банка, когда он перезвонит.')
            ctx.scene.leave()
        })
        return lastMessage
    }
}

module.exports = SceneGenerator

