function importAll(r) {
  let images = {};
  r.keys().forEach((item, i) => {
    let s = item.replace('./', '').replace('atlas.', '').replace('/json', '').replace('/png', '');
    (!images[s]) ? images[s] = {}: null;
    images[s][item.replace('./', '').replace(`${s}/`, '').replace('atlas.', '')] = r(item);

  });
  return images;
}
let atlases = importAll(require.context('./', true, /(atlas.png|atlas.json)$/));

export default atlases