﻿if (typeof jslang == 'undefined') {
	LoadLangVAsync('EN');
} else {
	if (jslang == 'JP') jslang = 'JA';
	if (jslang == 'CS') jslang = 'CZ';
	if (jslang == 'SI') jslang = 'SL';
	LoadLangVAsync(jslang);
}

function LoadLangVAsync(lang) {
	if (top == window && window.master == 'ctl00_') {
		setTimeout(function() {
			LoadLangV(lang);
		}, 300);
	} else {
		LoadLangV(lang);
	}
}

function LoadLangV(lang) {
	if (document.getElementById("RADEDITORSTYLESHEET0")) {
		return;
	}

	var scr = document.createElement('script');
	scr.setAttribute('src', '/BcJsLang/ValidationFunctions.aspx?lang=' + lang);
	scr.setAttribute('charset', "utf-8");
	scr.setAttribute('type', 'text/javascript');
	document.getElementsByTagName('head')[0].appendChild(scr);
}

function formfield(strng, actiontype) {

	switch (actiontype) {
		// makes first letter upper and all else lower, removes (.) and (,)
		case 'firstupper':
			var allCaps = true;
			var allLower = true;
			// handle surnames properly, e.g. McDermon, deCaprio, if all lower or all upper, we change, otherwise we don't
			// we ignore the first character, e.g. Johnson
			for (var i = 1; i < strng.length; i++) {
				var c = strng.charCodeAt(i);
				if (c >= 65 && c <= 90)
					allLower = false;
				if (c >= 97 && c <= 127)
					allCaps = false;
			}
			if (allCaps || allLower) {
				var word = strng.split(" ");
				strng = "";
				for (var i = 0; i < word.length; i++) {
					if (word[i].length >= 1) {
						strng = strng + " " + word[i].substring(0, 1).toUpperCase() + word[i].substring(1).toLowerCase();
					}
				}
			}
			strng = strng.replace(".", "");
			strng = strng.replace(",", "");
			break;

			// makes first letter upper only and does not affect any other letters or punctuation
		case 'firstupperspecial':
			var word = strng.split(" ");
			strng = ""
			for (var i = 0; i < word.length; i++) {
				if (word[i].length >= 1) {
					strng = strng + " " + word[i].substring(0, 1).toUpperCase() + word[i].substring(1);
				}
			}
			break;

		case 'alllower':
			strng = strng.toLowerCase();
			break;

		case 'allupper':
			strng = strng.toUpperCase();
			break;

		default:
			break;
	}
	if (strng.substring(0, 1) == " ") {
		strng = strng.substring(1);
	}
	return strng;
}

function isCurrency(s, FieldName) {
	var error = "";
	if (s.length == 0) {
		error = "- " + FieldName + validatelang.Currency.MustNumber;
	} else {
		for (var i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if ((c < "0") || (c > "9")) {
				if (c != "." && c != ",") // with multilingual in europe $3.33 = $3,33
					error = "- " + FieldName + validatelang.Currency.NoSymbol;
			}
		}
	}
	return error;
}

function isNumeric(s, FieldName) {
	var error = "";
	if (s.length == 0) {
		error = "- " + FieldName + validatelang.Number.MustNumber;
	} else {
		var i;
		for (i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if ((c < "0") || (c > "9")) {
				error = "- " + FieldName + validatelang.Number.NoDecimal;
				return error;
			}
		}
	}
	return error;
}

function isNumericGreaterThan(s, FieldName, minValue) {
	var error = "";
	var inputNumber = 0;
	
	if (s.length == 0) {
		error = "- " + FieldName + validatelang.Number.MustNumber;
	} else {
		var i;
		for (i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if ((c < "0") || (c > "9")) {
				error = "- " + FieldName + validatelang.Number.NoDecimal;
				return error;
			}
			inputNumber = inputNumber * 10 + parseInt(c);
		}
		
		if (inputNumber <= minValue){
			error = "- " + FieldName + validatelang.Number.GreaterThan.replace(/\{0\}/g, minValue)  ;
			return error;
		}
	}
	return error;
}

function isFloat(s, FieldName) {
	var error = "";
	var i;
	if (s.length == 0) {
		error = "- " + FieldName + validatelang.Float.MustNumber;
	} else {
		for (i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if (((c < "0") || (c > "9"))) {

				if (c != "." && c != ",") {
					error = "- " + FieldName + validatelang.Float.MustNumber;
					return error;
				}
			}
		}
	}
	return error;
}

function isEmpty(strng, FieldName) {
	var error = "";
	if (strng.trim().length == 0) {
		error = validatelang.Enter.PleaseEnter + FieldName + "\n";
	}
	return error;
}

function isCharacterLimitExceededGeneric(strng, limit, FieldName, message) {
	var error = "";
	if (strng.length > limit) {
		error = '- ' + FieldName + message.replace(/\{0\}/g, limit) + "\n";
	}
	return error;
}

function isCharacterLimitExceeded(strng, limit, FieldName) {
	return isCharacterLimitExceededGeneric(strng, limit, FieldName, validatelang.TextMultiline.MaxCharacters);
}

function isCharacterLimitExceededRich(strng, limit, FieldName) {
	return isCharacterLimitExceededGeneric(strng, limit, FieldName, validatelang.TextMultiline.MaxCharactersRich);
}

function checkDropdown(strng, FieldName) {
	var error = "";
	if (strng.length == 0 || strng == " ") { // we put a space to ensure value attribute is not stripped by browser in WYSIWYG editor
		error = validatelang.Select.PleaseSelect + FieldName + "\n";
	}
	return error;
}

function checkEmail(strng) {
	var error = "";
	if (strng.length > 0) {
		// TLDs from http://data.iana.org/TLD/tlds-alpha-by-domain.txt 
		var emailFilter = new RegExp('^[a-zA-Z0-9._-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:aaa|abb|abbott|abogado|ac|academy|accenture|accountant|accountants|aco|active|actor|ad|ads|adult|ae|aeg|aero|af|afl|ag|agency|ai|aig|airforce|airtel|al|allfinanz|alsace|am|amica|amsterdam|android|ao|apartments|app|aq|aquarelle|ar|archi|army|arpa|as|asia|associates|at|attorney|au|auction|audio|auto|autos|aw|ax|axa|az|azure|ba|band|bank|bar|barcelona|barclaycard|barclays|bargains|bauhaus|bayern|bb|bbc|bbva|bcn|bd|be|beer|bentley|berlin|best|bet|bf|bg|bh|bharti|bi|bible|bid|bike|bing|bingo|bio|biz|bj|black|blackfriday|bloomberg|blue|bm|bms|bmw|bn|bnl|bnpparibas|bo|boats|bom|bond|boo|boots|boutique|br|bradesco|bridgestone|broker|brother|brussels|bs|bt|budapest|build|builders|business|buzz|bv|bw|by|bz|bzh|ca|cab|cafe|cal|camera|camp|cancerresearch|canon|capetown|capital|car|caravan|cards|care|career|careers|cars|cartier|casa|cash|casino|cat|catering|cba|cbn|cc|cd|ceb|center|ceo|cern|cf|cfa|cfd|cg|ch|chanel|channel|chat|cheap|chloe|christmas|chrome|church|ci|cipriani|cisco|citic|city|ck|cl|claims|cleaning|click|clinic|clothing|cloud|club|clubmed|cm|cn|co|coach|codes|coffee|college|cologne|com|commbank|community|company|computer|condos|construction|consulting|contractors|cooking|cool|coop|corsica|country|coupons|courses|cr|credit|creditcard|cricket|crown|crs|cruises|csc|cu|cuisinella|cv|cw|cx|cy|cymru|cyou|cz|dabur|dad|dance|date|dating|datsun|day|dclk|de|deals|degree|delivery|dell|delta|democrat|dental|dentist|desi|design|dev|diamonds|diet|digital|direct|directory|discount|dj|dk|dm|dnp|do|docs|dog|doha|domains|doosan|download|drive|durban|dvag|dz|earth|eat|ec|edu|education|ee|eg|email|emerck|energy|engineer|engineering|enterprises|epson|equipment|er|erni|es|esq|estate|et|eu|eurovision|eus|events|everbank|exchange|expert|exposed|express|fage|fail|faith|family|fan|fans|farm|fashion|feedback|fi|film|final|finance|financial|firmdale|fish|fishing|fit|fitness|fj|fk|flights|florist|flowers|flsmidth|fly|fm|fo|foo|football|forex|forsale|forum|foundation|fr|frl|frogans|fund|furniture|futbol|fyi|ga|gal|gallery|game|garden|gb|gbiz|gd|gdn|ge|gea|gent|genting|gf|gg|ggee|gh|gi|gift|gifts|gives|giving|gl|glass|gle|global|globo|gm|gmail|gmo|gmx|gn|gold|goldpoint|golf|goo|goog|google|gop|gov|gp|gq|gr|graphics|gratis|green|gripe|group|gs|gt|gu|guge|guide|guitars|guru|gw|gy|hamburg|hangout|haus|healthcare|help|here|hermes|hiphop|hitachi|hiv|hk|hm|hn|hockey|holdings|holiday|homedepot|homes|honda|horse|host|hosting|hoteles|hotmail|house|how|hr|hsbc|ht|hu|hyundai|ibm|icbc|ice|icu|id|ie|ifm|iinet|il|im|immo|immobilien|in|industries|infiniti|info|ing|ink|institute|insure|int|international|investments|io|ipiranga|iq|ir|irish|is|ist|istanbul|it|itau|iwc|java|jcb|je|jetzt|jewelry|jlc|jll|jm|jo|jobs|joburg|jp|jprs|juegos|kaufen|kddi|ke|kg|kh|ki|kia|kim|kinder|kitchen|kiwi|km|kn|koeln|komatsu|kp|kr|krd|kred|kw|ky|kyoto|kz|la|lacaixa|lancaster|land|lasalle|lat|latrobe|law|lawyer|lb|lc|lds|lease|leclerc|legal|lexus|lgbt|li|liaison|lidl|life|lighting|limited|limo|linde|link|live|lixil|lk|loan|loans|lol|london|lotte|lotto|love|lr|ls|lt|ltd|ltda|lu|lupin|luxe|luxury|lv|ly|ma|madrid|maif|maison|man|management|mango|market|marketing|markets|marriott|mba|mc|md|me|media|meet|melbourne|meme|memorial|men|menu|mg|mh|miami|microsoft|mil|mini|mk|ml|mm|mma|mn|mo|mobi|moda|moe|moi|mom|monash|money|montblanc|mormon|mortgage|moscow|motorcycles|mov|movie|movistar|mp|mq|mr|ms|mt|mtn|mtpc|mtr|mu|museum|mv|mw|mx|my|mz|na|nadex|nagoya|name|navy|nc|ne|nec|net|netbank|network|neustar|new|news|nexus|nf|ng|ngo|nhk|ni|nico|ninja|nissan|nl|no|nokia|np|nr|nra|nrw|ntt|nu|nyc|nz|obi|office|okinawa|om|omega|one|ong|onl|online|ooo|oracle|orange|org|organic|osaka|otsuka|ovh|pa|page|panerai|paris|partners|parts|party|pe|pet|pf|pg|ph|pharmacy|philips|photo|photography|photos|physio|piaget|pics|pictet|pictures|pink|pizza|pk|pl|place|play|plumbing|plus|pm|pn|pohl|poker|porn|post|pr|praxi|press|pro|prod|productions|prof|properties|property|protection|ps|pt|pub|pw|py|qa|qpon|quebec|racing|re|realtor|realty|recipes|red|redstone|rehab|reise|reisen|reit|ren|rent|rentals|repair|report|republican|rest|restaurant|review|reviews|rich|ricoh|rio|rip|ro|rocks|rodeo|rs|rsvp|ru|ruhr|run|rw|ryukyu|sa|saarland|sakura|sale|samsung|sandvik|sandvikcoromant|sanofi|sap|sarl|saxo|sb|sc|sca|scb|schmidt|scholarships|school|schule|schwarz|science|scor|scot|sd|se|seat|security|seek|sener|services|seven|sew|sex|sexy|sg|sh|shiksha|shoes|show|shriram|si|singles|site|sj|sk|ski|sky|skype|sl|sm|sn|sncf|so|soccer|social|software|sohu|solar|solutions|sony|soy|space|spiegel|spreadbetting|sr|srl|st|stada|starhub|statoil|stc|stcgroup|stockholm|studio|study|style|su|sucks|supplies|supply|support|surf|surgery|suzuki|sv|swatch|swiss|sx|sy|sydney|systems|sz|taipei|tatamotors|tatar|tattoo|tax|taxi|tc|td|team|tech|technology|tel|telefonica|temasek|tennis|tf|tg|th|thd|theater|theatre|tickets|tienda|tips|tires|tirol|tj|tk|tl|tm|tn|to|today|tokyo|tools|top|toray|toshiba|tours|town|toyota|toys|tr|trade|trading|training|travel|trust|tt|tui|tv|tw|tz|ua|ubs|ug|uk|university|uno|uol|us|uy|uz|va|vacations|vc|ve|vegas|ventures|versicherung|vet|vg|vi|viajes|video|villas|vin|virgin|vision|vista|vistaprint|viva|vlaanderen|vn|vodka|vote|voting|voto|voyage|vu|wales|walter|wang|watch|webcam|website|wed|wedding|weir|wf|whoswho|wien|wiki|williamhill|win|windows|wine|wme|work|works|world|ws|wtc|wtf|xbox|xerox|xin|xn--11b4c3d|xn--1qqw23a|xn--30rr7y|xn--3bst00m|xn--3ds443g|xn--3e0b707e|xn--3pxu8k|xn--42c2d9a|xn--45brj9c|xn--45q11c|xn--4gbrim|xn--55qw42g|xn--55qx5d|xn--6frz82g|xn--6qq986b3xl|xn--80adxhks|xn--80ao21a|xn--80asehdb|xn--80aswg|xn--90a3ac|xn--90ais|xn--9dbq2a|xn--9et52u|xn--b4w605ferd|xn--c1avg|xn--c2br7g|xn--cg4bki|xn--clchc0ea0b2g2a9gcd|xn--czr694b|xn--czrs0t|xn--czru2d|xn--d1acj3b|xn--d1alf|xn--efvy88h|xn--estv75g|xn--fhbei|xn--fiq228c5hs|xn--fiq64b|xn--fiqs8s|xn--fiqz9s|xn--fjq720a|xn--flw351e|xn--fpcrj9c3d|xn--fzc2c9e2c|xn--gecrj9c|xn--h2brj9c|xn--hxt814e|xn--i1b6b1a6a2e|xn--imr513n|xn--io0a7i|xn--j1aef|xn--j1amh|xn--j6w193g|xn--kcrx77d1x4a|xn--kprw13d|xn--kpry57d|xn--kput3i|xn--l1acc|xn--lgbbat1ad8j|xn--mgb9awbf|xn--mgba3a4f16a|xn--mgbaam7a8h|xn--mgbab2bd|xn--mgbayh7gpa|xn--mgbbh1a71e|xn--mgbc0a9azcg|xn--mgberp4a5d4ar|xn--mgbpl2fh|xn--mgbx4cd0ab|xn--mk1bu44c|xn--mxtq1m|xn--ngbc5azd|xn--node|xn--nqv7f|xn--nqv7fs00ema|xn--nyqy26a|xn--o3cw4h|xn--ogbpf8fl|xn--p1acf|xn--p1ai|xn--pgbs0dh|xn--pssy2u|xn--q9jyb4c|xn--qcka1pmc|xn--rhqv96g|xn--s9brj9c|xn--ses554g|xn--t60b56a|xn--tckwe|xn--unup4y|xn--vermgensberater-ctb|xn--vermgensberatung-pwb|xn--vhquv|xn--vuq861b|xn--wgbh1c|xn--wgbl6a|xn--xhq521b|xn--xkc2al3hye2a|xn--xkc2dl3a5ee0h|xn--y9a3aq|xn--yfro4i67o|xn--ygbi2ammx|xn--zfr164b|xperia|xxx|xyz|yachts|yamaxun|yandex|ye|yodobashi|yoga|yokohama|youtube|yt|za|zip|zm|zone|zuerich|zw)$', 'i');
		if (!(emailFilter.test(strng)))
			error = validatelang.Email.ValidEmail;
		else {
			// Check email for illegal characters
			var illegalChars = /[\(\)\<\>\,\;\:\\\"\[\]]/
			if (strng.match(illegalChars))
				error = validatelang.Email.Illegal;
		}
	} else
		error = validatelang.Email.ValidEmail;

	return error;
}

// Checks in a checkbox or radio list that at least one item is selected
function checkSelected(FieldName, strng) {
	var error = "- " + strng + validatelang.Select.MustSelect;
	if (FieldName.length > 0) {
		for (var i = 0; i < FieldName.length; i++) {
			if (FieldName[i].disabled == false && FieldName[i].checked == true) error = "";
		}
	} else
	if (FieldName.disabled == false && FieldName.checked == true) error = "";
	return error;
}

// returns the selected value from a radio list or nothing
function getRadioSelected(FieldName) {
	if (FieldName.length > 0) {
		for (var i = 0; i < FieldName.length; i++) {
			if (FieldName[i].disabled == false && FieldName[i].checked == true)
				return FieldName[i].value;
		}
	} else
	if (FieldName.disabled == false && FieldName.checked == true)
		return FieldName.value;
	return null;
}

// Checks asp.net checkbox lists as the elements of a checkbox have 2 extra characters
// appended to each one which makes the name no longer unique
function checkSelectedX(FieldName, strng) {
	var error = "- " + strng + validatelang.Select.MustSelect;
	var table = document.getElementById(FieldName);
	var cells = table.getElementsByTagName("td");
	var ctrl;
	for (var i = 0; i < cells.length; i++) {
		ctrl = cells[i].firstChild;
		if (ctrl && (ctrl.type == 'checkbox' || ctrl.type == 'radio'))
			if (ctrl.disabled == false && ctrl.checked == true)
				error = "";
	}
	return error;
}

function checkSpaces(strng, FieldName) {
	var error = "";
	for (var i = 0; i < strng.length; i++) {
		if (strng.charAt(i) == " ")
			error = "- " + FieldName + validatelang.Others.CannotContain + validatelang.Others.WhiteSpace;
	}
	return error;
}

// consistent with General->Check_URLChar()
function checkUrlChar(strng, FieldName) {
	var error = "";
	for (i = 0; i < strng.length; i++) {
		var c = strng.charAt(i);
		switch (c) {
			case "/":
			case "\\":
			case "#":
			case "?":
			case ":":
			case "@":
			case "=":
			case "&":
			case '"':
			case "|":
			case "_":
			case ".":
			case "%":
				error = "- " + FieldName + validatelang.Others.CannotContain + "[" + c + "] " + validatelang.Others.Character;
				return error;
		}
	}
	return error;
}

function isInteger(s) {
	var i;

	if (s.length == 0)
		return false;

	for (i = 0; i < s.length; i++) {
		// Check that current character is number.
		var c = s.charAt(i);
		if (((c < "0") || (c > "9"))) return false;
	}
	// All characters are numbers.
	return true;
}

// Checks to see if a date is valid. All date fields inside admin are readonly, if this function
// is called and no value is entered then the date is invalid, otherwise always valid
function checkDate(d, FieldName) {
	var error = "";

	if (d.length == 0) {
		error = validatelang.Enter.PleaseEnter + FieldName + validatelang.CheckDate.ValidDate;
		return error;
	}
	return error;
}

function appendBreak(msg) {
	return msg = msg + '\n';
}

String.prototype.trim = function() {
	a = this.replace(/^\s+/, '');
	return a.replace(/\s+$/, '');
}



function addEventSimple(obj, evt, fn) {
	if (obj.addEventListener)
		obj.addEventListener(evt, fn, false);
	else if (obj.attachEvent)
		obj.attachEvent('on' + evt, fn);
}

function sendRequestSync(url, callback, postData) {
	var req = createXMLHTTPObject();
	if (!req) return;
	var method = (postData) ? "POST" : "GET";
	req.open(method, url, false);
	if (postData)
		req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	req.send(postData);

	if (req.status === 200) {
		return req.responseText;
	}
}

var XMLHttpFactories = [
	function() {
		return new XMLHttpRequest()
	},
	function() {
		return new ActiveXObject("Msxml2.XMLHTTP")
	},
	function() {
		return new ActiveXObject("Msxml3.XMLHTTP")
	},
	function() {
		return new ActiveXObject("Microsoft.XMLHTTP")
	}
];

function createXMLHTTPObject() {
	var xmlhttp = false;
	for (var i = 0; i < XMLHttpFactories.length; i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		} catch (e) {
			continue;
		}
		break;
	}
	return xmlhttp;
}

for (var i = 0; i < document.forms.length; i++) {
	initCaptchaOnForm(document.forms[i]);
}

function initCaptchaOnForm(f) {
	if (f._CaptchaHookedUp)
		return;

	if (!f.CaptchaV2)
		return;

	if (!f.CaptchaHV2)
		return;

	f._CaptchaHookedUp = true;
}

function reCaptchaV2IsInvalid(f, messageWhenRobot) {
	if (typeof f['g-recaptcha-response'] != "undefined") {
		var hidden = f['bc-recaptcha-token'];
		var captchaId = hidden.getAttribute('data-recaptcha-id');
		var isValid = reCaptchaV2Manager.isInstanceVerified(captchaId);

		if (!isValid)
			return "- " + messageWhenRobot;
	}

	return "";
}

function captchaIsInvalid(f, messageWhenEmpty, messageWhenInvalid) {
	if ((f._CaptchaTextValidated === true) && (f._CaptchaTextIsInvalid === false)) {
		return "";
	}

	if (typeof f.ReCaptchaChallenge != "undefined") {
		var key = Recaptcha.get_challenge();
		var answer = Recaptcha.get_response();

		if (answer.trim().length == 0)
			return "- " + messageWhenEmpty;

		f.ReCaptchaAnswer.value = Recaptcha.get_response();
		f.ReCaptchaChallenge.value = Recaptcha.get_challenge();

		var response = sendRequestSync('/ValidateCaptcha.ashx?key=' + key + '&answer=' + answer + '&imageVerificationType=recaptcha');
		f._CaptchaTextIsInvalid = response == 'false';
		f._CaptchaTextValidated = true;
		if (f._CaptchaTextIsInvalid) {
			regenerateCaptcha(f);
		}
	} else {
		var key = f.CaptchaHV2.value;
		var answer = f.CaptchaV2.value;
		var correctCaptchaLength = 6;

		if (answer.trim().length == 0)
			return "- " + messageWhenEmpty;

		if (answer.length != correctCaptchaLength) {
			f._CaptchaTextIsInvalid = true;
		} else {
			var response = sendRequestSync('/ValidateCaptcha.ashx?key=' + key + '&answer=' + answer);
			f._CaptchaTextIsInvalid = response == 'false';
			f._CaptchaTextValidated = true;
			if (f._CaptchaTextIsInvalid) {
				regenerateCaptcha(f);
			}
		}
	}


	if (f._CaptchaTextIsInvalid)
		return "- " + messageWhenInvalid;

	return "";
}

function regenerateCaptcha(f) {
	f._CaptchaTextValidated = false;
	f._CaptchaTextIsInvalid = true;

	if (typeof f.ReCaptchaChallenge != "undefined") {
		Recaptcha.reload();
	} else {
		var key = sendRequestSync('/CaptchaHandler.ashx?Regenerate=true&rand=' + Math.random());

		f.CaptchaHV2.value = key;
		f.CaptchaV2.value = "";

		var imgs = f.getElementsByTagName("img");
		if (imgs.length == 0) { // fix for broken dom in ie9
			if ((f.parentNode.nodeName.toLowerCase() == "p") && (f.parentNode.nextSibling) && (f.parentNode.nextSibling.nodeName.toLowerCase() == "table") && (f.parentNode.nextSibling.className == "webform")) {
				imgs = f.parentNode.nextSibling.getElementsByTagName("img");
			}
		}

		for (var i = 0; i < imgs.length; i++) {
			var src = imgs[i].src;
			var srcLower = src.toLowerCase();
			if (srcLower.indexOf("/captchahandler.ashx") > -1) {
				var p1 = srcLower.indexOf("?id=") + 4;
				var p2 = srcLower.indexOf("&", p1);
				var oldKey = src.substring(p1, p2);
				var newSrc = src.replace(oldKey, key);

				imgs[i].src = newSrc;

				break;
			}
		}
	}
}

function isNumericIfVisible(s, FieldName) {
	var error = "";
	if (s.style.display == 'inline') {
		if (s.value.length == 0) {
			error = "- " + FieldName + validatelang.Number.MustNumber;
		} else {
			var i;
			for (i = 0; i < s.value.length; i++) {
				var c = s.value.charAt(i);
				if ((c < "0") || (c > "9")) {
					error = "- " + FieldName + validatelang.Number.NoDecimal;
					return error;
				}
			}
		}
	}
	return error;
}

function checkIPAddress(text) {
	var reg = /^\s*((0|[1-9]\d?|1\d{2}|2[0-4]\d|25[0-5])\.){3}(0|[1-9]\d?|1\d{2}|2[0-4]\d|25[0-5])\s*$/;
	if (reg.test(text)) return '';
	return validatelang.IP.Illegal;
}


/* reCaptchaV2Manager - manages all ReCaptcha V2 operations 
*/
if (typeof reCaptchaV2Manager == 'undefined') {
    var reCaptchaV2Manager = (function(){
        var _controlInstances = {};
        var _dataObjects = [];

        function initializeControls() {
            if (_dataObjects.length == 0) {
                return;
            }

            retrieveTokensWithAjax(_dataObjects.length, function(tokens) {
                for(var i=0; i<_dataObjects.length && i<tokens.length; i++) {
                    var crtDataObject = _dataObjects[i];

                    var hidden = document.getElementById('token' + crtDataObject.id);
                    hidden.value = tokens[i];

                    var renderParams = {
                        'sitekey': crtDataObject.sitekey,
                        'type': crtDataObject.type,
                        'theme': crtDataObject.theme,
                        'size': crtDataObject.size
                    };

                    if (typeof _controlInstances[crtDataObject.id] == "undefined") {
	                    _controlInstances[crtDataObject.id] = grecaptcha.render('recaptcha' + crtDataObject.id, renderParams);
	                }
	                else {
	                	grecaptcha.reset(_controlInstances[crtDataObject.id], renderParams);
	                }
                }
            });
        }

        function retrieveTokensWithAjax(count, callback) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState == 4 && req.status == 200) {
                    var tokens = req.responseText.split(';');
                    callback(tokens);
                }
            };

            req.open('GET', '/CaptchaHandler.ashx?RegenerateV2=true&count=' + count + '&rand=' + Math.random(), true);
            req.send();
        }

        return {
        	/* Needs to be assigned as the onload handler for the google reCaptcha V2 library.
        	*/
            onLoadHandler: function() {
                window.setTimeout(initializeControls, 1);
            },
            /* Use this method to register the parameters for each reCaptcha instance that will be rendered as a control 
           	** during the onLoadHandler.
            */
            registerInstance: function(data) {
                if(data) {
                    _dataObjects.push(data);
                }
            },
            /* Call this method reinitialize all ReCaptcha V2 controls corresponding to the registered instances.
            */
            reloadControls: function() {
            	initializeControls();
            },
            /* Checks if the validation has been performed on the given captcha control.
            */
            isInstanceVerified: function(captchaId){
                if(typeof _controlInstances[captchaId] != "undefined") {
                    var googleAnswer = grecaptcha.getResponse(_controlInstances[captchaId]);

                    // The google answer will be an empty string if the recaptcha instance has 
                    // not been validated
                    return googleAnswer.trim().length != 0;
                }
                else {
                    return false;
                }
            }
        };
    })();
}