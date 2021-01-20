const _ = require('lodash');
const postcss = require('postcss');

module.exports = (toApply, lookup, options, onError) => {
  const items = _.get(lookup, toApply, []);

  if (_.isEmpty(items)) {
    throw onError(`\`@insert\` No class named ${items}`);
  } else if (items.length > 1) {
    throw onError(`\`@insert\` Too many classes named ${items} not sure which to pick`);
  }

  let [item] = items;

  if (! options.allowFromMediaQueries) {
    if (item.parent.type !== 'root') {
      throw onError(`\`@insert\` cannot be used with ${toApply} because ${toApply} is nested inside of an at-rule (@${item.parent.name}).`)
    }
  }
  else {//allowed
    if ((item.parent.type === 'atrule') && (item.parent.name === 'media')) {
      let media = item.parent.clone();
      media.removeAll();
      media.append(item.clone().nodes);
      return media;
    }
  }

  return item.clone().nodes;
}
