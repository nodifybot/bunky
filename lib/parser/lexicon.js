/**
 * export all keyword that need to look inside sentence
 */


//payment keywords
var keyword = ["paid", "owe"];

//new member keyword
var member = ["new"];

//seacrh for these action in sentence
var action = ["addt", "addm", "mail", "report", "export"];

//month name
var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

//abberviation of months
var monthAbbrs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];

//special keyword used for refering to dates
var days = ["yesterday", "tomorrow"];

//exports all lexicon
exports.keyword = keyword;
exports.member = member;
exports.action = action;
exports.months = months;
exports.monthAbbrs = monthAbbrs;
exports.days = days;
