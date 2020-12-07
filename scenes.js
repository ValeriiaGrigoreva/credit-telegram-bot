const { Markup } = require('telegraf')
const Scene = require('telegraf/scenes/base')

class SceneGenerator {
    GenLastName() {
        const lastName = new Scene('lastName')

        lastName.enter((ctx) => ctx.reply('Введите вашу фамилию', Markup.keyboard(
            [
                [`${ctx.message.from.last_name}`]
            ]
        )
            .resize()
            .extra()
        ))

        lastName.on('text', async (ctx) => {
            const answer = ctx.message.text
            if (/[^a-zA-zа-яА-Я]/.test(answer)) {
                await ctx.reply('К сожалению, это не похоже на фамилию')
                await ctx.scene.reenter()
            } else {
                await ctx.scene.enter('name')
            }
        })

        lastName.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на фамилию')
            await ctx.scene.reenter()
        })

        return lastName
    }

    GenName() {
        const name = new Scene('name')

        name.enter((ctx) => ctx.reply('Введите ваше имя', Markup.keyboard(
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
            if (/[^a-zA-zа-яА-Я]/.test(answer)) {
                await ctx.reply('К сожалению, это не похоже на имя')
                await ctx.scene.reenter()
            } else { 
                await ctx.scene.enter('middleName')
            }
        })

        name.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на имя')
            await ctx.scene.reenter()
        })

        return name
    }

    GenMiddleName() {
        const middleName = new Scene('middleName')

        middleName.enter((ctx) => ctx.reply('Введите ваше отчество. Если у вас нет отчества, то введите "Нет"'))

        middleName.on('text', async (ctx) => {
            const answer = ctx.message.text;
            if (/[^a-zA-zа-яА-Я]/.test(answer)) {
                await ctx.reply('К сожалению, это не похоже на отчество')
                await ctx.scene.reenter()
            } else {
                await ctx.scene.enter('birthDate')
            }
        })

        middleName.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на отчество')
            await ctx.scene.reenter()
        })

        return middleName
    }

    GenBirthDate() {
        const birthDate = new Scene('birthDate');

        birthDate.enter((ctx) => {
            ctx.reply('Введите вашу дату рождения в формате ДД.ММ.ГГГГ')
        })

        birthDate.on('text', async (ctx) => {
            const answer = ctx.message.text;
            if (!answer.match(/\d\d.\d\d.\d\d\d\d/)) {
                await ctx.reply('К сожалению, это не похоже на дату рождения')
                await ctx.scene.reenter()
            } else {
                await ctx.scene.enter('phone')
            }
        })

        return birthDate
    }

    GenPhone() {
        const phone = new Scene('phone');

        phone.enter((ctx) => {
            ctx.reply('Введите ваш телефон в формате +7XXXXXXXXXX')
        })

        phone.phone((ctx) => ctx.scene.enter('email'));
        phone.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на телефон')
            await ctx.scene.reenter()
        });

        return phone
    }

    GenEmail() {
        const email = new Scene('email');

        email.enter((ctx) => {
            ctx.reply('Введите ваш email')
        })

        email.email((ctx) => ctx.scene.enter('creditSum'));
        email.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на email')
            await ctx.scene.reenter()
        });

        return email
    }

    GenCreditSum() {
        const creditSum = new Scene('creditSum')

        creditSum.enter((ctx) => {
            ctx.reply('Введите сумму кредита в рублях')
        })

        creditSum.on('text', async (ctx) => {
            const answer = ctx.message.text
            if (/[^\d]/.test(answer)) {
                await ctx.reply('К сожалению, это не похоже на сумму кредита')
                await ctx.scene.reenter()
            } else { 
                await ctx.scene.enter('loanPeriod')
            }
        })

        creditSum.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на сумму кредита')
            await ctx.scene.reenter()
        })

        return creditSum
    }

    GenLoanPeriod() {
        const loanPeriod = new Scene('loanPeriod')

        loanPeriod.enter((ctx) => {
            ctx.reply('Введите срок кредитования в месяцах')
        })

        loanPeriod.on('text', async (ctx) => {
            const answer = ctx.message.text
            if (/[^\d]/.test(answer)) {
                await ctx.reply('К сожалению, это не похоже на срок кредитования')
                await ctx.scene.reenter()
            } else { 
                ctx.reply('kool');
                //await ctx.scene.enter('middleName')
            }
        })

        loanPeriod.on('message', async (ctx) => {
            await ctx.reply('К сожалению, это не похоже на срок кредитования')
            await ctx.scene.reenter()
        })

        return loanPeriod
    }
}

module.exports = SceneGenerator