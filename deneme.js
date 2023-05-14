var blockSize=25;
var satir=27;
var sutun=26;
var canvas;
var context;

//Yılanın başlangıç için x ve y koordinatlarını belirler
var yilanX=blockSize*5;
var yilanY=blockSize*5;

var yemX;
var yemY;
var hizX=0;
var hizY=0;
var yilanGovdesi=[]; //Aslinda x ve y koordinatlarini tutan bir dizi.
var gameOver=false;
var sayac=0;
var yenile=150;
var skor=0;

var updateInterval;

window.onload=function(){
    //canvas sutun*blocksıze ve satir*blocksıze boyutlarında bir dikdörtgen olarak oluşturulur 
    canvas=document.getElementById("canvas");
    canvas.width=sutun*blockSize;
    canvas.height=satir*blockSize;
    
    context=canvas.getContext("2d");
    
    foodPlace();
    document.addEventListener("keyup",yonDegistir);

    // İlk satırda updateInterval sıfırlanıyor.İkinci satırda yeni değeri atanıyor.Bu,yenile değeri daha sonra azaltılacağı için yapılıyor.
    clearInterval(updateInterval);
    updateInterval=setInterval(update,yenile);
}

function skor_goster(skor){
    //html dosyasindaki id'si score olan yeri skor değişkeni ile günceller
    document.getElementById("score").textContent = skor;
}

function update(){
    if(gameOver){
        //oyun bittiyse return et ve çık bu kısım olmasa oyun bittikten sonra yılan durmaz
        return;
    }

    sayac++;
    yenile=(1500-(2*sayac))/10;

    context.fillStyle="#146C94";
    context.fillRect(0,0,canvas.width,canvas.height);
    //Canvasin boyutlarinda dikdortgen olusturuyor.
    context.fillStyle="#FF6D60";
    context.fillRect(yemX,yemY,blockSize,blockSize);
    //Yem olusturuluyor.

    if(yilanX==yemX && yilanY==yemY){
        yilanGovdesi.push(yemX,yemY);
        foodPlace();
        //Yilan yemi yerse yemin son konumunu yilanin govdesine ekle
        skor+=10;
        skor_goster(skor);
        clearInterval(updateInterval);
        updateInterval=setInterval(update,yenile);
    }

    for(i=yilanGovdesi.length-1;i>0;i--){
        yilanGovdesi[i]=yilanGovdesi[i-1];
    }

    if(yilanGovdesi.length){
        yilanGovdesi[0]=[yilanX,yilanY];
    }

    yilanX+=(hizX*blockSize);
    yilanY+=(hizY*blockSize);

    if(yilanX>=10*blockSize && yilanX<=14*blockSize && yilanY<0){
        yilanY=sutun*blockSize;
    }

    else if(yilanX>=10*blockSize && yilanX<=14*blockSize && yilanY>sutun*blockSize){
        yilanY=0;
    }

    context.fillStyle="#00FFCA";
    context.fillRect(yilanX,yilanY,blockSize,blockSize);

    //Yilanin kafasi olusturuluyor
    for(i=0;i<yilanGovdesi.length;i++){
        context.fillRect(yilanGovdesi[i][0],yilanGovdesi[i][1],blockSize,blockSize);
        //Yilanin govdesi olusturuluyor
    }
    carpisti();
    engel();
}

function carpisti(){

    for(i=0;i<11*blockSize;i+=blockSize){
        var kX=yilanX==(i+15*blockSize) || yilanX==i;
        var kY=yilanY<=0|| yilanY>=(satir-1)*blockSize;
        if(kX && kY){
            gameOver=true;
            alert("Game Over");
        }
    }

    if(yilanY==13*blockSize && (yilanX<=5*blockSize || yilanX>=canvas.width-6*blockSize)){
        gameOver=true;
        alert("Game Over");
    }

    if((yilanY==6*blockSize|| yilanY==(sutun-6)*blockSize) && (yilanX>=4*blockSize && yilanX<=21*blockSize)){
        gameOver=true;
        alert("Game Over");
    }

    for(i=0;i<sutun*blockSize;i++){
        if((yilanX<=0 || yilanX>=(sutun-1)*blockSize) && yilanY==i){
            gameOver=true;
            alert("Game Over");
        }
    }

    for(i=0;i<yilanGovdesi.length;i++){
        if(yilanX==yilanGovdesi[i][0] && yilanY==yilanGovdesi[i][1]){
            gameOver=true;
            alert("Game Over");
            break;
        }
        //Yilanin kendini isirma kontrolu
    }
}


function engel(){

    context.fillStyle="#94b9ff";
    context.fillRect(0,0,11*blockSize,1*blockSize);
    context.fillRect(0,0,1*blockSize,satir*blockSize);
    context.fillRect(0,(satir-1)*blockSize,11*blockSize,1*blockSize);
    context.fillRect(0,13*blockSize,6*blockSize,1*blockSize);

    context.fillRect(15*blockSize,0,11*blockSize,1*blockSize);
    context.fillRect((sutun-1)*blockSize,0,1*blockSize,satir*blockSize);
    context.fillRect(15*blockSize,(satir-1)*blockSize,11*blockSize,1*blockSize);
    context.fillRect((sutun-6)*blockSize,13*blockSize,6*blockSize,1*blockSize);

    context.fillRect(4*blockSize,6*blockSize,18*blockSize,1*blockSize);
    context.fillRect(4*blockSize,(sutun-6)*blockSize,18*blockSize,1*blockSize);
    context.stroke();

}

function yonDegistir(e){
    if(e.code=="ArrowUp" && hizY!=1){
        hizX=0;
        hizY=-1;
    }

    else if(e.code=="ArrowDown" && hizY!=-1){
        hizX=0;
        hizY=+1;
    }

    else if(e.code=="ArrowLeft" && hizX!=1){
        hizX=-1;
        hizY=0;
    }

    else if(e.code=="ArrowRight" && hizX!=-1){
        hizX=1;
        hizY=0;
    }
}

    function foodPlace(){

        var bolge=Math.floor(Math.random()*5);

        switch(bolge){
            case 0:
                yemX=Math.floor(Math.random()*24+1)*blockSize;
                yemY=Math.floor(Math.random()*12+1)*blockSize;
                if(yemY==6*blockSize && yemX>=4*blockSize && yemX<=22*blockSize){
                    yemY=7*blockSize;
                }
                break;
            
            case 1:
                yemX=Math.floor(Math.random()*24+1)*blockSize;
                yemY=Math.floor(Math.random()*12+14)*blockSize;
                if(yemY==(sutun-6)*blockSize && yemX>=4*blockSize && yemX<=22*blockSize){
                    yemY=(sutun-7)*blockSize;
                }
                break;
            
            case 2:
                yemY=0;
                yemX=Math.floor(Math.random()*4+11)*blockSize;
                break;
            
            case 3:
                yemY=(sutun-1)*blockSize;
                yemX=Math.floor(Math.random()*4+11)*blockSize;
                break;
            
            case 4:
                yemY=13*blockSize;
                yemX=Math.floor(Math.random()*14+6)*blockSize;
                break;
        }
        

        // yemX=Math.floor(Math.random()*sutun)*blockSize;
        // yemY=Math.floor(Math.random()*satir)*blockSize;
    }

function restartGame(){
    location.reload();
}