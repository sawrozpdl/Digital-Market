function Carousel(container, controls, width, responsive, delay, direction, fps, speed) {

    this.mainContainer = container;
    this.controls = controls;
    this.imageWrapper = this.mainContainer.getElementsByClassName('carousel-image-wrapper')[0];
    this.WIDTH = width;
    this.responsive = responsive;
    this.IMAGE_STAY = delay;
    this.FRAME_PER_SECOND = fps;
    this.SLIDE_DIRECTION = direction;
    this.SPEED = speed;
    this.WIDTH_RATE = 5 * this.SPEED;

    this.indexArea = null;
    this.arrowNext = null;
    this.arrowPrev = null;

    var imageCount = 0;
    var imageWidth = 0;
    var imageHeight = 0;
    var wrapperWidth = 0;
    var spanFont = 1;
    var isSliding = false;
    var left = 0;
    var position = 0;
    var images = this.imageWrapper.getElementsByTagName('img');

    var init = function () {

        this.mainContainer.style.position = 'relative';
        this.imageWrapper.style.position = 'absolute';
        this.imageWrapper.style.left = '0px'; // IMP
        this.imageWrapper.classList.add('clearfix');
        this.mainContainer.style.overflow = 'hidden';
        this.mainContainer.classList.add('clearfix');


        this.arrowPrev = document.createElement('span');
        this.arrowNext = document.createElement('span');
        if (!controls) {
            this.arrowNext.style.display = "none";
            this.arrowPrev.style.display = "none";
        }
        this.arrowPrev.setAttribute('class', 'fa fa-arrow-left arrowPrev');
        this.arrowNext.setAttribute('class', 'fa fa-arrow-right arrowNext');
        this.mainContainer.appendChild(this.arrowPrev);
        this.mainContainer.appendChild(this.arrowNext);

        this.indexArea = document.createElement('div');
        this.indexArea.style.position = 'absolute';
        this.indexArea.style.zIndex = "1";
        this.indexArea.style.bottom = '5%';
        this.mainContainer.appendChild(this.indexArea);

        imageWidth = images[0].naturalWidth;
        imageHeight = images[0].naturalHeight;
        imageCount = images.length;
        spanFont = imageHeight / 16;
        for (var foot = 0; foot < imageCount; foot++) {
            var temp = document.createElement('div');
            temp.setAttribute('id', 'index' + foot);
            temp.style.display = 'inline-block';
            temp.setAttribute('index', foot);
            this.indexArea.appendChild(temp);
        }
        this.indexArea.style.left = ((imageWidth - spanFont * (2 * imageCount - 1) / 2) / 2) + 'px';
        this.indexArea.childNodes[0].classList.add('active');
    }.bind(this);

    var startStuff = function () {
        console.log("here");
        for (var i = 0; i < images.length; i++) {
            element = images[i];
            element.style.float = 'left';
            if (this.WIDTH != 0) {
                imageWidth = this.WIDTH;
                imageHeight = this.WIDTH * (element.naturalHeight / element.naturalWidth);
                element.style.width = imageWidth + 'px';
                element.style.height = imageHeight + 'px';
            }
            wrapperWidth += imageWidth;
        }

        spanFont = imageHeight / 16;

        this.mainContainer.style.width = imageWidth + 'px';
        this.mainContainer.style.height = imageHeight + 'px';   
        this.imageWrapper.style.width = wrapperWidth + 'px';
        this.imageWrapper.style.height = imageHeight + 'px'; 

        this.arrowPrev.style.fontSize = spanFont;
        this.arrowNext.style.fontSize = spanFont;
        this.arrowPrev.style.padding = `0px ${spanFont / 2}px`;
        this.arrowNext.style.padding = `0px ${spanFont / 2}px`;
        this.arrowPrev.style.top = ((imageHeight - spanFont * 2) / 2) + 'px';
        this.arrowNext.style.top = this.arrowPrev.style.top;

        var count = 0;
        var autoSlide = setInterval(function () {
            if (this.SLIDE_DIRECTION == 0) return;
            var autoClick = (this.SLIDE_DIRECTION == -1) ? this.arrowPrev : this.arrowNext;
            if (count++ == this.IMAGE_STAY) autoClick.click();
        }.bind(this), 1000);

        this.arrowPrev.onclick = function () {
            if (isSliding) return;
            if (position == 0)
                position = imageCount - 1;
            else --position;
            slide();
        }

        this.arrowNext.onclick = function () {
            if (isSliding) return;
            if (position == (imageCount - 1))
                position = 0;
            else ++position
            slide();
        }

        var that = this;

        var slide = function () {
            var destination = -1 * position * imageWidth;
            if (left == destination) return;
            var direction = 1;
            if (left > destination)
                direction = -1;
            isSliding = true;
            left += (destination - left) % that.WIDTH_RATE; // keep in sync
            var anim = setInterval(function () {
                left += direction * that.WIDTH_RATE; // 10 pixels
                that.imageWrapper.style.left = left + 'px';
                if (left == destination) {
                    clearInterval(anim);
                    isSliding = false;
                    count = 0;
                }
            }.bind(this), 1000 / this.FRAME_PER_SECOND);
            updateIndices();
        }

        for (var j = 0; j < imageCount; j++) {
            var temp = this.indexArea.childNodes[j];
            temp.style.width = (spanFont / 2) + 'px';
            temp.style.height = (spanFont / 2) + 'px';
            temp.style.marginRight = (spanFont / 2) + 'px';
            temp.onclick = function () {
                if (isSliding) return;
                position = this.getAttribute('index');
                slide();
            };
        }
    }.bind(this);

    var that = this;

    this.goLeft = function () {
        that.arrowPrev.click();
    }

    this.goRight = function () {
        that.arrowNext.click();
    }

    function updateIndices() {
        that.indexArea.childNodes.forEach(node => {
            if (node.getAttribute('index') == position)
                node.classList.add('active');
            else
                node.classList.remove('active');
        });
    }
    init();
    startStuff();

    this.stopSlider = function() {
        clearInterval();
    }

    window.onresize = function() {
        if (!this.responsive) return;
        this.WIDTH = this.mainContainer.parentElement.clientWidth;
        startStuff();
    }.bind(this);
}

var container = document.getElementsByClassName('carousel-container')[0];
var slider = new Carousel(container, false, container.parentElement.clientWidth, true, 2, 1, 60, 1);

var leftSpan = document.getElementsByClassName("left-slider")[0];
leftSpan.onclick = function () {
    slider.goLeft();
}

var rightSpan = document.getElementsByClassName("right-slider")[0];
rightSpan.onclick = function () {
    slider.goRight();
}


document.getElementById('burger-menu').onclick = function () {
    document.getElementById('nav-menu').classList.toggle('display');
};

var info = document.getElementsByClassName('image-slider-right')[0];
info.onclick = function () {
    //document.getElementsByClassName('hover-content')[3].classList.toggle('info-hover'); //no transition with this
    var hcontent = document.getElementsByClassName('hover-content')[3];
    if (hcontent.style.opacity == 1) {
        hcontent.style.zIndex = "0";
        hcontent.style.opacity = "0";
    } else {
        hcontent.style.zIndex = "2";
        hcontent.style.opacity = "1";
    }
}