const config: any = {
  date: 'Saturday 1st April',
  url: 'https://www.meetup.com/JSOxford/',
  startTime: '9:30am',
  endTime: '5pm',
  location: 'The Story Museum in Oxford',
  fullAddress: 'The Story Museum, Rochester House, 42 Pembroke St, Oxford OX1 1BP',
  key: '1a6e39d4e6e846d1a8ad4b98ec332946',
  appId: '57195fd5-cae5-4810-a829-b42ff5d3f3db'
};

class ChatBot {
  private apiURL: Function = (query) => `https://api.projectoxford.ai/luis/v2.0/apps/${config.appId}?subscription-key=${config.key}&q=${query}`

  private messages: string[] = [
    `Hello! 👋`,
    `On ${config.date} JSOxford are hosting a Chat Hack Day at ${config.location}. Open to all.`,
    `Chat Hack is a hack day for people to make fun, quirky, useful and weird chat bots using web technologies.`,
    `You will have the chance to learn and build chat bots for many platforms such as Facebook Messenger, Telegram and Slack.`,
    `We will have people available to help and the day is targeted at all experience levels from beginner to chat bot master.`,
    `The day will start at ${config.startTime} and end around ${config.endTime}`,
    `More information can be found at ${config.url} or you can ask me questions and I'll try my best to answer.`
    ];

  private form: HTMLFormElement = <HTMLFormElement>document.querySelector('.message-form');
  private inputBox: HTMLInputElement = <HTMLInputElement>document.querySelector('.input-message');
  private timeline: Element = document.querySelector('.chat-timeline');
  private container: Element = document.querySelector('.chat-content');

  private isScrolled: boolean = false;

  private botIsTyping: Element = document.querySelector('.bot-typing');

  private getUserMessage: Function = (): string => this.inputBox.value;
  private resetUserMessage: Function = (): void => {this.inputBox.value = '';}

  constructor() {
    this.hookUpEventHandler();
    setTimeout(() => this.say(), 2000);
  }

  private hookUpEventHandler() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      let message = this.getUserMessage();
      if (message) {
        this.addChatItem(message, false);
        this.resetUserMessage();
        this.respondTo(message);
      }
    });

    this.container.addEventListener('scroll', () => {
      if(this.container.scrollTop < (this.container.scrollHeight - this.container.clientHeight)) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false
      }
    })
    requestAnimationFrame(() => this.scrollTimeline());
  }

  private scrollTimeline() {
    if(!this.isScrolled) {
      this.container.scrollTop = this.container.scrollHeight;
    }
    requestAnimationFrame(() => this.scrollTimeline());
  }

  private addChatItem(message, isBot) {
    let newMessage = document.createElement('li');
    newMessage.classList.add('chat-item');
    if (!isBot) {
      newMessage.classList.add('from-me');
    }
    newMessage.innerHTML = `
      <div class="bubble">
        <p>${message.replace(/\n/, '<br>')}</p>
      </div>
    `;
    this.timeline.appendChild(newMessage);
  }

  private say() {
    this.botIsTyping.classList.add('hide');
    let message = this.messages.shift();
    if (message) {
      this.addChatItem(message, true);
      setTimeout(() => this.say(), 3500);
      if(this.messages.length) {
        setTimeout(() => {
          this.botIsTyping.classList.remove('hide');
        }, 450);
      }
    }
  }

  private respondTo(message) {
    let url = this.apiURL(message);
    fetch(url)
      .then(res => res.json())
      .then(res => {
        switch(res.topScoringIntent.intent) {
          case 'Greeting':
            return this.addChatItem(`Hello.`, true);
          case 'Location':
            return this.addChatItem(`${config.fullAddress}`, true);
          case 'StartTime':
            return this.addChatItem(`We will be kicking off at ${config.startTime}`, true);
          case 'EndTime':
            return this.addChatItem(`We aim to finish about ${config.endTime}`, true);
          case 'Meetup':
            return this.addChatItem(`You can find out more at ${config.url}`, true);
          default:
            return this.addChatItem(`Sorry, I don't understand.`, true);
        }
      });
  }
}
new ChatBot();
