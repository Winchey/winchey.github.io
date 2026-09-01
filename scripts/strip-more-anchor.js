hexo.extend.filter.register('after_render:html', function (str) {
  return str.replace(
    /(<a class="btn"[^>]*href="[^"]*)#more(")/g,
    '$1$2'
  );
});
