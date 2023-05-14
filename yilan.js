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
    
    yemKonumu();
    document.addEventListener("keyup",yonDegistir);

    // İlk satırda updateInterval sıfırlanıyor.İkinci satırda yeni değeri atanıyor.Bu,yenile değeri daha sonra azaltılacağı için yapılıyor.
    clearInterval(updateInterval);
    updateInterval=setInterval(update,yenile);
}

function skorGoster(skor){
    //html dosyasindaki id'si score olan yeri skor değişkeni ile günceller
    document.getElementById("score").textContent = skor;
}

function update(){
    if(gameOver){
        //oyun bittiyse return et ve çık bu kısım olmasa oyun bittikten sonra yılan durmaz
        return;
    }

    //Canvasin boyutlarinda dikdortgen olusturuyor.
    context.fillStyle="#146C94";
    context.fillRect(0,0,canvas.width,canvas.height);
    
    //Yem olusturuluyor.
    context.fillStyle="#FF6D60";
    context.fillRect(yemX,yemY,blockSize,blockSize);
   
    //Yilan yemi yerse
    if(yilanX==yemX && yilanY==yemY){
        // yılan yemi yerse sayacı arttır ve sayfanın yenileme hızını arttırarak yılanın hızlanmasını sağla
        sayac++;
        yenile=(1500-(2*sayac))/10;

        //Yilan yemi yerse yemin son konumunu yilanin govdesine ekle
        yilanGovdesi.push(yemX,yemY);
        //Yeme yeni rastgele konum ata
        yemKonumu();
        
        //Skoru 10 arttır ve ekranda guncelle
        skor+=10;
        skorGoster(skor);

        //güncellenmiş yenile değeri ile update fonksiyonunu yeniden çağır
        clearInterval(updateInterval);
        updateInterval=setInterval(update,yenile);
    }

    //yılanın gövdesinin kafasını takip etmesi için yılanın her parçasını kendinden önceki parçaya ata
    for(i=yilanGovdesi.length-1;i>0;i--){
        yilanGovdesi[i]=yilanGovdesi[i-1];
    }

    //boşta kalan son parçayıda yılanın yeni konumuna ata(burası yılanın kafası oluyor)
    if(yilanGovdesi.length){
        yilanGovdesi[0]=[yilanX,yilanY];
    }

    //yilanin canvas içinde x ve y koordinatlarında blocksıze kadar ilerlemesini sağlar
    yilanX+=(hizX*blockSize);
    yilanY+=(hizY*blockSize);

    //yılan oyun alanının yukarısındaki engelsiz alandan çıkarsa aşağıdaki alandan tekrar oyun alanına girer
    if(yilanX>=10*blockSize && yilanX<=14*blockSize && yilanY<0){
        yilanY=sutun*blockSize;
    }
    //eğer aşağıdaki engelsiz alandan çıkarsa yukarıdan oyun alanına girer
    else if(yilanX>=10*blockSize && yilanX<=14*blockSize && yilanY>sutun*blockSize){
        yilanY=0;
    }

    //Yilanin kafasi olusturuluyor
    context.fillStyle="#00FFCA";
    context.fillRect(yilanX,yilanY,blockSize,blockSize);
    
    for(i=0;i<yilanGovdesi.length;i++){
        context.fillRect(yilanGovdesi[i][0],yilanGovdesi[i][1],blockSize,blockSize);
        //Yilanin govdesi olusturuluyor
    }
    carpisti();
    engel();
}

//Yılanın engellere çarpmasını kontrol eder
function carpisti(){

    //üst ve alt kenarlardaki engellere çarpması durumu
    for(i=0;i<11*blockSize;i+=blockSize){
        var kX=yilanX==(i+15*blockSize) || yilanX==i;
        var kY=yilanY<=0|| yilanY>=(satir-1)*blockSize;
        if(kX && kY){
            gameOver=true;
            alert("Oyun Bitti");
        }
    }

    //ortadaki engellere çarpma durumu 
    if(yilanY==13*blockSize && (yilanX<=5*blockSize || yilanX>=canvas.width-6*blockSize)){
        gameOver=true;
        alert("Oyun Bitti");
    }

    //oyun alanının üst ve alt kısımlarının ortasındaki engellere çarpma durumu
    if((yilanY==6*blockSize|| yilanY==(sutun-6)*blockSize) && (yilanX>=4*blockSize && yilanX<=21*blockSize)){
        gameOver=true;
        alert("Oyun Bitti");
    }

    //sağ ve sol kenarlardaki engellere çarpma durumu 
    for(i=0;i<sutun*blockSize;i++){
        if((yilanX<=0 || yilanX>=(sutun-1)*blockSize) && yilanY==i){
            gameOver=true;
            alert("Oyun Bitti");
        }
    }

    //Yilanin kendini ısırma kontrolu
    for(i=0;i<yilanGovdesi.length;i++){
        if(yilanX==yilanGovdesi[i][0] && yilanY==yilanGovdesi[i][1]){
            gameOver=true;
            alert("Oyun Bitti");
            break;
        }
    }
}


//engelleri oluşturan fonksiyon
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

//yılanı kontrol eden fonksiyon
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

function yemKonumu(){
    //yemin bulunabileceği 5 farklı bölge var 
    var bolge=Math.floor(Math.random()*5);

    switch(bolge){
        case 0:
            //yem üst bölgede bulunursa 
            yemX=Math.floor(Math.random()*24+1)*blockSize;
            yemY=Math.floor(Math.random()*12+1)*blockSize;
            if(yemY==6*blockSize && yemX>=4*blockSize && yemX<=22*blockSize){
                //eğer üst bölgenin ortasındaki engelle aynı yerse bir satır yukarı koy
                yemY=7*blockSize;
            }
            break;
        
        case 1:
            //yem alt bölgede bulunursa 
            yemX=Math.floor(Math.random()*24+1)*blockSize;
            yemY=Math.floor(Math.random()*12+14)*blockSize;
            if(yemY==(sutun-6)*blockSize && yemX>=4*blockSize && yemX<=22*blockSize){
                //eğer alt bölgenin ortasındaki engelle aynı yerse bir satır yukarı koy
                yemY=(sutun-7)*blockSize;
            }
            break;
        
        case 2:
            //oyun alanının tepesindeki boşluktaysa 
            yemY=0;
            yemX=Math.floor(Math.random()*4+11)*blockSize;
            break;
        
        case 3:
            //oyun alanının altındaki boşluktaysa 
            yemY=(sutun-1)*blockSize;
            yemX=Math.floor(Math.random()*4+11)*blockSize;
            break;
        
        case 4:
            //oyun alanının ortasındaki iki engelin arasındaysa
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
