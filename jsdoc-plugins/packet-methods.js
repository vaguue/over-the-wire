const fs = require('fs');
const path = require('path');

const layers = [];

module.exports.handlers = {
  newDoclet(e) {
    const { doclet } = e;
    if (doclet.kind == 'class' && doclet.implements?.includes('Layer')) {
      const { name, properties } = doclet;
      layers.push({
        name,
        properties: properties?.filter(e => e?.name && e?.description) ?? [],
      });
    }
  },
  processingComplete(dictionary) {
    layers.forEach(layer => {
      const { name, properties } = layer;
      dictionary.doclets.push({
        comment: '/**\n' +
          `   * Adds ${name} layer to the packet stack\n` +
          '   * \n' +
          '   * @param {Object} data - The layer data\n' +
          properties.map(prop => `* @param {${prop.type.names[0]}} [data.${prop.name}] - ${prop.description}`).join('\n') +
          '   * @returns {Packet} The packet instance\n' +
          '   * \n' +
          '   */',
        description: `Adds ${name} layer to the packet stack\n`,
        params: [
          {
            name: 'data',
            type: { names: ['Object'] },
            description: 'The layer data',
            optional: false,
          },
          ...properties.map(e => {
            e.name = 'data.' + e.name;
            return e;
          }),
        ],
        returns: [
          {
            type: {
              names: ['Packet']
            },
            description: 'the packet instance'
          }
        ],
        examples: [],
        name: name,
        longname: `Packet#${name}`,
        kind: 'function',
        memberof: 'Packet',
        scope: 'instance'
      });
    });
  },
};
