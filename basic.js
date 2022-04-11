window.location.href.search( /(?:File|http|https):\/+([A-Z]:)?(.*)\/(.*)/i );
var PROGRAM_DRIVE = RegExp.$1;
var PROGRAM_PATH = (RegExp.$1 + RegExp.$2).replace( "%20", " " );;
var PROGRAM_NAME = RegExp.$3.replace( "%20", " " );;

String.prototype.trim = function() { return this.replace(/(^\s*)|(\s*$)/g, ""); };
String.prototype.ltrim = function() { return this.replace(/(^\s*)/g, ""); };
String.prototype.rtrim = function() { return this.replace(/(\s*$)/g, ""); };
String.prototype.length2 = function() { 
	var nLength = 0;
	for ( var i=0; i<this.length; i++) {
		if (this.charCodeAt(i) > 256 )
			nLength++;
		nLength++;
	}
	
	return nLength;
};
String.prototype.lpad = function(len) { return repeat(len-this.length2()) + this; };
String.prototype.rpad = function(len) { return this + repeat(len-this.length2()); };

Array.prototype.isInclude = function(ele) {
	var i=0;
	for ( ; i<this.length; i++ ) {
		if ( this[i] == ele )
			break;
	}
	
	return ( i == this.length ) ? false : true;
}

function repeat( cnt ) {
	var ch = " ";
	var data = "";
	
	if ( arguments.length > 1 )
		ch = arguments[1];
	
	for ( var i=0; i<cnt; i++ )
		data += ch;
	
	return data;
};

function getFile( file ) {
	var fso, fp;
	
	fso = new ActiveXObject( "Scripting.FileSystemObject" );
	if ( !fso.FileExists( file ) )
		return "";
//console.log( "file : " + file );
	fp = fso.OpenTextFile( file, 1 ); // READ ONLY
//console.log( "22222" );	
	var data = fp.ReadAll();
//console.log( "33333" );		
	fp.Close();
	
	fso = fp = null;
	
	if ( arguments.length > 1 ) {
		data = data.split( arguments[1] );
	}
	
	if ( arguments.length > 2 ) {
		for ( var i=0; i<data.length; i++ ) {
			data[i] = data[i].split( arguments[2] );
		}
	}
	
	return data;
}
	
function writeFile( file, data ) {
	var fso, fp;
	
	var fso = new ActiveXObject( "Scripting.FileSystemObject" );
	var fp;

	if ( arguments.length > 2 ) 
		fp = fso.OpenTextFile( file, 2, arguments[2] ); // WRITE
	else
		fp = fso.OpenTextFile( file, 2, true ); // WRITE + CREATE
	fp.Write( data );
	fp.Close();
	
	fso = fp = null;
}

function getFileUtf8( file ) {
	var fso, fp;
	
	//fso = new ActiveXObject( "Scripting.FileSystemObject" );
	//if ( !fso.FileExists( file ) )
	//	return "";

	fp = new ActiveXObject( "ADODB.Stream" );
	fp.Open();
	fp.charSet = "UTF-8";
	fp.LoadFromFile( file );
	var data = fp.ReadText();
	fp.Close();
	
	//fso = null;

	return data;
	
	if ( arguments.length > 1 ) {
		data = data.split( arguments[1] );
	}
	
	if ( arguments.length > 2 ) {
		for( var i=0; i<data.length; i++ ) {
			data[i] = data[i].split( arguments[2] );
		}
	}
	
	return data;
}

function getFileBinary( file ) {
	var fso, fp;
	
	fso = new ActiveXObject( "Scripting.FileSystemObject" );
	if ( !fso.FileExists( file ) )
		return "";
	
	fp = fso.GetFile( file );
	
	var fd = fp.OpenAsTextStream(1, true);
	var data = fd.Read(fp.Size);
	fd.Close();
	
	fso = fp = fd = null;
	
	return data;
}

function delFile( file ) {
	var fso;

	fso = new ActiveXObject( "Scripting.FileSystemObject" );
	if ( fso.FileExists( file ) ) {
    	 fso.deleteFile( file );
	}
}

function fAddComment( data ) 
{
	var aWord;
	
	data = data.split("\n");
	for ( var i=0; i<data.length; i++) {
		aWord = data[i].match( /\b[a-z][a-z0-9_]{2,}\b/ig );
		if ( !aWord ) 
			continue;
		
		for (var j=0; aWord && j<aWord.length; j++ ) {
			if ( gaWord[ aWord[j].toUpperCase() ] ) {
				data[i] = data[i].rpad(90) + "\t-- " + gaWord[ aWord[j].toUpperCase() ];
/*
				if ( data[i].length2() < 90 ) {
					data[i] = data[i] + repeat(90-data[i].length2()) + "\t-- " + gaWord[ aWord[j].toUpperCase() ];
				}
				else {
					data[i] = data[i] + "\t\t-- " + gaWord[ aWord[j].toUpperCase() ];
				}
*/

			break;
			}
		}
	}
	
	data = data.join("\n");
	
	return data;
}
	
	
function fMinusComment( data ) {
	var re = new RegExp();
	
	re = /\/\*(?!\+)((.(?!\/\*))|\n(?!\/\*))*\*\//g;
	data = data.replace( re, "" );
	
	re = /\-\-(?!\+).*/g;
	data = data.replace( re, "" );
	
	return data;
}


function fMinusCommentForce( data ) {
	var re = new RegExp();
	
	// Hint도 삭제
	re = /\/\*((.(?!\/\*))|\n(?!\/\*))*\*\//g;	
	data = data.replace( re, "" );
	
	// Hint도 삭제
	re = /\-\-.*/g;
	data = data.replace( re, "" );
	
	return data;
}


function fMinusCComment( data ) {
	var re = new RegExp();
		
	re = /\/\*((.(?!\/\*))|\n(?!\/\*))*\*\//g;	
	data = data.replace( re, "" );
	
	re = /\/\/.*/g;
	data = data.replace( re, "" );
	
	return data;
}

