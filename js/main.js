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
	    url: 'https://www.meetup.com/JSOxford/',
	    startTime: '9:30am',
	    endTime: '5pm',
	    location: 'The Story Museum in Oxford',
	    fullAddress: 'The Story Museum, Rochester House, 42 Pembroke St, Oxford OX1 1BP',
	    apiKey: 'bba70764af4f47808ab21666ad50d0df',
	    appId: '57195fd5-cae5-4810-a829-b42ff5d3f3db'
	};
	var ChatBot = (function () {
	    function ChatBot() {
	        var _this = this;
	        this.apiURL = function (query) { return "https://api.projectoxford.ai/luis/v2.0/apps/" + config.appId + "?subscription-key=" + config.apiKey + "&q=" + query; };
	        this.messages = [
	            "Hello! \uD83D\uDC4B",
	            "On " + config.date + " JSOxford are hosting a Chat Hack Day at " + config.location + ". Open to all.",
	            "Chat Hack is a hack day for people to make fun, quirky, useful and weird chat bots using web technologies.",
	            "You will have the chance to learn and build chat bots for many platforms such as Facebook Messenger, Telegram and Slack.",
	            "We will have people available to help and the day is targeted at all experience levels from beginner to chat bot master.",
	            "The day will start at " + config.startTime + " and end around " + config.endTime,
	            "More information can be found at " + config.url + " or you can ask me questions and I'll try my best to answer."
	        ];
	        this.form = document.querySelector('.message-form');
	        this.inputBox = document.querySelector('.input-message');
	        this.timeline = document.querySelector('.chat-timeline');
	        this.container = document.querySelector('.chat-content');
	        this.isScrolled = false;
	        this.botIsTyping = document.querySelector('.bot-typing');
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
	        this.botIsTyping.classList.add('hide');
	        var message = this.messages.shift();
	        if (message) {
	            this.addChatItem(message, true);
	            setTimeout(function () { return _this.say(); }, 3500);
	            if (this.messages.length) {
	                setTimeout(function () {
	                    _this.botIsTyping.classList.remove('hide');
	                }, 450);
	            }
	        }
	    };
	    ChatBot.prototype.respondTo = function (message) {
	        var _this = this;
	        var url = this.apiURL(message);
	        fetch(url)
	            .then(function (res) { return res.json(); })
	            .then(function (res) {
	            switch (res.topScoringIntent.intent) {
	                case 'Greeting':
	                    return _this.addChatItem("Hello.", true);
	                case 'Location':
	                    return _this.addChatItem("" + config.fullAddress, true);
	                case 'StartTime':
	                    return _this.addChatItem("We will be kicking off at " + config.startTime, true);
	                case 'EndTime':
	                    return _this.addChatItem("We aim to finish about " + config.endTime, true);
	                case 'Meetup':
	                    return _this.addChatItem("You can find out more at " + config.url, true);
	                default:
	                    return _this.addChatItem("Sorry, I don't understand.", true);
	            }
	        });
	    };
	    return ChatBot;
	}());
	new ChatBot();


/***/ }
/******/ ]);