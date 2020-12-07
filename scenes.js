const { Markup } = require('telegraf');
const Scene = require('telegraf/scenes/base')

class SceneGenerator {
    GenLastName () {
        const lastName = new Scene('lastName');

        lastName.enter((ctx) => ctx.reply('Введите ваше имя', Markup.keyboard(
            [
                [`${ctx.message.from.first_name}`]
            ]
        )
            .oneTime()
            .resize()
            .extra()
        ));

        return lastName
    }
}

module.exports = SceneGenerator