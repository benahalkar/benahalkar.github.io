function random_rgb(){ 
    let rgb = "rgb(" + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ")";
    // console.log(typeof(rgb), rgb);
    return rgb;
}

setInterval(
    function(){
        document.body.style.background = random_rgb()
    },1000
);