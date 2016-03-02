var chance = require('chance');

chance = new chance();

var exports = module.exports = {};

exports.createUser = function(name, password, species, vocation) {
  var dummy = {
    name: name
  , password: password
  , species: species
  , vocation: vocation
  , hp: chance.integer({min: 5, max: 10})
  , mana: chance.integer({min: 5, max: 10})
  , attack: chance.integer({min: 2, max: 5})
  , defense: chance.integer({min: 2, max: 5})
  , speed: chance.integer({min: 2, max: 5})
  , magicAttack: chance.integer({min: 2, max: 5})
  , magicDefense: chance.integer({min: 2, max: 5})
  , charisma: chance.integer({min: 2, max: 5})
  , luck: chance.integer({min: 2, max: 5})
  , items: ['Potion', 'Elixir', 'Loaf of bread']
  , weapons: []
  , armor: []
  }
  if(species == 'Human') {
    dummy.hp += chance.integer({min: 1, max: 4});
    dummy.luck += chance.integer({min: 1, max: 4});
  }
  else if(species == 'Dwarf') {
    dummy.hp += chance.integer({min: 1, max: 4});
    dummy.defense += chance.integer({min: 1, max: 4});
    dummy.charisma += chance.integer({min: 1, max: 4});
    dummy.speed -= chance.integer({min: 1, max: 4});
  }
  else if(species == 'Elf') {
    dummy.luck += chance.integer({min: 1, max: 4});
    dummy.speed += chance.integer({min: 1, max: 4});
    dummy.magicDefense += chance.integer({min: 1, max: 4});
    dummy.hp -= chance.integer({min: 1, max: 4});
  }
  else if(species == 'Naga') {
    dummy.charisma += chance.integer({min: 1, max: 4});
    dummy.defense += chance.integer({min: 1, max: 4});
    dummy.magicDefense += chance.integer({min: 1, max: 4});
    dummy.luck -= chance.integer({min: 1, max: 4});
  }
  if(dummy.speed < 0)
    dummy.speed = 0;
  if(dummy.luck < 0)
    dummy.luck = 0;
  if(vocation == 'Knight') {
    dummy.weapons.push('Plain Broadsword');
    dummy.armor.push('Rusty Chainmail');
  }
  else if(vocation == 'Archer') {
    dummy.weapons.push('Plain Longbow');
    dummy.armor.push('Tattered Cloak');
  }
  else if(vocation == 'Gladiator') {
    dummy.weapons.push('Plain Battleaxe');
    dummy.armor.push('Rusty Platemail');
  }
  else if(vocation == 'Wizard') {
    dummy.weapons.push('Plain Wand');
    dummy.armor.push('Tattered Robe');
  }
  return dummy;
}

exports.zip = function() {
    var args = [].slice.call(arguments);
    var longest = args.reduce(function(a,b){
        return a.length>b.length ? a : b
    }, []);

    return longest.map(function(_,i){
        return args.map(function(array){return array[i]})
    });
}

exports.isYes = function(str) {
  return (str == 'y') || (str == 'yes') || (str == 'Y') || (str == 'Yes')
}

exports.isNo = function(str) {
  return (str == 'n') || (str == 'no') || (str == 'N') || (str == 'No')
}
