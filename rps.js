/*
    rps.js by Bill Weinman  <http://bw.org/contact/>
    created 2011-07-12
    updated 2012-07-28
    Copyright (c) 2011-2012 The BearHeart Group, LLC
    This file may be used for personal educational purposes as needed. 
    Use for other purposes is granted provided that this notice is
    retained and any changes made are clearly indicated as such. 
*/

var dndSupported;    // verdaderio se drag and drop for suportado
var dndEls = new Array();
var draggingElement;
var winners = {     // esta biblioteca define os elementos do jogo e quem perde com quem 
    Rock: 'Paper',
    Paper: 'Scissors',
    Scissors: 'Rock'
};

var hoverBorderStyle = '2px dashed #999';
var normalBorderStyle = '2px solid white';

// esta é uma função de segurança para verificar se o browser suporta a função drag and drop
function detectDragAndDrop() {
	   // se o browser for o Internet Explorer a função devolve false e portanto a função drag and drop não existe
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            var rv = parseFloat( RegExp.$1 );
            if(rv >= 6.0) return true;
            }
        return false;
    }
	    // se houve a função drag and drop devolve true
    if ('draggable' in document.createElement('span')) return true;
        // cenário default quando nenhum dos outros se verifica
	return false;
}

// suporte a DnD

function handleDragStart(e) {
    var rpsType = getRPSType(this);
    draggingElement = this;
    draggingElement.className = 'moving';
    statusMessage('Drag ' + rpsType);
    this.style.opacity = '0.4';
    this.style.border = hoverBorderStyle;
    e.dataTransfer.setDragImage(getRPSImg(this), 120, 120); // define a imagem arrastada

}

    // definir a imagem depois de arrastada
function handleDragEnd(e) {
    this.style.opacity = '1.0';

    // repõe o estilo do elementos
    draggingElement.className = undefined;
    draggingElement = undefined;

    // repõe todos os elementos
    for(var i = 0; i < dndEls.length; i++) {
        dndEls[i].style.border = normalBorderStyle;
    }
}

function handleDragOver(e) {
    if(e.preventDefault) e.preventDefault();
    this.style.border = hoverBorderStyle;

    return false;   // alguns browsers necessitam desta função para prevenir ação default
}

    // define o estilo do elemento enquanto está a ser arrastado
function handleDragEnter(e) {
    if(this !== draggingElement) statusMessage('Hover ' + getRPSType(draggingElement)    + ' over ' + getRPSType(this));
    this.style.border = hoverBorderStyle;
}

     // define o estilo do elemento quando se para de arrastar o objeto
function handleDragLeave(e) {
    this.style.border = normalBorderStyle;
}

    // define o que a página mostra quando se larga um dos objetos sobre um dos outros
function handleDrop(e) {
    if(e.stopPropegation) e.stopPropagation(); // impede alguns browsers de redirecionar
    if(e.preventDefault) e.preventDefault();
    if(this.id === draggingElement.id) return;
    else isWinner(this, draggingElement);
}

// define qual o elemento que vence sobre o outros e mostra na página
function isWinner(under, over) {
    var underType = getRPSType(under);
    var overType = getRPSType(over);
    if(overType == winners[underType]) {
        statusMessage(overType + ' beats ' + underType);
        swapRPS(under, over);
    } else {
        statusMessage(overType + ' does not beat ' + underType);
    }
}

// define o rodapé da página 
function getRPSFooter(e) {
    var children = e.childNodes;
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'footer' ) return children[i];
    }
    return undefined;
}

// define as imagens do pedra, papel ou tesoura do site
function getRPSImg(e) {
    var children = e.childNodes;
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'img' ) return children[i];
    }
    return undefined;
}


function getRPSType(e) {
    var footer = getRPSFooter(e);
    if(footer) return footer.innerHTML;
    else return undefined;
}

// troca as posições das imagens depois de arrastadas consoante o objeto vence ou perde
function swapRPS(a, b) {
    var holding = Object();

    holding.img = getRPSImg(a);
    holding.src = holding.img.src;
    holding.footer = getRPSFooter(a);
    holding.type = holding.footer.innerHTML;
    
    holding.img.src = getRPSImg(b).src;
    holding.footer.innerHTML = getRPSType(b);

    getRPSImg(b).src = holding.src;
    getRPSFooter(b).innerHTML = holding.type;
}


var elStatus;
// obtem o id dos elementos HTML
function element(id) { return document.getElementById(id); }

function statusMessage(s) {
    if(!elStatus) elStatus = element('statusMessage');
    if(!elStatus) return;
    if(s) elStatus.innerHTML = s;
    else elStatus.innerHTML = '&nbsp;';
}

// verifica se suporta todas as funções de drag and drop necessárias para o código funcionar
function init() {
    if((dndSupported = detectDragAndDrop())) {
        statusMessage('Using HTML5 Drag and Drop');
        dndEls.push(element('rps1'), element('rps2'), element('rps3'));
        for(var i = 0; i < dndEls.length; i++) {
            dndEls[i].addEventListener('dragstart', handleDragStart, false);
            dndEls[i].addEventListener('dragend', handleDragEnd, false);
            dndEls[i].addEventListener('dragover', handleDragOver, false);
            dndEls[i].addEventListener('dragenter', handleDragEnter, false);
            dndEls[i].addEventListener('dragleave', handleDragLeave, false);
            dndEls[i].addEventListener('drop', handleDrop, false);
        }
    } else {
        statusMessage('This browser does not support Drag and Drop');
    }
}

// incializa o jogo quando a janela carrega
window.onload = init;