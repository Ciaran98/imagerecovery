const fs = require('fs');
const buffer = require('buffer');
const BUFFER_OFFSET = 512;
let currentBuffer = 0;
let imageCount = 0;
// Recover JPG images from a forensic image of a card
// To do: expand to include other file formats
// SD cards are often initialised with a FAT file system which has 512 byte blocks, we iterate over the file in these 512 byte chunks.
// Read data from the file
const data =  fs.readFileSync('testrecovery.raw');
// Allocate a 512 byte buffer to store the 512 byte chunk from the file
let buf1 = Buffer.alloc(512);
// Iterate through the data in the file, fill the buffer, if the first 3 bytes match that of a JPEG, we create a new file, and save the contents
//If they do not match, then it must be a continuation of the previous file, in which case we continue saving the bytes to the file.
for(let i = 0; i < (data.length/512);i++){
    buf1.fill(data.slice(currentBuffer));
    if(buf1[0] == 255 && buf1[1] == 216 && buf1[2] == 255){
        imageCount++;
        fs.writeFileSync('images/image_'+imageCount+'.jpg',buf1,{flag:'a+'});
    }
    else if(imageCount != 0){
        fs.writeFileSync('images/image_'+imageCount+'.jpg',buf1,{flag:'a+'});
    }
    currentBuffer+=BUFFER_OFFSET;
}

