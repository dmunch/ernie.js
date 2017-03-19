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

function Decoder(textDecoder, shortSize) {
  this.TextDecoder = textDecoder;
  this.ShortSize = shortSize || 512; 
  this.ShortBuffer = new Uint8Array(this.ShortSize);
  this.ShortView = new DataView(this.ShortBuffer.buffer);

  this.ShortLength = 0;
  this.ShortIndex = 0;

  this.BufferIndex = 0;
}

Decoder.prototype.decode = function(buffer) {
  this.nextBuffer(buffer);
  return this.decodeNext().value;
}

Decoder.prototype.decodeNext = function() {
  try {
    if(!this.Stack) {
      var start = this.decode_small_int(this.Buffer); 
      if(start != BERT_START) {
        throw "NO_BERT_START";
      }
      this.Stack = [];
    }
    
    if(this.Stack.length == 0) {
      this.decode_intern(this.Buffer, this.Stack);
    } else {
      this.resume(this.Buffer, this.Stack[0]);
    }

    var val = this.collect(this.Stack[0]);
    this.Stack = undefined;
    return {err: undefined, value: val};
  } catch(ex) {
    return {err: ex, value: undefined};
  }
}

Decoder.prototype.hasMoreTerms = function() {
  return (this.ShortLength - this.ShortIndex > 0) || (this.Buffer.length - this.BufferIndex > 0);
}

Decoder.prototype.nextBuffer = function(buffer) {
  this.BufferIndex = 0;
  this.Buffer = buffer; 
}

Decoder.prototype.resume = function(buffer, op) {
  var resumed = false;
  switch(op.magic) {
    case LIST:
    case LARGE_TUPLE: 
    case SMALL_TUPLE: {
      if(!op.length) {
        //magic was read, but not length yet
        //start decoding the list elements
        this.decode_intern_magic(buffer, op);
        resumed = true;
      } else if(op.stack && op.stack.length > 0) {
        //befor continueing to decode the list 
        //we have to resume the last element in the stack 
        //which might not be finished decoding
        resumed = this.resume(buffer, op.stack[op.stack.length - 1]);

        if(resumed) {
          //we need to increse the current counter
          //to take into account that we resumed a 
          //list element
          op.current ++;
          
          /*
          if(op.current == op.length) {
            var nil = this.decode_small_int(buffer);
              if(nil != NIL) {
              throw "NO NIL AT END OF LIST";
              }
          }*/
        }
        
      }

      if(op.current < op.length) {
        //resume decoding the list elements
        this.decode_intern_magic(buffer, op);
        resumed = true;
      }
      break;
    }
    case SMALL_BIG:{
       if(!op.digits) {
        this.decode_small_big(buffer, op);
        resumed = true;
      } else if(op.current < op.length) {
        this.decode_small_big(buffer, op);
        resumed = true;
      }
      break;
    } 

    case BINARY:
    case STRING: {
      if(!op.value) {
        this.decode_intern_magic(buffer, op);
        resumed = true;
      } else if(op.current < op.length) {
        this.decode_intern_magic(buffer, op);
        resumed = true;
      }
      break;
    } 
    default:
      if(!op.value) {
        this.decode_intern_magic(buffer, op);
        resumed = true;
      }
      break;
  }
  return resumed;
}

Decoder.prototype.collect = function(op) {
  switch(op.magic) {
    case LIST: {
      return this.collect_list(op);
    }
    case SMALL_BIG: {
      let value = 0;
      for(let i = 0; i < op.length; i++) {
        value += op.digits[i] * Math.pow(256,i);
      }
      return value;
    }
    case LARGE_TUPLE: 
    case SMALL_TUPLE: {
      return this.collect_tuple(op);
    }
    case BINARY: {
      return this.TextDecoder.decode(op.value.buffer);
    } 
    default:
      return op.value; 
  }
}

Decoder.prototype.collect_list = function(op) {
  var array = new Array(op.stack.length);
  for(var i = 0; i < op.stack.length; i++) {
    array[i] = this.collect(op.stack[i]);
  }
  return array;
}

Decoder.prototype.collect_tuple = function(op) {
  if(op.length != 3) {
    return this.collect_list(op);
  }

  var magic1 = op.stack[0].magic == ATOM; 
  var magic2 = op.stack[1].magic == ATOM; 
  var magic3 = op.stack[2].magic == LIST; 
  var val1 = op.stack[0].value == 'bert';    
  var val2 = op.stack[1].value == 'dict';    

  if(magic1 && magic2 && magic3 && val1 && val2) {
    return this.collect_assoc_array(op.stack[2]);
  } 
  return this.collect_list(op);
}


Decoder.prototype.collect_assoc_array = function(op) {
  var obj = {}; 
  for(var i = 0; i < op.stack.length; i++) {
    var keyValue = this.collect(op.stack[i]); 
    obj[keyValue[0]] = keyValue[1]; 
  }
  return obj;
}


Decoder.prototype.decode_intern = function(buffer, stack) {

  var magic = this.decode_small_int(buffer); 
  var op = {magic: magic};
  stack.push(op);
  this.decode_intern_magic(buffer, op);
}

Decoder.prototype.decode_intern_magic = function(buffer, op) {
  switch(op.magic) {
    case ATOM: {
      this.decode_atom(buffer, op);
      break;
    }
    case SMALL_INTEGER: {
      op.value = this.decode_small_int(buffer, op);
      break;
    }
    case INTEGER: {
      op.value = this.decode_int(buffer, op);
      break;
    }
    case NEW_FLOAT: {
      op.value = this.decode_new_float(buffer, op);
      break;
    }
    case BINARY: {
      this.decode_binary(buffer, op);
      break;
    }
    case STRING: {
      this.decode_string(buffer, op);
      break;
    }
    case SMALL_TUPLE: {
      if(!op.length) {
        op.length = this.decode_small_int(buffer);
      }
      this.decode_list_like(buffer, op);
      break;
    }
    case LIST:
      if(!op.length) {
        op.length = this.decode_int(buffer);
      }
      this.decode_list_like(buffer, op);
      var nil = this.decode_small_int(buffer);
      if(nil != NIL) {
        throw "NO NIL AT END OF LIST";
      }
    case LARGE_TUPLE: {
      if(!op.length) {
        op.length = this.decode_int(buffer);
      }
      this.decode_list_like(buffer, op);
      break;
    }
    case SMALL_BIG:
      this.decode_small_big(buffer, op);
      break;
    default:
      throw "Decoder doesn't support " + op.magic + "yet.";
  }
}

Decoder.prototype.decode_atom = function(buffer, op) {
  if(!op.length) {
    op.length = this.decode_uint16(buffer);
  }
  this.read(buffer, op.length);
  var charCodes = this.ShortBuffer.subarray(this.ShortIndex, this.ShortIndex + op.length);
  this.ShortIndex += op.length;
  op.value = String.fromCharCode.apply(null, charCodes);
}

Decoder.prototype.decode_small_int = function(buffer) {
  this.read(buffer, 1);
  var val = this.ShortView.getUint8(this.ShortIndex);
  this.ShortIndex += 1;
  return val;
}

Decoder.prototype.decode_int = function(buffer, op) {
  this.read(buffer, 4);
  var val = this.ShortView.getInt32(this.ShortIndex);
  this.ShortIndex += 4;
  return val;
}

Decoder.prototype.decode_uint16 = function(buffer) {
  this.read(buffer, 2);
  var val =  this.ShortView.getUint16(this.ShortIndex);
  this.ShortIndex += 2;

  return val;
}

Decoder.prototype.decode_uint32 = function(buffer) {
  this.read(buffer, 4);
  var val =  this.ShortView.getUint32(this.ShortIndex);
  this.ShortIndex += 4;

  return val;
}

Decoder.prototype.decode_new_float = function(buffer, op) {
  this.read(buffer, 8);
  var val = this.ShortView.getFloat64(this.ShortIndex);
  this.ShortIndex += 8;
  return val;
}

Decoder.prototype.decode_binary = function(buffer, op) {
  if(!op.length) {
    op.length = this.decode_uint32(buffer);
  }
  if(!op.value) {
    op.value = new Uint8Array(op.length);
  } 
  if(!op.current) {
    op.current = 0;
  } 
  for(; op.current < op.length; op.current++) {
    this.read(buffer, 1);
    op.value[op.current] = this.ShortView.getUint8(this.ShortIndex++);
  }
}

Decoder.prototype.decode_small_big = function(buffer, op) {
  if(op.length === undefined) {
    op.length = this.decode_small_int(buffer);
  }
  if(op.sign === undefined) {
    op.sign = this.decode_small_int(buffer);
  }
  if(!op.digits) {
    op.digits = new Array(op.length);
  } 
  if(!op.current) {
    op.current = 0;
  } 
  for(; op.current < op.length; op.current++) {
    this.read(buffer, 1);
    op.digits[op.current] = this.ShortView.getUint8(this.ShortIndex++);
  }
}

Decoder.prototype.decode_string = function(buffer, op) {
  if(!op.length) {
    op.length = this.decode_uint16(buffer);
  }

  if(!op.value) {
    op.value= new Array(op.length);
  } 
  if(!op.current) {
    op.current = 0;
  } 
  for(; op.current < op.length; op.current++) {
    this.read(buffer, 1);
    op.value[op.current] = this.ShortView.getUint8(this.ShortIndex++);
  }
}

Decoder.prototype.decode_list_like = function(buffer, op) {
  if(!op.current) {
    op.current = 0;
  } 
  if(!op.stack) {
    op.stack = [];
  } 
  
  for(; op.current < op.length; op.current++) {
    this.decode_intern(buffer, op.stack);
  }
}

Decoder.prototype.read = function(buffer, size) {
  var remainingSpace = this.ShortLength - this.ShortIndex;

  if(size <= remainingSpace) {
    //we still have enough data in the short buffer
    return;
  }

  var emptySpace = this.ShortSize - this.ShortLength;

  if(!(emptySpace >= this.ShortSize / 2)) {
    //fill the remaining space in the short buffer
    var unreadSpace = this.ShortLength - this.ShortIndex;
    if(unreadSpace > 0) {
      //shift the other half of the short buffer down
      this.ShortBuffer.copyWithin(0, this.ShortIndex); 
    }
    this.ShortLength = unreadSpace;
    this.ShortIndex = 0;
    emptySpace = this.ShortSize - this.ShortLength;
  }

  var length = Math.min(buffer.length - this.BufferIndex, emptySpace);
  this.ShortBuffer.set(buffer.subarray(this.BufferIndex, this.BufferIndex + length), this.ShortLength);
  
  this.BufferIndex += length;

  if(length == 0 && remainingSpace == 0) {
    //no more data to read and the short buffer is empty
    var err = new Error();
    throw {msg: "BERT_ERRNO_EMPTY", stack: err.stack};
  }

  this.ShortLength += length;
  this.Total += length;
  if(this.ShortLength - this.ShortIndex < size) {
    throw "BERT_ERRNO_SHORT_READ";
  }
}

module.exports = {
  Decoder
}
