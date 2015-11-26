"use strict";
//Make jQuery like hints
var $ = document.querySelectorAll.bind(document);
Element.prototype.on = Element.prototype.addEventListener;
var comment = $('.comments-form__text')[0];
var comments = $('.comments__list')[0];
var success = $('.success')[0];
var title_height = 0;
var ad_timer; 
function equalHeight(){
	var titles_parents = $('.articles__item');
	var max = 0;
	for (var j = 0; j < titles_parents.length; j++){
		title_height = titles_parents[j].querySelector('.article__title').clientHeight;
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
}
function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function tooltipCheckViewport(){
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
function createComment(text){
	var new_comment = comments.children[0].cloneNode(true);
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
	replyCount();
	var ad_id = setInterval(function(){
		var style = window.getComputedStyle(success);
		var top = style.top;
		top = parseInt(top.replace(/px/,''));
		top++;
		success.style.top = top+'px';
		if (top >= 0){
			success.style.top = "0";
			clearInterval(ad_id);
		}
	},10);
	return new_comment;
}
function voteCount(){
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
}
function replyCount(){
	var reply = $('.single-comment__reply');
	var reply_comments = $('.reply-form__text');
	var reply_submit = $('.reply-form__submit');
	for (var i = 0; i < reply.length; i++){
		reply[i].onclick = function(e){
			this.classList.toggle('active');
			return false;
		};
	}
	for (var i = 0; i < reply_comments.length; i++){
		reply_comments[i].onkeyup = function(e){
			e.preventDefault();
			this.parentNode.querySelector('.reply-form__submit').classList.add('allow');
		};
		reply_comments[i].onblur = function(){
			if (this.value == '')
				this.parentNode.querySelector('.reply-form__submit').classList.remove('allow');
		};
	}
	for (var i = 0; i < reply_submit.length; i++){
		reply_submit[i].onclick = function(e){
			e.preventDefault();
			if (this.className != 'allow')
				return;
			var reply_comment = this.previousElementSibling;
			var new_comment = createComment(reply_comment);
			reply_comment.value = "";
			var toggle_reply = this.parentNode.previousElementSibling;
			toggle_reply.classList.remove('active');
			var replies = this.parentNode.nextElementSibling;
			replies.insertBefore(new_comment,replies.firstChild);
			replyCount();
			voteCount();//Regenerate after creating
			timer();
			return false;
		};
	}
}
function timer(){
	ad_timer = setTimeout(function(){
		success.style.top = '-50px';
	}, 10000);
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
comment.onkeyup = function(){
	$('.comments-form__submit')[0].classList.add('allow');
};
comment.onblur = function(){
	if (!this.value)
		$('.comments-form__submit')[0].classList.remove('allow');
};
$('.comments-form__submit')[0].onclick = function(e){
	e.preventDefault();
	console.log('here');
	if (!this.classList.contains('allow'))
		return;
	var new_comment = createComment(comment);
	comment.value = "";
	comments.insertBefore(new_comment,comments.firstChild);
	replyCount();
	voteCount()//Regenerate after creating
	timer();
};
$('.single-comment__less')[0].onclick = function(){
	this.style.display = "none";
	document.querySelector('.read_more .hidden_text').style.display = "block";
	$('single-comment__less')[0].style.display = "inline";
	return false;
};
$('.single-comment__more')[0].onclick = function(){
	this.style.display = "none";
	document.querySelector('.read_more .hidden_text').style.display = "none";
	$('.single-comment__more')[0].style.display = "inline";
	return false;
};
$('.success__close')[0].onclick = function(){
	success.style.top = "-50px";
	clearTimeout(ad_timer);
}
equalHeight();
tooltipCheckViewport();
replyCount();
voteCount();
