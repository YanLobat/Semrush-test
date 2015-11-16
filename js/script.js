"use strict";
var titles_parents = document.querySelectorAll('.latest > div');
var titles = document.querySelectorAll('.latest h3');
var submit = document.querySelector('.subscribe input[type=submit]');
var input = document.querySelector('.subscribe input[type=text]');
var share = document.querySelectorAll('a.share');
var notify = document.querySelector('.notify > a');
var comment = document.querySelector('.comment_form textarea');
var more = document.querySelector('.read_more .more');
var less = document.querySelector('.read_more .less');
var main_submit = document.querySelector('.comment_form input[type=submit]');
var comments = document.querySelector('div.comments');
var close = document.querySelector('.close');
var success = document.querySelector('.success');
var title_height = 0;
var ad_timer; 
function equalHeight(){
	for (var i = 0; i < titles_parents.length; i++){
		var sections = titles_parents[i].children;
		var max = 0;
		for (var j = 0; j < sections.length; j++){
			title_height = sections[j].children[1].children[0].children[2].clientHeight;
			if (title_height > max)
				max = title_height;
		}
		titles_parents[i].setAttribute('data-height',max);
		max = 0;
	}
	for (var i = 0; i < titles.length; i++){
		var data = titles[i].parentNode.parentNode.parentNode.parentNode.dataset;
		titles[i].style.height = data.height+'px';
	}
}
function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function tooltipCheckViewport(){
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
	new_comment.querySelector('img').setAttribute('src','images/profile_author_07.png');
	new_comment.querySelector('.author').innerHTML = "Kelsey Jones";
	new_comment.querySelector('.comment_time').innerHTML = "• 0 secs ago";
	new_comment.querySelector('.comment_content').innerHTML = text.value;
	new_comment.querySelector('.comment_rating').className = "comment_rating neutral";
	new_comment.querySelector('.comment_rating').innerHTML = "0";
	new_comment.querySelector('.replies').innerHTML = "";//cause we don't have any replies yet
	new_comment.querySelector('.reply').classList.remove('active');
	new_comment.querySelector('.reply_form textarea').value = "";
	document.querySelector('header').classList.add('added');
	document.querySelector('.comment_count').innerHTML = parseInt(document.querySelector('.comment_count').innerHTML)+1;
	console.log('i');	replyCount();
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
	var vote_plus = document.querySelectorAll('.vote_plus');
	var vote_minus = document.querySelectorAll('.vote_minus');
	for(var i = 0; i < vote_plus.length; i++){
		vote_plus[i].onclick = function(){
			var rating = this.parentNode.querySelector('.comment_rating');
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
			var rating = this.parentNode.querySelector('.comment_rating');
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
	var reply = document.querySelectorAll('a.reply');
	var reply_comments = document.querySelectorAll('.reply_form textarea');
	var reply_submit = document.querySelectorAll('.reply_form input[type=submit]');
	for (var i = 0; i < reply.length; i++){
		console.log(reply[i]);
		reply[i].onclick = function(e){
			this.classList.toggle('active');
			return false;
		};
	}
	for (var i = 0; i < reply_comments.length; i++){
		reply_comments[i].onkeyup = function(e){
			e.preventDefault();
			this.parentNode.querySelector('input[type=submit]').classList.add('allow');
		};
		reply_comments[i].onblur = function(){
			if (this.value == '')
				this.parentNode.querySelector('input[type=submit]').classList.remove('allow');
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
submit.onclick = function(){
	if (validateEmail(input.value)){
		document.querySelector('.subscribe_text').innerHTML = "Thank you!";
		document.querySelector('.subscribe form').innerHTML = "You have successfully subscribed to our blog.";
		return false;
	}	
	else{
		document.querySelector('.input').classList.add('valid_err');
		return false;
	}
};
input.onkeyup = function(){
	document.querySelector('.input').classList.remove('valid_err');
	return true;
};
notify.onclick = function(){
	this.style.display = "none";
	document.querySelector('.notify > form').style.display = "block";
	return false;
};
comment.onkeyup = function(){
	document.querySelector('.comment_form input[type=submit]').classList.add('allow');
};
comment.onblur = function(){
	if (this.value == '')
		document.querySelector('.comment_form input[type=submit]').classList.remove('allow');
};
main_submit.onclick = function(e){
	e.preventDefault();
	if (this.className != 'allow')
		return;
	var new_comment = createComment(comment);
	comment.value = "";
	comments.insertBefore(new_comment,comments.firstChild);
	replyCount();
	voteCount()//Regenerate after creating
	timer();
};
more.onclick = function(){
	this.style.display = "none";
	document.querySelector('.read_more .hidden_text').style.display = "block";
	less.style.display = "inline";
	return false;
};
less.onclick = function(){
	this.style.display = "none";
	document.querySelector('.read_more .hidden_text').style.display = "none";
	more.style.display = "inline";
	return false;
};
close.onclick = function(){
	success.style.top = "-50px";
	clearTimeout(ad_timer);
}
equalHeight();
tooltipCheckViewport();
replyCount();
voteCount();
