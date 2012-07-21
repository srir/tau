module.exports = (function() {
  var fs          = require('fs'),
      handlebars  = require('handlebars');
  handlebars.loadPartial = function (name) {
    var partial = handlebars.partials[name];
    if (typeof partial === "string") {
      partial = handlebars.compile(partial);
      handlebars.partials[name] = partial;
    }
    return partial;
  };

  handlebars.registerHelper("block", function (name, options) {
      /* Look for partial by name. */
      var partial
        = handlebars.loadPartial(name) || options.fn;
      return partial(this, { data : options.hash });
  });

  handlebars.registerHelper("partial", function (name, options) {
    handlebars.registerPartial(name, options.fn);
  });

  handlebars.registerPartial('base',
    fs.readFileSync(__dirname + '/views/base.html', 'utf8'));
})();
