// Konami-like arrow key sequence redirect
(function () {
	const TARGET = "/70xJS11XCBeO13rb-18QamyFA3z1clbODGzOcMSHDfs/"; // destination path
	const SEQ = ["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright"]; // required sequence
	const buf = [];
	window.addEventListener("keydown", (e) => {
		const k = e.key.toLowerCase();
		buf.push(k);
		if (buf.length > SEQ.length) buf.shift();
		if (SEQ.every((v,i) => buf[i] === v)) {
			document.body.style.transition = "filter .24s";
			document.body.style.filter = "hue-rotate(40deg) blur(1px)";
			setTimeout(() => (window.location.href = TARGET), 200);
		}
	}, { passive: true });
})();

// Blog grid hover effects
(function(){
	const STYLE_ID = 'blog-grid-fx';
	const CSS = `
	.entries-grid{--fx-hue:0;}
	.entries-grid .grid__item{position:relative;transition:transform .32s cubic-bezier(.4,.8,.2,1),box-shadow .32s,background .4s,filter .4s;will-change:transform;backface-visibility:hidden;}
	.entries-grid .grid__item:before{content:"";position:absolute;inset:0;border-radius:8px;pointer-events:none;box-shadow:0 0 0 0 rgba(0,0,0,.12);transition:box-shadow .35s ease,background .4s;}
	.entries-grid .grid__item:hover{transform:translateY(-4px);}
	.entries-grid .grid__item:hover:before{box-shadow:0 6px 18px -4px rgba(0,0,0,.28),0 2px 6px -1px rgba(0,0,0,.18);}
	.entries-grid .grid__item article{background:var(--item-bg,transparent);border-radius:8px;overflow:hidden;position:relative;}
		.entries-grid .grid__item .archive__item-title{margin:.6em 0 .4em;font-weight:600;text-align:center;}
	.entries-grid .grid__item .archive__item-teaser{overflow:hidden;border-radius:6px;}
	.entries-grid .grid__item .archive__item-teaser img{transition:transform .6s ease,filter .5s ease;display:block;}
	.entries-grid .grid__item:hover .archive__item-teaser img{transform:scale(1.06) rotate(.25deg);filter:saturate(1.15) contrast(1.05);}
	.entries-grid .grid__item:focus-within{outline:2px solid var(--mm-accent,#e0b400);outline-offset:4px;}
	@media (prefers-reduced-motion: reduce){.entries-grid .grid__item,*{transition:none!important}}
	`;
	function inject(){
		if(!document.getElementById(STYLE_ID)){
			const s=document.createElement('style');
			s.id=STYLE_ID; s.textContent=CSS; document.head.appendChild(s);
		}
	}
	if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', inject); else inject();
})();
