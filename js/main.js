/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var config = {
	    date: 'Saturday 1st April',
	    url: "<a href=\"https://www.meetup.com/JSOxford/\">https://www.meetup.com/JSOxford/</a>",
	    startTime: '9:30am',
	    endTime: '5pm',
	    location: 'The Story Museum in Oxford',
	    googleMaps: 'https://goo.gl/maps/vjVy6N4rapt',
	    fullAddress: 'The Story Museum, Rochester House, 42 Pembroke St, Oxford OX1 1BP',
	    key: '1a6e39d4e6e846d1a8ad4b98ec332946',
	    appId: '57195fd5-cae5-4810-a829-b42ff5d3f3db'
	};
	var ChatBot = (function () {
	    function ChatBot() {
	        var _this = this;
	        this.apiURL = function (query) { return "https://api.projectoxford.ai/luis/v2.0/apps/" + config.appId + "?subscription-key=" + config.key + "&q=" + query; };
	        this.messages = [
	            "Hello! \uD83D\uDC4B",
	            "On " + config.date + " JSOxford are hosting a Chat Hack Day at " + config.location + ". Open to all.",
	            "Chat Hack is a hack day for people to make fun, quirky, useful and weird chat bots using web technologies.",
	            "You will have the chance to learn and build chat bots for many platforms such as Facebook Messenger, Telegram and Slack.",
	            "We will have people available to help and the day is targeted at all experience levels from beginner to chat bot master.",
	            "The day will start at " + config.startTime + " and end around " + config.endTime,
	            "More information can be found at " + config.url + " or you can ask me questions and I'll try my best to answer.",
	            "Please make sure you register on the event page to ensure a spot - " + config.url
	        ];
	        this.form = document.querySelector('.message-form');
	        this.inputBox = document.querySelector('.input-message');
	        this.timeline = document.querySelector('.chat-timeline');
	        this.container = document.querySelector('.chat-content');
	        this.isScrolled = false;
	        this.botIsTyping = document.querySelector('.bot-typing');
	        this.botTyping = function () { return setTimeout(function () { _this.botIsTyping.classList.remove('hide'); }, 450); };
	        this.botNotTyping = function () { return _this.botIsTyping.classList.add('hide'); };
	        this.getUserMessage = function () { return _this.inputBox.value; };
	        this.resetUserMessage = function () { _this.inputBox.value = ''; };
	        this.hookUpEventHandler();
	        setTimeout(function () { return _this.say(); }, 2000);
	    }
	    ChatBot.prototype.hookUpEventHandler = function () {
	        var _this = this;
	        this.form.addEventListener('submit', function (event) {
	            event.preventDefault();
	            var message = _this.getUserMessage();
	            if (message) {
	                _this.addChatItem(message, false);
	                _this.resetUserMessage();
	                _this.respondTo(message);
	            }
	        });
	        this.container.addEventListener('scroll', function () {
	            if (_this.container.scrollTop < (_this.container.scrollHeight - _this.container.clientHeight)) {
	                _this.isScrolled = true;
	            }
	            else {
	                _this.isScrolled = false;
	            }
	        });
	        requestAnimationFrame(function () { return _this.scrollTimeline(); });
	    };
	    ChatBot.prototype.scrollTimeline = function () {
	        var _this = this;
	        if (!this.isScrolled) {
	            this.container.scrollTop = this.container.scrollHeight;
	        }
	        requestAnimationFrame(function () { return _this.scrollTimeline(); });
	    };
	    ChatBot.prototype.addChatItem = function (message, isBot) {
	        var newMessage = document.createElement('li');
	        newMessage.classList.add('chat-item');
	        if (!isBot) {
	            newMessage.classList.add('from-me');
	        }
	        newMessage.innerHTML = "\n      <div class=\"bubble\">\n        <p>" + message.replace(/\n/, '<br>') + "</p>\n      </div>\n    ";
	        this.timeline.appendChild(newMessage);
	    };
	    ChatBot.prototype.say = function () {
	        var _this = this;
	        this.botNotTyping();
	        var message = this.messages.shift();
	        if (message) {
	            this.addChatItem(message, true);
	            setTimeout(function () { return _this.say(); }, 3500);
	            if (this.messages.length) {
	                this.botTyping();
	            }
	        }
	    };
	    ChatBot.prototype.respondTo = function (message) {
	        var _this = this;
	        this.botTyping();
	        var url = this.apiURL(message);
	        fetch(url)
	            .then(function (res) { return res.json(); })
	            .then(function (res) {
	            var message;
	            switch (res.topScoringIntent.intent) {
	                case 'Greeting':
	                    message = "Hello.";
	                    break;
	                case 'Location':
	                    message = config.fullAddress + " (See on <a href=\"" + config.googleMaps + "\">Google Maps</a>)";
	                    break;
	                case 'StartTime':
	                    message = "We will be kicking off at " + config.startTime;
	                    break;
	                case 'EndTime':
	                    message = "We aim to finish about " + config.endTime;
	                    break;
	                case 'Meetup':
	                    message = "You can find out more at " + config.url;
	                    break;
	                case 'Bring':
	                    message = "All you need to bring is a laptop and charger. If you have plans to use a specific platform (such as Telegram) then I recommend signing up to an account before the event.";
	                    break;
	                default:
	                    message = "Sorry, I don't understand.";
	                    break;
	            }
	            setTimeout(function () {
	                _this.botNotTyping();
	                return _this.addChatItem(message, true);
	            }, 1500);
	        });
	    };
	    return ChatBot;
	}());
	new ChatBot();


/***/ }
/******/ ]);