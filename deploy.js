const ghpages = require('gh-pages');

ghpages.publish('dist', {
  dotfiles: true,
  add: true,
}, function (err) {
  if (err) console.error('Deploy failed:', err);
  else console.log('Deploy succeeded!');
});
