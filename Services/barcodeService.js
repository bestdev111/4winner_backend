function numberFilter(barcode){
  temp = '';
  for(let i = 0; i < barcode.length; i ++){
    if(barcode[i] > '0' && barcode[i] < '9')
      temp += barcode[i];
  }
  return temp;
}

async function generateBarcode(timestamp, userId){
  timestamp = timestamp + '';
  let splitStr = timestamp.split(''); // ["g","u","i","t","a","r"]
  let reversedArr = splitStr.reverse();
  timestamp = reversedArr.join('');

  let barcode = timestamp + '' + userId;
  barcode = numberFilter(barcode);
  barcode = barcode.slice(0, 20);
  
  return barcode;
}

module.exports = generateBarcode;