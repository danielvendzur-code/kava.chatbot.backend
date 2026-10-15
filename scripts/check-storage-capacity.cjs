const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('coffee-jolka-app.js', 'utf8');
const context = {DATA:{fullOffer:[]},packOf:p=>p.grams};
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('  function accessoryFor('),source.indexOf('  function renderResult(')),context);
const coffee = {currency:'EUR',grams:1000};
const jar = {name:'Coffeevac 250g',url:'https://example.test/jar',priceAmount:13.9,currency:'EUR'};
context.DATA.fullOffer = [jar];
assert.equal(context.accessoryFor(coffee),null,'A small jar must not be offered for a kilogram.');
context.DATA.fullOffer = [{...jar,name:'Hario doza 1000ml'}];
assert.equal(context.accessoryFor(coffee),null,'Volume does not prove coffee capacity.');
context.DATA.fullOffer = [jar];
assert.equal(context.accessoryFor({...coffee,grams:220}).product.priceAmount,13.9);
context.DATA.fullOffer = [{...jar,name:'Coffeevac',storageVariants:[
  {capacityGrams:250,price:13.9,label:'250g'},
  {capacityGrams:500,price:16.9,label:'500g'},
  {capacityGrams:1000,price:26.9,label:'1000g'}]}];
assert.equal(context.accessoryFor({...coffee,grams:500}).product.priceAmount,16.9);
assert.equal(context.accessoryFor(coffee).product.priceAmount,26.9);
vm.runInContext(fs.readFileSync('coffee-catalogues/ebenica.js','utf8'),context);
context.DATA.fullOffer = context.CX_COFFEE_CATALOGUES.ebenica.offer;
assert.equal(context.accessoryFor(coffee).product.priceAmount,26.9,'Actual Ebenica catalogue: kilogram jar price.');
assert.equal(context.accessoryFor({...coffee,grams:220}).product.priceAmount,13.9);
vm.runInContext(fs.readFileSync('coffee-catalogues/becafe.js','utf8'),context);
context.DATA.fullOffer = context.CX_COFFEE_CATALOGUES.becafe.offer;
assert.equal(context.accessoryFor({...coffee,grams:220}).product.priceAmount,12.9,'Approved BeCafe jar remains.');
console.log('PASS: verified capacity only, no undersized jar, price matches selected storage size.');
