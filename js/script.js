"use strict";
//Make jQuery like hints
var $ = document.querySelectorAll.bind(document);
Element.prototype.on = Element.prototype.addEventListener;
var rootScope = {
	init: function(){
		//Variables
		this.comment = $('.comments-form__text')[0];
		this.comments = $('.comments__list')[0];
		this.comments_submit = $('.comments-form__submit')[0];
		this.success = $('.success')[0];
		this.success__close = $('.success__close')[0];
		this.ad_timer = 0;
		this.less = $('.single-comment__less');
		this.more = $('.single-comment__more');
		this.reply = $('.single-comment__reply');
		this.reply_comments = $('.reply-form__text');
		this.reply_submit = $('.reply-form__submit');
		//Handlers
		for (var i = 0; i < this.less.length; i++ ){
			this.less[i].addEventListener('click',this.toggleComment,false);
			this.more[i].addEventListener('click',this.toggleComment,false);
		}
		for (var i = 0; i < this.reply.length; i++){
			this.reply[i].addEventListener('click',function(e){
				e.preventDefault();
				this.classList.toggle('active');
			},false);
			this.reply_comments[i].addEventListener('keyup',function(){
				this.parentNode.querySelector('.reply-form__submit').classList.add('allow');
			},false);
			this.reply_comments[i].addEventListener('blur',function(){
				if (this.value == '')
					this.parentNode.querySelector('.reply-form__submit').classList.remove('allow');
			},false);
			this.reply_submit[i].addEventListener('click',function(e){
				e.preventDefault();
				if (!e.target.classList.contains('allow'))
					return;
				var reply_comment = e.target.previousElementSibling;
				var new_comment = this.createComment(reply_comment);
				reply_comment.value = "";
				var toggle_reply = e.target.parentNode.previousElementSibling;
				toggle_reply.classList.remove('active');
				var replies = e.target.parentNode.nextElementSibling;
				replies.insertBefore(new_comment,replies.firstChild);
				//self.replyCount();
				this.voteCount();//Regenerate after creating
				this.timer();
			}.bind( this ),false);
		}
		this.comment.addEventListener('keyup',this.comment_keyupHandler.bind( this ),false);
		this.comment.addEventListener('blur',this.comment_blurHandler.bind( this ),false);
		this.comments_submit.addEventListener('click',this.comments_submitHandler.bind( this ),false);
		this.success__close.addEventListener('click',function(){
			this.success.style.top = "-50px";
			clearTimeout(this.ad_timer);
		}.bind( this ),false);
		//Calling functions
		this.replyCount();
		this.voteCount();
		this.equalHeight();
		this.tooltipCheckViewport();
	},
	createComment: function(text){
		var new_comment = this.comments.children[0].cloneNode(true);
		new_comment.querySelector('.single-comment__pic').setAttribute('src','images/profile_author_07.png');
		new_comment.querySelector('.single-comment__author').innerHTML = "Kelsey Jones";
		new_comment.querySelector('.single-comment__time').innerHTML = "• 0 secs ago";
		new_comment.querySelector('.single-comment__content').innerHTML = text.value;
		new_comment.querySelector('.single-comment__rating').className = "single-comment__rating neutral";
		new_comment.querySelector('.single-comment__rating').innerHTML = "0";
		new_comment.querySelector('.replies-list').innerHTML = "";//cause we don't have any replies yet
		new_comment.querySelector('.single-comment__reply').classList.remove('active');
		new_comment.querySelector('.reply-form__text').value = "";
		$('header')[0].classList.add('added');
		~$('.comments__count')[0].innerHTML++; //= parseInt(document.querySelector('.comment_count').innerHTML)+1;
		this.replyCount();
		var ad_id = setInterval(function(){
			var style = window.getComputedStyle(this.success);
			var top = style.top;
			top = parseInt(top.replace(/px/,''));
			top++;
			this.success.style.top = top+'px';
			if (top >= 0){
				this.success.style.top = "0";
				clearInterval(ad_id);
			}
		}.bind( this ),10);
		return new_comment;
	},
	comment_keyupHandler: function(){
		this.comments_submit.classList.add('allow');
	},
	comment_blurHandler: function(){
		if (!this.comment.value)
			this.comments_submit.classList.remove('allow');
	},
	comments_submitHandler: function(e){	
		console.log(this);
		e.preventDefault();	
		if (!this.comments_submit.classList.contains('allow'))
			return;
		var new_comment = this.createComment(this.comment);
		this.comment.value = "";
		this.comments.insertBefore(new_comment,this.comments.firstChild);
		this.replyCount();
		this.voteCount()//Regenerate after creating
		this.timer();
	},
	replyCount: function(){
		console.log('reply');
		var reply = $('.single-comment__reply');
		var reply_comments = $('.reply-form__text');
		var reply_submit = $('.reply-form__submit');
		var self = this;
		for (var i = 0; i < reply_submit.length; i++){
			reply_submit[i].onclick = function(e,self){
				
				return false;
			};
		}
	},
	voteCount: function(){
		var vote_plus = $('.single-comment__vote_plus');
		var vote_minus = $('.single-comment__vote_minus');
		for(var i = 0; i < vote_plus.length; i++){
			vote_plus[i].onclick = function(){
				var rating = this.parentNode.querySelector('.single-comment__rating');
				switch (rating.classList[1]){
					case 'positive':
						var new_rating = parseInt(rating.innerHTML.substr(1))+1;
						rating.innerHTML = '+'+new_rating;
						break;
					case 'neutral':
						rating.classList.remove('neutral');
						rating.classList.add('positive');
						var new_rating = parseInt(rating.innerHTML)+1;
						rating.innerHTML = '+'+new_rating;
						break;
					case 'negative':
						var new_rating = parseInt(rating.innerHTML.substr(1))-1;
						if (new_rating)
							rating.innerHTML = '-'+new_rating;
						else{
							rating.classList.remove('negative');
							rating.classList.add('neutral');
							rating.innerHTML = new_rating;
						}
						break;
				}
			};
		}
		for(var i = 0; i < vote_minus.length; i++){
			vote_minus[i].onclick = function(){
				var rating = this.parentNode.querySelector('.single-comment__rating');
				switch (rating.classList[1]){
					case 'positive':
						var new_rating = parseInt(rating.innerHTML.substr(1))-1;
						if (new_rating)
							rating.innerHTML = '+'+new_rating;
						else{
							rating.classList.remove('positive');
							rating.classList.add('neutral');
							rating.innerHTML = new_rating;
						}
						break;
					case 'neutral':
						rating.classList.remove('neutral');
						rating.classList.add('negative');
						var new_rating = parseInt(rating.innerHTML)+1;
						rating.innerHTML = '-'+new_rating;
						break;
					case 'negative':
						var new_rating = parseInt(rating.innerHTML.substr(1))+1;
						rating.innerHTML = '-'+new_rating;
						break;
				}
			}
		};
	},
	toggleComment: function(e){
		e.preventDefault();
		this.style.display = "none";
		if (this.classList.contains('single-comment__less')){
			$('.single-comment__hidden_text')[0].style.display = "none";
			$('.single-comment__more')[0].style.display = "inline";
		}
		else{
			$('.single-comment__hidden_text')[0].style.display = "block";
			$('.single-comment__less')[0].style.display = "inline";
		}
		return false;
	},
	timer: function(){
		this.ad_timer = setTimeout(function(){
			this.success.style.top = '-50px';
		}.bind( this ), 10000);
	},
	equalHeight: function(){
		var titles_parents = $('.articles__item');
		var max = 0;
		for (var j = 0; j < titles_parents.length; j++){
			var title_height = titles_parents[j].querySelector('.article__title').clientHeight;
			if (title_height > max)
				max = title_height;
		}
		for (var i = 0; i < titles_parents.length; i++){
			titles_parents[i].setAttribute('data-height',max);
		}
		var titles = $('.article__title');
		for (var i = 0; i < titles.length; i++){
			var data = titles[i].closest('.articles__item').dataset;//this is new style variant but not super cross-browser titles[i].parentNode.parentNode.parentNode.dataset;
			titles[i].style.height = data.height+'px';
		}
	},
	tooltipCheckViewport: function(){
		var share = $('.article__share');
		for (var i = 0; i < share.length;  i++){
			share[i].onmouseenter = function(){
				var coord = this.children[0].getBoundingClientRect();
				if (coord.right > window.innerWidth){
					this.children[0].style.right = "inherit";
					this.children[0].style.left = "-150px";
					this.children[0].classList.add('without_before');
				}
			}
			share[i].onmouseleave = function(){
				this.children[0].style.left = "";
				this.children[0].style.right = "";
				this.children[0].classList.remove('without_before');
			}
		}
	}
};
rootScope.init();
function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
$('.subscribe-form__submit')[0].onclick = function(){
	if (validateEmail($('.subscribe-form__input')[0].value)){
		$('.subscribe__text')[0].innerHTML = "Thank you!";
		this.parentNode.innerHTML = "You have successfully subscribed to our blog.";
		return false;
	}	
	else{
		this.parentNode.classList.add('not_valid');
		return false;
	}
};
$('.subscribe-form__input')[0].onkeyup = function(){
	this.parentNode.classList.remove('not_valid');
	return true;
};
$('.notify__button')[0].onclick = function(){
	this.style.display = "none";
	$('.notify-form')[0].style.display = "block";
	return false;
};

