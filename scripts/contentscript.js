$(document).ready(function() {
	if (window.location.host == "twitter.com") {
		$(document).bind("DOMNodeInserted", monitor_twitter);
	}
	else if (window.location.host == "www.facebook.com") {
		$(document).bind("DOMNodeInserted", add_fb_messages);
		add_fb_messages();
	}
	else if (window.location.host.split('.').slice(0, 2).join('.') == "mail.google") {
		$(document).bind("DOMNodeInserted", gmail_listen_again);
		setTimeout(reply_all_check, 1000);
	}
})

// GMAIL SECTION HERE //

function gmail_listen_again() {
	if ($('div.K98VUe').length > 0) {
		$('div.K98VUe').unbind('click');
		$('div.K98VUe').click(function() {
			set_reply_all_message();
		});
	}
}

function reply_all_check() {
	if ($('td.mC > div >span.mG:first').text() == "Reply to all") {
		set_reply_all_message();
	}
	else {
		if ($('.reply_all_reminder').is(":visible")) {
			$('.reply_all_reminder').remove();
		}
	}
	setTimeout(reply_all_check, 1000);
}

function set_reply_all_message() {
	if ($('.reply_all_reminder').length == 0) {
		$('.J-Jw').each(function(index, element) {
			if (index == 1) {
				$(element).append('<div class="reply_all_reminder"><div class="padded_shame"></div></div>');
				var reply_all_message = reply_all_messages[Math.floor(Math.random() * reply_all_messages.length)];
				$('.padded_shame').html(reply_all_message);
			}
		});
	}
}

var reply_all_messages = ['Before you hit Send, make sure you intended to Reply All.',
							'Reply All, huh? Might be a good idea to edit out the comments about your boss’ power suit.',
							'Keep it clean&mdash;it looks like you’re replying to everybody.',
							'You’re pretty sure this message needs to go to everybody? We’ll take your word for it.',
							'Terry’s hair <em>does</em> look weird, but you may not want to Reply All saying so.',
							'Don’t you hate it when someone does a Reply All when they don’t need to? That could be you right now.',
							'If you want to say bad things about your coworker, make sure they’re not included in this Reply All. Done? Then please continue.',
							'You may be the Dirk Nowitzki of email, but you should check to make sure you meant to Reply All.']

// TWITTER SECTION HERE //

var target_div = '';
var num_popups = 0;
var last_num_popups = 0;
var last_bind = 1;
var num_binds = 0;
var active_popup = '';
var last_popup_subtree = '';
var hash = '**starter**';
var change_count = 0;

function monitor_twitter() {
	if (window.location.hash != hash) {
		$('.tweet-box-title > h2').removeClass('shame_monitored')
	}
		change_count = change_count + 1;
		if (!$('.tweet-box-title > h2').hasClass('shame_monitored')) {
			$('.tweet-box-title > h2').unbind("DOMSubtreeModified");
			$('.tweet-box-title > h2').bind("DOMSubtreeModified",function(){
				var type = $('.tweet-box-title > h2').text().split(' ')[0];
				var user = $('.tweet-box-title > h2').text().split(' ')[1];
				//console.log('main subtree baby');
				target_div = 'main';
				if ($('.twttr-dialog-container').css('visibility') == 'visible') {
					$('.main-tweet-box > .tweet-box > #twitter_shame_message').remove();
				}
				else {
					insert_twitter_message(type, user);
				}
			 });
			$('.tweet-box-title > h2').addClass('shame_monitored');
		}
		num_popups = $('.twttr-dialog-container').length;
		if ($('.twttr-dialog-container').length > 1) {
			$('.twttr-dialog-container:first').remove();
		}
		if (num_popups != last_num_popups) {
			active_popup = 'shame_' + num_popups;
			$('.twttr-dialog-container').last().addClass(active_popup);
			if (!$('.' + active_popup).hasClass('shame_monitored')) {
				num_binds = num_binds + 1;
				last_num_popups = num_popups;
				$('.twttr-dialog-content > .tweet-box > .text-area').append('<div id="twitter_shame_message" class="shame"><div id="padded_shame">Testing</div></div>');
				$('.shame_' + (last_num_popups)).unbind("DOMSubtreeModified");
				$('.' + active_popup).unbind("DOMSubtreeModified");
				$('.' + active_popup).bind("DOMSubtreeModified",function(){
					var type = $('.twttr-dialog-header > h3').last().text().split(' ')[0];
					var user = $('.twttr-dialog-header > h3').last().text().split(' ')[1];
					target_div = 'popup';
					if (last_popup_subtree != (type + ' ' + user)) {
						insert_twitter_message(type, user);
						last_popup_subtree = (type + ' ' + user);
					}
				 });
				last_bind = num_binds;
				$('.' + active_popup).addClass('shame_monitored');
			}
		}

			if ($('.main-tweet-box > .tweet-box > .text-area > #twitter_shame_message').length == 0) {
				// console.log($('.tweet-button-container').is(':visible'));
				var message = everyone_tweets[Math.floor(Math.random() * everyone_tweets.length)];
				$('.main-tweet-box > .tweet-box > .text-area').append('<div id="twitter_shame_message"><div id="padded_shame" class="shame">' + message + '</div></div>');
				target_div = 'main';
			}
		if ($('.twttr-dialog-content > .tweet-box > .text-area > #twitter_shame_message').length != num_popups) {
			var message = everyone_tweets[Math.floor(Math.random() * everyone_tweets.length)];
			$('.twttr-dialog-content > .tweet-box > .text-area').append('<div id="twitter_shame_message" class="pop_shame"><div id="padded_shame" class="shame">' + message + '</div></div>');
		}

	hash = window.location.hash;
}

function insert_twitter_message(type, user, div) {
	var shame_message = '';
	if (type == 'Message' && !$('#padded_shame').hasClass('dm')) {
		// ////console.log('dm: ' + $('#padded_shame').hasClass('dm'));
		$('#padded_shame').removeClass();
		$('#padded_shame').addClass('dm shame');
		var dm_message = dm_messages[Math.floor(Math.random() * dm_messages.length)];
		shame_message = dm_message.replace(/rEpLaCe/g, "@" + user);
		// $('#padded_shame').html(dm_message);
		// $('#padded_shame').html("This message will only be seen by " + user + ".");
	}
	else if (type == 'Mention' && !$('#padded_shame').hasClass('mention')) {
		// ////console.log('mention');
		$('#padded_shame').removeClass();
		$('#padded_shame').addClass('mention shame');
		var mention = mentions[Math.floor(Math.random() * mentions.length)];
		mention = mention.replace(/rEpLaCe/g, "@" + user);
		if (user == 'lifehacker') {
			mention = "Thanks for messaging us!";
		}
		else if (user == 'oprah') {
			mention = "You get a tweet! You get a tweet! You all get a tweet!";
		}
		else if (user == 'ladygaga') {
			mention = "I’ll be over here with my prosciutto jacket.";
		}
		else if (user == 'justinbieber') {
			mention = "PSA: Justin Bieber doesn’t care what you say or who you are. He’s not going to marry you. *sigh*";
		}
		else if (user == 'parishilton') {
			mention = "Why are you messaging @parishilton? Is this 2003? Twitter wasn't even around then.";
		}
		shame_message = mention;
	}
	else if (user == 'happening?' && !$('#padded_shame').hasClass('everyone')) {
		$('#padded_shame').removeClass();
		$('#padded_shame').addClass('everyone shame');
		var everyone_tweet = everyone_tweets[Math.floor(Math.random() * everyone_tweets.length)];
		everyone_tweet = everyone_tweet.replace(/rEpLaCe/g, "@" + user);
		shame_message = everyone_tweet;
	}
	if (shame_message == '') {
		return;
	}
	else {
		$('.shame').each(function(index, element) {
			$(element).html(shame_message);
		});
	}
}

var dm_messages = ['Whoa, you know rEpLaCe? Very cool. This DM is just between you two.', 
					'This is a private conversation between you and rEpLaCe.', 
					'How do you know rEpLaCe? I went to high school with rEpLaCe! Enjoy your private conversation.',
					'Are you sure you don’t want to share your hilarious conversations with rEpLaCe with everyone else? Positive? OK then, DM away!'];
					
var mentions = ['rEpLaCe and people who follow both you and rEpLaCe can see this in their timelines, but anyone <em>can</em> see it.',
				'Your message is visible to rEpLaCe, <em>and</em> to anyone who’s bored enough to click on either one of your timelines.',
				'You may think only rEpLaCe can see your message, but anyone who follows both of you will&mdash;and anyone on the internet can.',
				'Not so fast Weiner. Even though you’re mentioning rEpLaCe, anyone can see this. Send a message if you want a private conversation.',
				'This message can be seen publicly by everyone, and will appear in the timelines of everyone who follows you and rEpLaCe.'];
				
var everyone_tweets = ['Ha! That’s a good one. <em>All</em> your followers will like that one.',
						'Everyone can see this. Don’t use too many dirty words.',
						'You might want to use spell check before you hit send. Everyone can see what you’re tweeting.',
						'Remember, I before E, except after C. And when you’re spelling Weiner. (Everyone can see this.)',
						'Is your mother on Twitter? Your mother can see this. So can everyone else. Think about what you’re saying.',
						'This message can be seen publicly by everyone on the internets.'];
						

// FACEBOOK SECTION HERE //

var visible_to = '';

function add_fb_messages() {
	if ($('#post_to_your_feed_warning').length == 0 || visible_to != $('.fbPrivacyWidget').find('.uiTooltipText').text()) {
		$('#post_to_your_feed_warning').show();
		visible_to = $('.fbPrivacyWidget').find('.uiTooltipText').text();

		// top news feed box logic here
		var feed_post_message = '';
		if (visible_to == 'Everyone') {
			var feed_post_message = feed_everyone[Math.floor(Math.random() * feed_everyone.length)];
		}
		else if (visible_to == 'Friends of Friends and Networks') {
			var feed_post_message = feed_friends_of_networks[Math.floor(Math.random() * feed_friends_of_networks.length)];
		}
		else if (visible_to == 'Friends and Networks') {
			var feed_post_message = feed_friends_and_networks[Math.floor(Math.random() * feed_friends_and_networks.length)];
		}
		else if (visible_to == 'Friends of Friends') {
			var feed_post_message = feed_friends_of_friends[Math.floor(Math.random() * feed_friends_of_friends.length)];
		}
		else if (visible_to == 'Friends Only') {
			var feed_post_message = feed_friends_only[Math.floor(Math.random() * feed_friends_only.length)];
		}
		else if (visible_to == 'Customize') {
			var feed_post_message = feed_customize[0];
		}
		if ($('#pagelet_header_personal').length == 0) {
		
		
			if ($('#post_to_your_feed_warning').length == 0) {
				$('.showOnceInteracted.uiComposerMessageBoxControls').prepend('<div id="post_to_your_feed_warning" class="set"><div id="padded_shame">' + visible_to + ': ' + feed_post_message + '</div></div>');
			}
			else {
				$('#padded_shame').html(visible_to + ': ' + feed_post_message);
			}
		
		}
		else {
			var user = $('#pagelet_header_personal > div.profileHeader').attr('title');
			var wall_post = wall_posts[Math.floor(Math.random() * wall_posts.length)];
			wall_post = wall_post.replace(/rEpLaCe/g, user);
			if ($('#padded_shame').length == 0) {
				$('.showOnceInteracted.uiComposerMessageBoxControls').prepend('<div id="post_to_your_feed_warning"><div id="padded_shame">' + wall_post + '</div></div>');
			}
			else {
				$('#padded_shame').html(wall_post);
			}
		}
		if (feed_post_message == '') {
			$('#post_to_your_feed_warning').hide();
		}

	}
	// commenting on other ppl's stuff logic here
	if ($('.mini_visibility_warning').length != $('.uiUfiAddComment').length) {
		$('.uiUfiAddComment').each(function(index, element) {
			if ($(element).find('.mini_visibility_warning').length == 0) {
				var post_comment = post_comments[Math.floor(Math.random() * post_comments.length)];
				$(element).append('<div class="mini_visibility_warning"><div class="padded_shame" style="padding-left:0px;">' + post_comment + '</div></div>');
			}
		});
	}
}

var wall_posts = ['Posting to rEpLaCe’s wall is not the same as sending a message. Anyone who can see this wall can see your post.',
					'Whatever you post to this wall will be visible to anyone rEpLaCe’s settings allow to see it.'];
					
var post_comments = ['Note: Everyone who can see the original post in this thread will see your comment.',
					'Feel like throwing in your two cents, do ya? Just remember, if someone can see the original post, they’ll see your comment.'];
					
var feed_everyone = ['Everyone can see this. That includes your grandma, your priest, and your thought-controlling government.',
					'You like to update the internet at large, huh? Respect. (If not, you may want to change your privacy settings.)',
					'This post will be visible to every person on the internet. All 2 billion of them.',
					'You keep your friends close, and your enemies closer. Or at least I\'ll assume that’s why you’re posting this to everyone.'];
					
var feed_friends_of_networks = ['This post will be visible to your friends, <em>their</em> friends, and all your networks.',
								'Trust your friends’ taste? This post will be visible to all of their friends, along with your networks.'];
								
var feed_friends_and_networks = ['This post will be visible only to your Facebook friends and your networks.',
								'Is your boss part of your work network? She’ll be able to read this post, along with the rest of your friends.'];
								
var feed_friends_of_friends = ['Trust your friends’ taste? This post will be visible to all of their friends.',
							'This post will be visible to Friends of Friends. No, that doesn’t mean Ross and Rachel. Why would you ever think that?',
							'Your friends and <em>their</em> friends will be able to see what you post here.'];
							
var feed_friends_only = ['You like to keep your communication close to the chest, huh? This post will be visible to your friends only.',
					'Trust no one. Whatever you post here will be visible only to your Facebook friends.'];
					
var feed_customize = ['Customized your settings, did you? We’re impressed&mdash;and will assume you know what you’re doing.'];