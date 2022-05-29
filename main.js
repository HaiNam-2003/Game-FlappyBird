const canvas = document.getElementById('box');
const context = canvas.getContext('2d');

let khung = 0;

const hinhAnh = new Image();
hinhAnh.src = "img/FL_Image.png";

const DIE = new Audio();
DIE.src = "audio/audio_sfx_die.wav";

const FLAP = new Audio();
FLAP.src = "audio/audio_sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/audio_sfx_hit.wav";

const POINT = new Audio();
POINT.src = "audio/audio_sfx_point.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/audio_sfx_swooshing.wav";

const trangThai = {
    hienTai : 0,
    batDau : 0,
    choiGame : 1,
    thuaGame : 2,
}

const startBtn = {
    x : 155,
    y : 260,
    w : 82,
    h : 26
}

canvas.addEventListener("click", function(evt){
    switch(trangThai.hienTai){
        case trangThai.batDau:
            trangThai.hienTai = trangThai.choiGame;
            SWOOSHING.play();
            break;
        case trangThai.choiGame:
            chim.flap();
            FLAP.play();
            break;
        case trangThai.thuaGame:
            let rect = canvas.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;

            // ktra nếu click vào buttom
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w &&
                clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
                    ong.reset();
                    chim.speedReset();
                    score.reset();
                    trangThai.hienTai = trangThai.batDau;
                }
            break;
    }
});

// hình nền
const hinhNen = {
    img_X: 0,
    img_Y: 0, 
    w: 275,
    h: 226,
    x: 0,
    y: canvas.height - 226,

    draw : function() {
        context.drawImage(hinhAnh, this.img_X, this.img_Y, this.w, this.h, this.x, this.y,
                            this.w, this.h);
        context.drawImage(hinhAnh, this.img_X, this.img_Y, this.w, this.h, this.x + this.w, this.y,
                            this.w, this.h);
    }
}

const nenDat = {
    img_X: 276,
    img_Y: 0, 
    w:  224,
    h: 112,
    x: 0,
    y: canvas.height - 112,

    dx : 2,

    draw : function() {
        context.drawImage(hinhAnh, this.img_X, this.img_Y, this.w, this.h, this.x, this.y,
            this.w, this.h);
        context.drawImage(hinhAnh, this.img_X, this.img_Y, this.w, this.h, this.x + this.w, this.y,
            this.w, this.h);
    },

    update : function() {
        if(trangThai.hienTai == trangThai.choiGame){
            this.x = (this.x - this.dx) % (- this.w/4);
        }
    }
}

const degree = Math.PI/180;

const chim = {
    animation : [
        {img_X: 276, img_Y: 112},
        {img_X: 276, img_Y: 139},
        {img_X: 276, img_Y: 164},
        {img_X: 276, img_Y: 139},
    ],
    x: 80,
    y: 190,
    w: 34,
    h: 26,

    khung : 0,
    ra: 12,

    tocDo : 0,
    trongLuc : 0.25,
    bay : 5,

    rotation : 0,

    draw : function() {
        let chim = this.animation[this.khung];

        context.save();

        context.translate(this.x, this.y);

        context.rotate(this.rotation);

        context.drawImage(hinhAnh, chim.img_X, chim.img_Y, this.w, this.h, - this.w/2, - this.h/2,
            this.w, this.h);

        context.restore();
    },

    flap : function() {
        this.tocDo = -this.bay;
    },

    update : function() {
        // nếu ng chơi click vào canvas hientai->batdau, chim sẽ vỗ cánh nhanh hơn
        if(trangThai.hienTai == trangThai.batDau){
            this.thoigian = 10;
        } else {
            this.thoigian = 5;
        }

        // tăng khung lên 1 sau một thời gian nhất định
        if(khung % this.thoigian == 0){
            this.khung += 1;
        } else {
            this.khung += 0;
        }

        // this.animation.length = 4
        // tăng khung lên từ 1-4 sau đó về lại 0
        // this.khung = 0      0 % 4 = 0
        // this.khung = 1      1 % 4 = 1
        // this.khung = 2      2 % 4 = 2
        // this.khung = 3      3 % 4 = 3
        // this.khung = 4      4 % 4 = 0
        this.khung = this.khung % this.animation.length;

        if(trangThai.hienTai === trangThai.batDau) {
            this.y = 190; // dđưa về vị trí ban đầu của con chim 
            this.rotation = 0 * degree;
        } else {
            this.tocDo += this.trongLuc;
            this.y += this.tocDo;

            if(this.y + this.h/2 >= canvas.height - nenDat.h){
                this.y = canvas.height - nenDat.h - this.h/2;

                if(trangThai.hienTai == trangThai.choiGame){
                    trangThai.hienTai = trangThai.thuaGame;
                    DIE.play();
                }
            }
            // nếu tốc độ của con chim nhanh hơn tốc độ bay thì chim sẽ dốc đầu xuống
            if(this.tocDo >= this.bay){
                this.rotation = 90 * degree;
                this.khung = 1;
            } else {
                this.rotation = -25 * degree;
            }
        } 
    },
    speedReset : function() {
        this.tocDo = 0;
    }
}

const sanSang = {
    img_X: 0,
    img_Y: 228, 
    w:  173,
    h: 152,
    x: canvas.width/2 - 173/2,
    y: canvas.height/3,

    draw : function() {
        if(trangThai.hienTai == trangThai.batDau){
            context.drawImage(hinhAnh, this.img_X, this.img_Y, this.w, this.h, this.x, this.y - this.h/2,
                this.w, this.h);
        }
    }
}

const ketThuc = {
    img_X: 175,
    img_Y: 228, 
    w:  225,
    h: 202,
    x: canvas.width/2 - 225/2,
    y: canvas.height/3,

    draw : function() {
        if(trangThai.hienTai == trangThai.thuaGame){
            context.drawImage(hinhAnh, this.img_X, this.img_Y, this.w, this.h, this.x, this.y - this.h/2,
                this.w, this.h);
        }
    }
}

const ong = {
    vitri : [],

    tren : {
        img_X: 553,
        img_Y: 0
    },

    duoi : {
        img_X: 502,
        img_Y: 0
    },
    w: 53,
    h: 400,

    khoangCach2ong : 90,
    viTriToiDaY: -150,
    dx : 2,
    

    draw : function(){
        for(let i = 0; i < this.vitri.length; i++) {
            let o = this.vitri[i];

            let viTriTrenCuaY = o.y;
            let viTriDuoiCuaY = o.y + this.h + this.khoangCach2ong;

            // ống trên
            context.drawImage(hinhAnh, this.tren.img_X, this.tren.img_Y, this.w, this.h, o.x, viTriTrenCuaY,
                this.w, this.h);
            // ống dưới
            context.drawImage(hinhAnh, this.duoi.img_X, this.duoi.img_Y, this.w, this.h, o.x, viTriDuoiCuaY,
                this.w, this.h);
        }
    },
    update : function(){
        if(trangThai.hienTai != trangThai.choiGame) return;

        if(khung % 100 == 0) {
            this.vitri.push({
                x : canvas.width,
                y : this.viTriToiDaY * (Math.random() + 1)
            });
        }
        for(let i = 0; i < this.vitri.length; i++) {
            let o = this.vitri[i];

            let viTriDuoiOngY = o.y + this.khoangCach2ong + this.h;
            
            // kiểm tra sự va chạm
            // ống trên 
            if(chim.x + chim.ra > o.x && chim.x - chim.ra < o.x + this.w 
                && chim.y - chim.ra < o.y + this.h && chim.y + chim.ra > o.y){
                    trangThai.hienTai = trangThai.thuaGame;
                    HIT.play();
                }
                
            // ống dưới
            if(chim.x + chim.ra > o.x && chim.x - chim.ra < o.x + this.w
                && chim.y - chim.ra < viTriDuoiOngY + this.h && chim.y + chim.ra > viTriDuoiOngY){
                    trangThai.hienTai = trangThai.thuaGame;
                    HIT.play();
            }

            // di chuyển ống qua trái
            o.x -= this.dx;

            // nếu ống đi ra khỏi canvas thì sẽ xóa chúng ra khỏi mảng
            if(o.x + this.w <= 0) {
                // shift để xóa 1 elements
                this.vitri.shift();
                POINT.play();
                score.value += 1;

                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },

    reset : function() {
        this.vitri= [];
    }
}

const score = {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,

    draw : function(){
        context.fillStyle = "#FFF";

        if(trangThai.hienTai == trangThai.choiGame) {
            context.lineWidth = 2;
            context.font = "35px Tahoma";
            context.fillText(this.value, canvas.width/2, 50);
            context.strokeText(this.value, canvas.width/2, 50);

        } else if(trangThai.hienTai == trangThai.thuaGame) {
            // score value
            context.font = "25px Tahoma";
            context.fillText(this.value, 260, 186);
            context.strokeText(this.value, 260, 186);
            // best score
            context.fillText(this.value, 260, 230);
            context.strokeText(this.value, 260, 230);
        }
    },

    reset : function() {
        this.value = 0;
    }
}   

function draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);

    hinhNen.draw();
    ong.draw();
    nenDat.draw();
    chim.draw();
    sanSang.draw();
    ketThuc.draw();
    score.draw();
}

function update() {
    chim.update();
    nenDat.update();
    ong.update();
}

function loop() {
    update();
    draw();

    khung++;

    requestAnimationFrame(loop);
}
loop();