require('dotenv').config()
const { Telegraf, session, Stage } = require('telegraf')
const { Markup } = require('telegraf')
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

/*при запуске бота он проверяет согласие на обработку персональных данных, появляется клавиатура 
для упрощения ввода ответа*/
bot.start((ctx) => ctx.reply('Здравствуйте!\n\nДанный бот поможет вам оформить заявку на потребительский кредит.\n\nДля продолжения подтвердтите, пожалуйста, согласие на обработку персональных данных.', Markup.keyboard([
    ['Согласен(а)', 'Не согласен(а)'], 
  ]).resize().extra()))

//в случае согласия на обработку данных, бот начинает запрашивать необходимые данные переходя по сценам, начиная с фамилии
bot.hears('Согласен(а)', (ctx) => ctx.scene.enter('lastName'))
/*в случае несогласия на обработку данных, бот информирует о невозможности оставления заявки и предлагает 
начать заново или выбрать опцию "Согласен(а)", если человек передумал*/
bot.hears('Не согласен(а)', (ctx) => ctx.reply('К сожалению, без согласия на обработку персональных данных мы не сможем принять вашу заявку.\n\nЕсли вы все таки хотите отправить заявку нажмите /start или выберите опцию "Согласен(а)".'))

bot.launch()
