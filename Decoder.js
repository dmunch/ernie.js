// ernie.js
// Copyright (c) 2017 Daniel Münch (@dmunch)

// Based on previous work 
// BERT-JS
// Copyright (c) 2009 Rusty Klophaus (@rklophaus)
// Contributions by Ben Browning (@bbrowning)
// See MIT-LICENSE for licensing information.


// BERT-JS is a Javascript implementation of Binary Erlang Term Serialization.
// - http://github.com/rklophaus/BERT-JS
//
// References:
// - http://www.erlang-factory.com/upload/presentations/36/tom_preston_werner_erlectricity.pdf
// - http://www.erlang.org/doc/apps/erts/erl_ext_dist.html#8


const BERT_START = 131;
const SMALL_ATOM = 115;
const ATOM = 100;
const BINARY = 109;
const SMALL_INTEGER = 97;
const INTEGER = 98;
const SMALL_BIG = 110;
const LARGE_BIG = 111;
const FLOAT = 99;
const NEW_FLOAT = 70;
const STRING = 107;
const LIST = 108;
const SMALL_TUPLE = 104;
const LARGE_TUPLE = 105;
const NIL = 106;
const ZERO = 0;
const ZERO_CHAR = 48;


function Decoder(textDecoder) {
  this.TextDecoder = textDecoder;
  this.SmallIndex = 0;
}

Decoder.prototype.decode = function(buffer) {
  this.ShortIndex = 0;
  this.ShortView = new DataView(buffer.buffer);
  var start = this.decode_small_int(buffer); 
  if(start != BERT_START) {
    throw "NO_BERT_START";
  }
  return this.decode_intern(buffer);
}

Decoder.prototype.decode_intern = function(buffer) {
  var magic = this.decode_small_int(buffer); 
  switch(magic) {
    case ATOM: {
      return this.decode_atom(buffer);
    }
    case SMALL_INTEGER: {
      return this.decode_small_int(buffer);
    }
    case INTEGER: {
      return this.decode_int(buffer);
    }
    case NEW_FLOAT: {
      return this.decode_new_float(buffer);
    }
    case BINARY: {
      return this.decode_binary(buffer);
    }
    case STRING: {
      return this.decode_string(buffer);
    }
    case SMALL_TUPLE: {
      let length = this.decode_small_int(buffer);
      return this.decode_tuple(buffer, length);
      break;
    }
    case LARGE_TUPLE: {
      let length = this.decode_int(buffer);
      return this.decode_tuple(buffer, length);
      break;
    }
    case LIST: {
      let length = this.decode_int(buffer);
      let value = this.decode_list_like(buffer, length);
      let nil = this.decode_small_int(buffer);
      if(nil != NIL) {
        this.ShortIndex--; 
      }
      return value;
    }
    case SMALL_BIG:
      return this.decode_small_big(buffer);
    default:
      throw "Decoder doesn't support " + magic + "yet.";
  }
}

Decoder.prototype.decode_atom = function(buffer) {
  var length = this.decode_uint16(buffer);
  var charCodes = buffer.subarray(this.ShortIndex, this.ShortIndex + length);
  this.ShortIndex += length;
  return String.fromCharCode.apply(null, charCodes);
}

Decoder.prototype.decode_small_int = function(buffer) {
  var val = this.ShortView.getUint8(this.ShortIndex);
  this.ShortIndex += 1;
  return val;
}

Decoder.prototype.decode_int = function(buffer, op) {
  var val = this.ShortView.getInt32(this.ShortIndex);
  this.ShortIndex += 4;
  return val;
}

Decoder.prototype.decode_uint16 = function(buffer) {
  var val =  this.ShortView.getUint16(this.ShortIndex);
  this.ShortIndex += 2;

  return val;
}

Decoder.prototype.decode_uint32 = function(buffer) {
  var val =  this.ShortView.getUint32(this.ShortIndex);
  this.ShortIndex += 4;

  return val;
}

Decoder.prototype.decode_new_float = function(buffer) {
  var val = this.ShortView.getFloat64(this.ShortIndex);
  this.ShortIndex += 8;
  return val;
}

Decoder.prototype.decode_binary = function(buffer) {
  var length = this.decode_uint32(buffer);
  
  var value = buffer.subarray(this.ShortIndex, this.ShortIndex + length);
  this.ShortIndex += length;
  return this.TextDecoder.decode(value);
}

Decoder.prototype.decode_small_big = function(buffer) {
  var length = this.decode_small_int(buffer);
  var sign = this.decode_small_int(buffer);
  
  let value = 0;
  for(let i = 0; i < length; i++) {
    let digit = this.ShortView.getUint8(this.ShortIndex++);
    value += digit * Math.pow(256,i);
  }
  return value;
}

Decoder.prototype.decode_string = function(buffer) {
  let length = this.decode_uint16(buffer);
  let value = buffer.subarray(this.ShortIndex, this.ShortIndex + length);
  this.ShortIndex += length;

  let ar = new Array(length);
  for(let i = 0; i < length; i++) {
    ar[i] = value[i];
  }
  return ar;
}

Decoder.prototype.decode_list_like = function(buffer, length) {
  let value = new Array(length);
  for(let i = 0; i < length; i++) {
    value[i] = this.decode_intern(buffer);
  }

  return value;
}

Decoder.prototype.decode_tuple = function(buffer, length) {
  let value = this.decode_list_like(buffer, length);
  if(length != 3 || value[0] !== 'bert' || value[1] !== 'dict') {
    return value;
  }

  var obj = {};
  let propList = value[2]; 

  let i = propList.length; 
  while(i--) {
    var keyValue = propList[i]; 
    obj[keyValue[0]] = keyValue[1]; 
  }
  return obj;
}

module.exports = {
  Decoder 
}
