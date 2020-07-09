var _pug = require('pug');
var fs = require('fs');

exports.compile = function(relativeTemplatePath, data, next){

  var absoluteTemplatePath = process.cwd() + '/views/' + relativeTemplatePath + '.pug';

  _pugs.renderFile(absoluteTemplatePath, data, function(err, compiledTemplate){
    if(err){
      throw new Error('Problem compiling template(double check relative template path): ' + relativeTemplatePath);
    }
    console.log('[INFO] COMPILED TEMPLATE: ', compiledTemplate)
    next(null, compiledTemplate);
  });

};