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

function Encoder(textEncoder) {
  this.TextEncoder = textEncoder;
  this.Buffer = new Uint8Array(256);
  this.View = new DataView(this.Buffer.buffer);
  this.Offset = 0;
}


function BertAtom(Obj) {
	this.type = "Atom";
	this.value = Obj;
	this.toString = function () {
		return Obj;
	};
}

function BertBinary(Obj) {
	this.type = "Binary";
	this.value = Obj;
	this.toString = function () {
		return "<<\"" + Obj + "\">>";
	};
}

function BertTuple(Arr) {
	this.type = "Tuple";
	this.length = Arr.length;
	this.value = Arr;
	for (var i = 0; i < Arr.length; i++) {
		this[i] = Arr[i];
	}
	this.toString = function () {
		var i, s = "";
		for (i = 0; i < this.length; i++) {
			if (s !== "") {
				s += ", ";
			}
			s += this[i].toString();
		}

		return "{" + s + "}";
	};
}

Encoder.prototype.encode = function (Obj) {
  this.Buffer[0] = BERT_START;
	this.Offset++;

  this.encode_inner(Obj);
  return this.Buffer.subarray(0, this.Offset);
};

Encoder.prototype.atom = function (Obj) {
	return new BertAtom(Obj);
};

Encoder.prototype.binary = function (Obj) {
	return new BertBinary(Obj);
};

Encoder.prototype.tuple = function () {
	return new BertTuple(arguments);
};

Encoder.prototype.assureSize = function(bytesToAdd) {
  var newLength = this.Buffer.byteLength;
  while(this.Offset + bytesToAdd > newLength) {
    newLength *= 2;
  }
  if(newLength == this.Buffer.byteLength) {
    return;
  }
  
  var oldBuffer = this.Buffer;
  this.Buffer = new Uint8Array(newLength);
  this.Buffer.set(oldBuffer); 
  this.View = new DataView(this.Buffer.buffer);
};

// - ENCODING -

Encoder.prototype.encode_inner = function (Obj) {
  if (Obj === undefined) throw new Error("Cannot encode undefined values.")
	var func = 'encode_' + typeof(Obj);
  this[func](Obj);
};

Encoder.prototype.encode_string = function (Obj) {
  var encoded = this.TextEncoder.encode(Obj);
  /*
   * By default we encode strings as binaries.
   * This block would encode strings as STRING 
  /*
  this.assureSize(1 + 2 + encoded.length);
  
  this.Buffer[this.Offset++] = STRING;
  this.View.setUint16(this.Offset, encoded.length);
  this.Offset += 2;
  
  this.Buffer.set(encoded, this.Offset);
  this.Offset += encoded.length;
  */
  this.assureSize(1 + 4 + encoded.length);
  
  this.Buffer[this.Offset++] = BINARY;
  this.View.setUint32(this.Offset, encoded.length);
  this.Offset += 4;
  
  this.Buffer.set(encoded, this.Offset);
  this.Offset += encoded.length;
};


Encoder.prototype.encode_boolean = function (Obj) {
	if (Obj) {
		this.encode_inner(
			this.tuple(this.atom("bert"), this.atom("true")));
	}
	else {
		this.encode_inner(
			this.tuple(this.atom("bert"), this.atom("false")));
	}
};

Encoder.prototype.encode_number = function (Obj) {
	var isInteger = (Obj % 1 === 0);

	// Handle floats...
	if (!isInteger) {
    this.assureSize(1 + 8);
    this.Buffer[this.Offset++] = NEW_FLOAT;
    this.View.setFloat64(this.Offset, Obj);
    this.Offset += 8;
    return;
	}

	// Small int...
	if (isInteger && Obj >= 0 && Obj < 256) {
    this.assureSize(1 + 1);
    this.Buffer[this.Offset++] = SMALL_INTEGER;
	  this.View.setUint8(this.Offset, Obj);
    this.Offset += 1;
	  return;
  }

	// 4 byte int...
	if (isInteger && Obj >= -134217728 && Obj <= 134217727) {
    this.assureSize(1 + 4);
    this.Buffer[this.Offset++] = INTEGER;
	  this.View.setUint32(this.Offset, Obj);
    this.Offset += 4;
    return;
	}

	// Bignum...
  var numDigits = Math.floor(Math.log(Obj) / Math.log(256)) + 1;
  if(numDigits < 256) {
    this.assureSize(1 + 1 + numDigits);
    this.Buffer[this.Offset++] = SMALL_BIG;
	  this.View.setUint8(this.Offset++, numDigits);
  } else {
    //JavaScript doesn't support this big integers 
    this.assureSize(1 + 4 + numDigits);
    this.Buffer[this.Offset++] = LARGE_BIG;
	  this.View.setUint32(this.Offset, numDigits);
    this.Offset += 4;
  }
	this.bignum_to_bytes(Obj);
};

Encoder.prototype.encode_object = function (Obj) {
	// Check if it's an atom, binary, or tuple...
	if (Obj === null){
	    this.encode_inner(this.atom("null")); return;
	}
	if (Obj.type === "Atom") {
		this.encode_atom(Obj); return;
	}
	if (Obj.type === "Binary") {
		this.encode_binary(Obj); return;
	}
	if (Obj.type === "Tuple") {
		this.encode_tuple(Obj); return;
	}

	if (Array.isArray(Obj)) {
		this.encode_array(Obj); return;
	}

	// Treat the object as an associative array...
	this.encode_associative_array(Obj);
};

Encoder.prototype.encode_atom = function (Obj) {
  this.assureSize(1 + 2 + Obj.value.length); 
  this.Buffer[this.Offset++] = ATOM;
  
  this.View.setUint16(this.Offset, Obj.value.length);
  this.Offset += 2;
  
  for (var i = 0, strLen = Obj.value.length; i < strLen; i++) {
    this.Buffer[this.Offset++] = Obj.value.charCodeAt(i); 
  } 
};

Encoder.prototype.encode_binary = function (Obj) {
	//TODO
  //return BINARY + this.int_to_bytes(Obj.value.length, 4) + Obj.value;
};

Encoder.prototype.encode_tuple = function (Obj) {
	if (Obj.length < 256) {
    this.Buffer[this.Offset++] = SMALL_TUPLE;
    this.Buffer[this.Offset++] = Obj.length;
	} else {
    this.Buffer[this.Offset++] = LARGE_TUPLE;
    this.View.setUint32(this.Offset, Obj.length);
    this.Offset += 4;
	}
	
	for (var i = 0; i < Obj.length; i++) {
    this.encode_inner(Obj[i]);
	}
};

Encoder.prototype.encode_array = function (Obj) {
  if (Obj.length == 0) {
		this.encode_inner(
			this.tuple(this.atom("bert"), this.atom("nil")));
    return;
  }
  this.assureSize(1 + 4); 
  this.Buffer[this.Offset++] = LIST;
  this.View.setUint32(this.Offset, Obj.length);
  this.Offset += 4;
	for (var i = 0; i < Obj.length; i++) {
		this.encode_inner(Obj[i]);
	}
  this.assureSize(1); 
  this.Buffer[this.Offset++] = NIL;
};

Encoder.prototype.encode_associative_array = function (Obj) {
	var key, Arr = [];
	for (key in Obj) {
		if (Obj.hasOwnProperty(key)) {
			Arr.push(this.tuple(key, Obj[key]));
		}
	}
  
  return this.encode_inner(
      this.tuple(
        this.atom("bert"), 
        this.atom("dict"), 
        Arr
      )
    );
};


// - UTILITY FUNCTIONS -

// Encode an integer into an Erlang bignum,
// which is a byte of 1 or 0 representing
// whether the number is negative or positive,
// followed by little-endian bytes.
Encoder.prototype.bignum_to_bytes = function (Int) {
	var isNegative, Rem;
	isNegative = Int < 0;
	if (isNegative) {
		Int *= -1;
		this.Buffer[this.Offset++] = 1;
	} else {
		this.Buffer[this.Offset++] = 0;
	}

	while (Int !== 0) {
		Rem = Int % 256;
		this.Buffer[this.Offset++] = Rem;
		Int = Math.floor(Int / 256);
	}
};

module.exports = {
  Encoder,
  BertTuple,
  BertAtom
}
