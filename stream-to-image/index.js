(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 256;    // We will scale the photo width to this
  var height = 256;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;
  var ws = null;

  const frameCb = (canvas) => () => {
    var context = canvas.getContext('2d');
    if (width && height) {
      // canvas.width = width;
      // canvas.height = height;
      // context.drawImage(video, 0, 0, width, height);
      // var imageData = context.getImageData(0, 0, width, height);
      // var data = imageData.data;
      // var result = []

      // // iterate over all pixels
      // for(var i = 0, n = 256*256*4; i < n; i += 4) {
      //   var red = data[i] || 0;
      //   var green = data[i + 1] || 0;
      //   var blue = data[i + 2] || 0;
      //   result.push(red, green, blue);
      // }
      // console.warn(result.length);
      // const bin = Int8Array.from(result);
      // ws.send(bin);
      takepicture();
    } else {
      console.warn('there');
      clearphoto();
    }
  }

  function startup() {
    // ws = new WebSocket("ws://localhost:9966");
    // ws.onmessage = (event) => console.warn(event); 

    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');
    // ws.onopen = onWSOpen(canvas);

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
      console.warn('can play')
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      setInterval(() => frameCb(canvas)(), 50);
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  

  function takepicture() {
    console.warn('take picture');
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/jpg');
      window.data = data;
      photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();