/* global TelegramBot */

/* exported App */
class App {
  constructor() {
    this._request = {
      parameter: '',
      pathInfo: '',
      data: {},
    };
  }

  /**
   * @returns {App.Properties}
   */
  get properties() {
    if (!this._properties) {
      this._properties = { script: undefined };
    }
    if (!this._properties.script) this._properties.script = PropertiesService.getScriptProperties().getProperties();
    return this._properties;
  }

  get bot() {
    if (!this._bot) this._bot = new TelegramBot(this.properties.script.APP_BOT_TOKEN);
    return this._bot;
  }

  setWebhook() {
    const url = ScriptApp.getService().getUrl();
    if (url) {
      return this.bot.setWebhook(url);
    }
  }

  log(data, parseMode = 'Markdown') {
    this.bot.sendMessage(this.properties.script.APP_LOG_CHAT_ID, data, parseMode);
  }

  toMarkdownCode(text) {
    const wrapper = '```';
    return `${wrapper}\n${text}\n${wrapper}`;
  }

  doPost(e) {
    try {
      this._request.parameter = e.parameter;
      if (e.postData) {
        this._request.data = JSON.parse(e.postData?.contents ?? {});
      } else {
        this._request.data = e.parameter;
      }
      this.bot.sendMessage(
        this._request.data?.message.chat.id,
        this.toMarkdownCode(JSON.stringify(this._request, null, '  ')),
        'Markdown',
      );
    } catch (err) {
      this.log(`${err.message}\n\n${err.stack}\n\n${JSON.stringify(e, null, '  ')}`);
    }
  }
}
