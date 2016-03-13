var chance = require('chance'),
    fs = require('fs');

chance = new chance();

var exports = module.exports = {};

var armorList = JSON.parse(fs.readFileSync('objects/armor.json')),
    weaponsList = JSON.parse(fs.readFileSync('objects/weapons.json')),
    itemsList = JSON.parse(fs.readFileSync('objects/items.json')),
    enemiesList = JSON.parse(fs.readFileSync('objects/enemies.json')),
    magic = JSON.parse(fs.readFileSync('objects/magic.json'));

exports.enemyAction = function(sess) {
  var dealt = Math.max(0, sess.enemy.atk - totalDefense(sess.user) + chance.integer({min: -1, max: 2}));
  sess.user.hp -= dealt;
  sess.user.hp = Math.max(0, sess.user.hp);
  if(sess.enemy.spd >= totalSpeed(sess.user))
    sess.history.push({type: 'journey', author: 'Server', description: 'The ' + sess.enemy.name + ' is fast enough to attack first!'});
  sess.history.push({type: 'journey', author: 'Server', description: 'The ' + sess.enemy.name + ' deals ' + dealt + ' damage to you.'},
                    {type: 'journey', author: 'Server', description: 'You have ' + sess.user.hp + ' health left.'});
}

exports.userAction = function(req, res, sess) {
  if(req.body.input == 'attack' || req.body.input == 'Attack' || req.body.input == 'a' || req.body.input == 'A') {
    var dealt = Math.max(0, totalAttack(sess.user) - sess.enemy.def + chance.integer({min: -1, max: 2}));
    sess.enemy.hp -= dealt;
    sess.enemy.hp = Math.max(0, sess.enemy.hp);
    sess.history.push({type: 'journey', author: 'Server', description: 'You deal ' + dealt + ' to the ' + sess.enemy.name + '.'},
                      {type: 'journey', author: 'Server', description: 'The ' + sess.enemy.name + ' has ' + sess.enemy.hp + ' health left.'});
  }
  else if(req.body.input == 'magic' || req.body.input == 'Magic' || req.body.input == 'm' || req.body.input == 'M') {
    sess.history.push({type: 'journey', author: 'Server', description: 'Magic unsupported.'});
  }
  else if(req.body.input == 'item' || req.body.input == 'Item' || req.body.input == 'i' || req.body.input == 'I') {
    sess.history.push({type: 'journey', author: 'Server', description: 'Magic unsupported.'});
  }
  else
    sess.history.push({type: 'journey', author: 'Server', description: 'Sorry, I don\'t understand that.'});
}

var totalDefense = exports.totalDefense = function(user) {
  var def = user.defense;
  for(var i = 0; i < user.armor.length; i++) {
    def += user.armor[i].def;
  }
  return def;
}

var totalAttack = exports.totalAttack = function(user) {
  var atk = user.attack;
  //first (two) weapons
  for(var i = 0; i < user.weapons.length && i < 2; i++) {
    atk += user.weapons[i].dmg;
  }
  return atk;
}

var totalSpeed = exports.totalSpeed = function(user) {
  var spd = user.speed;
  //first (two) weapons
  for(var i = 0; i < user.weapons.length && i < 2; i++) {
    spd += user.weapons[i].spd;
  }
  //all armor
  for(var i = 0; i < user.armor.length; i++) {
    spd -= user.armor[i].enc;
  }
  return spd;
}

exports.enemy = function(biome) {
  if(biome == 'woods') {
    var rarity = chance.integer({min: 1, max: 10});
    if(rarity >= 9)
      return defModel(enemiesList.tiger, 3, 1, -1, 0, 5, 7);
    else if(rarity >= 3)
      return defModel(enemiesList.bear, 2, 0, 0, -1, 3, 4);
    else if(rarity >= 1)
      return defModel(enemiesList.sparrow, 0, 0, 0, 2, 1, 3);
  }
  else if(biome == 'caves') {
    var rarity = chance.integer({min: 1, max: 10});
    if(rarity >= 9)
      return defModel(enemiesList.golem, 3, 0, 5, -1, 15, 20);
    else if(rarity >= 3)
      return defModel(enemiesList.ogre, 1, 2, 0, -1, 9, 13);
    else if(rarity >= 1)
      return defModel(enemiesList.bat, -1, 0, 0, 0, 5, 7);
  }
  else if(biome == 'mountains') {
    var rarity = chance.integer({min: 1, max: 10});
    if(rarity >= 9)
      return defModel(enemiesList.manticore, 5, 5, 5, 0, 40, 60);
    else if(rarity >= 3)
      return defModel(enemiesList.griffin, 2, 2, 0, 2, 30, 40);
    else if(rarity >= 1)
      return defModel(enemiesList.willowisp, 0, -2, 0, 10, 15, 20);
  }
}

function defModel(type, hp, atk, def, spd, levelmin, levelmax) {
  var model = type;
  model.level = chance.integer({min: levelmin, max: levelmax});
  model.hp = model.level + hp;
  model.atk = model.level + atk;
  model.def = model.level + def;
  model.spd = model.level + spd;
  return model;
}

exports.levelUp = function(sess) {
  sess.user.experience -= sess.user.level * 25;
  sess.user.level++;
  sess.user.maxhp += chance.integer({min: 0, max: 2});
  sess.user.maxmp += chance.integer({min: 0, max: 2});
  sess.user.attack += chance.integer({min: 0, max: 2});
  sess.user.defense += chance.integer({min: 0, max: 2});
  sess.user.speed += chance.integer({min: 0, max: 2});
  sess.user.magicAttack += chance.integer({min: 0, max: 2});
  sess.user.magicDefense += chance.integer({min: 0, max: 2});
  sess.user.charisma += chance.integer({min: 0, max: 2});
  sess.user.luck += chance.integer({min: 0, max: 2});
  if(sess.user.species == 'Human') {
    sess.user.maxhp += chance.integer({min: 0, max: 2});
    sess.user.attack += chance.integer({min: 0, max: 2});
    sess.user.magicAttack += chance.integer({min: 0, max: 2});
  }
  else if(sess.user.species == 'Dwarf') {
    sess.user.maxhp += chance.integer({min: 0, max: 3});
    sess.user.defense += chance.integer({min: 0, max: 3});
  }
  else if(sess.user.species == 'Elf') {
    sess.user.speed += chance.integer({min: 0, max: 2});
    sess.user.attack += chance.integer({min: 0, max: 2});
    sess.user.magicAttack += chance.integer({min: 0, max: 2});
  }
  else if(sess.user.species == 'Naga') {
    sess.user.defense += chance.integer({min: 0, max: 2});
    sess.user.magicDefense += chance.integer({min: 0, max: 2});
    sess.user.charisma += chance.integer({min: 0, max: 3});
  }
}

exports.createUser = function(name, password, species, vocation) {
  var health = chance.integer({min: 5, max: 10});
  var mana = chance.integer({min: 5, max: 10});
  var model = {
    name: name,
    password: password,
    gold: 0,
    experience: 0,
    level: 1,
    species: species,
    vocation: vocation,
    hp: health,
    maxhp: health,
    mp: mana,
    maxmp: mana,
    attack: chance.integer({min: 2, max: 5}),
    defense: chance.integer({min: 2, max: 5}),
    speed: chance.integer({min: 2, max: 5}),
    magicAttack: chance.integer({min: 2, max: 5}),
    magicDefense: chance.integer({min: 2, max: 5}),
    charisma: chance.integer({min: 2, max: 5}),
    luck: chance.integer({min: 2, max: 5}),
    items: [itemsList.sPotion, itemsList.sElixir, itemsList.bread],
    weapons: [],
    armor: [],
    skills: []
  }
  if(species == 'Human') {
    var hpboost = chance.integer({min: 1, max: 4});
    model.maxhp += hpboost;
    model.hp += hpboost;
    model.luck += chance.integer({min: 1, max: 4});
  }
  else if(species == 'Dwarf') {
    var hpboost = chance.integer({min: 1, max: 4});
    model.maxhp += hpboost;
    model.hp += hpboost;
    model.defense += chance.integer({min: 1, max: 4});
    model.charisma += chance.integer({min: 1, max: 4});
    model.speed -= chance.integer({min: 1, max: 4});
  }
  else if(species == 'Elf') {
    var hpboost = chance.integer({min: 1, max: 4});
    model.luck += chance.integer({min: 1, max: 4});
    model.speed += chance.integer({min: 1, max: 4});
    model.magicDefense += chance.integer({min: 1, max: 4});
    model.maxhp -= hpboost;
    model.hp -= hpboost;
  }
  else if(species == 'Naga') {
    model.charisma += chance.integer({min: 1, max: 4});
    model.defense += chance.integer({min: 1, max: 4});
    model.magicDefense += chance.integer({min: 1, max: 4});
    model.luck -= chance.integer({min: 1, max: 4});
  }
  if(model.speed < 0)
    model.speed = 0;
  if(model.luck < 0)
    model.luck = 0;
  if(vocation == 'Knight') {
    model.weapons.push(weaponsList.plainBroadswoard);
    model.armor.push(armorList.rustyChainmail);
    model.skills.push(magic.rage);
  }
  else if(vocation == 'Archer') {
    model.weapons.push(weaponsList.plainLongbow);
    model.armor.push(armorList.tatteredCloak);
    model.skills.push(magic.blind);
  }
  else if(vocation == 'Gladiator') {
    model.weapons.push(weaponsList.plainBattleaxe);
    model.armor.push(armorList.rustyPlatemail);
  }
  else if(vocation == 'Wizard') {
    model.weapons.push(weaponsList.plainWand);
    model.armor.push(armorList.tatteredRobe);
    model.skills.push(magic.bolt);
  }
  return model;
}

exports.isYes = function(str) {
  return (str == 'y') || (str == 'yes') || (str == 'Y') || (str == 'Yes')
}

exports.isNo = function(str) {
  return (str == 'n') || (str == 'no') || (str == 'N') || (str == 'No')
}
