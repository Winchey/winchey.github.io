hexo.extend.filter.register('after_render:html', function (str) {
  return str.replace(
    /<div class="links-of-blogroll-title">([\s\S]*?)链接\s*<\/div>/g,
    '<div class="links-of-blogroll-title">$1友链</div>'
  );
});
