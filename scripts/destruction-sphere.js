/**
 * A single DestructiveBlast.
 * @typedef {Object} DestructiveBlast
 * @property {Object} blastType - The blast type of the DestructiveBlast.
 * @property {Object} blastShape - The blast shape of the DestructiveBlast.
 * @property {Object} defaultSaveDC - The blast shape of the DestructiveBlast.
 * @property {string} actorId - The actor who casts DestructiveBlast.
 */
class DestructiveBlast {
	static ID = 'destructive-blast';

	static flags = {
		blastTypes: 'blastTypes',
		blastShapes: 'blastShapes',
		defaultSaveDC: 'defaultSaveDC',
		damageDice: 'damageDice'
	}

	static TEMPLATES = {
		DESTRUCTIVEBLAST: `modules/wolfer-spheres5e/templates/destructive-blast.hbs`
	}

	static getBlastTypesFromActor(actorId){
		let blastTypes = new Array();
		const allSpells = game.actors.get(actorId).itemTypes.spell;
		allSpells.forEach(spell => {
			if(spell.name.toLowerCase().endsWith("(blast type)")){
				blastTypes.push(spell);
			}
		});
		return blastTypes;
	}

	static getBlastShapesFromActor(actorId){
		let blastShapes = new Array();
		const allSpells = game.actors.get(actorId).itemTypes.spell;
		allSpells.forEach(spell => {
			if(spell.name.toLowerCase().endsWith("(blast shape)")){
				blastShapes.push(spell);
			}
		});
		return blastShapes;
	}
	
	static getDefaultSaveDCFromActor(actorId){
		return game.actors.get(actorId).system.attributes.spelldc;
	}
	
	static getNumberOfDamageDice(actorId){
		let level = game.actors.get(actorId).system.details.level;
		let defaultNumber = 1 + Math.floor((level + 1)/6);
		let augmentedNumber = 1 + Math.floor(level/2);
		return {dice: defaultNumber, augmentDice: augmentedNumber};
	}
	
	static updateBlastType(blastType){
		$(blastType).parent().children('.blastSelected').removeClass("blastSelected");
		$(blastType).addClass("blastSelected");
		
		$("#destructiveBlastFinalSave").text($(blastType).children(':first-child').children(':nth-child(3)').text().trim());
		$("#destructiveBlastFinalDamageType").text($(blastType).children(':first-child').children(':nth-child(2)').text().trim());
		$("#destructiveBlastFinalRider").text($(blastType).children(':nth-child(2)').text().substring(14));
		
		$("#destructiveBlastTypeAugments").html('');
		let augmentArr = $(blastType).children(':nth-child(3)').text().split('Augment');
		let augmentCounter = 0;
		augmentArr.forEach(augment => {
			if(Number.isInteger(parseInt(augment.trim().substring(0, 1))))
			{
				let augmentParts = augment.trim().split(":");
				let augmentEl = $("<div></div>").addClass("flexrow alignCenter");
				let augmentText = TextEditor.enrichHTML("<b>Augment " + augmentParts[0] + ":</b>" + augmentParts[1], {"rolls": true, "async": false});
				augmentEl.append($("<label></label").attr("for", "destructiveBlastTypeAugment-" + augmentCounter).html(augmentText));
				augmentEl.append($("<input></input>").attr("id", "destructiveBlastTypeAugment-" + augmentCounter).attr("type", "checkbox").attr("data-sp",parseInt(augmentParts[0])));
				//console.log(augmentEl);
				$("#destructiveBlastTypeAugments").append(augmentEl);
				augmentCounter++;
			}
		});
	}
	
	static updateBlastShape(blastShape){
		$(blastShape).parent().children('.blastSelected').removeClass("blastSelected");
		$(blastShape).addClass("blastSelected");
		
		$("#destructiveBlastFinalRange").text($(blastShape).children(':first-child').children(':nth-child(2)').text().split(':')[1].trim());
		$("#destructiveBlastFinalTarget").text($(blastShape).children(':first-child').children(':nth-child(3)').text().split(':')[1].trim());
		$("#destructiveBlastFinalDuration").text($(blastShape).children(':first-child').children(':nth-child(4)').text().split(':')[1].trim());
		//console.log($(blastShape).children(':first-child'));
		
		$("#destructiveBlastShapeAugments").html('');
		let augmentArr = $(blastShape).children(':nth-child(2)').text().split('Augment');
		let augmentCounter = 0;
		augmentArr.forEach(augment => {
			if(Number.isInteger(parseInt(augment.trim().substring(0, 1))))
			{
				let augmentParts = augment.trim().split(":");
				let augmentEl = $("<div></div>").addClass("flexrow alignCenter");
				let augmentText = TextEditor.enrichHTML("<b>Augment " + augmentParts[0] + ":</b>" + augmentParts[1], {"rolls": true, "async": false});
				augmentEl.append($("<label></label").attr("for", "destructiveBlastShapeAugment-" + augmentCounter).html(augmentText));
				augmentEl.append($("<input></input>").attr("id", "destructiveBlastShapeAugment-" + augmentCounter).attr("type", "checkbox").attr("data-sp",parseInt(augmentParts[0])));
				//console.log(augmentEl);
				$("#destructiveBlastShapeAugments").append(augmentEl);
				augmentCounter++;
			}
		});
	}
	
	static toggleHidden(...ids){
		ids.forEach(id => {
			$("#"+id).toggleClass("Hidden");
		});
	}
}

class DestructiveBlastConfig extends FormApplication{
	static get defaultOptions() {
		const defaults = super.defaultOptions;
		
		const overrides = {
			height: 'auto',
			id: 'destructive-blast',
			template: DestructiveBlast.TEMPLATES.DESTRUCTIVEBLAST,
			title: 'Destructive Blast',
			actorId: null
		};
	  
		const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
		
		return mergedOptions;
	}
	
	getData(options){
		return {
			blastTypes: DestructiveBlast.getBlastTypesFromActor(options.actorId),
			blastShapes: DestructiveBlast.getBlastShapesFromActor(options.actorId),
			defaultSaveDC: DestructiveBlast.getDefaultSaveDCFromActor(options.actorId),
			damageDice: DestructiveBlast.getNumberOfDamageDice(options.actorId)
		}
	}
}