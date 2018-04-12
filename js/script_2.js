//Quand le document est prêt
$(document).ready(function(e) {
	
	////// PARTIE SNAP.SVG
	var cPaths = new Array(),division,rP;
	
		// Pour chaque point à modifier
		for (var i = 0; i < 2; i++){
			// On pioche des valeurs d'angle en random comprises entre -110 et 110
			rP = Math.floor(Math.random() * (110 - -110) + -110);
			$(".controls").find('.vertical').eq(i).parent('.bCurs').find('input').val(rP);
		}
		
			// on y déclare l'espace de travail Snap.svg
		var s = Snap("#bSnapSvg_0");
			// on rend l'espace de travail ("s") responsive
			s.attr({id:'snap',  width: '100%', height: '100%'});
			
			// on divise le bloc en 3 pour avoir 3 segments égaux //division = 100
			division = $("#snap").width()/3;
			console.log(division);
			
			// on déclare une droite de segments (x:100, y:100)->(x:200, y:100)->(x:300, y:100)
		var points = "M0 0L" + division*1 + " 0L" + division*2 + " 0L" + division*3 + " 0",
			// on trace la droite sur l'espace de travail ("s") et on la stylise
			path = s.path(points).attr({
				// options
				stroke: '#F9B233',
				strokeWidth: 1,
				strokeDasharray: "5",
    			strokeDashoffset: 5,
				fill: 'none',
				id: 'path'
			}),
			// on déclare le texte ("Lac Titicaca"), sa position ("50,50") -> (x,y) et son rattachement à la droite déclarée au-dessus ("path") sur l'espace de travail ("s")
			text = s.text(50,50, 'Lac Titicaca').attr({ 'textpath': path, id: 'text' });
			
			// on fragmente la chaine de caractère de la droite déclarée ("points")
		var cPoints = points.split('L'), // [M100 0, 200 0, 300 0]
			cStart = cPoints[0].split('M'), // [M, 100 0]
			p_1 = cStart[1].split(' '), p_2 = cPoints[1].split(' '), p_3 = cPoints[2].split(' ');
			// p_1 = [100,0], p_2 = [200,0], p_3 = [300,0]
			
			// on stocke les points dans des chaines de référence
			cPaths.push(p_1, p_2, p_3);
		
			// Pour chaque point modifiable (les 2 derniers du tracé) de l'espace de travail à modifier
		for(var j = 1; j < 3; j++){
				// numéro du point à modifier
			var nPoint = j,
				// coordonnées du point référence de rotation (centre de rotation)
				cx = cPaths[j][0], cy = cPaths[j][1];
				
				// on utilise la fonction de rotation (coord x centre de rot., coord y centre de rot., coord x point à modifier, coord y point à modif., numéro point à modif., numéro esp. de travail à modif.
			Rotate(nPoint);
		}
	
	
	// on déclare la fonction de rotation (coord x centre de rot., coord y centre de rot., coord x point à modifier, coord y point à modif., numéro point à modif., numéro esp. de travail à modif.
	function Rotate(nPoint) {
		for(var k = nPoint; k < 3; k++) {
			var radian = 0,
				L = cPaths[1][0] - cPaths[0][0];
				
			for(var l = 0; l < k; l++) {
				// on calcule le radian (unité de mesure autre que le degré) de chaque point (PI / 180) * (l'angle voulu en négatif)
				// à chaque point on additionne le radian du point précèdent, d'où la boucle "for"
				radian += (Math.PI / 180) * (0 - $('.controls').find('.valVertical').eq(l).val());
			}
			
			// on calcule les nouvelles coordonnées du point: (xRéf + rayon * cos(angle), yRéf - rayon * sin(angle))
			nx = parseFloat(cPaths[k][0]) + parseFloat(L) * Math.cos(radian);
			ny = parseFloat(cPaths[k][1]) - parseFloat(L) * Math.sin(radian);
				
			// on stocke les valeurs dans la chaine de référence des points
			cPaths[parseFloat(k) + parseFloat(1)] = [nx, ny];
		}
		
		// on supprime le tracé existant
		Snap('#path').remove();
		// on déclare et trace le nouveau tracé avec les nouveaux points
		path = s.path("M" + cPaths[0][0] + " " + cPaths[0][1] + "L" + cPaths[1][0] + " " + cPaths[1][1] + "L" + cPaths[2][0] + " " + cPaths[2][1] + "L" + cPaths[3][0] + " " + cPaths[3][1]).attr({
			stroke: '#F9B233',
			strokeWidth: 2,
			strokeDasharray: "5",
			fill: 'none',
			id: 'path'
		});
		// On applique le texte au nouveau tracé
		Snap('#text').attr({ 'textpath': Snap('#path') });
		
		if($('.bSvg').attr('oldh') == ''){
			$('.bSvg').attr('oldh', parseFloat(Snap('#path').getBBox().height) + parseFloat(60));
		}
		// on applique la fonction de redimmensionnement et de repositionnement du bloc
		resizeBloc();
	}
	
	// on déclare une fonction pour redimmensionner la hauteur de l'espace de travail: elle sera égale à la valeur entre la plus haute et la plus basse coordonnée y entre les 3 points
	function resizeBloc() {
		var oldH = 262;
		// on redimmensionne le bloc en allant chercher la hauteur du tracé
		$('#snap').css('height', parseFloat(Snap('#path').getBBox().height) + parseFloat(60));
		// on calcule son positionnement vertical au centre
		var pos = $('#snap').height() - Snap('#path').getBBox().y2 - 30;
		// on applique le repositionnement
		Snap('#path').transform('t0,' + pos + '');
		difH = oldH - (parseFloat(Snap('#path').getBBox().height) + parseFloat(60));
		$('#snap').css('padding-top', difH/2 + 'px').css('padding-bottom', difH/2 + 'px');
	}
	
	//on fait appelle à la librairie "jStepper" pour pouvoir modifier les valeurs des curseurs en utilisant les bloc de textes correspondants
	// Pour les curseurs qui modifient les angles de chaque point
	$('.valVertical').jStepper({minValue:-110, maxValue:110, minLength:1,
		onStep: function(objTextField, bDirection, bLimitReached) {
			nPoint = parseFloat(objTextField.parent('.bCurs').parent('.controls').find('.valVertical').index(objTextField)) + parseFloat(1);
			objTextField.parent('.bCurs').find('.cursVertical').val(objTextField.val());
			Rotate(nPoint);
		}
	});
	// Pour les curseurs qui modifient la position du texte
	$('.valText').jStepper({minValue:0, maxValue:110, minLength:1,
		onStep: function(objTextField, bDirection, bLimitReached) {
			$('#snap').find('text').attr('x', objTextField.val());
			$('.cursText').val(objTextField.val());
		}
	});
	// Pour les curseurs qui modifient la taille du texte
	$('.valTextSize').jStepper({minValue:2, maxValue:110, minLength:1,
		onStep: function(objTextField, bDirection, bLimitReached) {
			$('#snap').css('font-size', objTextField.val() + 'px');
			$('.cursTextSize').val(objTextField.val());
		}
	});
	
	//Quand un curseur qui modifie l'angle d'un point est lui-même modifié alors il change l'angle du point visé grâce à la fonction "Rotate()"
	$('.cursVertical, .valVertical').on('input', function() {
		nPoint = parseFloat($(this).parent('.bCurs').parent('.controls').find('.cursVertical').index($(this))) + parseFloat(1);
		if($(this).hasClass('cursVertical')) {$(this).parent('.bCurs').find('.valVertical').val($(this).val());}
		else {$(this).parent('.bCurs').find('.cursVertical').val($(this).val());}
		Rotate(nPoint);
	});
	//Quand un curseur qui modifie la position du texte est lui-même modifié alors il change la position du texte visé grâce à "$('.bSnapSvg').eq(nSnap).find('text').attr('x', $(this).val());"
	$('.cursText, .valText').on('input', function() {
		$('#snap').find('text').attr('x', $(this).val());
		if($(this).hasClass('cursText')) {$(this).parent('.bCurs').find('.valText').val($(this).val());}
		else {$(this).parent('.bCurs').find('.cursText').val($(this).val());}
	});
	//Quand un curseur qui modifie la taille du texte est lui-même modifié alors il change la taile du texte visé grâce à "$('.bSnapSvg').eq(nSnap).css('font-size', $(this).val() + 'px');"
	$('.cursTextSize, .valTextSize').on('input', function() {
		$('#snap').css('font-size', $(this).val() + 'px');
		if($(this).hasClass('cursTextSize')) {$(this).parent('.bCurs').find('.valTextSize').val($(this).val());}
		else {$(this).parent('.bCurs').find('.cursTextSize').val($(this).val());}
	});

});