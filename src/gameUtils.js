var chance = require('chance')
    fs = require('fs');

chance = new chance();

var exports = module.exports = {};
var armorList = JSON.parse(fs.readFileSync('objects/armor.json')),
    weaponsList = JSON.parse(fs.readFileSync('objects/weapons.json')),
    itemsList = JSON.parse(fs.readFileSync('objects/items.json')),
    enemiesList = JSON.parse(fs.readFileSync('objects/enemies.json'));

exports.enemy = function(biome) {
  if(biome == 'woods') {
    var rarity = chance.integer({min: 1, max: 10});
    if(rarity >= 9) {
      var model = enemiesList.tiger;
      model.level = chance.integer({min: 5, max: 7});
      model.atk = level + 1;
      model.def = level - 1;
      model.spd = level;
      return model;
    }
    else if(rarity >= 3) {
      var model = enemiesList.bear;
      model.level = chance.integer({min: 3, max: 4});
      model.atk = level - 1;
      model.def = level;
      model.spd = level;
      return model;
    }
    else if(rarity >= 1) {
      var model = enemiesList.sparrow;
      model.level = chance.integer({min: 1, max: 3});
      model.atk = level;
      model.def = level;
      model.spd = level + 2;
      return model;
    }
  }
  else if(biome == 'caves') {
    var rarity = chance.integer({min: 1, max: 10});
    if(rarity >= 9) {
      var model = enemiesList.golem;
      model.level = chance.integer({min: 15, max: 20});
      model.atk = level;
      model.def = level + 5;
      model.spd = level - 1;
      return model;
    }
    else if(rarity >= 3) {
      var model = enemiesList.ogre;
      model.level = chance.integer({min: 9, max: 13});
      model.atk = level + 2;
      model.def = level;
      model.spd = level - 1;
      return model;
    }
    else if(rarity >= 1) {
      var model = enemiesList.bat;
      model.level = chance.integer({min: 5, max: 7});
      model.atk = level;
      model.def = level;
      model.spd = level + 3;
      return model;
    }
  }
  else if(biome == 'mountains') {
    var rarity = chance.integer({min: 1, max: 10});
    if(rarity >= 9) {
      var model = enemiesList.manticore;
      model.level = chance.integer({min: 50, max: 100});
      model.atk = level + 5;
      model.def = level + 5;
      model.spd = level;
      return model;
    }
    else if(rarity >= 3) {
      var model = enemiesList.griffin;
      model.level = chance.integer({min: 28, max: 45});
      model.atk = level + 2;
      model.def = level;
      model.spd = level + 2;
      return model;
    }
    else if(rarity >= 1) {
      var model = enemiesList.willowisp;
      model.level = chance.integer({min: 15, max: 20});
      model.atk = level - 2;
      model.def = level;
      model.spd = level + 10;
      return model;
    }
  }
}

exports.createUser = function(name, password, species, vocation) {
  var dummy = {
    name: name,
    password: password,
    gold: 0,
    experience: 0,
    species: species,
    vocation: vocation,
    hp: chance.integer({min: 5, max: 10}),
    mana: chance.integer({min: 5, max: 10}),
    attack: chance.integer({min: 2, max: 5}),
    defense: chance.integer({min: 2, max: 5}),
    speed: chance.integer({min: 2, max: 5}),
    magicAttack: chance.integer({min: 2, max: 5}),
    magicDefense: chance.integer({min: 2, max: 5}),
    charisma: chance.integer({min: 2, max: 5}),
    luck: chance.integer({min: 2, max: 5}),
    items: [itemsList.sPotion, itemsList.sElixir, itemsList.bread],
    weapons: [],
    armor: []
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
    dummy.weapons.push(weaponsList.plainBroadswoard);
    dummy.armor.push(armorList.rustyChainmail);
  }
  else if(vocation == 'Archer') {
    dummy.weapons.push(weaponsList.plainLongbow);
    dummy.armor.push(armorList.tatteredCloak);
  }
  else if(vocation == 'Gladiator') {
    dummy.weapons.push(weaponsList.plainBattleaxe);
    dummy.armor.push(armorList.rustyPlatemail);
  }
  else if(vocation == 'Wizard') {
    dummy.weapons.push(weaponsList.plainWand);
    dummy.armor.push(armorList.tatteredRobe);
  }
  return dummy;
}

exports.isYes = function(str) {
  return (str == 'y') || (str == 'yes') || (str == 'Y') || (str == 'Yes')
}

exports.isNo = function(str) {
  return (str == 'n') || (str == 'no') || (str == 'N') || (str == 'No')
}
