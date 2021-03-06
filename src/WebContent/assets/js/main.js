var isLogin = false;
var today_recite = 0;
var today_review = 0;
var username = "";

//用户七天数据
var recite_data;
var review_data;
var recite_timelabel;
var label_word_static;

//mysql
var mysql_user = "root"
var mysql_password = "maxinyin"
var mysql_url = "jdbc:mysql://localhost:3306/vocabulary?useSSL=false";

(function($) {
		
	skel.breakpoints({
		xlarge:		'(max-width: 1680px)',
		large:		'(max-width: 1280px)',
		medium:		'(max-width: 980px)',
		small:		'(max-width: 736px)',
		xsmall:		'(max-width: 480px)',
		xxsmall:	'(max-width: 360px)'
	});

	$(function() {
		

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$footer = $('#footer'),
			$main = $('#main'),
			$main_articles = $main.children('article');

			$body.addClass('is-loading');
			
			$('.log-href').mouseenter(function() {
				$(this).css('color', 'rgba(255, 255, 255, 0.7)');
				$(this).css('border-bottom', '0.15rem solid rgba(255, 255, 255, 0.7)');
			})
			
			$('.log-href').mouseleave(function() {
				$(this).css('color', 'rgba(255, 255, 255, 0.4)');
				$(this).css('border-bottom', '0.15rem solid rgba(255, 255, 255, 0.4)');
			})
			
			$('.log-href').click(function(event) {
				$(this).css('color', 'rgba(255, 255, 255, 1)');
				$(this).css('border-bottom', '0.15rem solid rgba(255, 255, 255, 1)');
				if (!isLogin) {
					var $article = $main_articles.filter('#log');
					//$body.addClass('is-article-visible');
					setTimeout(function() {
								$header.hide();
								$footer.hide();
								$main.show();
								$article.show();
	
								setTimeout(function() {
									$article.addClass('active');
										$window
											.scrollTop(0)
											.triggerHandler('resize.flexbox-fix');
										setTimeout(function() {
											locked = false;
										}, delay);
								}, 25);
					}, delay);	
				} else {
					event.preventDefault();
					isLogin = !isLogin;
					username = "";
					today_recite = 0;
					today_review = 0;
					$('#header > nav > ul > li:nth-child(3) > a').attr('href', '#log');
					$('#header > nav > ul > li:nth-child(3) > a > strong').text("LOG");
					$("#header > div.content > div > h1").text("LESSWORD");
					$('.log-href > text').text('log in');
					$('.recite-goal-today').hide();
				    $('.review-goal-today').hide();
				    $('.cut-line').hide();
				    $('.login-first').show();
				    $('#start-recite').removeClass("disabled");
				    $('#start-review').removeClass("disabled");
				    
				    var origin_class = $("#header > div.logo > span").prop("className").split(' ')[1];
				    $("#header > div.logo > span").removeClass(origin_class);
                    $("#header > div.logo > span").addClass("fa-grav");
                    $("#header > div.logo").removeAttr('width');
                    $("#header").append("<style>#header .logo .icon:before{font-size: 5.5rem}</style>");
                    
                    $('#task > div.slide-container > div.card.flipped').removeClass('flipped');;
                    $('#task > div.slide-container > div.card > div.back').hide();
                    $('#task > div.slide-container > div.card > div.front').hide();
                    
                    
                    $('.refresh').hide();
                    $('.arrow').hide();
                    $('.word-container').hide();
			
				    
				}
			})

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});
			$('form').placeholder();
			if (skel.vars.IEVersion < 12) {
				var flexboxFixTimeoutId;
				$window.on('resize.flexbox-fix', function() {
					clearTimeout(flexboxFixTimeoutId);
					flexboxFixTimeoutId = setTimeout(function() {
						if ($wrapper.prop('scrollHeight') > $window.height())
							$wrapper.css('height', 'auto');
						else
							$wrapper.css('height', '100vh');

					}, 250);
				}).triggerHandler('resize.flexbox-fix');

			}

		// Nav.
			var $nav = $header.children('nav'),
				$nav_li = $nav.find('li');
				if ($nav_li.length % 2 == 0) {
					$nav.addClass('use-middle');
					$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');
				}

		// Main.
			var	delay = 325,
				locked = false;
				$main._show = function(id, initial) {
					var $article = $main_articles.filter('#' + id);
						if ($article.length == 0)
							return;
							if (locked || (typeof initial != 'undefined' && initial === true)) {
									$body.addClass('is-switching');
									$body.addClass('is-article-visible');
									$main_articles.removeClass('active');

									$header.hide();
									$footer.hide();

									$main.show();
									$article.show();
									$article.addClass('active');

									locked = false;
									setTimeout(function() {
										$body.removeClass('is-switching');
									}, (initial ? 1000 : 0));
								return;
							}

							locked = true;

						if ($body.hasClass('is-article-visible')) {
								var $currentArticle = $main_articles.filter('.active');
								$currentArticle.removeClass('active');

								setTimeout(function() {
										$currentArticle.hide();
										$article.show();
										setTimeout(function() {
											$article.addClass('active');
												$window
													.scrollTop(0)
													.triggerHandler('resize.flexbox-fix');
												setTimeout(function() {
													locked = false;
												}, delay);
										}, 25);
								}, delay);
						}
					
						else {
								$body.addClass('is-article-visible');
								setTimeout(function() {
										$header.hide();
										$footer.hide();
										$main.show();
										$article.show();

										setTimeout(function() {
											$article.addClass('active');
												$window
													.scrollTop(0)
													.triggerHandler('resize.flexbox-fix');
												setTimeout(function() {
													locked = false;
												}, delay);
										}, 25);
								}, delay);
						}
				};

				$main._hide = function(addState) {
					var $article = $main_articles.filter('.active');
						if (!$body.hasClass('is-article-visible'))
							return;
						if (typeof addState != 'undefined'
						&&	addState === true)
							history.pushState(null, null, '#');

							if (locked) {
									$body.addClass('is-switching');
									$article.removeClass('active');
									$article.hide();
									$main.hide();
									$footer.show();
									$header.show();
									$body.removeClass('is-article-visible');
									locked = false;
									$body.removeClass('is-switching');
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');
								return;

							}
							locked = true;
						$article.removeClass('active');
						setTimeout(function() {
								$article.hide();
								$main.hide();
								$footer.show();
								$header.show();

								setTimeout(function() {
									$body.removeClass('is-article-visible');
										$window
											.scrollTop(0)
											.triggerHandler('resize.flexbox-fix');
										setTimeout(function() {
											locked = false;
										}, delay);
								}, 25);
						}, delay);
				};


				$main_articles.each(function() {
					var $this = $(this);
						$('<div class="close">Close</div>')
							.appendTo($this)
							.on('click', function() {
								location.hash = '';
							});
						$this.on('click', function(event) {
							event.stopPropagation();
						});
				});


				$body.on('click', function(event) {
						if ($body.hasClass('is-article-visible'))
							$main._hide(true);

				});

				$window.on('keyup', function(event) {
					switch (event.keyCode) {
						case 27:
								if ($body.hasClass('is-article-visible'))
									$main._hide(true);
							break;
						default:
							break;

					}
				});

				$window.on('hashchange', function(event) {
						if (location.hash == ''
						||	location.hash == '#') {
								event.preventDefault();
								event.stopPropagation();
								$main._hide();
								$('.log-href').show();
						}

						else if ($main_articles.filter(location.hash).length > 0) {
								event.preventDefault();
								event.stopPropagation();
								$main._show(location.hash.substr(1));
								
						}

				});
		
				if ('scrollRestoration' in history)
					history.scrollRestoration = 'manual';
				else {
					var	oldScrollPos = 0,
						scrollPos = 0,
						$htmlbody = $('html,body');
					$window
						.on('scroll', function() {
							oldScrollPos = scrollPos;
							scrollPos = $htmlbody.scrollTop();

						})
						.on('hashchange', function() {
							$window.scrollTop(oldScrollPos);
						});

				}
		
					$main.hide();
					$main_articles.hide();
					if (location.hash != ''
					&&	location.hash != '#')
						$window.on('load', function() {
							$main._show(location.hash.substr(1), true);
						});

	});

})(jQuery);