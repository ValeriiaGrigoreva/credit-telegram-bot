const { Telegraf, session, Stage, Extra } = require('telegraf')
const Markup = require('telegraf/markup')
const SceneGenerator = require('./scenes')
const curScene = new SceneGenerator()
const lastName = curScene.GenLastName()
const name = curScene.GenName()
const middleName = curScene.GenMiddleName()
const phone = curScene.GenPhone()
const email = curScene.GenEmail()
const birthDate = curScene.GenBirthDate()
const creditSum = curScene.GenCreditSum()
const loanPeriod = curScene.GenLoanPeriod()

const token = '1483488015:AAE9HfUzITxtbLIN4VrnfRjJe06J21rq838'

const bot = new Telegraf(token)

const stage = new Stage([lastName, name, middleName, phone, email, birthDate, creditSum, loanPeriod])
bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => ctx.reply('Здравствуйте! Данный бот поможет вам оформить заявку на потребительский кредит. Для продолжения подтвердтите согласие на обработку персональных данных', Markup.keyboard([
        ['Согласен(а)', 'Не согласен(а)'],  
      ])
        .resize()
        .extra()
        )
    
)
bot.hears('Согласен(а)', (ctx) => ctx.scene.enter('lastName'))
bot.hears('Не согласен(а)', (ctx) => ctx.reply('К сожалению, без согласия на обработку персональных данных мы не сможем принять вашу заявку. Если вы все таки хотите отправить заявку нажмите /start или выберите опцию Согласен(а)'))

bot.launch()
