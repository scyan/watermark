var ctx = document.getElementById('canvas').getContext('2d');
var ctx2 = document.getElementById('canvas2').getContext('2d');
function getImgData(){

	var promise=new Promise(function(resolve,reject){

		var img = new Image();
		img.crossOrigin="anonymous";
		var originalData;
		img.onload = function() {
		    ctx.drawImage(img, 0, 0);
		    // 获取指定区域的canvas像素信息
		    originalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
		    resolve(originalData);
		    // console.log(originalData);
		    // processData(originalData)
		};
		// img.src = './orange.jpg';
		img.src = 'https://img.alicdn.com/tps/TB1zNDSPXXXXXa0XFXXXXXXXXXX-256-256.jpg';
	});
	return promise;
}
function getTextData(){
	var textData;
	// 这些canvas API，好久没用，需要查API文档了T_T
	ctx.font = '30px Microsoft Yahei';
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillText('广告位招租u', 60, 130);
	return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
}

var processData = function(originalData){
    var data = originalData.data;
    for(var i = 0; i < data.length; i++){
        if(i % 4 == 0){
            // 红色分量
            if(data[i] % 2 == 0){
            	//该分量值为偶数全部没有信息
                data[i] = 0;
            } else {
            	//该分量值为奇数全部有信息
                data[i] = 255;
            }
        } else if(i % 4 == 3){
            // alpha通道不做处理
            continue;
        } else {
            // 关闭其他分量，不关闭也不影响答案，甚至更美观 o(^▽^)o
            data[i] = 0;
        }
    }
    // 将结果绘制到画布
    ctx2.putImageData(originalData, 0, 0);
}


var mergeData = function(originalData,newData, color){
    var oData = originalData.data;
    var bit, offset;  // offset的作用是找到alpha通道值，这里需要大家自己动动脑筋
 
    switch(color){
        case 'R':
            bit = 0;
            offset = 3;
            break;
        case 'G':
            bit = 1;
            offset = 2;
            break;
        case 'B':
            bit = 2;
            offset = 1;
            break;
    }
 
    for(var i = 0; i < oData.length; i++){
        if(i % 4 == bit){
            // 只处理目标通道
            if(newData[i + offset] === 0 && (oData[i] % 2 === 1)){
                // 没有信息的像素，该通道最低位置0，但不要越界
                //没信息的像素，原图为奇数，变为偶数，没信息且原图为偶数的像素还是偶数
                if(oData[i] === 255){
                    oData[i]--;
                } else {
                    oData[i]++;
                }
            } else if (newData[i + offset] !== 0 && (oData[i] % 2 === 0)){
                // // 有信息的像素，该通道最低位置1，可以想想上面的斑点效果是怎么实现的
                //有信息，原图为偶数，变为奇数，有信息且原图为奇数的像素还是奇数
                if(oData[i] === 255){
                    oData[i]--;
                } else {
                    oData[i]++;
                }
            }
        }
    }
    ctx.putImageData(originalData, 0, 0);
}
getImgData().then(function(imgData){
	var textData=getTextData();
	console.log(textData)
	mergeData(imgData,textData,'R');
	// var ctx = document.getElementById('canvas2').getContext('2d');
	var originalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	processData(originalData)
})