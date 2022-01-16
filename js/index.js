function random_rgb(){ 
    let rgb = "4px solid rgb(" + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ")";
    // console.log(typeof(rgb), rgb);
    return rgb;
}

setInterval(
    function(){
        let rgb = random_rgb();
        document.getElementById("bubble").style.border = rgb;
        document.getElementById("profile_pic").style.border = rgb;
        document.getElementById("button_1").style.borderTop = rgb;
        document.getElementById("button_1").style.borderBottom = rgb;
        document.getElementById("button_2").style.borderTop = rgb;
        document.getElementById("button_2").style.borderBottom = rgb;
    },500
);