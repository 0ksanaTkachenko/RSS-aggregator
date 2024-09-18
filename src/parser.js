const dataParse = (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
  return xmlDoc;
};

export default dataParse;
