
function imagePreview(imgSrc, targetElementId) {
    var imgPreviewElement = document.getElementById(targetElementId);
    if(imgSrc) {
        imgPreviewElement.src = imgSrc;
        imgPreviewElement.style.display = 'inline-block';
    } else {
        imgPreviewElement.src = '';
        imgPreviewElement.style.display = 'none';
    }
}


function loadAndPreviewImage(srcNode, targetElementId) {
    var imgSrc = RED.nodes.node(srcNode)?.imgSrc;
    imagePreview(imgSrc, targetElementId);
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject('Error: ', error);
        };
    })
}

function renderLottiePreview(data, targetElementId) {
    var lottiePreviewElement = document.getElementById(targetElementId);
    lottiePreviewElement.innerHTML = "";
    try {
        
        data = JSON.parse(data);
        bodymovin.loadAnimation({
            container: lottiePreviewElement,
            animationData: data,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            name: "Demo Animation",
        });
    } catch(e) {
        console.error(e);
    }
        
}

function loadAndrenderLottiePreview(srcNode, targetElementId) {
    renderLottiePreview(RED.nodes.node(srcNode)?.animation, targetElementId );
}


function selectImageRow(image) {
    if (!image.id) {
        return image.text;
    }
    var imageNode = RED.nodes.node(image.element.value.toLowerCase());
    if(imageNode) {
        var title = imageNode.name;
        if(imageNode.description) {
            title += ' - ' + imageNode.description;
        } 
        return $(
            
            '<div class="select-image-row"><span>' + title +  '</span><div class="img-preview"><img src="' + imageNode.imgSrc + '"  /></div></div>'
        );
    } else {
        return $(
            '<div class="select-image-row"><div class="img-preview"></div> ' + image.text + '</div>'
        );
    }
}

function selectAnimationRow(animation) {
    
    if(!animation) {
        return;
    }
    if (!animation.id) {
        return animation.text;
    }
    var animationNode = RED.nodes.node(animation.element.value.toLowerCase());
    if(animationNode) {
        var title = animationNode.name;
        if(animationNode.description) {
            title += ' - ' + animationNode.description;
        }

        setTimeout(function() {
            renderLottiePreview(animationNode.animation, 'lottie-preview-' + animation.id);
        }, 50)

        return $(
            '<div class="select-animation-row"><span>' + title +  '</span><div class="lottie-preview" id="lottie-preview-' + animation.id + '"></div></div>'
        );
    } else {
        return $(
            '<div class="select-animation-row">' + animation.text + '</div>'
        );
    }
}

function matchCustomImage(params, data) {
    // If there are no search terms, return all of the data
    if ($.trim(params.term) === '') {
        return data;
    }
  
    // Do not display the item if there is no 'text' property
    if (typeof data.text === 'undefined') {
        return null;
    }

    var imageNode = RED.nodes.node(data.id);
    if(imageNode && imageNode.description) {
        data.text += ' - ' + imageNode.description;
    } 
    // `params.term` should be the term that is used for searching
    // `data.text` is the text that is displayed for the data object
    if (data.text.toLowerCase().indexOf(params.term.toLowerCase()) > -1) {
        return $.extend({}, data, true);
    }
 
    return null;
}

var customImageSelect = {
    placeholder: 'Select an option',
    templateResult: selectImageRow,
    matcher: matchCustomImage,
    allowClear: true

}

var customAnimationSelect = {
    placeholder: 'Select an option',
    templateResult: selectAnimationRow,
    matcher: matchCustomImage,
    allowClear: true
}


/* Fetch images */

function fetchImages() {
    var images = [];
    RED.nodes.eachConfig(function(config) {
        if(config.type == 'repo-image-config'){
            images.push({ id: config.id, text: config.name});
        }
    });
    return images;
}



/* Fetch animations */

function fetchAnimations() {
    var animations = [];
    RED.nodes.eachConfig(function(config) {
        if(config.type == 'lottie-animation-config'){
            animations.push({ id: config.id, text: config.name});
        }
    });
    return animations;
}

/* Fetch Glossaries */

function fetchGlossariesArticles() {
    var articles = [];
    RED.nodes.eachConfig(function(config) {
        if(config.type == 'repo-article-config' && config.showAsGlossary){
            articles.push({ id: config.id, text: config.name});
        }
    });
    return articles;
}

/* Fetch Menu */

function fetchMenuArticles() {
    var articles = [];
    RED.nodes.eachConfig(function(config) {
        if(config.type == 'repo-article-config' && config.showAsMenu){
            articles.push({ id: config.id, text: config.name});
        }
    });
    return articles;
}

/* Fetch Menu */

function fetchOverlayArticles() {
    var articles = [];
    RED.nodes.eachConfig(function(config) {
        if(config.type == 'repo-article-config' && config.showAsOverlay){
            articles.push({ id: config.id, text: config.name});
        }
    });
    return articles;
}
