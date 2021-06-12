/*
 *  made for Alexey Krimskiy
 */

$(document).ready(function () {
  var input = $('.field').find('input, textarea');
  input.keyup(function () {
    inputTest(this);
  });
});

function inputTest(that) {
  var field = $(that).closest('.field');
  var form = $(that).closest('form, .form');
  var length = $.trim($(that).val()).length;

  //  FILLED
  if (length > 0) field.addClass('filled');else field.removeClass('filled');

  //  VALIDATED
  if (length >= 4) {
    field.addClass('validated');
    form.addClass('validated');
  } else {
    field.removeClass('validated');
    form.removeClass('validated');
  }
}
var Timer = {
  length: null,
  time: null,
  selector: null,
  interval: null,
  callback: null,

  //  RUN
  run: function (selector, callback, length) {
    Timer.length = length;
    Timer.time = Timer.length;
    Timer.selector = selector;
    Timer.callback = callback;
    $(Timer.selector).text(Timer.length);
    Timer.interval = setInterval(Timer.count, 1000);
  },

  //  COUNT
  count: function () {
    Timer.time = Timer.time - 1;
    $(Timer.selector).text(Timer.time);
    if (Timer.time <= 0) {
      if (typeof Timer.callback === 'function' && Timer.callback) Timer.callback();
      Timer.reset();
    }
  },

  //  RESET
  reset: function () {
    clearInterval(Timer.interval);
    Timer.length = null;
    Timer.time = null;
    Timer.selector = null;
    Timer.interval = null;
    Timer.callback = null;
  }
};
var Identity = {
  duration: 1400,
  delay: 500,
  iteration: 0,
  processing: false,
  enough: false,
  interval: null,
  callback: null,
  status: 'loading',
  id: '#identity',
  selector: '#identity div',
  classes: 'working rest robot',

  //  WORK
  work: function () {
    if (Identity.status != 'loading') Identity.status = 'working';
    Identity.wait(function () {
      $(Identity.id).addClass('working');
    });
  },

  //  ROBOT
  robot: function () {
    Identity.status = 'robot';
    Identity.wait(function () {
      $(Identity.id).addClass('robot');
    });
  },

  //  REST
  rest: function () {
    Identity.abort();
    Identity.status = 'rest';
    setTimeout(function () {
      Identity.abort();
      $(Identity.id).addClass('rest');
    }, Identity.delay);
  },

  //  WAIT
  wait: function (call) {
    if (Identity.processing != true) {
      Identity.abort();
      Identity.processing = true;

      setTimeout(function () {
        if (typeof call === 'function' && call) call();
        Identity.waiting();
        Identity.interval = setInterval(Identity.waiting, Identity.duration);
      }, Identity.delay);
    }
  },

  //  WAITING
  waiting: function () {
    if (Identity.enough != true) {
      ++Identity.iteration;
      return;
    }

    Identity.stopping();
  },

  //  STOP
  stop: function (callback) {
    setTimeout(function () {
      if (Identity.processing == true) {
        Identity.enough = true;
        Identity.callback = callback;

        $(Identity.selector).attr('style', 'animation-iteration-count: ' + Identity.iteration + '; -webkit-animation-iteration-count: ' + Identity.iteration + ';');
      }
    }, Identity.delay);
  },

  //  STOPPING
  stopping: function () {
    clearInterval(Identity.interval);
    Identity.rest();

    if (typeof Identity.callback === 'function' && Identity.callback) Identity.callback();
    Identity.reset();
  },

  //  ABORT
  abort: function () {
    if (Identity.status == 'robot') $(Identity.id).removeClass('robot');else if (Identity.status != 'loading' && Identity.processing != true) $(Identity.id).removeClass(Identity.classes + ' loading');else $(Identity.id).removeClass(Identity.classes);
  },

  //  RESET
  reset: function () {
    Identity.iteration = 0;
    Identity.processing = false;
    Identity.enough = false;
    Identity.interval = null;
    Identity.callback = null;

    $(Identity.selector).removeAttr('style');
  }
};
var Stars = {
  canvas: null,
  context: null,
  circleArray: [],
  colorArray: ['#4c1a22', '#4c1a23', '#5d6268', '#1f2e37', '#474848', '#542619', '#ead8cf', '#4c241f', '#d6b9b1', '#964a47'],

  mouseDistance: 50,
  radius: .5,
  maxRadius: 1.5,

  //  MOUSE
  mouse: {
    x: undefined,
    y: undefined,
    down: false,
    move: false
  },

  //  INIT
  init: function () {
    this.canvas = document.getElementById('stars');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.display = 'block';
    this.context = this.canvas.getContext('2d');

    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('resize', this.resize);

    this.prepare();
    this.animate();
  },

  //  CIRCLE
  Circle: function (x, y, dx, dy, radius, fill) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = this.radius;

    this.draw = function () {
      Stars.context.beginPath();
      Stars.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      Stars.context.fillStyle = fill;
      Stars.context.fill();
    };

    this.update = function () {
      if (this.x + this.radius > Stars.canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
      if (this.y + this.radius > Stars.canvas.height || this.y - this.radius < 0) this.dy = -this.dy;

      this.x += this.dx;
      this.y += this.dy;

      //  INTERACTIVITY
      if (Stars.mouse.x - this.x < Stars.mouseDistance && Stars.mouse.x - this.x > -Stars.mouseDistance && Stars.mouse.y - this.y < Stars.mouseDistance && Stars.mouse.y - this.y > -Stars.mouseDistance) {
        if (this.radius < Stars.maxRadius) this.radius += 1;
      } else if (this.radius > this.minRadius) {
        this.radius -= 1;
      }

      this.draw();
    };
  },

  //  PREPARE
  prepare: function () {
    this.circleArray = [];

    for (var i = 0; i < 1200; i++) {
      var radius = Stars.radius;
      var x = Math.random() * (this.canvas.width - radius * 2) + radius;
      var y = Math.random() * (this.canvas.height - radius * 2) + radius;
      var dx = (Math.random() - 0.5) * 1.5;
      var dy = (Math.random() - 1) * 1.5;
      var fill = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];

      this.circleArray.push(new this.Circle(x, y, dx, dy, radius, fill));
    }
  },

  //  ANIMATE
  animate: function () {
    requestAnimationFrame(Stars.animate);
    Stars.context.clearRect(0, 0, Stars.canvas.width, Stars.canvas.height);

    for (var i = 0; i < Stars.circleArray.length; i++) {
      var circle = Stars.circleArray[i];
      circle.update();
    }
  },

  //  MOUSE MOVE
  mouseMove: function (event) {
    Stars.mouse.x = event.x;
    Stars.mouse.y = event.y;
  },

  //  RESIZE
  resize: function () {
    Stars.canvas.width = window.innerWidth;
    Stars.canvas.height = window.innerHeight;
  }
};
var renderer, scene, camera, ww, wh, particles;

ww = window.innerWidth, wh = window.innerHeight;

var centerVector = new THREE.Vector3(0, 0, 0);
var previousTime = 0;
speed = 10;
isMouseDown = false;

var getImageData = function (image) {

	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;

	var ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0);

	return ctx.getImageData(0, 0, image.width, image.height);
};

function getPixel(imagedata, x, y) {
	var position = (x + imagedata.width * y) * 4,
	    data = imagedata.data;
	return { r: data[position], g: data[position + 1], b: data[position + 2], a: data[position + 3] };
}

var drawTheMap = function () {

	var geometry = new THREE.Geometry();
	var material = new THREE.PointCloudMaterial();
	material.vertexColors = true;
	material.transparent = true;
	for (var y = 0, y2 = imagedata.height; y < y2; y += 1) {
		for (var x = 0, x2 = imagedata.width; x < x2; x += 1) {
			if (imagedata.data[x * 4 + y * 4 * imagedata.width] > 0) {

				var vertex = new THREE.Vector3();
				vertex.x = x - imagedata.width / 2 + (500 - 440 * .5);
				vertex.y = -y + imagedata.height / 2;
				vertex.z = -Math.random() * 500;

				vertex.speed = Math.random() / speed + 0.015;

				var pixelColor = getPixel(imagedata, x, y);
				var color = "rgb(" + pixelColor.r + ", " + pixelColor.g + ", " + pixelColor.b + ")";
				geometry.colors.push(new THREE.Color(color));
				geometry.vertices.push(vertex);
			}
		}
	}
	particles = new THREE.Points(geometry, material);

	scene.add(particles);

	requestAnimationFrame(render);
};

var init = function () {
	renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById("yahia"),
		antialias: true,
		alpha: true
	});
	renderer.setSize(ww, wh);

	scene = new THREE.Scene();

	camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, 1, 1000);
	camera.position.set(0, -20, 4);
	camera.lookAt(centerVector);
	scene.add(camera);
	camera.zoom = 1;
	camera.updateProjectionMatrix();

	imagedata = getImageData(image);
	drawTheMap();

	window.addEventListener('mousemove', onMousemove, false);
	window.addEventListener('mousedown', onMousedown, false);
	window.addEventListener('mouseup', onMouseup, false);
	window.addEventListener('resize', onResize, false);
};
var onResize = function () {
	ww = window.innerWidth;
	wh = window.innerHeight;
	renderer.setSize(ww, wh);
	camera.left = ww / -2;
	camera.right = ww / 2;
	camera.top = wh / 2;
	camera.bottom = wh / -2;
	camera.updateProjectionMatrix();
};

var onMouseup = function () {
	isMouseDown = false;
};
var onMousedown = function (e) {
	isMouseDown = true;
	lastMousePos = { x: e.clientX, y: e.clientY };
};
var onMousemove = function (e) {
	if (isMouseDown) {
		camera.position.x += (e.clientX - lastMousePos.x) / 100;
		camera.position.y -= (e.clientY - lastMousePos.y) / 100;
		camera.lookAt(centerVector);
		lastMousePos = { x: e.clientX, y: e.clientY };
	}
};

var render = function (a) {

	requestAnimationFrame(render);

	particles.geometry.verticesNeedUpdate = true;
	if (!isMouseDown) {
		camera.position.x += (0 - camera.position.x) * 0.06;
		camera.position.y += (0 - camera.position.y) * 0.06;
		camera.lookAt(centerVector);
	}

	renderer.render(scene, camera);
};

var imgData = 'data:image/png;base64,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'
var image = document.createElement("img");
image.src = imgData;
var Submit = {

  //  DATA
  data: function (template, fields) {
    var data = {};
    for (i = 0; i < fields.length; i++) {
      var field = $(fields[i]);
      var name = field.attr('name');
      var value = field.val().replace(/(?:\r\n|\r|\n)/g, '<br>');
      data[name] = value;
    }

    return data;
  },

  //  PUSH
  push: function (form) {
    var template = $('.template[data-template=' + form + ']');
    var fields = template.find('.field input, .field textarea');

    //  WAITING
    Submit.view('[data-status=waiting]', template);

    //  AJAX
    $.ajax({
      type: 'POST',
      url: 'includes/php/' + form + '.php',
      data: { dd: JSON.stringify(Submit.data(template, fields)) },
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        Submit.callback('error', form, template, fields);
      },
      success: function (data) {
        Submit.callback('success', form, template, fields);
      }
    });
  },

  //  CALLBACK
  callback: function (status, form, template, fields) {
    setTimeout(function () {

      //  SUCCESS
      if (status == 'success') {
        template.find('.form .status').removeClass('current');
        fields.closest('.field').fadeOut(700);
        fields.closest('.form').find('.submit').fadeOut(700);
        Identity.stop();

        if (form == 'secret') secretAvailability = false;else if (form == 'opinion') opinionAvailability = false;

        setTimeout(function () {
          fields.closest('.form').find('.submit').remove();
          fields.closest('.field').remove();
          template.find('.form .status[data-status=success]').addClass('current');
        }, 750);
      }

      //  ERROR
      else {
          Submit.view('[data-status=error]', template);
          setTimeout(function () {
            Submit.view(':not([data-status])', template);
          }, 6000);
        }
    }, 4000);
  },

  //	VIEW
  view: function (selector, template) {
    template.find('.form .status').removeClass('current');
    template.find('.form .status' + selector).addClass('current');
  },

  //	LISTEN
  listen: function (selector) {
    $(selector).on('click', function (e) {
      if ($(this).closest('.form').hasClass('validated')) {
        var form = $(this).attr('data-form');
        Submit.push(form);
      }

      e.preventDefault();
    });
  }
};
var Router = {
	wrapper: [],
	location: null,

	//	ROUTE
	route: function (location, callback) {
		Identity.work();
		Router.location = Router.processLocation(location);

		//	ROUTES
		Router.routes(callback);
	},

	//	PROCESS LOCATION
	processLocation: function (location) {
		if (location === undefined) location = window.location.hash;

		return location.replace('#', '');
	},

	//	CALLBACK
	callback: function (callback) {
		setTimeout(function () {
			Identity.stop();
      Router.updateWrapper();
      Router.updateTemplate(Router.wrapper[0]);
      window.location.hash = Router.location;
      Router.location = null;

      //  CALLBACKS
      Router.callbacks(Router.wrapper[0]);
      if (typeof callback === 'function' && callback) callback();
		}, 200);
	},

	//	UPDATE TEMPLATE
	updateTemplate: function (template) {
		var templates = $('.template');
		var current = $('.template[data-template=' + template + ']');

		templates.removeClass('current');
		setTimeout(function () {
			templates.hide();
			current.show().addClass('current');
		}, 1120);
	},

	//	UPDATE WRAPPER
	updateWrapper: function (push, pull) {
		if (push) Router.push(push);
		if (pull) Router.pull(pull);

		var wrapper = Router.wrapper.toString().replace(/,/g, ' ');
		$('.wrapper').attr('class', 'wrapper ' + wrapper);
	},

	//	PUSH
	push: function (items) {
		items = items.split(' ');

		for (i = 0; i < items.length; i++) {
			if (!Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.push(items[i]);
		}
	},

	//	PULL
	pull: function (items) {
		items = items.split(' ');

		for (i = 0; i < items.length; i++) {
			if (Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.splice(Router.wrapper.indexOf(items[i]), 1);
		}
	},

	//	LISTEN
	listen: function () {
		$('.wrapper').on('click', '.router', function (e) {
			Router.route($(this).attr('href'), window[$(this).attr('data-callback')]);
			e.preventDefault();
		});

		window.addEventListener('popstate', function (e) {
			Router.route(undefined);
		});
	}
};
Router.routes = function (callback) {
  Router.wrapper = [];
  var location = Router.location.split('/').filter(Boolean);

  //  HOME
  Router.push('home');

  //  CALLBACK
  Router.callback(callback);
};
Router.callbacks = function (wrapper) {
  if (wrapper == 'secret') secret();else if (wrapper == 'opinion') opinion();else if (wrapper == 'bucketAll') bucketAll();else if (wrapper == 'notFound') notFound();
};
var secretAvailability = true;
function secret() {
  if (secretAvailability == true) {
    setTimeout(function () {
      var input = $('.template[data-template=secret] .field').find('input, textarea');

      input.focus();
      Identity.robot();
    }, Identity.duration * 1.25);
  }
}
var opinionAvailability = true;
function opinion() {
  if (opinionAvailability == true) {
    setTimeout(function () {
      var input = $('.template[data-template=opinion] .field').find('input, textarea');

      input.focus();
      Identity.robot();
    }, Identity.duration * 1.25);
  }
}
function bucketAll() {
  var list = $('.template[data-template=bucketAll] .bucketList');
  var link = list.find('li.archived a');

  //  LISTEN
  link.hover(function () {
    list.addClass('hover');
  }, function () {
    list.removeClass('hover');
  });
}
function notFound() {
  setTimeout(function () {
    Timer.run('.template[data-template=notFound] time', function () {
      Router.route('#ßß');
    }, 5);
  }, Identity.duration * 1.25);
}

function notFoundCallback() {
  Timer.reset();
}
var md = new MobileDetect(window.navigator.userAgent);

$(document).ready(function () {
  Identity.work();
  $('.template main').mCustomScrollbar({
    theme: 'dark'
  });
});

function loadProject() {
  Router.route(undefined, function () {

    //  CALLBACK
    Router.listen();
    Submit.listen('.submit');
    if (!md.mobile()) {
      Stars.init();
      init();
    }
    setTimeout(function () {
      $('#signature').removeClass('loading');
    }, Identity.delay * 1.5);
  });
};

loadProject();