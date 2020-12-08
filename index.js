require('dotenv').config()
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
const lastMessage = curScene.GenLastMessage()

const bot = new Telegraf(process.env.TOKEN)

const stage = new Stage([lastName, name, middleName, phone, email, birthDate, creditSum, loanPeriod, lastMessage])
bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => ctx.reply('Здравствуйте!\n\nДанный бот поможет вам оформить заявку на потребительский кредит.\n\nДля продолжения подтвердтите, пожалуйста, согласие на обработку персональных данных.', Markup.keyboard([
        ['Согласен(а)', 'Не согласен(а)'], 
      ])
        .resize()
        .extra()
        )
    
)
bot.hears('Согласен(а)', (ctx) => ctx.scene.enter('lastName'))
bot.hears('Не согласен(а)', (ctx) => ctx.reply('К сожалению, без согласия на обработку персональных данных мы не сможем принять вашу заявку.\n\nЕсли вы все таки хотите отправить заявку нажмите /start или выберите опцию "Согласен(а)".'))

bot.launch()
